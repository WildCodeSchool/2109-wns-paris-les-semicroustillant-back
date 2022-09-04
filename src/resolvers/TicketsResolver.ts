/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import TicketModel from '../models/TicketModel';
import ProjectModel from '../models/ProjectModel';
import Ticket from '../entities/TicketEntity';
import TicketInput from '../inputs/TicketInput';
import TicketInputUpdate from '../inputs/TicketInputUpdate';
import UserInputUpdate from '../inputs/UserInputUpdate';

// @TODO: put this function in utils folder + change ts type
export const getAdvancement = (data: any) => {
  const timeSpent = data.total_time_spent;
  const estimatedTime = data.initial_time_estimated;
  return (timeSpent / estimatedTime) * 100;
};
@Resolver()
class TicketsResolver {
  // TicketsResolver.ts
  @Authorized()
  @Query(() => [Ticket])
  // fetch all tickets in DB
  async allTickets() {
    try {
      const getAllTickets = await TicketModel.find()
        // reference to projects collection
        .populate('project_id')
        // reference to users collection
        .populate('users')
        // execute populate()
        .exec();

      if (!getAllTickets || getAllTickets.length === 0) {
        throw new Error('No projects found');
      }

      for (let i = 0; i < getAllTickets.length; i += 1) {
        // calculate advancement based on total tickets and done tickets
        getAllTickets[i].advancement = getAdvancement(getAllTickets[i]);
      }
      return getAllTickets;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
  @Query(() => Number)
  async countTicketsByUserId(
    @Arg('id', () => String) userId: UserInputUpdate['_id']
  ) {
    try {
      const countTicketsByUserId = await TicketModel.countDocuments({
        users: userId,
      });

      return countTicketsByUserId;
    } catch (err) {
      return console.log(err);
    }
  }

  // TicketsRsolver.ts
  @Authorized()
  @Query(() => Ticket)
  async getOneTicket(
    @Arg('id', () => String) ticketId: TicketInputUpdate['_id']
  ) {
    try {
      const getOneTicket = await TicketModel.findById(ticketId)
        .populate('project_id')
        .populate('users')
        .exec();

      if (!getOneTicket) {
        throw new Error('This ticket does not exist');
      }
      getOneTicket.advancement = getAdvancement(getOneTicket);

      return getOneTicket;
    } catch (err) {
      return console.log(err);
    }
  }

  // TicketsRsolver.ts
  @Authorized()
  @Mutation(() => Ticket)
  async addTicket(@Arg('ticketInput') ticketInput: TicketInput) {
    try {
      const project = await ProjectModel.findById(ticketInput.project_id);
      if (!project) throw new Error('Project not found');

      await TicketModel.init();
      const ticket = await TicketModel.create(ticketInput).then((tick) =>
        TicketModel.findById(tick._id)
          .populate('project_id')
          .populate('users')
          .exec()
      );

      return ticket;
    } catch (err) {
      return console.log(err);
    }
  }

  // TicketsResolver.ts
  @Authorized()
  @Mutation(() => Ticket)
  async updateTicket(
    @Arg('ticketInputUpdate') ticketInputUpdate: TicketInputUpdate
  ) {
    try {
      // finds to corresponding document with it's id
      // and update it with the input received
      await TicketModel.findByIdAndUpdate(
        ticketInputUpdate._id,
        ticketInputUpdate,
        // if true, returns the modified document
        // if false, returns the document before modification
        {
          new: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
    return TicketModel.findById(ticketInputUpdate._id)
      .populate('project_id')
      .populate('users')
      .exec();
  }

  // TicketsResolver.ts
  @Authorized()
  @Mutation(() => String)
  async deleteTicket(
    @Arg('id', () => String) ticketId: TicketInputUpdate['_id']
  ) {
    try {
      await TicketModel.init();
      await TicketModel.findByIdAndRemove(ticketId);
    } catch (err) {
      console.log(err);
    }

    return 'Ticket successfully deleted';
  }
}

export default TicketsResolver;
