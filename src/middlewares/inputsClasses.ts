import * as jf from 'joiful';

const positions = [
  'Developer',
  'Product Owner',
  'Scrum Master',
  'Team Lead',
  'Test Engineer',
] as const;

const roles = ['super admin', 'admin', 'users'] as const;

// eslint-disable-next-line import/prefer-default-export
export class UserInputJoi {
  @jf.string().required()
  firstname: string;

  @jf.string().required()
  lastname: string;

  @jf.string().email()
  email: string;

  @jf
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[!'"#$%&''()*+,‐./:;<=>?@-]/)
    .required()
  hash: string;

  @jf
    .string()
    .valid(...roles)
    .required()
  role: string;

  @jf
    .string()
    .valid(...positions)
    .required()
  position: string;
}
