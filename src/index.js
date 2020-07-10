const express = require("express")

require("./db/mongoose")

const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT 

const multer = require('multer')
const upload = multer({
    dest: 'images'
})

app.post('/upload',upload.single('upload'),(req,res) => {
    res.send()
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)





app.listen(port, () => {
    console.log("Server is runnin on port : " + port)
})
