import { InputType, Field } from "type-graphql";
// import mongoose from 'mongoose';

@InputType()
class IdInput {
  @Field()
  id: String;
}

export default IdInput;