import { InputType, Field } from 'type-graphql';
import User from '../entities/Users';
// import Filelink from '../entities/Filelinks';

@InputType()
export default class TicketInputUpdate {
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

  /* @Field(() => [Filelink])
  file_links?: Filelink[]; */

  @Field(() => String)
  users?: User[];

  /* @Field()
  projectId?: string; */
}
