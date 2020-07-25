import { ApolloServer, gql } from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'

//Demo Comments
let comments = [{
    id: '1', 
    text: 'Nice Article!',
    author: '1',
    post: '1'
}, {
    id: '2', 
    text: 'Liked it',
    author: '2',
    post: '2'
}, {
    id: '3', 
    text: 'Subscribed',
    author: '4',
    post: '3'
}, {
    id: '4', 
    text: 'Hello World',
    author: '2',
    post: '2'
}]


// Demo Posts Data
let posts = [{
    id: '1',
    title: 'About Ionic',
    body: 'This article is about Ionic',
    published: '12 Jan 2020',
    author: '1'
}, {
    id: '2',
    title: 'Hello',
    body: 'Hello Hi!',
    published: '18 July 2020',
    author: '2'
}, {
    id: '3',
    title: 'About GraphQL',
    body: 'GraphQL is a Query Language',
    published: '20 July 2020',
    author: '1'
}]

// Demo user Data
let users = [{
    id: '1',
    name: 'Shabarish',
    email: 'shabarish@example.com',
    age: 19
}, {
    id: '2',
    name: 'Aman',
    email: 'aman@example.com',
    age: 19
}, 
{
    id: '3',
    name: 'Swapnil',
    email: 'Swap@example.com',
    age: 20
}, 
{
    id: '4',
    name: 'Tomato',
    email: 'tomato@tomato.com',
    age: 24
}]

// Type Definitions (schema)
const typeDefs = gql`
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatedPostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreatedCommentInput): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!, 
        email: String!, 
        age: Int!
    }

    input CreatedPostInput {
        title: String!, 
        body: String!, 
        published: String!, 
        author: ID!
    }

    input CreatedCommentInput {
        text: String!, 
        author: ID!, 
        post: ID!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int!
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: String!
        author: User!
        comments: [Comment!]!
    }
    type Comment{
        id: ID!
        text: String!
        author: [User!]!
        post: [Post!]!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if(args.query){
                return users.filter((user) => {
                    return user.name.toLocaleLowerCase().includes(args.query)
                })
            }else{
                return users
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
        posts(parent, args, ctx, info){
            if(args.query){
                return posts.filter((post) => {
                    return post.body.toLowerCase().includes(args.query.toLowerCase()) || post.title.toLowerCase().includes(args.query.toLowerCase())
                })
            }else{
                return posts
            }
        }, 
        comments(parent, args, ctx, info){
            return comments
        }
    }, 
    Mutation: {
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user) => user.email === args.data.email)
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
            users.push(user)
            return user
        }, 
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex((user) => user.id === args.id)
            if(userIndex === -1){
                throw new Error("Invalid User")
            }

            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id
            
                if(match){
                    comments = comments.filter((comment) => comment.post !== post.id)
                }
                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)
            return deletedUsers[0]
        },
        createPost(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.data.author)
            if(!userExists){
                throw new Error("ID is invalid")
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            posts.push(post)
            return post
        }, 
        deletePost(parent, args, ctx, info){
            const postIndex = posts.findIndex((post) => post.id === args.id)
            if(postIndex === -1){
                throw new Error("Invaid Post ID")
            }
            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter((comment) => {
                return comment.post !== args.id
            })
            // console.log(post)
            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => post.id === args.data.post)
            if(!postExists || !userExists){
                throw new Error("User or Post does not exist")
            }
            const comment = {
                id: uuidv4(),
                ...args.data
            }
            comments.push(comment)
            return comment
        }, 
        deleteComment(parent, args, ctx, info){
            const commentIndex = comments.findIndex((comment) => comment.id === args.id)
            if(commentIndex === -1){
                throw new Error('Comment does not Exist')
            }
            const deletedComments = comments.splice(commentIndex, 1)
            return deletedComments[0]
        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        }, comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    }, User: {
        posts(parent, args, ctx, info){
            return posts.filter((post) => {
                return post.author === parent.id
            })
        }, 
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    }, Comment: {
        author(parent, args, ctx, info){
            return users.filter((user) => {
                return user.id === parent.author
            })
        }, post(parent, args, ctx, info){
            return posts.filter((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server is Up! on ${url}`)
})