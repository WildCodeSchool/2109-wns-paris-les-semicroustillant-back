import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class Filelink {
  @Field(() => ID)
  _id: string;

  @Field()
  link: string;

  @Field()
  ticketId: string;
}

export default Filelink;
