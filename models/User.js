const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') 


const UserSchema = new mongoose.Schema({      // 建立user schema
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        // 邮箱的输入必须符合特定的pattern
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
               'Please provide valid email'],
        unique: true,       // unique index
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
})


// Mongoose自带的instance method (和schema有关的函数可以封装起来)
// 用来generate token的函数
UserSchema.methods.createJWT = function () {     // createJWT这个名字是我自己定义的
    return jwt.sign(
        {userId: this._id, name: this.name},    // this代指被引文件里的user变量
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME},
    )
}

// 用来login时比较密码的函数(password和encoded pw没法直接比较)
UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = bcrypt.compare(canditatePassword, this.password)
    return isMatch
}





module.exports = mongoose.model('User', UserSchema)


