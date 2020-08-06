const Comment = {
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

export {Comment as default}