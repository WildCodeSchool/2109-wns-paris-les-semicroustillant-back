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
  project_owner?: string;

  @Field(() => [ID], { nullable: true })
  members?: string[];

  // These two fields will be computed in resolver by querying the right data from Tickets
  // @Field({ nullable: true })
  // completedTickets?: number;

  // @Field({ nullable: true })
  // totalTickets?: number;
}
