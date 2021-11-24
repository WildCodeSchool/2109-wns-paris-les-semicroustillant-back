import { Field, ID, ObjectType } from 'type-graphql';
// import User from './Users';
import Filelink from './Filelinks';

@ObjectType()
class Ticket {
  @Field(() => ID)
  _id: string;

  @Field()
  subject?: string;

  @Field()
  status?: string;

  /* @Field(() => [User])
  users?: User[]; */

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

  @Field(() => String)
  file_links?: Filelink[];

  @Field()
  projectId?: string;
}

export default Ticket;
