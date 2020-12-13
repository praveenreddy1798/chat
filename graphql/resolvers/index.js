const messageResolvers = require('./messages')
const userResolvers = require('./user')
const {Message,User} = require('../../models')
module.exports={
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
      },
      Reaction: {
        createdAt: (parent) => parent.createdAt.toISOString(),
        message: async (parent) => await Message.findByPk(parent.messageId),
        user: async (parent) =>
          await User.findByPk(parent.userId, {
            attributes: ['username', 'imageUrl', 'createdAt'],
          }),
      },
      Query: {
        ...userResolvers.Query,
        ...messageResolvers.Query,
      },
      Mutation: {
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation,
      },
      Subscription: {
        ...messageResolvers.Subscription
      }
    }
