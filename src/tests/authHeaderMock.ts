import { ApolloServer, gql } from 'apollo-server';
import UserModel from '../models/UserModel';

const authHeaderMock = async (server: ApolloServer) => {
    const userAdmin = {
      firstname: 'admin-fn',
      lastname: 'admin-ln',
      email: 'admin@email.com',
      hash: '$2b$10$Vvyb64CIVPOtVtDWFq/inu5Hg3EnpRI9ypCFidKh7BnRZG/gq/hP.', // in clear 'admin-hash',
      role: 'admin',
      position: 'Product Owner',
    };

    const test = await new UserModel(userAdmin).save();

    console.log('test', test);

    const loginUnitTest = gql`
      query Login($hash: String!, $email: String!) {
        login(password: $hash, email: $email)
      }
    `;

    const res = await server.executeOperation({
      query: loginUnitTest,
      variables: {
        hash: 'admin-hash',
        email: 'admin@email.com',
      },
    });

    return res.data?.login;
  };

  export default authHeaderMock;
  