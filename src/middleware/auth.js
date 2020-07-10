//const express = require("express")
//const app = express()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {



    try{
        const token = req.header('Authorization').replace('Bearer ','')
        //console.log("Authorization = " + token)
        const decoded = jwt.verify(token,process.env.JWT_SALT)
        //console.log(decoded)
        const user = await User.findOne({_id: decoded._id,'tokens.token':token})
        //console.log(user)
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()

    } catch ( e) {
        res.status(401).send({error: "Not authorized"})

    }
    console.log("Called middleware")


}

module.exports = auth
