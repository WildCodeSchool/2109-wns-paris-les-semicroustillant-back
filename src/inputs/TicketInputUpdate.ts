import { InputType, Field, ID } from 'type-graphql';
import {
  MaxLength,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsDate,
  MinLength,
  IsNumber,
  IsEnum,
} from 'class-validator';

import StatusEnum from '../common-values/ticket.enum';

@InputType()
export default class TicketInputUpdate {
  @Field(() => ID)
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @Field(() => ID, { nullable: true })
  created_by: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30, {
    message: 'Project subject must be between 1 and 30 characters',
  })
  subject?: string;

  @Field({ nullable: true })
  @IsEnum(StatusEnum)
  status?: string;

  @Field({ nullable: true })
  @IsDate()
  deadline?: Date;

  @Field({ nullable: true })
  @MinLength(5, {
    message: 'Project description must be at least 1 character',
  })
  description?: string;

  @Field({ nullable: true })
  @IsNumber()
  initial_time_estimated?: number;

  @Field({ nullable: true })
  @IsNumber()
  total_time_spent?: number;

  @Field({ nullable: true })
  @IsNumber()
  advancement?: number;

  @Field()
  @IsMongoId()
  project_id: string;

  @Field(() => [ID], { nullable: true })
  @IsMongoId({ each: true })
  users?: string[];
}
