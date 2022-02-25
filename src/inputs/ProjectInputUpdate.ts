import { InputType, Field } from 'type-graphql';
import IdInput from './IdInput';

@InputType()
export default class ProjectInputUpdate {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  projectOwner?: string;

  @Field(() => [IdInput], { nullable: true })
  members?: String[];

  @Field({ nullable: true })
  advancement?: number;
}
