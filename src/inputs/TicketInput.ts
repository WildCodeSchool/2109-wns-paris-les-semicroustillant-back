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

import User from '../entities/UserEntity';
import Project from '../entities/ProjectEntity';

import StatusEnum from '../common-values/status.enum';

// /entities/TicketInput.ts
@InputType()
export default class TicketInput {
  @Field(() => ID)
  @IsMongoId()
  @IsNotEmpty()
  created_by: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(125, {
    message: 'Ticket subject must be between 1 and 125 characters',
  })
  subject: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;

  @Field({ nullable: true })
  @IsDate()
  deadline?: Date;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(250, {
    message: 'Ticket description must be between 1 and 250 characters',
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

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  project_id: Project;

  @Field(() => [ID], { nullable: true })
  @IsMongoId({ each: true })
  users?: User[];
}
