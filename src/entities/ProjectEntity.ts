import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class Project {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  description: string;

  @Field(() => ID, { nullable: true })
  projectOwner: string;

  @Field(() => [ID], { nullable: true })
  members: string[];

  // These two fields will be computed in resolver by querying the right data from Tickets
  @Field({ nullable: true })
  completedTickets: number;

  @Field({ nullable: true })
  totalTickets: number;
}

export default Project;
