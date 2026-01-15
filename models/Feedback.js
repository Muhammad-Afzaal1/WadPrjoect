const mongoose = require('mongoose')

const feedBackSchema = new mongoose.Schema({
    reviewer:{
        type:mongoose.Schema.ObjectId,
        ref:'Person',
        required:true
    },
    seller:{
        type:mongoose.Schema.ObjectId,
        ref:'Person',
        required:true
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,

    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('FeedBack', feedBackSchema);