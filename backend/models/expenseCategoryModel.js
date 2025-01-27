const mongoose = require('mongoose');

const expenseCategorySchema = new mongoose.Schema({
    category:{
        type:Array,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
})
module.exports = {
    expenseCategoryModel: mongoose.model('expense_category_schema', expenseCategorySchema)
}