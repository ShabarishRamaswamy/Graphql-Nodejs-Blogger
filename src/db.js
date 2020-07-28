const comments = [{
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
const posts = [{
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
const users = [{
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

const db = {
    users,
    posts,
    comments
}

export {db as default}