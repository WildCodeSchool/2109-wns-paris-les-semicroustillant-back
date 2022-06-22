// import { MergeInfo } from 'apollo-server';
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

export interface IProject {
  [x: string]: any;
  _id: string;
  name: string;
  status: string;
  description: string;
  projectOwner: string;
  members: string[];
  totalTickets?: number;
  completedTickets?: number;
}

export interface IUserDB {
  email: string;
  hash: string;
  _id: string;
}
