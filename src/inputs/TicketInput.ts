import { InputType, Field } from 'type-graphql';
import Users from '../entities/Users';
import IdInput from './IdInput';

@InputType()
export default class TicketInput {
  @Field()
  subject: string;

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
  projectId?: string;

  @Field(() => [IdInput], { nullable: true })
  users?: Users[];
}
