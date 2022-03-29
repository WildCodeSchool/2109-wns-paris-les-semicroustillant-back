import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import UserModel from './models/UserModel';
import 'dotenv/config';

/*
export const customAuthChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles,
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access is denied
};
*/

const customAuthChecker: AuthChecker<ContextType> = async (
  { root, args, context, info },
  roles: string[]
) => {
  const userJwt = context.token;
  const secret = process.env.SECRET_JWT_KEY as Secret;
  console.log('JWT SECRET', process.env.SECRET_JWT_KEY);
  console.log('USER JWT', userJwt);

  // let payload: JwtPayload;
  try {
    const payload = <JwtPayload>jwt.verify(userJwt, secret);

    console.log('PAYLOAD', payload);

    if (!payload.userEmail) {
      return false;
    }

    const user = await UserModel.findOne({ email: payload.userEmail }, 'email');
    if (!user) {
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
