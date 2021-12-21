import { ApolloServer, gql } from 'apollo-server';
import createServer from '../server';
import TicketsModel from '../models/Tickets';

let server: ApolloServer;

beforeAll(async () => {
  server = await createServer();
});

describe('TicketsResolver', () => {
  let ticket1Data = {};
  let ticket2Data = {};

  beforeEach(() => {
    ticket1Data = {
      subject: 'Test users',
      status: 'pending',
      deadline: '2021-12-31T23:00:00.000Z',
      description: 'Test users',
      initial_time_estimated: 1,
      total_time_spent: 0,
      advancement: 0,
    };

    ticket2Data = {
      subject: 'Test tickets',
      status: 'pending',
      deadline: '2022-01-31T23:00:00.000Z',
      description: 'Test tickets',
      initial_time_estimated: 1,
      total_time_spent: 0,
      advancement: 0,
    };
  });

  describe('allTickets()', () => {
    it('gets an array of all tickets', async () => {
      const ticket1InDb = new TicketsModel(ticket1Data);
      const ticket2InDb = new TicketsModel(ticket2Data);
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
          }
        }
      `;

      const res = await server.executeOperation({
        query: allTicketsQuery,
      });

      expect(res.data?.allTickets).toEqual([
        expect.objectContaining(ticket1Data),
        expect.objectContaining(ticket2Data),
      ]);
      expect(res.data?.allTickets[0]._id).toBe(ticket1InDb._id.toString());
      expect(res.data?.allTickets[1]._id).toBe(ticket2InDb._id.toString());
    });

    it('console logs an error if data does not exist in query', async () => {
      const ticket1InDb = new TicketsModel(ticket1Data);
      const ticket2InDb = new TicketsModel(ticket2Data);
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
  describe('getOneTicket()', () => {
    it('gets a specific ticket', async () => {
      const ticket1InDb = new TicketsModel(ticket1Data);
      const ticket2InDb = new TicketsModel(ticket2Data);
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

    describe('deleteUser()', () => {
      it('deletes a specific user', async () => {
        const ticket1InDb = new TicketsModel(ticket1Data);
        const ticket2InDb = new TicketsModel(ticket2Data);
        await ticket1InDb.save();
        await ticket2InDb.save();
      });
    });
  });
});
