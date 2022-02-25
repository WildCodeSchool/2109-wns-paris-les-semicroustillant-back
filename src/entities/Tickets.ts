import { Field, ID, ObjectType } from 'type-graphql';
import User from './Users';

@ObjectType()
class Ticket {
  @Field(() => ID)
  _id: string;

  @Field()
  subject?: string;

  @Field()
  status?: string;

  @Field()
  deadline?: Date;

  @Field()
  description?: string;

  @Field()
  initial_time_estimated?: number;

  @Field({ nullable: true })
  total_time_spent?: number;

  @Field({ nullable: true })
  advancement?: number;

  @Field()
  projectId?: string;

  @Field(() => [User], { nullable: true })
  users?: User[];
}

export default Ticket;
