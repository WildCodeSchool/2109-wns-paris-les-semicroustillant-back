import { ApolloServer, gql } from 'apollo-server';
import createServer from '../server';
import UserModel from '../models/Users';

// import UsersResolver from '../resolvers/UsersResolver';
// success get all users
// error in catch
// error in finding users (USersModel.find())

let server: ApolloServer;

beforeAll(async () => {
  server = await createServer();
});

describe('UserResolver', () => {
  let user1Data = {};
  let user2Data = {};

  beforeEach(() => {
    user1Data = {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jd@gmail.com',
      hash: 'azert1234',
      role: 'user',
      position: 'Developer',
    };

    user2Data = {
      firstname: 'John',
      lastname: 'Doze',
      email: 'jdoze@gmail.com',
      hash: 'azert123456',
      role: 'user',
      position: 'PO',
    };
  });

  describe('allUsers()', () => {
    it('gets an array of all users', async () => {
      const user1InDb = new UserModel(user1Data);
      const user2InDb = new UserModel(user2Data);
      await user1InDb.save();
      await user2InDb.save();

      const allUsersQuery = gql`
        query allUsers {
          allUsers {
            _id
            firstname
            lastname
            email
            hash
            role
            position
          }
        }
      `;

      const res = await server.executeOperation({
        query: allUsersQuery,
      });

      expect(res.data?.allUsers).toEqual([
        expect.objectContaining(user1Data),
        expect.objectContaining(user2Data),
      ]);

      expect(res.data?.allUsers[0]._id).toBe(user1InDb._id.toString());
      expect(res.data?.allUsers[1]._id).toBe(user2InDb._id.toString());
    });
    it('console logs an error if data does not exist in query', async () => {
      const user1InDb = new UserModel(user1Data);
      const user2InDb = new UserModel(user2Data);
      await user1InDb.save();
      await user2InDb.save();

      const allUsersQuery = gql`
        query allUsers {
          allUsers {
            _id
            firstname
            lastname
            email
            hash
            role
            position
            plop
          }
        }
      `;

      try {
        await server.executeOperation({
          query: allUsersQuery,
        });
      } catch (err: any) {
        expect(err.errors.message).toEqual(
          'Cannot query field "plop" on type "User".'
        );
      }
    });
  });
  describe('getOneUser()', () => {
    it('gets a specific user', async () => {
      const user1InDb = new UserModel(user1Data);
      const user2InDb = new UserModel(user2Data);
      await user1InDb.save();
      await user2InDb.save();

      const getOneUserQuery = gql`
        query getOneUser($getOneUserId: String!) {
          getOneUser(id: $getOneUserId) {
            _id
            firstname
            lastname
            email
            hash
            role
            position
          }
        }
      `;

      const variables = { getOneUserId: user1InDb._id.toString() };
      const res = await server.executeOperation({
        query: getOneUserQuery,
        variables,
      });

      expect(res.data?.getOneUser).toEqual(expect.objectContaining(user1Data));
    });
  });
  describe('deleteUser()', () => {
    it('deletes a specific user', async () => {
      const user1InDb = new UserModel(user1Data);
      const user2InDb = new UserModel(user2Data);
      await user1InDb.save();
      await user2InDb.save();

      // Delete a user by his ID
      const deleteOneUser = gql`
        mutation DeleteUserMutation($deleteUserId: String!) {
          deleteUser(id: $deleteUserId)
        }
      `;

      const variables = { deleteUserId: user1InDb._id.toString() };
      const res = await server.executeOperation({
        query: deleteOneUser,
        variables,
      });

      // Get all users to check that he has been successfully deleted
      const allUsersQuery = gql`
        query allUsers {
          allUsers {
            _id
            firstname
            lastname
            email
            hash
            role
            position
          }
        }
      `;

      const all = await server.executeOperation({
        query: allUsersQuery,
      });

      expect(res.data?.deleteUser).toEqual('User deleted');
      expect(all.data?.allUsers.length).toEqual(1);
      expect(all.data?.allUsers).toEqual(
        expect.not.objectContaining(user1Data)
      );
    });
    it.only('fails deleting a specific user', async () => {
      const user1InDb = new UserModel(user1Data);
      const user2InDb = new UserModel(user2Data);
      await user1InDb.save();
      await user2InDb.save();

      // Delete a user by his ID
      const deleteOneUser = gql`
        mutation DeleteUserMutation($deleteUserId: String!) {
          deleteUser(id: $deleteUserId)
        }
      `;

      const wrongId = '619fa6b902b538d856541718';
      const variables = { deleteUserId: wrongId };
      const res = await server.executeOperation({
        query: deleteOneUser,
        variables,
      });

      const allUsersQuery = gql`
        query allUsers {
          allUsers {
            _id
            firstname
            lastname
            email
            hash
            role
            position
          }
        }
      `;

      const all = await server.executeOperation({
        query: allUsersQuery,
      });

      expect(res.data?.deleteUser).toEqual('Error deleting');
      expect(all.data?.allUsers.length).toEqual(2);
      expect(all.data?.allUsers).toEqual([
        expect.objectContaining(user1Data),
        expect.objectContaining(user2Data)
      ]);
    });
  });
});
