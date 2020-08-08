import { ApolloServer, gql, PubSub } from 'apollo-server'
var fs = require('fs');
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import { merge } from 'lodash'

const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs: gql`${fs.readFileSync('./src/schema.graphql')}`,
    resolvers: { Query, Mutation, Subscription, Post, User, Comment },
    context: {
        db,
        pubsub
    }
})

server.listen().then(({url}) => {
    console.log(`Server is Up! on ${url}`)
})