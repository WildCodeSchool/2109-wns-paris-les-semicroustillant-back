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

import Project from '../entities/ProjectEntity';
import User from '../entities/UserEntity';

import StatusEnum from '../common-values/status.enum';

@InputType()
export default class TicketInputUpdate {
  @Field(() => ID)
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @Field(() => ID)
  @IsMongoId()
  @IsNotEmpty()
  created_by: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(125, { message: 'Ticket subject must be between 1 and 125 characters' })
  subject?: string;

  @Field()
  @IsNotEmpty()
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

  @Field()
  @IsNotEmpty()
  @IsMongoId()
  project_id: Project;

  @Field(() => [ID], { nullable: true })
  @IsMongoId({ each: true })
  users?: User[];
}
