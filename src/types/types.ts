import { GraphQLResolveInfo } from 'graphql';

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
  projectId?: string;
  users?: IUserInput[];
}

export interface IProjectInput {
  name: string;
  status: string;
  projectOwner: string;
  members: string;
}
