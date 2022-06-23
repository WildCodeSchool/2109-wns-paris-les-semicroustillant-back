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

    context.user = user;

    if (roles.length === 0 || roles.includes(context.user.role)) {
      return true;
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default customAuthChecker;
