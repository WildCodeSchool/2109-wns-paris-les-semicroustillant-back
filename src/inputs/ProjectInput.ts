import { InputType, Field } from 'type-graphql';
import IdInput from './IdInput';

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

  @Field(() => [IdInput], { nullable: true })
  members?: string[];

  @Field({ nullable: true })
  advancement?: number;
}
