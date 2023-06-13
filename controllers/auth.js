const User = require('../models/User')   // 导入schema
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')    // 用来hash password: 万一有人闯进了DB, 看见的也只是hash过的value

const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
  const {name, email, password} = req.body
  // hash password
  const salt = await bcrypt.genSalt(10)     // 生成salt
  const hashedPassword = await bcrypt.hash(password, salt)   // 用salt来hash生成random complex pw
  const tempUser = {name, email, password: hashedPassword}
  const user = await User.create({...tempUser})    // 在DB的user database里存储tempUser, db能自动加id
  /* 在数据库中，被添加的data是这样的:
  _id: ObjectId('727358ejad')
  name: "alan"
  email: "lfz0217@sina.com"
  password: "$2a$10$0EAbIU/7jWnse9Q"
  */

  // create token
  const token = user.createJWT()   // createJWT里的this就是user
  res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token})    // send back 201
  /* 在postman中，send back的data是这样的:
  {
    "user": {
      "name": "alan"
    },
    "token": "eyJhbGciOig3fQ.2ue-Xz4rNdjKg..."
  }
  */
}
  

const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})   // 把user从database里用email来找出
    
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password)    // instance method
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token})
}


module.exports = {     
    register,
    login,
}