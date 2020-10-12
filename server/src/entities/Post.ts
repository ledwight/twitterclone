import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToOne } from 'typeorm'
import { Field, Int, ObjectType } from "type-graphql";
import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity{
    
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    creatorId: number;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column()
    body: string;

    @Field(() => Int)
    @Column({default: 0})
    points: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt = Date();

    @ManyToOne(() => User, (user) => user.posts)
    creator: User


    // @Field(() => User)
    // @ManyToOne(() => User)
    // owner: User;
    
}