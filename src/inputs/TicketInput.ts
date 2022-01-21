import { InputType, Field } from 'type-graphql';
import Users from '../entities/Users';

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

  @Field(() => [String])
  users?: Users[];
}
