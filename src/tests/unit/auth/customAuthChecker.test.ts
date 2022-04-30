// import { AuthChecker } from 'type-graphql';
import jwt from 'jsonwebtoken';
// import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import UserModel from '../../../models/UserModel';
import customAuthChecker from '../../../auth/customAuthChecker';

describe('customAuthChecker', () => {
  // @SophieTopart: how to correctly type context and process?
  let context: { token: string } | null = null;
  let roles: string[] | null = null;
  // let process: { env: { SECRET_JWT_KEY: Secret } } | null = null;

  beforeEach(() => {
    context = {
      token: 'fake-token',
    };
    roles = ['admin'];
    // process = {
    //   env: {
    //     SECRET_JWT_KEY: 'fake-secret',
    //   },
    // };
  });

  it('should successfully check the user', async () => {
    // const userJwt = context?.token;
    // const secret = process?.env.SECRET_JWT_KEY;
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user-id' });
    UserModel.findOne = jest
      .fn()
      .mockResolvedValue({ email: 'user@email.com', role: 'admin' });

    // @SophieTopart: typing issue with customAuthChecker
    // @ts-ignore
    const result = await customAuthChecker({ context }, roles);

    // console.log(process?.env.SECRET_JWT_KEY);

    expect(result).toBe(true);
    // expect(jwt.verify).toHaveBeenCalledWith(context?.token, process?.env.SECRET_JWT_KEY);
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
