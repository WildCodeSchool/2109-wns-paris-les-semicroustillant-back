import { InputType, Field } from "type-graphql";
import IdInput from "./IdInput";
import Users from "../entities/Users";

@InputType()
export default class ProjectInput {
  @Field()
  name: string;
  
  @Field()
  projectOwner: string;

  @Field(() => [IdInput], { nullable: true })
  members: Users[];
}
