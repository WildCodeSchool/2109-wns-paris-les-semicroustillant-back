import { InputType, Field, ID } from "type-graphql";
import IdInput from "./IdInput";
// import ProjectInput from "./ProjectInput";

@InputType()
// export default class ProjectInputUpdate implements Partial<ProjectInput> {
export default class ProjectInputUpdate {
  @Field(() => ID)
  _id!: string;

  @Field()
  name?: string;
  
  @Field()
  projectOwner?: string;

  @Field(() => [IdInput])
  members?: IdInput[];
}