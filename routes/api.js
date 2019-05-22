/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const shortid = require('shortid')
const mongoose = require('mongoose')

mongoose.connect(process.env.DB, {useNewUrlParser: true, useFindAndModify: false})
let db = mongoose.connection

let thread = require('../models/thread')

db.on('error', console.error.bind(console, 'Error connectiong to db...'))
db.once('open', () => {
  console.log('DB Connection success...')
})

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(function(req, res){ // create thread
    let newThread = new thread({
      _id: shortid.generate(),
      board: req.params.board,
      text: req.body.text,
      delete_password: req.body.delete_password
    })
    newThread.save()
    res.redirect('/b/'+req.params.board)
  })
  
    .get((req, res) => { // /api/threads/{board}
      thread.find({board: req.params.board}).sort({bumped_on: -1}).limit(10)
        .exec((err,data)=>{
        if(err)console.log('error getting thread: ', err)
        res.send(data)
      })
  })
  
    .put((req, res) => { // update thread and report
      thread.findOneAndUpdate({_id: req.body.thread_id},{
        $set: {
          reported: true
        }
      },{},(err,data)=>{
        if(data){
          res.send('success')
        }
      })
  })
  
    .delete((req, res)=>{ // delete thread
      console.log(req.params.board, req.body.thread_id, req.body.delete_password)
      thread.findOneAndDelete({
        board: req.params.board,
        _id: req.body.thread_id,
        delete_password: req.body.delete_password
      },{}, (err, data)=>{
        if(err)console.log('Error findOneAndDelete... ', err)
        if(data){
          res.send('Successfully Deleted Thread...')
        } else {
          res.send('Failed. Thread not found...')
        }
      })
  })
    
  app.route('/api/replies/:board') // Create reply
    .post((req,res)=>{
      const date = new Date()
      thread.findOneAndUpdate({_id: req.body.thread_id},{
        bumped_on: Date.now(),
        $push: {replies: {
          _id: shortid.generate(),
          text: req.body.text,
          delete_password: req.body.delete_password,
          reported: false,
          created_on: date.toLocaleString()
        }}
      },{new: true},(err,data)=>{
        if(err)console.log('Failed to findOneAndUpdate...', err)
        if(data){
          res.redirect('/b/'+req.params.board+'/'+req.body.thread_id)
        } else {
          console.log('No reply id to delete')
          res.send('No reply id to delete')
        }
      })
  })
    .get((req,res)=>{ // /api/replies/{board}?thread_id={thread_id}
      thread.findOne({_id: req.query.thread_id}).limit(10)
        .exec((err,data)=>{
        if(err)console.log('Error getting replies...', err)
        res.send(data)
      })
  })
    
    .put((req, res) => { // report a reply
      thread.findOneAndUpdate({_id: req.body.thread_id, "replies._id": req.body.reply_id}, {
        $set:{
          "replies.$.reported": true
        }
      }, {}, (err, data) => {
        if(data){
          res.send('Success')
        } else {
          res.send('Error. Report reply failed')
        }
      })
  })
  
    .delete((req, res)=>{ // delete reply ...incorrect password
      thread.findOneAndUpdate({
        board: req.params.board,
        _id: req.body.thread_id,
        "replies._id": req.body.reply_id,
        "replies.delete_password": req.body.delete_password
      },{
        $pull: {
          replies: {
            _id: req.body.reply_id
          }
        }
      }, (err, data)=>{
        if(err)console.log('Error deleting reply...', err)
        if(data){
          res.send('Success')
        } else {
          res.send('Incorrect Password')
        }
      })
  })

};
