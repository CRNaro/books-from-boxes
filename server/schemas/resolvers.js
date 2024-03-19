// resolvers.js is where we define the functionality for each query and mutation.
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks');

                return userData;
            }
            throw new Error('Not logged in');
    },
},

Mutation: {
    addUser: async (parent, args, context) => {
        const user = await User.create(args);
        //const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' }); 
        const token = signToken({username: user.username, email: user.email, _id: user._id});
        return { 
            token, 
            user 
        };
    },

    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
        }
        //const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' }); 
        const token = signToken({username: user.username, email: user.email, _id: user._id});
        return { token, user };
},

    saveBook: async (parent, { 
    bookId, 
    authors, 
    description, 
    title, 
    image, 
    link 
}, context) => {

    if (context.user) {
        const updateUser = await User.findOneAndUpdate(
            {_id: context.user._id },
            { $push: { savedBooks: { 
                bookId, 
                authors, 
                description, 
                title, 
                image, 
                link 
            } } },
            { new: true }
        );
        return updateUser;
    }
    throw new AuthenticationError('You need to be logged in!');
},

    removeBook: async (parent, { bookId }, context) => {   
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
    },
}
};
module.exports = resolvers;