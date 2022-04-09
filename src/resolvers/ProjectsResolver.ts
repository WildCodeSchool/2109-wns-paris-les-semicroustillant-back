/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import Project from '../entities/ProjectEntity';
import ProjectModel from '../models/ProjectModel';
import TicketsModel from '../models/Tickets';
import ProjectInput from '../inputs/ProjectInput';
import ProjectInputUpdate from '../inputs/ProjectInputUpdate';
import { getAdvancement } from './TicketsResolver';

// @TODO: refacto + move into a dedicated file
const countTicketsById = async ({
  projectId,
  status,
}: {
  projectId: string;
  status?: string | null; // or undefined?
}) => {
  const queryFilter = status ? { projectId, status } : { projectId };
  return TicketsModel.countDocuments(queryFilter);
};

@Resolver()
class ProjectsResolver {
  @Authorized()
  @Query(() => [Project])
  async getAllProjects() {
    try {
      const getAllProjects = await ProjectModel.find();

      // @SophieTopart: Refacto to be done (IMO, makes the code complex to read and test), duplicate code with getOneProject query, maybe should be function in a dedicated file?
      const getAllTickets = await TicketsModel.find();

      for (let i = 0; i < getAllProjects.length; i += 1) {
        const getCorrespondingTickets = getAllTickets.filter(
          (ticket) => ticket.projectId === getAllProjects[i]._id.toString()
        );

        for (let j = 0; j < getCorrespondingTickets.length; j += 1) {
          getCorrespondingTickets[j].advancement = getAdvancement(
            getCorrespondingTickets[j]
          );
        }

        const getTicketsAdvancements: number[] = [];

        for (let k = 0; k < getCorrespondingTickets.length; k += 1) {
          getTicketsAdvancements.push(getCorrespondingTickets[k].advancement);
        }

        const sumOfTicketsAdvancements = getTicketsAdvancements.reduce(
          (a, b) => a + b,
          0
        );

        getAllProjects[i].advancement =
          sumOfTicketsAdvancements / getCorrespondingTickets.length;
      }

      return getAllProjects;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
  @Query(() => Project)
  async getOneProject(
    @Arg('projectId', () => String) projectId: ProjectInputUpdate['_id']
  ) {
    try {
      const getOneProject = await ProjectModel.findById(projectId);

      getOneProject.totalTickets = await countTicketsById({
        projectId: getOneProject._id.toString(),
      });

      getOneProject.completedTickets = await countTicketsById({
        projectId: getOneProject._id.toString(),
        status: 'Done',
      });

      return getOneProject;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
  @Mutation(() => Project)
  async createProject(@Arg('projectInput') projectInput: ProjectInput) {
    try {
      await ProjectModel.init();
      const project = await ProjectModel.create(projectInput);
      await project.save();

      return project;
    } catch (err) {
      return console.log(err);
    }
  }

  @Authorized()
  @Mutation(() => Project)
  async updateProject(
    @Arg('projectInputUpdate') projectInputUpdate: ProjectInputUpdate
  ) {
    const projectId = projectInputUpdate._id;

    try {
      await ProjectModel.findByIdAndUpdate(projectId, projectInputUpdate, {
        new: true,
      });
    } catch (err) {
      return console.log(err);
    }

    return ProjectModel.findById(projectId);
  }

  @Authorized()
  @Mutation(() => String)
  async deleteProject(
    @Arg('ProjectId', () => String) projectId: ProjectInputUpdate['_id']
  ) {
    try {
      await ProjectModel.init();
      const result = await ProjectModel.findByIdAndRemove(projectId);

      if (!result) {
        return new Error('This project does not exist');
      }
    } catch (err) {
      return console.log(err);
    }

    return 'Project successfully deleted';
  }
}

export default ProjectsResolver;
