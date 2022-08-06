import { GraphQLResolveInfo } from 'graphql';
import { Types } from 'mongoose';

export declare type IFieldResolver<
  TSource,
  TContext,
  TArgs = Record<string, any>
> = (
  context: TContext,
  source?: TSource,
  args?: TArgs,
  info?: GraphQLResolveInfo
) => any;

export interface IUserInput {
  firstname: string;
  lastname: string;
  email: string;
  hash: string;
  role: string;
  position: string;
}

export interface ITicketInput {
  subject: string;
  status?: string;
  deadline?: Date;
  description?: string;
  initial_time_estimated?: number;
  total_time_spent?: number;
  advancement?: number;
  project_id?: string;
  users?: IUserInput[];
}

export interface IProjectInput {
  name: string;
  status: string;
  project_owner: string;
  members: string;
}
export interface IProject {
  [x: string]: any;
  _id: string | Types.ObjectId;
  name: string;
  status: string;
  description: string;
  project_owner: string;
  members: string[];
  total_tickets?: number;
  completed_tickets?: number;
}

export interface IUserDB {
  _id: string | Types.ObjectId;
  firstname: string;
  lastname: string;
  hash: string;
  role: string;
}

export interface IUser {
  [x: string]: any;
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  hash?: string;
  role: string;
  position: string;
}
