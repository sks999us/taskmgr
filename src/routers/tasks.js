const express = require('express')
const router = new express.Router()
const Task = require("../models/task")
const auth = require('../middleware/auth')

router.post('/tasks',auth,async (req,res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try {
        await task.save()
        res.status(201).send(task)       
    }catch (error) {
        res.status(400).send(error)
    }

})

router.get('/tasks',auth,async (req,res) => {

    const match = {}
    const sort = {}

    if(req.query.completed) {
            match.completed = req.query.completed === 'true' ? true : false
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    //console.log(sort)
    try {
        //const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match ,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        //await req.user.populate('tasks').execPopulate()
        //console.log("User = " ,req.user)

        res.status(200).send(req.user)       
    }catch (error) {
        res.status(500).send(error)
    }

    // Task.find({})
    // .then(( result) => {
    //     res.status(200).send(result)

    // })
    // .catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.get('/tasks/:id',auth, async (req,res) => {

    try {
        //const task = await Task.findById(req.params.id)
        //await task.populate('owner').execPopulate()
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(task){
            res.status(200).send(task)
        } else {
            res.status(404).send(task)
        }    
    }catch (error) {
        res.status(500).send(error)
    }

})

router.patch('/tasks/:id',auth,async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed','description']

    const operationAllowed = updates.every((update) => 
         allowedUpdates.includes(update) 
    )

    if (!operationAllowed) {
        return res.status(400).send({error: "Invalid operations!!"})
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true})
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(task){
            updates.forEach((update) => task[update] = req.body[update]) 
    
            await task.save()

            res.status(200).send(task)

        } else {
            res.status(404).send(task)
        }    
    }catch (error) {
        res.status(500).send(error)
    }


})

router.delete('/tasks/:id',auth,async (req,res) => {


    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        //const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
         
        if(task){
            //task.remove()
            res.status(200).send(task)
        } else {
            res.status(404).send(task)
        }    
    }catch (error) {
        res.status(500).send(error)
    }


})

module.exports = router