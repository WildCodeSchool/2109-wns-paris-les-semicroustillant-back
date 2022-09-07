import bcrypt from 'bcrypt';
import { Resolver, Query, Arg } from 'type-graphql';
import { ApolloError } from 'apollo-server';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/UserModel';

import { IUserDB } from '../types/types';

const privateKey = process.env.SECRET_JWT_KEY as Secret;
@Resolver()
export default class LoginResolver {
  @Query(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<string> {
    const userDB: IUserDB | null = await UserModel.findOne(
      { email },
      'firstname lastname hash role'
    );

    if (userDB && bcrypt.compareSync(password, userDB.hash)) {
      const options = {
        expiresIn: '24h',
      };

      const userData = {
        userId: userDB._id.toString(),
        userLastname: userDB.lastname,
        userFirstname: userDB.firstname,
        userRole: userDB.role,
      };
      const token = jwt.sign(userData, privateKey, options);

      return token;
    }
    throw new ApolloError('Invalid credentials');
  }

  @Query(() => Boolean)
  async checkUserToken(@Arg('token') token: string): Promise<boolean> {
    const date: number = new Date().getTime();

    try {
      const userJwt = <JwtPayload>jwt.verify(token, privateKey);

      if (userJwt.userId && userJwt.exp && userJwt.exp < date) {
        return true;
      }

      return false;
    } catch (err) {
      console.log(err);

      return false;
    }
  }
}
