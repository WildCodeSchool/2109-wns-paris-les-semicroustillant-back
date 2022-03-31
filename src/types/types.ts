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
