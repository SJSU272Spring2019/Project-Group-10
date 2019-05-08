//setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let { PythonShell } = require('python-shell');
const Order = require('./models/order');
const Item = require('./models/item');
require("./mongoose");

const server = {
    port: 3001
}
const origin = "http://localhost:3000";

//config
const app = express();
app.use(bodyParser.json());
app.use(cors({origin}))

//headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

let returnObj = {}
returnObj.modal1 = []
returnObj.modal2 = []
let popBur = {}
let popBev = {}
let popSid = {}
let popDes = {}

let cnt = 2;
let car = "";
let cars = ["", 'car1.jpg', 'car2.jpg', 'car3.jpg', 'car4.jpg', 'car5.jpg'];


//routes
app.get("/", (req, res) => {
    popularBurger();
    popularBeverage();
    popularSide();
    popularDessert();
    
    let temperature = new PythonShell("./scripts/temperature.py");
    temperature.on('message', (temp) => {
        console.log("Current temperature: ",temp)
        returnObj.temperature = temp
        temp = Number(temp)
        if(temp<=70) returnObj.weather = "cold"
        else if(temp>70) returnObj.weather = "hot"
        console.log("Current weather: ", returnObj.weather)
    })
    let test = new PythonShell("./scripts/numberPlate.py", { args: cars[cnt]});
    test.on('message', (msg) => {
        console.log("License Plate: ",msg)
        car = msg;
        returnObj.car = msg

        Order.find({"car":msg}, (err, result) => {
            if(err) res.send({ message: "error" })
            else if(result[0]){
                //existing user
                returnObj.new_user = false
                Order.findOne({car, "type":"burger"}, 'item', { sort: '-qty' }, (err, res1) => {
                    // console.log(res)
                    if(res1!=={}){
                        returnObj.modal1.push({ type: "burger", name: res1.item})
                        returnObj.modal2.push({ type: "burger", name: res1.item})
                    }
                    Order.findOne({
                        $and: [{ "car": car }, {
                            $or: [{ "type": "beverage_hot"}, {"type": "beverage_cold"}]
                        }]
                        },'item', { sort: '-qty' }, (err, res2) => {
                            if(res2!=={}){
                                returnObj.modal1.push({ type: "beverage", name: res2.item })
                                returnObj.modal2.push({ type: "beverage", name: res2.item })
                            }
                            Order.findOne({ car, "type": "side" }, 'item', { sort: '-qty' }, (err, res3) => {
                                if(res3!=={}){
                                    returnObj.modal1.push({ type: "side", name: res3.item })
                                    returnObj.modal2.push({ type: "side", name: res3.item })
                                }
                                Order.findOne({ car, "type": "dessert" }, 'item', { sort: '-qty' }, (err, res4) => {
                                    if(res4!=={}){
                                        returnObj.modal1.push({ type: "dessert", name: res4.item })
                                        returnObj.modal2.push({ type: "dessert", name: res4.item })
                                    }
                                    res.json(returnObj);
                                    new Promise((resolve, reject) => {
                                        for (m of returnObj.modal2) {
                                            if (m.type === "burger") {
                                                Order.aggregate([{
                                                    $match: { type: "burger" },
                                                }, {
                                                    $group: {
                                                        _id: "$item",
                                                        total: {
                                                            $sum: "$qty"
                                                        }
                                                    }
                                                }, {
                                                    $sort: { "total": -1 }
                                                }, {
                                                    $limit: 2
                                                }], (err, res) => {
                                                    if (m.name === res[0]._id) {
                                                        console.log(res[1]._id)
                                                        returnObj.modal2.push({ type: "burger", name: res[1]._id })
                                                    }
                                                    else {
                                                        console.log(res[0]._id)
                                                        returnObj.modal2.push({ type: "burger", name: res[0]._id })
                                                    }
                                                });
                                            }
                                            else if (m.type === "side") {
                                            }
                                            else if (m.type === "beverage") { }
                                            else if (m.type === "dessert") { }
                                        }
                                        resolve(returnObj)
                                        .then((value) => {
                                            res.json(value)
                                        })
                                        .catch((err))
                                    })
                                })
                            })
                    })
                })
            }
            else{
                //new user
                returnObj.new_user = true
                returnObj.modal1.push(popBur)
                returnObj.modal1.push(popBev)
                returnObj.modal1.push(popSid)
                returnObj.modal1.push(popDes)
                returnObj.modal2.push(popBur)
                returnObj.modal2.push(popBev)
                returnObj.modal2.push(popSid)
                returnObj.modal2.push(popDes)
                returnObj.modal2.push(fillmodal2(returnObj.modal2))
                console.log("--------------------")
                console.log(returnObj)
                res.json(returnObj)
                returnObj = {}
            }
        })
    })
});

app.post("/", (req, res) => {
    let order = new Order({
        car: "EA7THE",
        item: "Chocolate Chip Cookie",
        qty: 0,
        type: "dessert"
    })
    Order.findOneAndUpdate({ car:order.car, item:order.item, type: order.type }, { $inc: { "qty" : order.qty } }, { upsert: true} ,  (err) => {
        if(err) res.send(err)
        else res.send("success");
    })

    // cnt++;
    // car = "";
    // res.send(String(cnt))
})

app.listen(server.port, () => console.log("Server listening on port ",server.port))

//functions
function popularBurger() {
    Order.aggregate([{
        $match: { type: "burger" },
    }, {
        $group: {
            _id: "$item",
            total: {
                $sum: "$qty"
            }
        }
    }, {
        $sort: { "total": -1 }
    }, {
        $limit: 1
    }], (err, res) => {
        // console.log(res)
        popBur =  { type: "burger", name: res[0]._id }
    });
}

function popularBeverage() {
    Order.aggregate([{
        $match:  { $or: [{ type:"beverage_hot"}, { type: "beverage_cold" }]} ,
    }, {
        $group: {
            _id: "$item",
            total: {
                $sum: "$qty"
            }
        }
    },{
        $sort: { "total": -1 }
    },{
        $limit: 1
    }], (err, res) => { 
        // console.log(res)
        popBev = { type: "beverage", name: res[0]._id }
    });
}

function popularSide(){
    Order.aggregate([{
        $match: { type: "side" },
    }, {
        $group: {
            _id: "$item",
            total: {
                $sum: "$qty"
            }
        }
    }, {
        $sort: { "total": -1 }
    }, {
        $limit: 1
    }], (err, res) => {
        // console.log(res)
        popSid = { type: "side", name: res[0]._id }
    });
}

function popularDessert(){
    Order.aggregate([{
        $match: { type: "dessert" },
    }, {
        $group: {
            _id: "$item",
            total: {
                $sum: "$qty"
            }
        }
    }, {
        $sort: { "total": -1 }
    }, {
        $limit: 1
    }], (err, res) => {
        // console.log(res)
        popDes = { type: "dessert", name: res[0]._id }
    });
}

function fillmodal2(modal2, res){
    let aprioriData = []
    for(m of modal2){
        if(m.type==="burger"){
            Order.aggregate([{
                $match: { type: "burger" },
            }, {
                $group: {
                    _id: "$item",
                    total: {
                        $sum: "$qty"
                    }
                }
            }, {
                $sort: { "total": -1 }
            }, {
                $limit: 2
            }], (err, res) => {
                console.log("result is---------------")
                if(m.name===res[0]._id){ 
                    aprioriData.push({ type: "burger", name:res[1]._id}) 
                }
                else { 
                    aprioriData.push({ type: "burger", name:res[0]._id}) 
                }
            });
        }
        else if(m.type==="side"){
        }
        else if(m.type==="beverage"){}
        else if(m.type==="dessert"){}
    }
}

// Cars: Ordered?
// LTM378   yes
// BB7D618  yes 
// EA7THE   yes
// 4SZW590  no