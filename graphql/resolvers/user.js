const {User}=require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError,AuthenticationError} = require('apollo-server')
const {Op} = require('sequelize')
const { Message } = require('../../models')
module.exports={
    Query: {
    getUsers: async (_,__,{user}) => {
       try {
           if(!user){
               throw new AuthenticationError('unauthenticated')
           }
        
           let users = await User.findAll({
               attributes:['username','imageUrl','createdAt'],
               where: {username : {[Op.ne]:user.username}},
           })

           const allUserMessages = await Message.findAll({
               where:{[Op.or]:[{from:user.username},{to:user.username}],},
               order:[['createdAt','DESC']]
           })

       users=users.map((otherUser)=>{
           const latestMessage = allUserMessages.find((m)=>m.from===otherUser.username || m.to===otherUser.username)
           otherUser.latestMessage = latestMessage
           return otherUser
    
       })
           return users
       }
       catch (err) {
           console.log(err)
           throw err
       }
    },

    login: async(_,args)=>{
        const{username,password} = args
        const errors ={}
        try{
            if (username.trim()=='')errors.username='username must not be empty'
            if (password.trim()=='')errors.password='password must not be empty'
            if(Object.keys(errors).length >0)
            throw new UserInputError('Fill in the fields appropriately',{errors})
            const user = await User.findOne({where:{username:username}
            })
            if(!user){
                errors.username='invalid username'
                throw new UserInputError('invalid username',{errors})
            }
            const correctPassword = await bcrypt.compare(password,user.password)

            if(!correctPassword){
                errors.password='password is incorrect'
                throw new UserInputError('please check your password',{errors})
            }
            const token = jwt.sign({username
              },process.env.JWT_SECRET, { expiresIn: '1h' });

            return {
                ...user.toJSON(),
                createdAt:user.createdAt.toISOString(),
                token
            }
        }
        catch (err){
            console.log(err)
            throw err

        }
    }

  },

  Mutation:{
      register: async(_,args)=>{
          let {username,password,email,confirmPassword} = args
          let errors ={}
          try{
              if(email.trim()==='')errors.email='email must not be empty'
              if(username.trim()==='')errors.username='username must not be empty'
              if(password.trim()==='')errors.password='password must not be empty'
              if(confirmPassword.trim()==='')errors.confirmPassword='confirm password must not be empty'

              if(password!==confirmPassword)errors.confirmPassword='passwords must match'

              const userByusername = await User.findOne({where:{username}})
              const userByemail = await User.findOne({where:{email:email}})
              if(userByusername)errors.username='Username already taken'
              if(userByemail)errors.email='Email already taken'

              if(Object.keys(errors).length > 0){
                  throw errors
              }

              password = await bcrypt.hash(password,6)

             const user = await User.create({
            username,email,password
        })
        return user
          }
          catch (err) {
              console.log(err)
            if (err.name === 'SequelizeValidationError') {
                err.errors.forEach((e) => (errors[e.path] = e.message))
              }
              throw new UserInputError('bad input',{errors}) 
          }
         
      },
      
      
  }
}