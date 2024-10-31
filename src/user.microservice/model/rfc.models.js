const mongoose = require('mongoose');

const rfcSchema = new mongoose.Schema({
    rfc:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('rfc', rfcSchema);