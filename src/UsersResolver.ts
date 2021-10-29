import { Query, Resolver } from 'type-graphql';
import User from './Users';
import UsersModel from './models/Users';

@Resolver()
class UsersResolver {
  @Query(() => [User])
  // eslint-disable-next-line class-methods-use-this
  async allUsers() {
    const getAllUsers = await UsersModel.find();
    return getAllUsers;
  }
}

export default UsersResolver;
