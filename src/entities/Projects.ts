import { Field, ID, ObjectType } from 'type-graphql';
import User from './Users';

@ObjectType()
class Project {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  projectOwner: string;

  @Field(() => [User])
  members: User[];
}

export default Project;
