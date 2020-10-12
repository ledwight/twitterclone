import "reflect-metadata"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { createConnection } from 'typeorm'

// Resolver Imports
import { UserResolver } from "./resolvers/user"
import { PostResolver } from "./resolvers/post"
import { Post } from "./entities/Post"
import { User } from "./entities/User"

const main = async () => {

    const app = express();

    const conn = await createConnection({
        type: 'postgres',
        database: 'twitterclone2', 
        username: 'postgres',
        password: 'admin',
        logging: true,
        synchronize: true,
        entities: [Post, User]
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver],
            validate: false
        }),
        context: ({req, res}) => ({ req, res })
    })

    // Redis session setup
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                secure: false, // turn this on in prod
                sameSite: 'lax'
            },
            saveUninitialized: false,
            secret: 'randomString',
            resave: false,
        })
    )

    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))

    apolloServer.applyMiddleware({ app, cors: { origin: false } })

    app.listen(4000, () => {
        console.log("Express server up and running!")
    })


}

main()