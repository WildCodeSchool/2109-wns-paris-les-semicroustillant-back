import { Field, ID, ObjectType } from 'type-graphql';
import User from './UserEntity';

@ObjectType()
class Project {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  created_by: string;

  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  description: string;

  @Field(() => User, { nullable: true })
  project_owner: User;

  @Field(() => [User], { nullable: true })
  members: User[];

  // These two fields will be computed in resolver by querying the right data from Tickets
  @Field({ nullable: true })
  completed_tickets: number;

  @Field({ nullable: true })
  total_tickets: number;
}

export default Project;
