/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import Ticket from '../entities/TicketEntity';
import TicketsModel from '../models/TicketModel';
import TicketInput from '../inputs/TicketInput';
import TicketInputUpdate from '../inputs/TicketInputUpdate';
import IdInput from '../inputs/IdInput';

export const getAdvancement = (data: any) => {
  const timeSpent = data.total_time_spent;
  const estimatedTime = data.initial_time_estimated;
  return (timeSpent / estimatedTime) * 100;
};
@Resolver()
class TicketsResolver {
  @Authorized()
  @Query(() => [Ticket])
  async allTickets() {
    try {
      const getAllTickets = await TicketsModel.find();
      
      // @FIX: add test for !getAllProjects
      if (getAllTickets.length === 0) {
        throw new Error('No projects found');
      }

      for (let i = 0; i < getAllTickets.length; i += 1) {
        getAllTickets[i].advancement = getAdvancement(getAllTickets[i]);
      }
      return getAllTickets;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
  @Query(() => Ticket)
  async getOneTicket(@Arg('id', () => String) ticketId: IdInput) {
    try {
      const getOneTicket = await TicketsModel.findById(ticketId);

      // @FIX: add test for !getOneTicket
      if (!getOneTicket) {
        throw new Error('This ticket does not exist');
      }
      getOneTicket.advancement = getAdvancement(getOneTicket);

      return getOneTicket;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
  @Mutation(() => Ticket)
  async addTicket(@Arg('ticketInput') ticketInput: TicketInput) {
    try {
      await TicketsModel.init();
      const ticket = await TicketsModel.create(ticketInput);
      await ticket.save();

      return ticket;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
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

  @Authorized()
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
