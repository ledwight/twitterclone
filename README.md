# Twitter Clone
Basic Twitter Clone CRUD application built with a React, GraphQL, and Apollo Stack connected to a local postgres database
Based off of [Ben Awad's](https://www.youtube.com/channel/UC-8QAzbLcRglXeN_MY9blyw) tutorial [here](https://www.youtube.com/watch?v=I6ypD7qv3Z8)

## Installation
The latest version of Node.js, PostGreSQL, and Redis are required to run this application
[Node Download](https://nodejs.org/en/)
[PostGreSQL Download](https://www.postgresql.org/download/)
[Redis Download](https://redis.io/download)

## Information
### Server
The back-end is connected to a local PostGreSQL database, and is being ran with [TypeORM](https://typeorm.io/#/) as it's object relational manager.
[Redis Download](https://redis.io/download) is used for cookie storage management due to it's fast rewrite nature.
[Apollo](https://www.apollographql.com/docs/react/) is used as the state management library and as the engine for [GraphQL](https://graphql.org/) queries.

### Web
Front-end is built with [React](https://reactjs.org/) using [NextJS](https://nextjs.org/) for routing and [Chakra-UI's](https://chakra-ui.com/) component library.
Use [GraphQL Codegen](https://graphql-code-generator.com/) for custom GraphQL Query Hooks (VERY USEFUL TOOL FOR GRAPHQL).

# Installation
Navigate into both your web and server folders and run npm install
```bash
npm install
```

# Usage
Make sure you have your redis and postgres local instances running. Afterwards, change this snippet of code to match your needs:
```
    const conn = await createConnection({
        type: 'postgres',
        database: '', //Local Database Name
        username: '', //Local Database Username 
        password: '', //Local Database Password
        logging: true,
        synchronize: true,
        entities: [Post, User]
    })
```
Upon running, the ```synchronize: true``` flag should automatically update your database schema to what's defined in the application entities

## Inside server folder
Open up two consoles and run the following commands:
```npm run watch```
```npm run dev```
Afterwards, navigate [here](https://localhost:4000/graphql) to open an interactive GraphQL UI

## Inside web folder
Open up a console and run the following command:
```npm run dev```
Afterwards, navigate [here](https://localhost:3000)

## License
[MIT](https://choosealicense.com/licenses/mit/)