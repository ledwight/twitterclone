import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity{
    
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({unique: true })
    username!: string;

    @Column()
    password!: string;

    @Field(() => String)
    @Column()
    name: string;

    @Field(() => String)
    @Column({ unique: true})
    email: string;

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[]


    // @Field(() => Post)
    // @OneToMany( () => Post, Post => Post.owner)
    // posts: [Post]
}