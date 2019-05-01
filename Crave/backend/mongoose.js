var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://root:root@cravecluster-1wrvb.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true, poolSize: 100 }, (err) => {
        if (err) console.log(err);
        else console.log("Connected to MongoDB.")
    });

module.exports = { mongoose };