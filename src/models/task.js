const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        //minlength: 1,
        required: true,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
},
{   toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    timestamps: true
})

taskSchema.pre('save',async function (next) {
    const task = this

    console.log('Called from TASK pre function')

    next()

})

const Task = mongoose.model('Task',taskSchema)


module.exports = Task