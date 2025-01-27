const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const {mongoDBConnect} = require('./mongodb/mongodb')
const {authenticateToken} = require('./auth/JWTAuth')
const cors = require('cors')
try{
    //routeDirectives
    const userRouter = require('./routes/users')
    const userLoginRouter = require('./routes/login').router
    const expenseRouter = require('./routes/expense')

    //appMain
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
    })
    
    mongoDBConnect()
    app.get('/', (req, res) => {
        return res.send('Welcome to Expense Tracker API Portal!')
    })
    app.use('/registration', userLoginRouter)
    
    //using below middleware to make all the requests go though authentication
    app.use(authenticateToken)
    app.use('/users', userRouter)
    app.use('/expense', expenseRouter)

}catch(err){
    console.log({success:false, error:err})
}