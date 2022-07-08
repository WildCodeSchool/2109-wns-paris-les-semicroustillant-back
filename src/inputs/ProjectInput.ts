import { InputType, Field, ID } from 'type-graphql';
import {
  MaxLength,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import User from '../entities/UserEntity';

import StatusEnum from '../common-values/status.enum';

@InputType()
export default class ProjectInput {
  @Field(() => ID)
  @IsNotEmpty()
  created_by: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(125, {
    message: 'Project\'s name must be between 1 and 125 characters',
  })
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsEnum(StatusEnum)
  status: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(250, {
    message: 'Project\'s name must be between 1 and 250 characters',
  })
  description: string;

  @Field(() => ID, { nullable: true })
  @IsMongoId()
  project_owner?: User;

  @Field(() => [ID], { nullable: true })
  @IsMongoId({ each: true })
  members?: User[];
}
