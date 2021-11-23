/* eslint-disable class-methods-use-this */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import User from '../entities/Users';
import UsersModel from '../models/Users';
import UpdateUserModel from '../models/UpdateUser';
import UserInput from '../inputs/UserInput';
import UserInputUpdate from '../inputs/UserInputUpdate';
import IdInput from '../inputs/IdInput';

@Resolver()
class UsersResolver {
  @Query(() => [User])
  async allUsers() {
    const getAllUsers = await UsersModel.find();

    return getAllUsers;
  }

  @Mutation(() => User)
  async addUser(@Arg('userInput') userInput: UserInput) {
    await UsersModel.init();
    const user = await UsersModel.create(userInput);
    await user.save();

    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => String) userId: IdInput,
    @Arg('userInputUpdate') userInputUpdate: UserInputUpdate) {
      try {
        const user = await UpdateUserModel.findByIdAndUpdate(userId, userInputUpdate);

        return user;
      } catch (err) {
        console.log(err);
      }

    return UsersModel.findOne(userId);
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id', () => String) id: IdInput) {
    await UsersModel.init();
    await UsersModel.findByIdAndRemove(id);

    return 'User deleted';
  }  
}

export default UsersResolver;
