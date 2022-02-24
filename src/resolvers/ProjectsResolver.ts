/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import Project from '../entities/Projects';
import ProjectModel from '../models/ProjectModel';
import TicketsModel from '../models/Tickets';
import ProjectInput from '../inputs/ProjectInput';
import ProjectInputUpdate from '../inputs/ProjectInputUpdate';
import IdInput from '../inputs/IdInput';

@Resolver()
class ProjectsResolver {
  @Query(() => [Project])
  async getAllProjects() {
    try {
      const getAllProjects = await ProjectModel.find();

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

      const getCorrespondingTickets = await TicketsModel.findOne(
        { projectId: getOneProject._id },
        'projectId'
      );
      /* 
      const getCorrespondingTickets = await TicketsModel.$where(
        projectId: getOneProject._id
      );
 */
      console.log(projectId);
      console.log(getCorrespondingTickets);

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
