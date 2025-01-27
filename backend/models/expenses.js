const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    desc:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    note:{
        type:String,
        required:false
    }
})
module.exports = {
    expenseModel: mongoose.model('expense_schema', expenseSchema)
}