import { InputType, Field, ID } from 'type-graphql';
import IdInput from './IdInput';

@InputType()
export default class TicketInputUpdate {
  @Field(() => ID,  { nullable: true })
  created_by: string;

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

  @Field({ nullable: true })
  project_id?: string;

  @Field(() => [IdInput], { nullable: true })
  users?: string[];
}
