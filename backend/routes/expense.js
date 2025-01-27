const router = require('express').Router();
const { expenseCategoryModel } = require('../models/expenseCategoryModel');
const { expenseModel } = require('../models/expenses');

function dateToEpoch(dateString) {
    const dateObject = new Date(dateString);
    const epochTimestamp = dateObject.getTime();
    return epochTimestamp;
}

router.post('/postExpense', async (req, res) => {
    try {
        let body = req.body
        let categories = await expenseCategoryModel.findOne({ userId: req.userId })
        console.log(categories, body.category, req.userId)
        if(!(categories.category).includes(body.category)){
            await expenseCategoryModel.findOneAndUpdate({ userId: req.userId }, { $push: { category: body.category } })
        }
        let newExpense = new expenseModel({
            desc: body.desc,
            amount: body.amount,
            date: new Date(body.date),
            userId: req.userId,
            category: body.category,
            note: body.note
        })
        await newExpense.save()
        return res.status(200).json({ success: true, message: "Expense added successfully!" })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.get('/getExpenses', async (req, res) => {
    try {
        let userId = req.userId
        let expenses = await expenseModel.find({ userId: userId }).sort({ date: -1 })
        return res.status(200).json({ success: true, message: "Expense fetched successfully!", expenses: expenses })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.get('/getExpCategory', async (req, res) => {
    try {
        let userId = req.userId
        let categories = await expenseCategoryModel.findOne({ userId: userId }, { category: 1, _id: 0 })
        return res.status(200).json({ success: true, message: "Categories fetched successfully!", categories: categories?.category })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.post('/postExpCategory', async (req, res) => {
    try {
        let userId = req.userId
        let category = req.body.category
        let categories = await expenseCategoryModel.findOne({ userId: userId })
        if (!categories) {
            let newCategory = new expenseCategoryModel({
                userId: userId,
                category: [category]
            })
            await newCategory.save()
            return res.status(400).json({ success: false, message: "not categoryModel found for this user, new categoryModel created!" })
        }
        if (categories.category.includes(category)) {
            return res.status(400).json({ success: false, message: "category already exists!" })
        }
        await expenseCategoryModel.findOneAndUpdate({ userId: userId }, { $push: { category: category } })
        return res.status(200).json({ success: true, message: "category pushed successfully!" })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.post('/updateTransaction', async (req, res) => {
    try {
        let body = req.body
        console.log(body)
        let categories = await expenseCategoryModel.findOne({ userId: req.userId })
        if(!(categories.category).includes(body.category)){
            await expenseCategoryModel.findOneAndUpdate({ userId: req.userId }, { $push: { category: body.category } })
        }
        let data = await expenseModel.findByIdAndUpdate(body.id,
            {
                desc: body.desc,
                amount: body.amount,
                date: (new Date(body.date)).valueOf(),
                userId: req.userId,
                category: body.category,
                note: body.note
            }, { new: true })
        return res.status(200).json({ success: true, message: "category updated successfully!", data: data })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.post('/deleteTransaction', async (req, res) => {
    try {
        let body = req.body
        for(let i of body){
            await expenseModel.findByIdAndDelete(i)
        }
        return res.status(200).json({ success: true, message: "transactions deleted successfully!"})
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.get('/getTransactionsByFilter', async(req, res) => {
    try{
        let userId = req.userId
        let startDate = req.query.startDate
        let endDate = req.query.endDate
        let categories = req.query.categories
        let query = {}
        if(startDate && endDate){
            startDate = dateToEpoch(startDate)
            endDate = dateToEpoch(endDate)
            query['date'] = { $gte: startDate, $lte: endDate }
        }
        if(categories){
            query['category'] = { $in: categories }
        }
        let expenses = await expenseModel.find({ userId: userId, ...query }).sort({ date: -1 })
        return res.status(200).json({ success: true, message: "Transactions fetched successfully!", expenses: expenses })
    }catch(err){
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
module.exports = router