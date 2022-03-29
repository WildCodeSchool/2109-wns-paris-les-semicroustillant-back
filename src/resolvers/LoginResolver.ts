import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Resolver, Query, Arg } from 'type-graphql';
import { ApolloError } from 'apollo-server';
import jwt, { Secret } from 'jsonwebtoken';
import UserModel from '../models/UserModel';

const jwtKey = process.env.SECRET_JWT_KEY as Secret;

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
          userEmail: usersDB.email,
        },
        jwtKey
      );
      return token;
    }
    throw new ApolloError('Invalid credentials');
  }
}
