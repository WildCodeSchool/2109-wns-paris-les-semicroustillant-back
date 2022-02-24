import { InputType, Field } from 'type-graphql';
import IdInput from './IdInput';
import Users from '../entities/Users';

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

  @Field({ nullable: true })
  project?: string;

  @Field(() => [IdInput], { nullable: true })
  users?: Users[];
}
