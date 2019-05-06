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

let cnt = 1;
let car = "";
let cars = ["", 'car1.jpg', 'car2.jpg', 'car3.jpg', 'car4.jpg', 'car5.jpg'];

//routes
app.get("/", (req, res) => {
    let returnObj = {}
    let test = new PythonShell("./scripts/numberPlate.py", { args: cars[cnt]});
    test.on('message', (msg) => {
        console.log(msg)
        car = msg;
        Order.find({"car":msg}, (err, result) => {
            if(err) res.send({ message: "error" })
            else if(result[0]){
                //existing user
                Order.findOne({car, "type":"burger"}, 'item', { $sort: '-qty' }, (err, res1) => {
                    console.log(res1)
                })
                res.send("bhukaad aya")
            }
            else{
                //new user
                res.send("new user")
            }
        })
    })
});

app.post("/", (req, res) => {
    // let order = new Order({
    //     car: "222222",
    //     item: "Crispy Chicken",
    //     qty: 1,
    //     type: "burger"
    // })
    // Order.findOneAndUpdate({ car:order.car, item:order.item, type: order.type }, { $inc: { "qty" : order.qty } }, { upsert: true} ,  (err) => {
    //     if(err) res.send(err)
    //     else res.send("success");
    // })

    // cnt++;
    // car = "";
    // res.send(String(cnt))
})



app.listen(server.port, () => console.log("Server listening on port ",server.port))
