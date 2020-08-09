const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info){
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 500)

            return pubsub.asyncIterator('count')
        }
    }, 
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info){
            const post = db.posts.find((post) => post.id === postId)

            if(!post){
                throw new Error('Post Not Found!')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    }
}

export { Subscription as default }