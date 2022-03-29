import { InputType, Field, ID } from 'type-graphql';
import Project from '../entities/ProjectEntity';

@InputType()
export default class ProjectInputUpdate implements Partial<Project> {
  @Field(() => ID)
  _id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  projectOwner?: string;

  @Field(() => [ID], { nullable: true })
  members?: string[];

  @Field({ nullable: true })
  advancement?: number;
}
