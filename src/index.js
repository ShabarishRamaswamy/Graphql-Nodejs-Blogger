import { ApolloServer, gql } from 'apollo-server'
var fs = require('fs');
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import { merge } from 'lodash'

const server = new ApolloServer({
    typeDefs: gql`${fs.readFileSync('./src/schema.graphql')}`,
    resolvers: { Query, Mutation, Post, User, Comment },
    context: {
        db
    }
})

server.listen().then(({url}) => {
    console.log(`Server is Up! on ${url}`)
})