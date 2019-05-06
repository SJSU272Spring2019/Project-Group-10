const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema([{
    item: String,
    price: String,
    desc: String,
    image: String,
    type: String,
    qty: { type: Number, default: 0}
}])

module.exports = mongoose.model("Items", itemSchema)