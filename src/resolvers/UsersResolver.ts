/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import User from '../entities/Users';
import UsersModel from '../models/Users';
import UserInput from '../inputs/UserInput';
import UserInputUpdate from '../inputs/UserInputUpdate';
import IdInput from '../inputs/IdInput';

@Resolver()
class UsersResolver {
  @Query(() => [User])
  async allUsers() {
    try {
      const getAllUsers = await UsersModel.find();

      return getAllUsers;
    } catch (err) {
      return console.log(err);
    }
  }

  @Query(() => User)
  async getOneUser(@Arg('id', () => String) userId: IdInput) {
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
      const user = await UsersModel.create(userInput);
      await user.save();

      return user;
    } catch (err) {
      return console.log(err);
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => String) userId: IdInput,
    @Arg('userInputUpdate') userInputUpdate: UserInputUpdate
  ) {
    try {
      await UsersModel.findByIdAndUpdate(userId, userInputUpdate, {
        new: true,
      });
    } catch (err) {
      console.log(err);
    }

    return UsersModel.findById(userId);
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id', () => String) id: IdInput) {
    try {
      await UsersModel.init();
      const del = await UsersModel.findByIdAndRemove(id);

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
