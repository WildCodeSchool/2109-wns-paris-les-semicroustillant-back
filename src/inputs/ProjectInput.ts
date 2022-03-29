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
  projectOwner?: string;

  @Field(() => [ID], { nullable: true })
  members?: string[];

  @Field({ nullable: true })
  advancement?: number;
}
