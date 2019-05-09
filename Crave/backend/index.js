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
app.use(cors({ origin }))

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

let cnt = 1;
let car = "";
let cars = ["", 'car1.jpg', 'car2.jpg', 'car3.jpg', 'car4.jpg', 'car5.jpg', 'car6.jpg', 'car7.jpg', 'car8.jpg', 'car9.jpg', 'car10.jpg'];


//routes
app.get("/", (req, res) => {
    popularBurger();
    popularBeverage();
    popularSide();
    popularDessert();

    let temperature = new PythonShell("./scripts/temperature.py");
    temperature.on('message', (temp) => {
        console.log("Current temperature: ", temp)
        returnObj.temperature = temp
        temp = Number(temp)
        if (temp <= 70) returnObj.weather = "cold"
        else if (temp > 70) returnObj.weather = "hot"
        console.log("Current weather: ", returnObj.weather)
    })
    let test = new PythonShell("./scripts/numberPlate.py", { args: cars[cnt] });
    test.on('message', (msg) => {
        console.log("License Plate: ", msg)
        car = msg;
        returnObj.car = msg

        Order.find({ "car": msg }, (err, result) => {
            if (err) res.send({ message: "error" })
            else if (result[0]) {
                //existing user
                returnObj.new_user = false
                Order.findOne({ car, "type": "burger" }, 'item', { sort: '-qty' }, (err, res1) => {
                    // console.log(res)
                    if (res1 !== {}) {
                        returnObj.modal1.push({ type: "burger", name: res1.item })
                        returnObj.modal2.push({ type: "burger", name: res1.item })
                        fillmodal2({ type: "burger", name: res1.item })
                    }
                    Order.findOne({
                        $and: [{ "car": car }, {
                            $or: [{ "type": "beverage_hot" }, { "type": "beverage_cold" }]
                        }]
                    }, 'item', { sort: '-qty' }, (err, res2) => {
                        if (res2 !== {}) {
                            returnObj.modal1.push({ type: "beverage", name: res2.item })
                            returnObj.modal2.push({ type: "beverage", name: res2.item })
                            fillmodal2({ type: "beverage", name: res2.item })
                        }
                        Order.findOne({ car, "type": "side" }, 'item', { sort: '-qty' }, (err, res3) => {
                            if (res3 !== {}) {
                                returnObj.modal1.push({ type: "side", name: res3.item })
                                returnObj.modal2.push({ type: "side", name: res3.item })
                                fillmodal2({ type: "side", name: res3.item })
                            }
                            Order.findOne({ car, "type": "dessert" }, 'item', { sort: '-qty' }, (err, res4) => {
                                if (res4 !== {}) {
                                    returnObj.modal1.push({ type: "dessert", name: res4.item })
                                    returnObj.modal2.push({ type: "dessert", name: res4.item })
                                    fillmodal2({ type: "dessert", name: res4.item })
                                }
                                res.json(returnObj)
                                returnObj = {}
                                returnObj.modal1 = []
                                returnObj.modal2 = []
                                popBur = {}
                                popBev = {}
                                popSid = {}
                                popDes = {}
                                cnt++;
                                car = "";
                            })
                        })
                    })
                })
            }
            else {
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
                fillmodal2(popBur)
                fillmodal2(popBev)
                fillmodal2(popSid)
                fillmodal2(popDes)

                console.log(returnObj)
                res.json(returnObj)
                returnObj = {}
                returnObj.modal1 = []
                returnObj.modal2 = []
                popBur = {}
                popBev = {}
                popSid = {}
                popDes = {}
                cnt++;
                car = "";
            }
        })
    })
});

app.post("/", (req, res) => {
    for (data of req.body.cart) {
        let order = new Order({
            car: car,
            item: data.item,
            qty: data.qty,
            type: data.type
        })
        Order.findOneAndUpdate({ car: order.car, item: order.item, type: order.type }, { $inc: { "qty": order.qty } }, { upsert: true }, (err) => {
            if (err) res.send("error")
        })
    }
    // cnt++;
    // car = "";
    res.send({ message: "success", data: cnt })
})

app.listen(server.port, () => console.log("Server listening on port ", server.port))

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
        popBur = { type: "burger", name: res[0]._id }
    });
}

function popularBeverage() {
    Order.aggregate([{
        $match: { $or: [{ type: "beverage_hot" }, { type: "beverage_cold" }] },
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
        popBev = { type: "beverage", name: res[0]._id }
    });
}

function popularSide() {
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
        popSid = { type: "side", name: res[0]._id }
    });
}

function popularDessert() {
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
        popDes = { type: "dessert", name: res[0]._id }
    });
}

function fillmodal2(data) {
    if (data.type === "burger" && data.name === "Angry Whooper") {
        returnObj.modal2.push({ type: "burger", name: "Sourdough King" })
    }
    if (data.type === "burger" && data.name === "Big Fish") {
        returnObj.modal2.push({ type: "burger", name: "Crispy Chicken" })
    }
    if (data.type === "burger" && data.name === "Crispy Chicken") {
        returnObj.modal2.push({ type: "burger", name: "Big Fish" })
    }
    if (data.type === "burger" && data.name === "Cheeseburger") {
        returnObj.modal2.push({ type: "burger", name: "Crispy Chicken" })
    }
    if (data.type === "burger" && data.name === "Chicken Club") {
        returnObj.modal2.push({ type: "burger", name: "Angry Whooper" })
    }
    if (data.type === "burger" && data.name === "Sourdough King") {
        returnObj.modal2.push({ type: "burger", name: "Angry Whooper" })
    }
    if (data.type === "burger" && data.name === "Hamburger") {
        returnObj.modal2.push({ type: "burger", name: "Big Fish" })
    }
    if (data.type === "burger" && data.name === "Q-Pound King") {
        returnObj.modal2.push({ type: "burger", name: "Big Fish" })
    }
    if (data.type === "burger" && data.name === "Q-Pound King") {
        returnObj.modal2.push({ type: "burger", name: "Crispy Chicken" })
    }
    if (data.type === "beverage" && data.name === "Mocha") {
        returnObj.modal2.push({ type: "beverage", name: "Cappuccino" })
    }
    if (data.type === "beverage" && data.name === "Espresso") {
        returnObj.modal2.push({ type: "beverage", name: "Hot Chocolate" })
    }
    if (data.type === "beverage" && data.name === "Hot Chocolate") {
        returnObj.modal2.push({ type: "beverage", name: "Mocha" })
    }
    if (data.type === "beverage" && data.name === "Cappuccino") {
        returnObj.modal2.push({ type: "beverage", name: "Hello" })
    }
    if (data.type === "beverage" && data.name === "Iced Tea") {
        returnObj.modal2.push({ type: "beverage", name: "Coca-cola" })
    }
    if (data.type === "beverage" && data.name === "Coca-cola") {
        returnObj.modal2.push({ type: "beverage", name: "Iced Tea" })
    }
    if (data.type === "beverage" && data.name === "Caramel Frappuccino") {
        returnObj.modal2.push({ type: "beverage", name: "Caramel Frappuccino" })
    }
    if (data.type === "beverage" && data.name === "Cold Brew") {
        returnObj.modal2.push({ type: "beverage", name: "Caramel Frappuccino" })
    }
    if (data.type === "beverage" && data.name === "Chocolate Shake") {
        returnObj.modal2.push({ type: "beverage", name: "Caramel Frappuccino" })
    }
    if (data.type === "side" && data.name === "Chicken Nuggets") {
        returnObj.modal2.push({ type: "side", name: "Bacon Cheesy Tots" })
    }
    if (data.type === "side" && data.name === "Bacon Cheesy Tots") {
        returnObj.modal2.push({ type: "side", name: "Chicken Nuggets" })
    }
    if (data.type === "side" && data.name === "Hash Browns") {
        returnObj.modal2.push({ type: "side", name: "French Fries" })
    }
    if (data.type === "side" && data.name === "Garden Side Salad") {
        returnObj.modal2.push({ type: "side", name: "Onion Rings" })
    }
    if (data.type === "side" && data.name === "French Fries") {
        returnObj.modal2.push({ type: "side", name: "Onion Rings" })
    }
    if (data.type === "side" && data.name === "Onion Rings") {
        returnObj.modal2.push({ type: "side", name: "French Fries" })
    }
    if (data.type === "dessert" && data.name === "Chocolate Chip Cookie") {
        returnObj.modal2.push({ type: "dessert", name: "Cookie Cheesecake" })
    }
    if (data.type === "dessert" && data.name === "Cini Minis") {
        returnObj.modal2.push({ type: "dessert", name: "Chocolate Chip Cookie" })
    }
    if (data.type === "dessert" && data.name === "Cookie Cheesecake") {
        returnObj.modal2.push({ type: "dessert", name: "Chocolate Chip Cookie" })
    }
    if (data.type === "dessert" && data.name === "Caramel Sundae") {
        returnObj.modal2.push({ type: "dessert", name: "Vanilla Soft Serve" })
    }
    if (data.type === "dessert" && data.name === "Dutch Apple Pie") {
        returnObj.modal2.push({ type: "dessert", name: "Caramel Sundae" })
    }
    if (data.type === "dessert" && data.name === "Vanilla Soft Serve") {
        returnObj.modal2.push({ type: "dessert", name: "Caramel Sundae" })
    }
}

// Cars: Ordered?
// LTM378   yes
// BB7D618  yes 
// EA7THE   yes
// 4SZW590  no



// new Promise((resolve, reject) => {

//     if (check) {
//         for (m of returnObj.modal2) {
//             if (m.type === "burger") {
//                 Order.aggregate([{
//                     $match: { type: "burger" },
//                 }, {
//                     $group: {
//                         _id: "$item",
//                         total: {
//                             $sum: "$qty"
//                         }
//                     }
//                 }, {
//                     $sort: { "total": -1 }
//                 }, {
//                     $limit: 2
//                 }], (err, res) => {
//                     if (m.name === res[0]._id) {
//                         console.log(res[1]._id)
//                         returnObj.modal2.push({ type: "burger", name: res[1]._id })
//                         console.log(returnObj.modal2)
//                     }
//                     else {
//                         console.log(res[0]._id)
//                         returnObj.modal2.push({ type: "burger", name: res[0]._id })
//                         console.log(returnObj.modal2)
//                     }
//                 });
//             }
//             else if (m.type === "side") { }
//             else if (m.type === "beverage") { }
//             else if (m.type === "dessert") { }
//         }
//         check = false;
//     }
//     console.log("Check before", check)
//     if (check === false) {
//         console.log("Check:---", check)
//         resolve(returnObj)
//     }
// })
//     .then((value) => {
//         console.log("--------------------------")
//         console.log(returnObj)
//         res.json(returnObj)
//     })
//     .catch((err))