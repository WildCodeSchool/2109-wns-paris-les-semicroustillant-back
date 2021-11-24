import { InputType, Field } from "type-graphql";
import UserInput from "./UserInput";

@InputType()
export default class ProjectInput {
  @Field()
  name: string;
  
  @Field()
  projectOwner: string;

  @Field(() => [UserInput])
  members: UserInput[];
}