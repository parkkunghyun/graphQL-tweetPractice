// package.json에 "type": "module" 그래야 import 가능 아니면 require만!

import { ApolloServer, gql } from "apollo-server";

let users = [
    {
        id: "1",
        firstName: "nico",
        lastName: 'las'
     },
    {
        id: "2",
        firstName: "mask",
        lastName: 'elon'
    },
]

let tweets = [
    {
        id: '1',
        text: 'hello',
        userId: '2'
    },
    {
        id: '2',
        text: 'thank you',
        userId: '3'
    }
]


//아래에 SDL 적어주기!
// Qery는 화면을 보여주는걸 뜻하고 그런게 하나이상있어야하기에 필수!
//  1. API Shape을 먼저 만들어서 데이터를 어떻게 가져올지 구상하자!

// 내가 만드는거는 트위터처럼 유저가 대화를 보내고 받는 형식!
// 필요한 부분 User(id,firstName, lastName, fullName), Tweet(id,text,author)
const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
    }

    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!):Tweet
    }

    type Mutation {
        postTweet(text: String! userId: ID!): Tweet
        deleteTweet(id: ID!): Boolean
    }

`
const resolvers = {
    Query: {
        allUsers() {
            console.log('all user')
            return users
        },
        allTweets() {
            return tweets
        }
    },
    Mutation: {
        postTweet(_, {text,userId}) {
            const newTweet = {
                id: tweets.length +1,
                text,
                userId
            }
            const check = users.find((user)=> user.id === userId)
            if (!check) { return}
            tweets.push(newTweet)
            return newTweet
        },
        deleteTweet(_, {id}) {
            const delTweet = tweets.find((tweet) => tweet.id === id)
            if(!delTweet) {return false}
            tweets = tweets.filter((tweet) => tweet.id !== id)
            return true
        }
    },
    User: {
        fullName({firstName, lastName }) {
            console.log('dynamic fullName user')
            return `${firstName} ${lastName}`
        }
    },
    Tweet: {
        author({userId}) {
            return users.find((user)=> user.id === userId)
        }
    }

}


const server = new ApolloServer({typeDefs,resolvers})
server.listen().then( (url) => {
    console.log(`server is running ${url}`)
})