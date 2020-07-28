import { ApolloServer, gql } from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'
var fs = require('fs');
import db from './db'


// Resolvers
const resolvers = {
    Query: {
        users(parent, args, { db }, info) {
            if(args.query){
                return db.users.filter((user) => {
                    return user.name.toLocaleLowerCase().includes(args.query)
                })
            }else{
                return db.users
            }
        },
        me(){
            return {
                id: '156',
                name: 'Aman',
                email: 'aman@example.com',
                age: 19
            }
        },
        post() {
            return{
                id: '123',
                title: 'Hello to Graphql',
                body: 'Welcome to GraphQl',
                published: '12 Jan 2020',
                author: 'Shabarish'
            }
        }, 
        posts(parent, args, { db }, info){
            if(args.query){
                return db.posts.filter((post) => {
                    return post.body.toLowerCase().includes(args.query.toLowerCase()) || post.title.toLowerCase().includes(args.query.toLowerCase())
                })
            }else{
                return db.posts
            }
        }, 
        comments(parent, args, { db }, info){
            return db.comments
        }
    }, 
    Mutation: {
        createUser(parent, args, { db }, info){
            const emailTaken = db.users.some((user) => user.email === args.data.email)
            if(emailTaken){
                throw new Error("Email Already Taken")
            }

            const one = {
                name: "Mumbai"
            }

            const two = {
                population: 30000000,
                ...one
            }


            const user = {
                id: uuidv4(),
                ...args.data
            }
            db.users.push(user)
            return user
        }, 
        deleteUser(parent, args, { db }, info){
            const userIndex = db.users.findIndex((user) => user.id === args.id)
            if(userIndex === -1){
                throw new Error("Invalid User")
            }

            const deletedUsers = db.users.splice(userIndex, 1)

            db.posts = db.posts.filter((post) => {
                const match = post.author === args.id
            
                if(match){
                    db.comments = db.comments.filter((comment) => comment.post !== post.id)
                }
                return !match
            })
            db.comments = comments.filter((comment) => comment.author !== args.id)
            return deletedUsers[0]
        },
        createPost(parent, args, { db }, info){
            const userExists = db.users.some((user) => user.id === args.data.author)
            if(!userExists){
                throw new Error("ID is invalid")
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            db.posts.push(post)
            return post
        }, 
        deletePost(parent, args, { db }, info){
            const postIndex = db.posts.findIndex((post) => post.id === args.id)
            if(postIndex === -1){
                throw new Error("Invaid Post ID")
            }
            const deletedPosts = db.posts.splice(postIndex, 1)

            db.comments = db.comments.filter((comment) => {
                return comment.post !== args.id
            })
            // console.log(post)
            return deletedPosts[0]
        },
        createComment(parent, args, { db }, info){
            const userExists = db.users.some((user) => user.id === args.data.author)
            const postExists = db.posts.some((post) => post.id === args.data.post)
            if(!postExists || !userExists){
                throw new Error("User or Post does not exist")
            }
            const comment = {
                id: uuidv4(),
                ...args.data
            }
            db.comments.push(comment)
            return comment
        }, 
        deleteComment(parent, args, { db }, info){
            const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
            if(commentIndex === -1){
                throw new Error('Comment does not Exist')
            }
            const deletedComments = db.comments.splice(commentIndex, 1)
            return deletedComments[0]
        }
    },
    Post: {
        author(parent, args, { db }, info){
            return db.users.find((user)=>{
                return user.id === parent.author
            })
        }, comments(parent, args, { db }, info){
            return db.comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    }, User: {
        posts(parent, args, { db }, info){
            return db.posts.filter((post) => {
                return post.author === parent.id
            })
        }, 
        comments(parent, args, { db }, info){
            return db.comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    }, Comment: {
        author(parent, args, { db }, info){
            return db.users.filter((user) => {
                return user.id === parent.author
            })
        }, post(parent, args, { db }, info){
            return db.posts.filter((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new ApolloServer({
    typeDefs: gql`${fs.readFileSync('./src/schema.graphql')}`,
    resolvers,
    context: {
        db
    }
})

server.listen().then(({url}) => {
    console.log(`Server is Up! on ${url}`)
})