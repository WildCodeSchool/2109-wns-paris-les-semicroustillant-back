import { InputType, Field, ID } from "type-graphql";
import User from "../entities/UserEntity";

@InputType()
export default class UserInputUpdate implements Partial<User>{
  @Field(() => ID)
  _id!: string;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  hash?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  position?: string;
}
