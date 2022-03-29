import bcrypt from 'bcrypt';
import { Resolver, Query, Arg } from 'type-graphql';
import { ApolloError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';

export const jwtKey = 'my_secret_key_that_must_be_very_long';

@Resolver()
export default class LoginResolver {
  @Query(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<string> {
    const usersDB = await UserModel.findOne({ email }, 'email hash');

    if (usersDB && bcrypt.compareSync(password, usersDB.hash)) {
      const token = jwt.sign(
        {
          user: usersDB.email,
        },
        jwtKey
      );
      return token;
    }
    throw new ApolloError('Invalid credentials');
  }
}
