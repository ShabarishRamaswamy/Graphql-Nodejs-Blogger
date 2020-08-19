import { v4 as uuidv4 } from 'uuid'

const Mutation = {
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
        db.comments = db.comments.filter((comment) => comment.author !== args.id)
        return deletedUsers[0]
    }, 
    updateUser(parent, args, { db }, info) {
        const { id, data } = args
        const user = db.users.find(user => user.id === id)
        if(!user) {
            throw new Error('User not found!')
        }
        if(typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email)

            if(emailTaken) {
                throw new Error('Email Taken')
            }
            user.email = data.email
        }

        if(typeof data.name === 'string') {
            user.name = data.name
        }

        if(typeof data.age === 'number'){
            user.age = data.age
        }

        return user
    },
    createPost(parent, args, { db, pubsub }, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        if(!userExists){
            throw new Error("ID is invalid")
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        pubsub.publish(`post`, { 
            post: {
                mutation: "CREATED",
                data: post
            }
        })
        return post
    }, 
    deletePost(parent, args, { db, pubsub }, info){
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        if(postIndex === -1){
            throw new Error("Invaid Post ID")
        }
        const [post] = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter((comment) => {
            return comment.post !== args.id
        })
        // console.log(post)

        pubsub.publish('post', {
            post: {
                mutation: 'DELETED',
                data: post
            }
        })

        return post
    },
    updatePost(parent, args, { db, pubsub }, info){
        const post = db.posts.find((pst) => pst.id === args.id)
        // originalPost = {...post}

        if(!post){
            throw new Error('Could Not Find Post')
        }

        if(typeof args.data.title === 'string'){
            post.title = args.data.title 
        }

        if(typeof args.data.body === 'string'){
            post.body = args.data.body
        }

        /*
        if(typeof data.published == 'boolean'){
            post.published = data.published

            if(originalPost.published && !post.published){
                // Deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published){
                // Created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        }else if(post.published){
            // Updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }
        
        */

        pubsub.publish('post', {
            post: {
                mutation: 'UPDATED',
                data: post
            }
        })

        return post
    },
    createComment(parent, args, { db, pubsub }, info){
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
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        return comment
    }, 
    deleteComment(parent, args, { db, pubsub }, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        if(commentIndex === -1){
            throw new Error('Comment does not Exist')
        }
        const [comment] = db.comments.splice(commentIndex, 1)
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        })
        return comment
    },updateComment(parent, args, { db, pubsub }, info){
        const comment = db.comments.find((comment) => comment.id === args.id)
        if(!comment){
            throw new Error('Sorry, Comment Not Found!')
        }
        if(typeof args.data.text === 'string'){
            comment.text = args.data.text
        }
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })
        return comment
    }
}

export {Mutation as default}