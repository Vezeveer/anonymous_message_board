/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let threadID = "";
  let threadID2 = "";
  let replyID = "";
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('POST /api/threads/exampleboard', function(done){
        chai.request(server)
          .post('/api/threads/exampleboard')
          .send({
            'text': "post text",
            'delete_password': "123"
        }).end(function(err, res){
            if(err)console.log(err)
            assert.equal(res.status, 200)

            done() //done
        })
      })
      test('POST second thread for reply test', function(done){
        chai.request(server)
          .post('/api/threads/exampleboard')
          .send({
            'text': "post text 2",
            'delete_password': "12345"
        }).end((err,res)=>{
          assert.equal(res.status, 200)
          done()
        })
      })
    })
    
    suite('GET', function() {
      test('GET /api/threads/:board', function(done){
        chai.request(server)
          .get('/api/threads/exampleboard')
          .end((err, res) => {
            if(err)console.log('Error GET: ', err)
            assert.equal(res.status, 200)
            threadID2 = res.body[0]._id
            threadID = res.body[1]._id
            done()
        })
      })
    });
    
    
    suite('PUT', function() {
      test('PUT report thread', function(done){
        chai.request(server)
          .put('/api/threads/exampleboard')
          .send({thread_id: threadID})
          .end((err,res)=>{
            if(err)console.log('PUT error: ', err)
            assert.equal(res.status, 200)
            assert.equal(res.text, 'success')
            done()
        })
      })
    });
    
    suite('DELETE', function() {
      test('DELETE /api/threads/exampleboard', function(done){
        chai.request(server)
        .delete('/api/threads/exampleboard')
        .send({
          thread_id: threadID,
          delete_password: "123"
        })
        .end((err,res)=>{
          if(err)console.log('trouble with delete;')
          assert.equal(res.status, 200)
          assert.equal(res.text, "Successfully Deleted Thread...")
          done()
        })
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('POST /api/replies/exampleboard', function(done){
        chai.request(server)
          .post('/api/replies/exampleboard')
          .send({thread_id: threadID2,
                  text: "example text",
                 delete_password: "123"
                })
          .end((err,res)=>{
            if(err)console.log(err)
            assert.equal(res.status, 200)
            
          done()
        })
      })
    });
    
    suite('GET', function() {
      test('GET /api/replies/exampleboard', function(done){
        chai.request(server)
          .get('/api/replies/exampleboard')
          .query({thread_id: threadID2})
          .end((err,res)=>{
            if(err)console.log(err)
            assert.equal(res.status, 200)
            replyID = res.body.replies[0]._id
            done()
        })
        
      })
    });
    
    suite('PUT', function() {
      test('PUT /api/replies/exampleboard', function(done){
        chai.request(server)
          .put('/api/replies/exampleboard')
          .send({thread_id: threadID2,
                  reply_id: replyID
                })
          .end((err,res)=>{
            if(err)console.log(err)
            assert.equal(res.status, 200)
            assert.equal(res.text, 'Success')
            done()
        })
        
      })
    });
    
    suite('DELETE', function() {
      test('DELETE /api/replies/exampleboard', function(done){
        chai.request(server)
          .delete('/api/replies/exampleboard')
          .send({thread_id: threadID2,
                  reply_id: replyID,
                 delete_password: "123"
                })
          .end((err,res)=>{
            if(err)console.log(err)
            assert.equal(res.status, 200)
            assert.equal(res.text, 'Success')
            done()
          
        })
      })
    });
    
    suite('DELETE', function() {
      test('DELETE /api/threads/exampleboard', function(done){
        chai.request(server)
        .delete('/api/threads/exampleboard')
        .send({
          thread_id: threadID2,
          delete_password: "12345"
        })
        .end((err,res)=>{
          if(err)console.log('trouble with delete;')
          assert.equal(res.status, 200)
          assert.equal(res.text, "Successfully Deleted Thread...")
          done()
        })
      })
    });
    
  });

});
