import { InputType, Field } from 'type-graphql';
import IdInput from './IdInput';
import Users from '../entities/Users';

@InputType()
export default class ProjectInputUpdate {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  projectOwner: string;

  @Field(() => [IdInput], { nullable: true })
  members: Users[];

  @Field({ nullable: true })
  advancement?: number;
}
