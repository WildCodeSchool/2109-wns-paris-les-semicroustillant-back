import { InputType, Field, ID } from 'type-graphql';

@InputType()
export default class IdInput {
  @Field(() => ID)
  _id!: string;
}
