import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        return Post.find();
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('title', () => String) title: string,
        @Arg('body', () => String) body: string,
        @Ctx() {req}: MyContext): Promise<Post | undefined> {
            return Post.create({title: title, body: body, creatorId: req.session.userId}).save()
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
        @Arg('body', () => String, { nullable: true }) body: string
    ): Promise<Post | undefined> {
        const post = await Post.findOne(id)
        if (!post) {
            return undefined
        } else {
            post.title = title
            post.body = body
            Post.save(post)

            // Post.update({id}, {title: title, body: body})
        }
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number): Promise<boolean> {
        await Post.delete(id)
        return true
    }

    // Templates for future queries

    // @Query(() => City, {nullable: true})
    // cityById(
    //     @Arg('id', () => Int) ID: number,
    //     @Ctx() { em }: MyContext
    // ): Promise<City | null> {
    //     return em.findOne(City, { ID })
    // }
    // @Query(() => [City], {nullable: true})
    // citiesByDistrict(
    //     @Arg('district', () => String) District: String,
    //     @Ctx() { em } : MyContext
    // ): Promise<[City] | null> {
    //     return em.find(City, {District: District})

}