import { AuthChecker } from 'type-graphql';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import UserModel from './models/UserModel';

// type RemoveIndex<T> = {
// 	[P in keyof T as string extends P
// 		? never
// 		: number extends P
// 		? never
// 		: P]: T[P];
// };

// interface CustomPayload extends RemoveIndex<JwtPayload> {
// 	userId: string;
// 	token: string;
// }

const customAuthChecker: AuthChecker<JwtPayload> = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { root, args, context, info },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  roles: string[],
) => {
  const userJwt = context.token;
  const secret = process.env.SECRET_JWT_KEY as Secret;
  // console.log('JWT SECRET', process.env.SECRET_JWT_KEY);
  // console.log('USER JWT', userJwt);

  // console.log('--- ROLES ---', roles);
  try {
    const payload = <JwtPayload>jwt.verify(userJwt, secret);
    // console.log('--- PAYLOAD ---', payload);

    // console.log('--- PAYLOAD ---', payload);

    if (!payload.userId) {
      return false;
    }

    const user = await UserModel.findOne({ _id: payload.userId }, 'email');
    // console.log('--- USER ---', user);

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
