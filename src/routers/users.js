const express = require('express')
const router = new express.Router()
//const app = express()
const User = require("../models/user")
const auth = require('../middleware/auth')
const {sendWelcomeEmail,sendCancellationEmail } = require('../emails/account')

router.get('/test',(req,res) => {
    res.send("Test router")
})

router.post('/users/login',async (req,res) => {

    try {
        const user = await User.findUserByCredential(req.body.email,req.body.password)

        //const token = await jwt.sign({_id: user.email},process.env.JWT_SALT)
        const token = await user.generateToken()
        //console.log(token)
        //console.log(await user.getPublicProfile())

        res.send({user, token})       
    }catch (error) {
        res.status(401).send({Error: error})
    }


})

router.post('/users/logout',auth,async (req,res) => {

    try {
        const token = req.header('Authorization').replace('Bearer ','')

        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return (tokenObj.token != token)
        })
        await req.user.save()

        res.send()    
    }catch (error) {
        res.status(500).send({Error: error})
    }


})

router.post('/users/logoutAll',auth,async (req,res) => {

    try {
        const token = req.header('Authorization').replace('Bearer ','')

        req.user.tokens = []
        await req.user.save()

        res.send()    
    }catch (error) {
        res.status(500).send({Error: error})
    }


})

router.post('/users',async (req,res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateToken()
        //await user.save()
        
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user,token})       
    }catch (error) {
        res.status(400).send(error)
    }

    // user.save()
    // .then(( result) => {
    //     res.status(201).send(result)
    // })
    // .catch((error) => {
    //     res.status(400).send(error)
    // })
})

router.get('/users/me',auth,async (req,res) => {

   res.send(req.user)

})

router.get('/users',auth,async (req,res) => {

    const users = await User.find({})
    if(users){
        res.status(200).send(users)
    } else {
        res.status(404).send(users)
    }  

    // User.find({})
    // .then(( result) => {
    //     res.status(200).send(result)
    // })
    // .catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.get('/users/:id',auth,async (req,res) => {


    try {
        const user = await User.findById(req.params.id)
        console.log('Before Populate.....')
        await   user.populate('tasks').execPopulate()
        console.log('After Populate.....')
        if(user){
            res.status(200).send(user)
        } else {
            res.status(404).send(user)
        }    
    }catch (error) {
        res.status(500).send(error)
    }

    //User.find({_id: ObjectID(req.params.id)})
    // User.findById(req.params.id)
    // .then(( result) => {
    //     if(result){
    //         res.status(200).send(result)
    //     } else {
    //         res.status(404).send(result)
    //     }
        
    // })
    // .catch((error) => {
    //     res.status(500).send(error)
    // })
})


// router.delete('/users/:id',auth,async (req,res) => {


//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
         
//         if(user){
//             res.status(200).send(user)
//         } else {
//             res.status(404).send(user)
//         }    
//     }catch (error) {
//         res.status(500).send(error)
//     }


// })

router.delete('/users/me',auth,async (req,res) => {

    try {
        req.user.remove() 
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch (error) {
        res.status(500).send(error)
    }
})

// router.patch('/users/:id',auth,async (req,res) => {

//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name','age','email','password']

//     const operationAllowed = updates.every((update) => 
//          allowedUpdates.includes(update) 
//     )

//     if (!operationAllowed) {
//         return res.status(400).send({error: "Invalid operations!!"})
//     }

//     try {
//         //const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true})
         
//         const user = await User.findById(req.params.id)

//         if(user){
//             updates.forEach((update) => user[update] = req.body[update]) 
    
//             await user.save()
//             res.status(200).send(user)
//         } else {
//             res.status(404).send(user)
//         }    
//     }catch (error) {
//         res.status(500).send(error)
//     }


// })

router.patch('/users/me',auth,async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']

    const operationAllowed = updates.every((update) => 
         allowedUpdates.includes(update) 
    )

    if (!operationAllowed) {
        return res.status(400).send({error: "Invalid operations!!"})
    }

    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true})
         
        //const user = await User.findById(req.params.id)

        if(req.user){
            updates.forEach((update) => req.user[update] = req.body[update]) 
    
            await req.user.save()
            res.send(req.user)
        }  
    }catch (error) {
        res.status(500).send(error)
    }


})

const multer = require('multer')
const sharp = require('sharp')
const upload = multer({
    //dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)

    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    //req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req,res, next) =>{
    res.status(400).send({error: error.message})

})

router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar',async (req,res) => {
   try {

        const user = await User.findById(req.params.id)

        if(!user || ! user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e) {
        //console.log(e.message)
        res.status(404).send()
    }
})



module.exports = router