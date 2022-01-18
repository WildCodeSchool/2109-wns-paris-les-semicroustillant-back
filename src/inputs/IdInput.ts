import { InputType, Field, ID } from "type-graphql";
// import mongoose from 'mongoose';

@InputType()
export default class IdInput {
  @Field(() => ID)
  _id!: string;
}
