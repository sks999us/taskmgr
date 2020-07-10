require('../src/db/mongoose')
const User = require('../src/models/user.js')
const Task = require('../src/models/task')

//5ef91eab214fe06d7dd4c0b5

// User.findByIdAndUpdate('5ef91eab214fe06d7dd4c0b5',{age:1})
// .then((user) => {
//     console.log(user)
//     return User.countDocuments({age: 1})
// })
// .then((count) => {
//     console.log(count)
// })


// const updateAgeAndCount  = async (id, age) => {
//     await User.findByIdAndUpdate(id,{age: age})
//     const count = await User.countDocuments({age})
//     return count
// }

// updateAgeAndCount('5ef91eab214fe06d7dd4c0b5',1)
// .then((count) => {
//     console.log(count)
// })
// .catch((error) => {
//     console.log(error)
// })

const findTaskAndDelete = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}


findTaskAndDelete('5ef93f8f1a9188700b35a051',1)
.then((count) => {
    console.log(count)
})
.catch((error) => {
    console.log(error)
})