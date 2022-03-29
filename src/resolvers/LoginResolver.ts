import bcrypt from 'bcrypt';
import { Resolver, Query, Arg } from 'type-graphql';
import { ApolloError } from 'apollo-server';
import jwt, { Secret } from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import 'dotenv/config';

const privateKey = process.env.SECRET_JWT_KEY as Secret;
@Resolver()
export default class LoginResolver {
  @Query(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    // { res },
  ): Promise<string> {

    // console.log('----- RES -----', res);
    // console.log('----- PVKEY -----', privateKey);

    const userDB = await UserModel.findOne({ email }, 'email hash');

    if (userDB && bcrypt.compareSync(password, userDB.hash)) {
      const options = {
        expiresIn: '24h',
      };
      const token = jwt.sign({ userId: userDB.id }, privateKey, options);

      // const cookie = res.cookie('token', token, {
      //   httpOnly: true,
      //   maxAge: 86400000,
      //   // sameSite: 'none',
      //   secure: process.env.NODE_ENV === "production",
      // });

      // console.log('----- PROCESS ENV NODE_ENV -----', process.env.NODE_ENV);
      // console.log('----- COOKIE -----', cookie);

      // return cookie;

      return token;
    }
    throw new ApolloError('Invalid credentials');
  }
}
