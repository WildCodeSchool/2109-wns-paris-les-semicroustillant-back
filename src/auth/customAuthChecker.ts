/* eslint-disable no-console */
import { AuthChecker } from 'type-graphql';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/UserModel';

// authorization
const customAuthChecker: AuthChecker<JwtPayload> = async (
  { context },
  roles: string[]
) => {
  // the token is assigned from the context
  const userJwt = context.token;
  const secret = process.env.SECRET_JWT_KEY as Secret;

  try {
    // verify authenticity of JWT
    const payload = <JwtPayload>jwt.verify(userJwt, secret);

    // if no content inside JWT payload, disapprove authorization
    if (!payload.userId) {
      return false;
    }
    // get the role and email from DB based on userId in JWT payload
    const user = await UserModel.findOne({ _id: payload.userId }, 'email role');

    // not found ==> disapprove authorization
    if (!user) {
      return false;
    }
    // assign the user to context
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
