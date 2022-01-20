import { InputType, Field } from 'type-graphql';
import IdInput from './IdInput';
// import Filelink from '../entities/Filelinks';

@InputType()
export default class TicketInputUpdate {
  @Field({ nullable: true })
  subject?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  deadline?: Date;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  initial_time_estimated?: number;

  @Field({ nullable: true })
  total_time_spent?: number;

  @Field({ nullable: true })
  advancement?: number;

  /* @Field(() => [Filelink])
  file_links?: Filelink[]; */

  @Field(() => [IdInput], { nullable: true })
  users?: { id: IdInput };

  /* @Field()
  projectId?: string; */
}
