/* eslint-disable no-console */
import { AuthChecker } from 'type-graphql';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/UserModel';

const customAuthChecker: AuthChecker<JwtPayload> = async (
  { context },
  roles: string[],
) => {
  const userJwt = context.token;
  const secret = process.env.SECRET_JWT_KEY as Secret;

  try {
    const payload = <JwtPayload>jwt.verify(userJwt, secret);

    if (!payload.userId) {
      return false;
    }

    const user = await UserModel.findOne({ _id: payload.userId }, 'email role');

    if (!user) {
      return false;
    }

    if (roles.length === 0) {
      return user !== undefined;
    }

    if (!roles.includes(user.role)) {
      return false;
    }

    context.user = user;

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default customAuthChecker;
