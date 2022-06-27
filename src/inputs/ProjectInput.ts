import { InputType, Field, ID } from 'type-graphql';
import { MaxLength, IsNotEmpty, IsString, IsMongoId } from 'class-validator';

@InputType()
export default class ProjectInput {
  @Field(() => ID)
  @IsNotEmpty()
  created_by: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: 'Project Name must be between 1 and 30 characters',
  })
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: 'Project Name must be between 1 and 30 characters',
  })
  // contains specified values ?
  status: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsMongoId()
  project_owner?: string;

  @Field(() => [ID], { nullable: true })
  @IsMongoId({ each: true })
  members?: string[];
}
