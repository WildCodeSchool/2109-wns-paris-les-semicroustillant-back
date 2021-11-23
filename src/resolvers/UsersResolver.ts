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

  @Mutation(() => String)
  async addUser(@Arg('userInput') userInput: UserInput) {
    await UsersModel.init();
    const user = await UsersModel.create(userInput);
    await user.save();
    return 'User added';
  }

  // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)

  // @Mutation(() => String)
  // async updateUser(
  //   @Arg('id') userId: IdInput,
  //   @Arg('userInput') userInput: UserInput) {
  //     try {
  //       const user = await UsersModel.findByIdAndUpdate(
  //         userId, userInput,
  //       { new: true });
  //       console.log('USER :', user);
  //       // await user.save();
  //       // return 'User successfully updated';
  //       return user;
        
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   return UsersModel.findOne(userId);
  // }

  @Mutation(() => String)
  async updateUser(
    @Arg('id', () => String) userId: IdInput,
    @Arg('userInputUpdate') userInputUpdate: UserInputUpdate) {
      try {
        const user = await UpdateUserModel.findByIdAndUpdate(
          userId, userInputUpdate,
        { new: true });
        console.log('USER :', user);
        // await user.save();
        // return 'User successfully updated';
        return user;
        
      } catch (err) {
        console.log(err);
      }
    return UpdateUserModel.findOne(userId);
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id', () => String) id: IdInput) {
    await UsersModel.init();
    await UsersModel.findByIdAndRemove(id);
    return 'User deleted';
  }

  
}

export default UsersResolver;


/* router.route("/update").post(function(req, res) {
  kennels.findByIdAndUpdate(
    { _id: "5db6b26730f133b65dbbe459" },
    { breed: "Great Dane" },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
}); */