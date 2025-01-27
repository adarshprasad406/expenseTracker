const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const mongoDBConnect = async () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    var db = mongoose.connection
    db.on('error', (err)=>{
        console.log({success:false, error:err})
    })
    db.once('open', () => {
        console.log('MongoDB connection successful')
    })
}

module.exports = {mongoDBConnect}