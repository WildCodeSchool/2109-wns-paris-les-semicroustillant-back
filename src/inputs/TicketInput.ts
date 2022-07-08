import { InputType, Field, ID } from 'type-graphql';
import {
  MaxLength,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';

import StatusEnum from '../common-values/status.enum';

@InputType()
export default class TicketInput {
  @Field(() => ID)
  @IsMongoId()
  @IsNotEmpty()
  created_by: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(125, { message: 'Project subject must be between 1 and 125 characters' })
  subject: string;

  @Field({ nullable: true })
  @IsEnum(StatusEnum)
  status?: string;

  @Field({ nullable: true })
  @IsDate()
  deadline?: Date;

  @Field({ nullable: true })
  @IsString()
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
  @IsNotEmpty()
  project_id: string;

  @Field(() => [ID], { nullable: true })
  @IsMongoId({ each: true })
  users?: string[];
}
