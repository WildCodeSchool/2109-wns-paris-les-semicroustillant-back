import { ApolloServer, gql } from 'apollo-server';
import createServer from '../../server';
import UserModel from '../../models/Users';

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
    it('fails getting a specific user due to wrong ID', async () => {
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

      const wrongId = '619e14d317fc7b24dca41e56';
      const variables = { getOneUserId: wrongId };
      const res = await server.executeOperation({
        query: getOneUserQuery,
        variables,
      });

      // @FIXME: does not return the error message in !getOneUser condition in UsersResolver.ts
      expect(res.data).toEqual(null);
      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message:
              'Cannot return null for non-nullable field Query.getOneUser.',
          }),
        ])
      );
    });
  });

  describe('addUser()', () => {
    it('adds a new user', async () => {
      const user1InDb = new UserModel(user1Data);
      await user1InDb.save();

      const addUserQuery = gql`
        mutation addUser($userInput: UserInput!) {
          addUser(userInput: $userInput) {
            firstname
            lastname
            email
            hash
            role
            position
          }
        }
      `;

      const variables = { userInput: user2Data };

      const res = await server.executeOperation({
        query: addUserQuery,
        variables,
      });

      expect(res.data?.addUser).toEqual(
        expect.objectContaining({ firstname: 'John' })
      );
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
      const all = await UserModel.find();

      expect(res.data?.deleteUser).toEqual('User successfully deleted');
      expect(all.length).toEqual(1);
      expect(all).toEqual(expect.not.objectContaining(user1Data));
    });
    it('fails deleting a specific user', async () => {
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

      const all = await UserModel.find();

      expect(res.data?.deleteUser).toEqual('Error deleting');
      expect(all.length).toEqual(2);
      expect(all).toEqual([
        expect.objectContaining(user1Data),
        expect.objectContaining(user2Data),
      ]);
    });
  });
});