/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import Ticket from '../entities/TicketEntity';
import TicketsModel from '../models/TicketModel';
import TicketInput from '../inputs/TicketInput';
import TicketInputUpdate from '../inputs/TicketInputUpdate';
import IdInput from '../inputs/IdInput';

// @TODO: put this function in utils folder + change ts type
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
  async getOneTicket(
    @Arg('id', () => String) ticketId: TicketInputUpdate['_id']
  ) {
    try {
      const getOneTicket = await TicketsModel.findById(ticketId);
      getOneTicket.advancement = getAdvancement(getOneTicket);
      return getOneTicket;
    } catch (err) {
      return console.log(err);
    }
  }

  // @Authorized()
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
    @Arg('ticketInputUpdate') ticketInputUpdate: TicketInputUpdate
  ) {
    try {
      await TicketsModel.findByIdAndUpdate(
        ticketInputUpdate._id,
        ticketInputUpdate,
        {
          new: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
    return TicketsModel.findById(ticketInputUpdate._id);
  }

  @Authorized()
  @Mutation(() => String)
  async deleteTicket(
    @Arg('id', () => String) ticketId: TicketInputUpdate['_id']
  ) {
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
