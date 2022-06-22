import jwt, { Secret } from 'jsonwebtoken';
import UserModel from '../../../models/UserModel';
import customAuthChecker from '../../../auth/customAuthChecker';

describe('customAuthChecker', () => {
  let context: { token: string };
  let root: any;
  let args: any;
  let info: any;
  let roles: string[];
  process.env.SECRET_JWT_KEY as Secret;

  beforeEach(() => {
    context = {
      token: 'fake-token',
    };
    root = 'root';
    args = 'args';
    info =  'info';
    roles = ['admin'];
    process.env.SECRET_JWT_KEY = 'fake-secret';
  });

  it('should successfully check the user', async () => {
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user-id' });
    UserModel.findOne = jest
      .fn()
      .mockResolvedValue({ email: 'user@email.com', role: 'admin' });

    const result = await customAuthChecker({ root, args, context, info }, roles);

    expect(result).toBe(true);
    expect(jwt.verify).toHaveBeenCalledWith(
      context?.token,
      process.env.SECRET_JWT_KEY
    );
    expect(UserModel.findOne).toHaveBeenCalledWith(
      { _id: 'user-id' },
      'email role'
    );
    expect(context).toEqual({
      token: 'fake-token',
      user: {
        email: 'user@email.com',
        role: 'admin',
      },
    });
  });

  it('should not authorized access if jwt verification not successful', async () => {
    jwt.verify = jest.fn().mockReturnValue({});

    // @ts-ignore
    const result = await customAuthChecker({ context }, roles);

    expect(result).toBe(false);
    // expect(jwt.verify).toHaveBeenCalledWith(context?.token, process?.env.SECRET_JWT_KEY);
  });
  it('should not authorized access if user not found', async () => {
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user-id' });
    UserModel.findOne = jest.fn().mockResolvedValue(null);

    // @ts-ignore
    const result = await customAuthChecker({ context }, roles);

    expect(result).toBe(false);
    // expect(jwt.verify).toHaveBeenCalledWith(context?.token, process?.env.SECRET_JWT_KEY);
    expect(UserModel.findOne).toHaveBeenCalledWith(
      { _id: 'user-id' },
      'email role'
    );
  });
  it('should not authorized access if user not found', async () => {
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user-id' });
    UserModel.findOne = jest.fn().mockResolvedValue(null);

    // @ts-ignore
    const result = await customAuthChecker({ context }, roles);

    expect(result).toBe(false);
    // expect(jwt.verify).toHaveBeenCalledWith(context?.token, process?.env.SECRET_JWT_KEY);
    expect(UserModel.findOne).toHaveBeenCalledWith(
      { _id: 'user-id' },
      'email role'
    );
  });

  it('should not authorized access if user role does not match', async () => {
    roles = ['wrong-role'];
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user-id' });
    UserModel.findOne = jest.fn().mockResolvedValue(null);

    // @ts-ignore
    const result = await customAuthChecker({ context }, roles);

    expect(result).toBe(false);
    // expect(jwt.verify).toHaveBeenCalledWith(context?.token, process?.env.SECRET_JWT_KEY);
    expect(UserModel.findOne).toHaveBeenCalledWith(
      { _id: 'user-id' },
      'email role'
    );
  });
});
