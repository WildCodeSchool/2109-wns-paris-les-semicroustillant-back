import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class User {
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

export default User;
