/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import Project from '../entities/Projects';
import ProjectModel from '../models/ProjectModel';
import TicketsModel from '../models/Tickets';
import ProjectInput from '../inputs/ProjectInput';
import ProjectInputUpdate from '../inputs/ProjectInputUpdate';
import IdInput from '../inputs/IdInput';
import { getAdvancement } from './TicketsResolver';

@Resolver()
class ProjectsResolver {
  @Query(() => [Project])
  async getAllProjects() {
    try {
      const getAllProjects = await ProjectModel.find();

      const getAllTickets = await TicketsModel.find();

      for (let i = 0; i < getAllTickets.length; i += 1) {
        getAllTickets[i].advancement = getAdvancement(getAllTickets[i]);
      }

      const getTicketsAdvancements: number[] = [];

      /* for (let i = 0; i < getAllProjects.length; i += 1) {
        for (let j = 0; j < getAllTickets.length; j += 1) {
          console.log(getAllTickets[j].projectId)
          if (getAllTickets[j].projectId === getAllProjects[i]._id) {
            getTicketsAdvancements.push(1);

             const sumOfTicketsAdvancements = getTicketsAdvancements.reduce(
              (a, b) => a + b,
              0
            );

            getAllTickets[i].advancement =
              sumOfTicketsAdvancements / getTicketsAdvancements.length; 
          }
        } */
      // const getTicketsAdvancements: number[] = [];
      // if (getAllTickets[i].projectId === getAllProjects[i]._id) {
      //   getTicketsAdvancements.push(getAllTickets[i].advancement);

      //   const sumOfTicketsAdvancements = getTicketsAdvancements.reduce(
      //     (a, b) => a + b,
      //     0
      //   );

      //   getAllTickets[i].advancement =
      //     sumOfTicketsAdvancements / getTicketsAdvancements.length;
      // }
      // }
      console.log(getTicketsAdvancements);

      if (!getAllProjects) {
        throw new Error('Cannot find any project');
      }

      return getAllProjects;
    } catch (err) {
      return console.log(err);
    }
  }

  @Query(() => Project)
  async getOneProject(@Arg('projectId', () => String) projectId: IdInput) {
    try {
      const getOneProject = await ProjectModel.findById(projectId);

      const getCorrespondingTickets = await TicketsModel.find({
        projectId: getOneProject._id,
      });

      for (let i = 0; i < getCorrespondingTickets.length; i += 1) {
        getCorrespondingTickets[i].advancement = getAdvancement(
          getCorrespondingTickets[i]
        );
      }

      const getTicketsAdvancements: number[] = [];

      for (let i = 0; i < getCorrespondingTickets.length; i += 1) {
        getTicketsAdvancements.push(getCorrespondingTickets[i].advancement);
      }

      const sumOfTicketsAdvancements = getTicketsAdvancements.reduce(
        (a, b) => a + b,
        0
      );

      getOneProject.advancement =
        sumOfTicketsAdvancements / getCorrespondingTickets.length;

      if (!getOneProject) {
        throw new Error('Cannot find this project');
      }

      return getOneProject;
    } catch (err) {
      return console.log(err);
    }
  }

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

  @Mutation(() => Project)
  async updateProject(
    @Arg('id', () => String) projectId: IdInput,
    @Arg('projectInputUpdate') projectInputUpdate: ProjectInputUpdate
  ) {
    try {
      await ProjectModel.findByIdAndUpdate(projectId, projectInputUpdate, {
        new: true,
      });
    } catch (err) {
      return console.log(err);
    }

    return ProjectModel.findById(projectId);
  }

  @Mutation(() => String)
  async deleteProject(@Arg('id', () => String) id: ProjectInputUpdate) {
    try {
      await ProjectModel.init();
      const result = await ProjectModel.findByIdAndRemove(id);

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
