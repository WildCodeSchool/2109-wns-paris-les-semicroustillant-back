import * as jf from 'joiful';
import { ApolloError } from 'apollo-server';
import { UserInputJoi } from './inputsClasses';

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

export interface IResponseJoi {
  success: boolean;
  error?: Error;
  payload?: IUserInput;
}

const sanitizeInput = (
  input: IUserInput
  //  | ITicketInput | IProjectInput
): IResponseJoi =>
  //  | ITicketInput | IProjectInput
  {
    const { error } = jf.validateAsClass(input, UserInputJoi);

    if (error) {
      return { success: false, error };
    }

    return { success: true, payload: input };
  };

export default sanitizeInput;
