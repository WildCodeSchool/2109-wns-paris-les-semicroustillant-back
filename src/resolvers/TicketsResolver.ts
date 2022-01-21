/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import Ticket from '../entities/Tickets';
import TicketsModel from '../models/Tickets';
import TicketInput from '../inputs/TicketInput';
import TicketInputUpdate from '../inputs/TicketInputUpdate';
import IdInput from '../inputs/IdInput';
import UsersModel from '../models/Users';

@Resolver()
class TicketsResolver {
  @Query(() => [Ticket])
  async allTickets() {
    try {
      const getAllTickets = await TicketsModel.find();
      return getAllTickets;
    } catch (err) {
      return console.log(err);
    }
  }

  @Query(() => Ticket)
  async getOneTicket(@Arg('id', () => String) ticketId: IdInput) {
    try {
      const getOneTicket = await TicketsModel.findById(ticketId);
      return getOneTicket;
    } catch (err) {
      return console.log(err);
    }
  }

  @Mutation(() => Ticket)
  async addTicket(@Arg('ticketInput') ticketInput: TicketInput) {
    try {
      const getAllUsers = await UsersModel.find();
      await TicketsModel.init();
      const ticket = await TicketsModel.create(ticketInput);
      const createdTicket = await ticket.save();

      return { createdTicket, getAllUsers };
    } catch (err) {
      return console.log(err);
    }
  }

  @Mutation(() => Ticket)
  async updateTicket(
    @Arg('id', () => String) ticketId: IdInput,
    @Arg('ticketInputUpdate') ticketInputUpdate: TicketInputUpdate
  ) {
    try {
      await TicketsModel.findByIdAndUpdate(ticketId, ticketInputUpdate, {
        new: true,
      });
    } catch (err) {
      console.log(err);
    }
    return TicketsModel.findById(ticketId);
  }

  @Mutation(() => String)
  async deleteTicket(@Arg('id', () => String) ticketId: IdInput) {
    try {
      await TicketsModel.init();
      await TicketsModel.findByIdAndRemove(ticketId);
    } catch (err) {
      console.log(err);
    }

    return 'Ticket successfully deleted';
  }
}

export default TicketsResolver;
