const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
    {
      company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50,
      },
      position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100,
      },
      status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],    // enumerate只能列举这几个
        default: 'pending',
      },
      createdBy: {
        type: mongoose.Types.ObjectId,    // every job created will be associated with a user
        ref: 'User',
        required: [true, 'Please provide user'],
      },
    },
    { timestamps: true }
  )
  
  module.exports = mongoose.model('Job', JobSchema)