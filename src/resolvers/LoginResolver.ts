import bcrypt from 'bcrypt';
import { Resolver, Query, Arg } from 'type-graphql';
import { ApolloError } from 'apollo-server';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/UserModel';

import { IUserDB } from '../types/types';

const privateKey = process.env.SECRET_JWT_KEY as Secret;

@Resolver()
export default class LoginResolver {
  // LoginResolver
  @Query(() => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<string> {
    const userDB: IUserDB | null = await UserModel.findOne(
      { email },
      // we only extract these properties
      'firstname lastname hash role'
    );

    // we compare the hashed password received with the hash in the DB
    if (userDB && bcrypt.compareSync(password, userDB.hash)) {
      // the following prepares the JWT
      const options = {
        expiresIn: '24h',
      };

      const userData = {
        userId: userDB._id.toString(),
        userLastname: userDB.lastname,
        userFirstname: userDB.firstname,
        userRole: userDB.role,
      };
      // we sign the token
      const token = jwt.sign(userData, privateKey, options);

      return token;
    }
    throw new ApolloError('Invalid credentials');
  }

  // LoginResolver.ts
  @Query(() => Boolean)
  async checkUserToken(@Arg('token') token: string): Promise<boolean> {
    const date: number = new Date().getTime();

    try {
      // verifying the integrity of the token
      const userJwt = <JwtPayload>jwt.verify(token, privateKey);

      // verifying that the token is not expired
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
