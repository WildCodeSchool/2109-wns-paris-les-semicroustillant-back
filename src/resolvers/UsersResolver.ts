/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import bcrypt from 'bcrypt';
import User from '../entities/UserEntity';
import UsersModel from '../models/UserModel';
import UserInput from '../inputs/UserInput';
import UserInputUpdate from '../inputs/UserInputUpdate';
import { adminsOnly } from '../auth/usersRole';

import { IUser } from '../types/types';
// Available authhorized:
// roles adminsOnly = ['admin', 'super admin'] and superAdmin = ['super admin']

@Resolver()
class UsersResolver {
  // UsersResolver.ts
  @Authorized()
  @Query(() => [User])
  async allUsers() {
    try {
      const getAllUsers = await UsersModel.find().select('-hash');

      if (!getAllUsers || getAllUsers.length === 0) {
        throw new Error('No users found');
      }

      return getAllUsers;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
  @Query(() => User)
  async getOneUser(
    @Arg('userId', () => String) userId: UserInputUpdate['_id']
  ) {
    try {
      // @FIX: add -hash inside tests
      const getOneUser = await UsersModel.findById(userId).select('-hash');

      // @FIX: add test for !getOneUser
      if (!getOneUser) {
        throw new Error('User not found');
      }

      return getOneUser;
    } catch (err) {
      return console.log(err);
    }
  }
  // UsersResolver.ts

  @Authorized(adminsOnly)
  @Mutation(() => User)
  async addUser(@Arg('userInput') userInput: UserInput) {
    try {
      // create DB index
      await UsersModel.init();
      // save user in DB
      let user: IUser = await UsersModel.create({
        ...userInput,

        // hash password with salt and save in document
        hash: bcrypt.hashSync(userInput.hash, 10),
      });
      // remove hash to returned object
      user = user.toObject();
      delete user.hash;

      return user;
    } catch (err) {
      return console.log(err);
    }
  }

  // @TODO: missing mutation for updating a user's own profile
  @Authorized(adminsOnly)
  @Mutation(() => User)
  async updateUser(@Arg('userInputUpdate') userInputUpdate: UserInputUpdate) {
    try {
      await UsersModel.findByIdAndUpdate(userInputUpdate._id, userInputUpdate, {
        new: true,
      });
    } catch (err) {
      console.log(err);
    }

    // Update UT with -hash
    return UsersModel.findById(userInputUpdate._id).select('-hash');
  }

  @Authorized(adminsOnly)
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
