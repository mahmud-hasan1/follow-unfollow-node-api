const mongoose = require('mongoose')

const userSchema  = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  //! Ai User jahake jahake follow Korbe.........
  following:[
    { 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ,
      username: String,
      avatar: String
    }
  ],

  //! Ai User ke je je Follow Korbe..........
  followers:[
    { 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      avatar: String
    }
  ]
}, { timestamps: true })

module.exports = new mongoose.model('User', userSchema)