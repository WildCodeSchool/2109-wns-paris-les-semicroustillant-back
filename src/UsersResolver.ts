/* eslint-disable class-methods-use-this */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import User from './Users';
import UsersModel from './models/Users';
import UserInput from './UserInput';
import IdInput from './Id';

@Resolver()
class UsersResolver {
  @Query(() => [User])
  async allUsers() {
    const getAllUsers = await UsersModel.find();
    return getAllUsers;
  }

  @Mutation(() => String)
  async addUser(@Arg('userInput') userInput: UserInput) {
    await UsersModel.init();
    const user = await UsersModel.create(userInput);
    await user.save();
    return 'User added';
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id', () => String) id: IdInput) {
    await UsersModel.init();
    await UsersModel.findByIdAndRemove(id);
    return 'User deleted';
  }
}

export default UsersResolver;
