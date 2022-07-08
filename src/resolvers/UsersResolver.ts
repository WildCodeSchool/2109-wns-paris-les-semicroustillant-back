/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import bcrypt from 'bcrypt';
import User from '../entities/UserEntity';
import UsersModel from '../models/UserModel';
import UserInput from '../inputs/UserInput';
import UserInputUpdate from '../inputs/UserInputUpdate';
import { adminsOnly } from '../auth/usersRole';
// Available authorized:
// roles adminsOnly = ['admin', 'super admin'] and superAdmin = ['super admin']
<<<<<<< HEAD
=======
// import { IUser } from '../types/types';
>>>>>>> 348aeaf2e25a29d4f77dfabc02c023de249e9684

@Resolver()
class UsersResolver {
  @Authorized()
  @Query(() => [User])
  async allUsers() {
    try {
      // @FIX: add -hash inside tests
      const getAllUsers = await UsersModel.find().select('-hash');

      // @FIX: add test for !getAllUsers
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

  @Authorized(adminsOnly)
  @Mutation(() => User)
  async addUser(@Arg('userInput') userInput: UserInput) {
    try {
      await UsersModel.init();
      let user = await UsersModel.create({
        ...userInput,
        hash: bcrypt.hashSync(userInput.hash, 10), // @FIXME: check right round of salt
      });
      // Update UT
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
