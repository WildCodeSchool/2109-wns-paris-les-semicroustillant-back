import { InputType, Field } from 'type-graphql';
import IdInput from './IdInput';
// import Filelink from '../entities/Filelinks';

@InputType()
export default class TicketInput {
  @Field()
  subject: string;

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

  @Field(() => [IdInput])
  users?: IdInput[];

  /* @Field()
  projectId?: string; */
}
