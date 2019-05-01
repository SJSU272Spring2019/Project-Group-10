//setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let { PythonShell } = require('python-shell');
require("./mongoose");

const server = {
    port: 3001
}
const origin = "http://localhost:3000";

//config
const app = express();
app.use(bodyParser.json());
app.use(cors({origin}))

//routes
app.get("/", (req, res) => {
    let options ={
        args: [19,7]
    }
    let test = new PythonShell("./scripts/test.py", options);
    test.on('message', (msg) => {
        console.log(msg)
        res.send(msg)
    })
});

//headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


app.listen(server.port, () => console.log("Server listening on port ",server.port))
