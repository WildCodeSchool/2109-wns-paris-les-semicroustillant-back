import bcrypt from 'bcrypt';
import { Resolver, Query, Arg } from 'type-graphql';
import { ApolloError } from 'apollo-server';
import jwt, { Secret } from 'jsonwebtoken';
import UserModel from '../models/UserModel';

import { IUserDB } from '../types/types';

const privateKey = process.env.SECRET_JWT_KEY as Secret;
@Resolver()
export default class LoginResolver {
  @Query(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<string> {
    const userDB: IUserDB | null = await UserModel.findOne(
      { email },
      'firstname lastname hash role'
    );

    if (userDB && bcrypt.compareSync(password, userDB.hash)) {
      // @FIX: other options to be added?
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
}
