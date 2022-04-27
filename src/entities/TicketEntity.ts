import { Field, ID, ObjectType } from 'type-graphql';

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

  @Field({ nullable: true })
  initial_time_estimated?: number;

  @Field({ nullable: true })
  total_time_spent?: number;

  @Field({ nullable: true })
  advancement?: number;

  @Field({ nullable: true })
  projectId?: string;

  @Field(() => [ID], { nullable: true })
  users?: string[];
}

export default Ticket;
