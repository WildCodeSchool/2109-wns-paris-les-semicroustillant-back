import { InputType, Field, ID } from 'type-graphql';

@InputType()
export default class ProjectInput {
  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  project_owner?: string;

  @Field(() => [ID], { nullable: true })
  members?: string[];

  // These two fields will be computed in resolver by querying the right data from Ticketsgit pull
  // @Field({ nullable: true })
  // completedTickets: number;

  // @Field({ nullable: true })
  // totalTickets: number;
}
