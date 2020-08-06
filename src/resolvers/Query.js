const Query = {
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
}

export {Query as default}