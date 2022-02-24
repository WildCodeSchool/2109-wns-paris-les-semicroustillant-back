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

  @Field(() => [ID])
  members?: string[];

  @Field()
  advancement?: number;
}

export default Project;
