import { Field, ID, ObjectType } from 'type-graphql';
import User from './Users';
// import Filelink from './Filelinks';

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

  @Field()
  total_time_spent?: number;

  @Field()
  advancement?: number;

  @Field(() => [User])
  users?: User[];
}

export default Ticket;
