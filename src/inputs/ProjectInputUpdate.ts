import { InputType, Field, ID } from "type-graphql";
// import Project from "../entities/Projects";
import UserInputUpdate from "./UserInputUpdate";

@InputType()
// export default class ProjectInputUpdate implements Partial<Project> {
export default class ProjectInputUpdate {
  @Field(() => ID)
  _id!: string;

  @Field()
  name?: string;
  
  @Field()
  projectOwner?: string;

  @Field(() => [UserInputUpdate])
  members?: UserInputUpdate[];
}