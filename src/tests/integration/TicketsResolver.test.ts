import { ApolloServer, gql } from 'apollo-server';
import createServer from '../../server';
import TicketModel from '../../models/TicketModel';

let server: ApolloServer;

// /tests/integragration/TicketsResolver.test.ts
beforeAll(async () => {
  // creates the mocked server
  server = await createServer();
});

describe('TicketsResolver', () => {
  let ticket1Data = {};
  let ticket2Data = {};
  // set test data
  beforeEach(() => {
    ticket1Data = {
      subject: 'Test users',
      status: 'pending',
      deadline: '2021-12-31T23:00:00.000Z',
      description: 'Test users',
      initial_time_estimated: 1,
      total_time_spent: 0,
      advancement: 0,
      users: [
        {
          _id: '617ab251d5b75c2bff718b45',
        },
      ],
    };

    ticket2Data = {
      subject: 'Test tickets',
      status: 'pending',
      deadline: '2022-01-31T23:00:00.000Z',
      description: 'Test tickets',
      initial_time_estimated: 1,
      total_time_spent: 0,
      advancement: 0,
      users: [
        {
          _id: '617ab251d5b75c2bff710000',
        },
      ],
    };
  });

  // /tests/integragration/TicketsResolver.test.ts
  // allTickets resolver testing
  describe('allTickets()', () => {
    it('gets an array of all tickets', async () => {
      // we initiate and save the two tickets in the DB
      // the tickets are added objectIDs
      const ticket1InDb = new TicketModel(ticket1Data);
      const ticket2InDb = new TicketModel(ticket2Data);
      await ticket1InDb.save();
      await ticket2InDb.save();

      const allTicketsQuery = gql`
        query allTickets {
          allTickets {
            _id
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;

      // executes the query, mocking frontend connection
      const res = await server.executeOperation({
        query: allTicketsQuery,
      });

      // we expect the tickets saved and fetched from DB to be there
      expect(res.data?.allTickets).toEqual([
        expect.objectContaining(ticket1Data),
        expect.objectContaining(ticket2Data),
      ]);
      // we expect the objectIDs of theses documents to the response ones
      expect(res.data?.allTickets[0]._id).toBe(ticket1InDb._id.toString());
      expect(res.data?.allTickets[1]._id).toBe(ticket2InDb._id.toString());
    });

    // /tests/integragration/TicketsResolver.test.ts
    // allTickets resolver testing
    it('console logs an error if data does not exist in query', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      const ticket2InDb = new TicketModel(ticket2Data);
      await ticket1InDb.save();
      await ticket2InDb.save();

      const allTicketsQuery = gql`
        query allTickets {
          allTickets {
            _id
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            plop
          }
        }
      `;
      try {
        await server.executeOperation({
          query: allTicketsQuery,
        });
      } catch (err: any) {
        expect(err.errors.message).toEqual(
          'Cannot query field "plop" on type "Ticket".'
        );
      }
    });
  });

  // /tests/integragration/TicketsResolver.test.ts
  // addTickets resolver testing
  describe('addTicket()', () => {
    it('adds a new ticket', async () => {
      const addTicketMutation = gql`
        mutation addTicket($ticketInput: TicketInput!) {
          addTicket(ticketInput: $ticketInput) {
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;

      const variables = { ticketInput: ticket2Data };

      const res = await server.executeOperation({
        query: addTicketMutation,
        variables,
      });

      expect(res.data?.addTicket).toEqual(expect.objectContaining(ticket2Data));
    });

    // /tests/integragration/TicketsResolver.test.ts
    // addTickets resolver testing
    it('fails adding a new ticket due to missing data', async () => {
      const addTicketMutation = gql`
        mutation addTicket($ticketInput: TicketInput!) {
          addTicket(ticketInput: $ticketInput) {
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;

      const variables = {
        ticketInput: {
          status: 'pending',
          deadline: '2021-12-31T23:00:00.000Z',
          description: 'Test users',
          initial_time_estimated: 1,
          total_time_spent: 0,
          advancement: 0,
          users: [
            {
              _id: '617ab251d5b75c2bff718b45',
            },
          ],
        },
      };

      const res = await server.executeOperation({
        query: addTicketMutation,
        variables,
      });

      expect(res.errors).toMatchSnapshot();
    });

    // /tests/integragration/TicketsResolver.test.ts
    // addTickets resolver testing
    it('fails adding a new ticket due to wrong data', async () => {
      const addTicketMutation = gql`
        mutation addTicket($ticketInput: TicketInput!) {
          addTicket(ticketInput: $ticketInput) {
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;

      const variables = {
        ticketInput: {
          subject: 123,
          status: 'pending',
          deadline: '2021-12-31T23:00:00.000Z',
          description: 'Test users',
          initial_time_estimated: 1,
          total_time_spent: 0,
          advancement: 0,
          users: [
            {
              _id: '617ab251d5b75c2bff718b45',
            },
          ],
        },
      };

      const res = await server.executeOperation({
        query: addTicketMutation,
        variables,
      });

      expect(res.errors).toMatchSnapshot();
    });
  });

  describe('updateTicket()', () => {
    it('updates a ticket even with partial data', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      await ticket1InDb.save();

      const updateTicketMutation = gql`
        mutation updateTicket(
          $ticketInputUpdate: TicketInputUpdate!
          $updateTicketId: String!
        ) {
          updateTicket(
            ticketInputUpdate: $ticketInputUpdate
            id: $updateTicketId
          ) {
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;

      const ticket1Id = ticket1InDb._id.toString();

      const variables = {
        ticketInputUpdate: {
          subject: 'Test update',
        },
        updateTicketId: ticket1Id,
      };

      const res = await server.executeOperation({
        query: updateTicketMutation,
        variables,
      });

      expect(res.data?.updateTicket).toEqual(
        expect.objectContaining({ subject: 'Test update' })
      );
    });
    it('fails updating a ticket due to wrong ID', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      await ticket1InDb.save();

      const updateTicketMutation = gql`
        mutation updateTicket(
          $ticketInputUpdate: TicketInputUpdate!
          $updateTicketId: String!
        ) {
          updateTicket(
            ticketInputUpdate: $ticketInputUpdate
            id: $updateTicketId
          ) {
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;

      const ticket1Id = '619e14d317fc7b24dca41e56';

      const variables = {
        ticketInputUpdate: {
          subject: 'Test update fail',
        },
        updateTicketId: ticket1Id,
      };

      const res = await server.executeOperation({
        query: updateTicketMutation,
        variables,
      });
      expect(res.errors).toMatchSnapshot();
    });
    it('fails updating a ticket due to wrong data', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      await ticket1InDb.save();

      const updateTicketMutation = gql`
        mutation updateTicket(
          $ticketInputUpdate: TicketInputUpdate!
          $updateTicketId: String!
        ) {
          updateTicket(
            ticketInputUpdate: $ticketInputUpdate
            id: $updateTicketId
          ) {
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;

      const ticket1Id = ticket1InDb._id.toString();

      const variables = {
        ticketInputUpdate: {
          subject: 123,
        },
        updateTicketId: ticket1Id,
      };

      const res = await server.executeOperation({
        query: updateTicketMutation,
        variables,
      });
      expect(res.errors).toMatchSnapshot();
    });
  });

  describe('getOneTicket()', () => {
    it('gets a specific ticket', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      const ticket2InDb = new TicketModel(ticket2Data);
      await ticket1InDb.save();
      await ticket2InDb.save();

      const getOneTicketQuery = gql`
        query getOneTicket($getOneTicketId: String!) {
          getOneTicket(id: $getOneTicketId) {
            _id
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;
      const variables = { getOneTicketId: ticket1InDb._id.toString() };
      const res = await server.executeOperation({
        query: getOneTicketQuery,
        variables,
      });
      expect(res.data?.getOneTicket).toEqual(
        expect.objectContaining(ticket1Data)
      );
    });
    it('fails getting a specific ticket due to wrong ID', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      const ticket2InDb = new TicketModel(ticket2Data);
      await ticket1InDb.save();
      await ticket2InDb.save();

      const getOneTicketQuery = gql`
        query getOneTicket($getOneTicketId: String!) {
          getOneTicket(id: $getOneTicketId) {
            _id
            subject
            status
            deadline
            description
            initial_time_estimated
            total_time_spent
            advancement
            users {
              _id
            }
          }
        }
      `;
      const wrongId = '619e14d317fc7b24dca41e56';
      const variables = { getOneTicketId: wrongId };
      const res = await server.executeOperation({
        query: getOneTicketQuery,
        variables,
      });
      expect(res.data).toEqual(null);
      expect(res.errors).toMatchSnapshot();
    });
  });

  describe('deleteTicket()', () => {
    it('deletes a specific ticket', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      const ticket2InDb = new TicketModel(ticket2Data);
      await ticket1InDb.save();
      await ticket2InDb.save();

      const deleteOneTicket = gql`
        mutation deleteTicket($deleteTicketId: String!) {
          deleteTicket(id: $deleteTicketId)
        }
      `;
      const variables = { deleteTicketId: ticket1InDb._id.toString() };
      const res = await server.executeOperation({
        query: deleteOneTicket,
        variables,
      });

      const all = await TicketModel.find();

      expect(res.data?.deleteTicket).toEqual('Ticket successfully deleted');
      expect(all.length).toEqual(1);
      expect(all).toEqual(expect.not.objectContaining(ticket1Data));
    });
    it('fails deleting a specific ticket due to wrong ID', async () => {
      const ticket1InDb = new TicketModel(ticket1Data);
      const ticket2InDb = new TicketModel(ticket2Data);
      await ticket1InDb.save();
      await ticket2InDb.save();

      const deleteOneTicket = gql`
        mutation deleteTicket($deleteTicketId: String!) {
          deleteTicket(id: $deleteTicketId)
        }
      `;
      const wrongId = '619fa6b902b538d856541718';
      const variables = { deleteTicketId: wrongId };
      const res = await server.executeOperation({
        query: deleteOneTicket,
        variables,
      });
      expect(res.errors).toMatchSnapshot();
    });
  });
});
