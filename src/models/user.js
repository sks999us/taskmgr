const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const { Binary } = require('mongodb')
const sharp = require('sharp')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password length > 6 chars and can not be = password ')
            }
            
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value) ) {
                throw new Error('Not a valid Email')
            }
            
        }
    },
    age:{
        type: Number,
        validate(value){
            if (value <= 0 ) {
                throw new Error('Age should be a poitive number')
            }

        }
    },
    tokens:[
        { token: {
                type: String,
                required: true
            }
        }
    ],
    avatar:{
        type: Buffer
    }
},
{   toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    timestamps: true
}

)

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save',async function (next) {
    const user = this

    if (user.isModified('password')) {
        console.log('Password Changed!!')
        const hashedpwd = await bcrypt.hash(user.password, 8)
        user.password = hashedpwd    
    }

    next()

})

userSchema.pre('remove',async function (next) {
    const user = this

    await Task.deleteMany({owner: user._id})

    next()

})

userSchema.statics.findUserByCredential = async (email, pwd) => {

    const user = await User.findOne({email})

    if(!user) {
        throw new Error("User not found")
    }

    const isMatch = await bcrypt.compare(pwd, user.password)

    if(!isMatch){
        console.log('Password mismatch')
        throw new Error("Password does not match")
    }

    return user
}

userSchema.methods.generateToken = async function() {
    //console.log("EMAIL = " + email)
    user = this
    const token =  jwt.sign({_id:user._id.toString()},process.env.JWT_SALT)
    //console.log("TOKEN = " + token)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON =  function() {
    console.log("getPublicProfile CALLED")
    const user = this
    
    const userObject = user.toObject()
    //console.log(userObject)
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

const User = mongoose.model('User',userSchema)

module.exports = User