/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import TicketModel from '../models/TicketModel';
import ProjectModel from '../models/ProjectModel';
import Ticket from '../entities/TicketEntity';
import TicketInput from '../inputs/TicketInput';
import TicketInputUpdate from '../inputs/TicketInputUpdate';

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
      const getAllTickets = await TicketModel.find()
        .populate('project_id')
        .populate('users')
        .exec();

      // @FIX: add test for !getAllProjects
      if (!getAllTickets || getAllTickets.length === 0) {
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
  async getOneTicket(
    @Arg('id', () => String) ticketId: TicketInputUpdate['_id']
  ) {
    try {
      const getOneTicket = await TicketModel.findById(ticketId)
        .populate('project_id')
        .populate('users')
        .exec();

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

  @Authorized()
  @Mutation(() => Ticket)
  async updateTicket(
    @Arg('ticketInputUpdate') ticketInputUpdate: TicketInputUpdate
  ) {
    // @TODO: Add verification that userId === created_by of the project OR Admin/super admin to allow update
    // Or maybe check that the user belongs to the project>ticket to update anything
    // This will be different for commentaries (only a user can modify his comments)
    try {
      await TicketModel.findByIdAndUpdate(
        ticketInputUpdate._id,
        ticketInputUpdate,
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
