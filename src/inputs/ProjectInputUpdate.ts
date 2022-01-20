import { InputType, Field, ID } from "type-graphql";
import IdInput from "./IdInput";
import Users from "../entities/Users";

@InputType()
export default class ProjectInputUpdate {
  @Field(() => ID)
  _id!: string;

  @Field({ nullable: true })
  name: string;
  
  @Field({ nullable: true })
  projectOwner: string;

  @Field(() => [IdInput], { nullable: true })
  members: Users[];
}
