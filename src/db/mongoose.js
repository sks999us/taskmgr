const mongoose = require('mongoose')
//const User = require('../models/user')
const Task = require('../models/task')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify: false
})



// const me = new User({
//     name: 'SKS',
//     password: 'Passwor',
//     email: 'sks@yahoo.Com ',
//     age: 49
// })

// me.save()
// .then(( result) => {
//     console.log(result)
// })
// .catch((error) => {
//     console.log(error)
// })

///

// const task = new Task({
//     description: "x"

// })


// task.save()
// .then(( result) => {
//     console.log(result)
// })
// .catch((error) => {
//     console.log(error)
// })