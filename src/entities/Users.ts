import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class User {
  @Field(() => ID)
  _id: string;

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

export default User;
