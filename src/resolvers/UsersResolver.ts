/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import bcrypt from 'bcrypt';
import User from '../entities/UserEntity';
import UsersModel from '../models/UserModel';
import UserInput from '../inputs/UserInput';
import UserInputUpdate from '../inputs/UserInputUpdate';
import { adminsOnly } from '../auth/usersRole';
// Available authhorized:
// roles adminsOnly = ['admin', 'super admin'] and superAdmin = ['super admin']
@Resolver()
class UsersResolver {
  // @Authorized()
  @Query(() => [User])
  async allUsers() {
    try {
      const getAllUsers = await UsersModel.find();
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
      const getOneUser = await UsersModel.findById(userId);

      return getOneUser;
    } catch (err) {
      return console.log(err);
    }
  }

  // @Authorized(adminsOnly)
  @Mutation(() => User)
  async addUser(@Arg('userInput') userInput: UserInput) {
    try {
      await UsersModel.init();
      const user = await UsersModel.create({
        ...userInput,
        hash: bcrypt.hashSync(userInput.hash, 10), // @FIXME: check right round of salt
      });
      await user.save();
      console.log('saved');

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
    return UsersModel.findById(userInputUpdate._id);
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
