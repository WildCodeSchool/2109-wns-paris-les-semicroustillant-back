import { InputType, Field, ID } from 'type-graphql';
import Project from '../entities/ProjectEntity';
import User from '../entities/UserEntity';

@InputType()
export default class ProjectInputUpdate implements Partial<Project> {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID,  { nullable: true })
  created_by: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  project_owner?: User;

  @Field(() => [ID], { nullable: true })
  members?: User[];
}
