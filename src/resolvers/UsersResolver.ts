/* eslint-disable no-console */
// import { Arg, Query, Resolver, Ctx, Mutation, Authorized } from 'type-graphql';
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import bcrypt from 'bcrypt';
// import { ApolloError } from 'apollo-server';
// import { JwtPayload } from 'jsonwebtoken';
import User from '../entities/UserEntity';
import UsersModel from '../models/UserModel';
import UserInput from '../inputs/UserInput';
import UserInputUpdate from '../inputs/UserInputUpdate';

@Resolver()
class UsersResolver {
  @Authorized()
  @Query(() => [User])
  // async allUsers(@Ctx() ctx: JwtPayload) { // @FREDY: remove the Ctx since not used here
  async allUsers() {

    // console.log('--- CTX ALL USERS ---', ctx);

    // @FREDY: is this condition really needed?
    // if (ctx?.user) {
      try {
        const getAllUsers = await UsersModel.find();
        return getAllUsers;
      } catch (err) {
        return console.log(err);
      }
    // } else {
    //   return new ApolloError('Not Authorized');
    // }
  }

  @Query(() => User)
  async getOneUser(
    @Arg('userId', () => String) userId: UserInputUpdate['_id']
  ) {
    try {
      const getOneUser = await UsersModel.findById(userId);

      return getOneUser;
    } catch (err) {
      return console.log(err);
    }
  }

  @Mutation(() => User)
  async addUser(@Arg('userInput') userInput: UserInput) {
    try {
      await UsersModel.init();
      const user = await UsersModel.create({
        ...userInput,
        hash: bcrypt.hashSync(userInput.hash, 10),
      });
      await user.save();

      return user;
    } catch (err) {
      return console.log(err);
    }
  }

  @Mutation(() => User)
  async updateUser(@Arg('userInputUpdate') userInputUpdate: UserInputUpdate) {
    try {
      await UsersModel.findByIdAndUpdate(userInputUpdate._id, userInputUpdate, {
        new: true,
      });
    } catch (err) {
      console.log(err);
    }
    return UsersModel.findById(userInputUpdate._id);
  }

  @Mutation(() => String)
  async deleteUser(
    @Arg('UserId', () => String) userId: UserInputUpdate['_id']
  ) {
    try {
      await UsersModel.init();
      const del = await UsersModel.findByIdAndRemove(userId);

      if (!del) {
        return 'Error deleting';
      }
    } catch (err) {
      console.log(err);
    }

    return 'User successfully deleted';
  }
}

export default UsersResolver;
