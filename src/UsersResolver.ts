import { Query, Resolver } from 'type-graphql';
import User from './Users';
import UsersModel from './models/Users';

@Resolver()
class UsersResolver {
  @Query(() => [User])
  async allUsers() {
    const getAllUsers = await UsersModel.find();
    return getAllUsers;
  }
}

export default UsersResolver;
