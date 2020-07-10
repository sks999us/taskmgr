// const mongodb = require('mongodb')

// const MongoClient = mongodb.MongoClient
const {MongoClient, ObjectID} = require('mongodb')

//const connectionURL = process.env.MONGO_URL //'mongodb://127.0.0.1:27017'
const databaseName = 'taskmgr'

//const id = new ObjectID()

//console.log(id)
//console.log(id.getTimestamp())
//console.log(id.generationTime)

MongoClient.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {

    if (error) {
        console.log(error)
        return console.log("Error connecting to mongo db")
    }

    //console.log('Connected correctly...')

    const db = client.db(databaseName)

    // db.collection('tasks').updateMany(
    //     {completed: true},
    //     {
    //         $set: {completed:false}
    //     }
    // ).then((resolve) =>{
    //     console.log(resolve.modifiedCount)
    // })
    // .catch((reject) => {
    //     console.log(reject)
    // })

    db.collection('tasks').deleteOne(
        {_id : ObjectID("5ef8281b17af046272a30051")},
        {
            $set: {completed:false}
        }
    ).then((resolve) =>{
        console.log(resolve.deletedCount)
    })
    .catch((reject) => {
        console.log(reject)
    })


    // db.collection('users').insertOne({
    //     name: 'ncs',
    //     age: 25
    // },(error, result) => {
    //     if(error) {
    //         return console.log('Insert issue')
    //     }
    //     console.log(result.ops)
    // })



    // db.collection('tasks').insertMany([
    //     {
    //         name: 'email',
    //         completed: false
    //     },
    //     {
    //         name: 'shopping',
    //         completed: true
    //     },
    //     {
    //         name: 'return',
    //         completed: false
    //     }
    // ],(error, result) => {
    //     if(error) {
    //         return console.log('Insert issue')
    //     }
    //     console.log(result.ops)
    // })
})