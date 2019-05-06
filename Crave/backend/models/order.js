const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    car: String,
    item: String,
    type: String,
    qty: { type: Number, defautl: 0 }
})

module.exports = mongoose.model("Orders", orderSchema)