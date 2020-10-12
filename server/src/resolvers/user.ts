import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2'
import { getConnection } from 'typeorm'

// User response object
@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext) {
        if (!req.session.userId) {
            console.log("You are not logged in")
            return null
        }
        return User.findOne(req.session.userId)
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return await User.find()
    }

    @Query(() => User, { nullable: true })
    async user(
        @Arg('id', () => Int) id: number): Promise<User | undefined> {
        return await User.findOne(id)
    }

    @Query(() => User, { nullable: true })
    async userByName(
        @Arg('name', () => String) name: string): Promise<User | undefined> {
        return User.findOne({ where: { name } })
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg('username', () => String) username: string,
        @Arg('password', () => String) password: string,
        @Arg('name', () => String) name: string,
        @Arg('email', () => String) email: string,
        @Ctx() { req }: MyContext): Promise<UserResponse | undefined> {
        // Example of back-end form validation
        if (username.length < 2) {
            return {
                errors: [{
                    field: "username",
                    message: "Username cannot be less than 2 characters"
                }]
            }
        }
        if (password.length < 2) {
            return {
                errors: [{
                    field: "password",
                    message: "Password cannot be less than 2 characters"
                }]
            }
        }
        let user: User
        try {
            const hashedPassword = await argon2.hash(password)
            const result = await getConnection().createQueryBuilder().insert().into(User).values({
                username: username,
                email: email,
                name: name,
                password: hashedPassword
            }).returning("*").execute();
            user = result.raw[0]
            req.session.userId = user.id
        } catch (err) {
            console.log("WE IN THE ERRORS: " + err)
            if (err.code === 23505) {
                return {
                    errors: [{
                        field: "username",
                        message: "Username is already taken"
                    }]
                }
            }
        }
        return { user }
    }

    @Mutation(() => User, { nullable: true })
    async updateUser(
        @Arg('id', () => Int) id: number,
        @Arg('name', () => String, { nullable: true }) name: string): Promise<User | undefined> {
        const user = await User.findOne(id)
        if (!user) {
            return undefined
        }
        User.update(user, { name: name })
    }

    @Mutation(() => Boolean)
    async deleteUser(
        @Arg('id', () => Int) id: number): Promise<boolean> {
        await User.delete(id)
        return true
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('username', () => String) username: string,
        @Arg('password', () => String) password: string,
        @Ctx() { req }: MyContext): Promise<UserResponse> {
        const user = await User.findOne({ where: { username } })
        if (!user) {
            return {
                errors: [{
                    field: "username",
                    message: "Username does not exist!"
                }]
            }
        } else {
            const valid = await argon2.verify(user.password, password)
            if (!valid) {
                return {
                    errors: [{
                        field: "password",
                        message: "Password is incorrect"
                    }]
                }
            } else {
                req.session.userId = user.id
                console.log("User Id: " + req.session.userId)
                return { user }
            }
        }
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() { req, res }: MyContext
    ) {
        return new Promise(resolve => req.session.destroy(err => {
            if (err) {
                return resolve(false)
            } else {
                res.clearCookie('qid');
                return resolve(true)
            }
        }))
    }

    // Templates for future queries

    // @Query(() => [City], {nullable: true})
    // citiesByDistrict(
    //     @Arg('district', () => String) District: String,
    //     @Ctx() { em } : MyContext
    // ): Promise<[City] | null> {
    //     return em.find(City, {District: District})

}