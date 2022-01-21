import { InputType, Field, ID } from "type-graphql";
import User from "../entities/Users";

@InputType()
export default class UserInputUpdate implements Partial<User>{
  @Field(() => ID)
  _id!: string;

  @Field()
  firstname?: string;

  @Field()
  lastname?: string;

  @Field()
  email?: string;

  @Field()
  hash?: string;

  @Field()
  role?: string;

  @Field()
  position?: string;
}
