import { InputType, Field } from "type-graphql";
import IdInput from "./IdInput";

@InputType()
export default class ProjectInput {
  @Field()
  name: string;
  
  @Field()
  projectOwner: string;

  @Field(() => [IdInput])
  members: IdInput[];
}