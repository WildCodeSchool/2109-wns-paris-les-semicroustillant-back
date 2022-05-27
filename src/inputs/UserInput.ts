// eslint-disable-next-line max-classes-per-file
import { Field, InputType } from 'type-graphql';

@InputType()
export default class UserInput {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  hash: string;

  @Field()
  role: string;

  @Field()
  position: string;
}
