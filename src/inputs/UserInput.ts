import { InputType, Field } from "type-graphql";

@InputType()
export default class UserInput {
  @Field()
  id: string;

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
