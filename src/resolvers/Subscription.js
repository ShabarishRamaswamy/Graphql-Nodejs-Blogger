const Subscription = {
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info){
            const post = db.posts.find((post) => post.id === postId)

            if(!post){
                throw new Error('Post Not Found!')
            }

            return pubsub.asyncIterator(`comment`)
        }
    },
    post: {
        subscribe(parent, args , { db, pubsub }, info){
            return pubsub.asyncIterator(`post`)
        }
    }
}

export { Subscription as default }