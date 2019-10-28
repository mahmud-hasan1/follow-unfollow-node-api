const http = require('http')
const express = require('express')
const mongoose = require('mongoose')

const User = require('./model/user')


const app = express()
app.use(express.json())


// //! Current Logged-In User
// app.use((req, res, next)=>{
//   req.userId = '5db410a3462b2b0d1c9887cb'
//   next()
// })


// Get All Users
app.get('/users', async (req, res, next)=>{
  let users = await User.find()
  res.json(users)
})

//. Register  A New User
app.post('/register', async(req, res, next)=>{  
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  try{
    await newUser.save()
    res.json(newUser)

  } catch(err){ res.json(err) }
}) 


//? Follow 
app.put('/follow', async(req, res, next)=>{
  const { otherPersonId, loggedUserId } = req.body

  let currUser = await User.findById(loggedUserId)
  let targetPerson = await User.findById(otherPersonId)
  
  //! You ( Current Logged in your Browser )
  let isExising = currUser.following.findIndex(u=> u.userId.toString() === targetPerson._id.toString())

  if(isExising >= 0){
    return res.send('You Already Following Him.........')
  }

  //! You ( Current Logged in your Browser )
  currUser.following.push({
    userId: targetPerson._id,
    username: targetPerson.username,
    avatar: 'null'
  })

  //! You Following him/her (He/She) 
  targetPerson.followers.push({
    userId: currUser._id,
    username: currUser.username,
    avatar: 'null'
  })

  await currUser.save()
  await targetPerson.save()

  res.send(currUser)
})


//? unFollow
app.put('/unfollow', async (req, res, next)=>{
  const { otherPersonId, loggedUserId } = req.body

  let currUser = await User.findById(loggedUserId)
  let targetPerson = await User.findById(otherPersonId)

  //! You ( Current Logged in your Browser )
  let isExisingInFollowing = currUser.following.findIndex(cu=> cu.userId.toString() === otherPersonId.toString())
  if(isExisingInFollowing < 0){
    return res.send('You Not Yet Following Him.........')
  }
  
  //! You
  //! Remove From Following in Current User on Profile
  currUser.following.splice(isExisingInFollowing, 1)
  await currUser.save()


  //! You Following him (He) 
  //! Remove From Followers in who (whom you following) Profile
  let isExisingInFollowers = targetPerson.followers.findIndex(tu=> tu.userId.toString() === loggedUserId.toString())
  targetPerson.followers.splice(isExisingInFollowers, 1)
  await targetPerson.save()

  res.json({message: "unfollowed......"})
})




mongoose.connect('mongodb://localhost/following-node-app', { useNewUrlParser: true })
.then((res)=>{
    const port = process.env.PORT || 4000
    const server = http.createServer(app)
    server.listen(port, ()=>console.log(`server is running on port ${port}`))
  })  
.catch((err)=>console.log(err))  
