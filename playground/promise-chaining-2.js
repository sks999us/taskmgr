require('../src/db/mongoose')
const Task = require('../src/models/task.js')

//5ef91fafdf33ed6d8ada8c07

Task.findByIdAndRemove('5ef91fafdf33ed6d8ada8c07')
.then((task) => {
    console.log(task)
    return Task.countDocuments({completed: false})
})
.then((count) => {
    console.log(count)
})
.catch((error) => {
    console.log("Error " + error)
})

