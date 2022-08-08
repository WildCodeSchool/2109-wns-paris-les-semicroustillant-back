import { Field, ID, ObjectType } from 'type-graphql';
// Here in case a file upload feature is eventually necessary
@ObjectType()
class Filelink {
  @Field(() => ID)
  _id: string;

  @Field()
  link: string;

  // @FIXME: Change to @Field(() => ID) and ticket_id: TicketEntity ?
  @Field()
  ticket_id: string;
}

export default Filelink;
