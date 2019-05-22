const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const threadSchema = new Schema({
  _id: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  bumped_on: {
    type: Date,
    default: Date.now
  },
  reported: {
    type: Boolean,
    default: false
  },
  delete_password: {
    type: String,
    required: true
  },
  replies: {
    type: Array,
    default: []
  },
  board: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('thread', threadSchema)