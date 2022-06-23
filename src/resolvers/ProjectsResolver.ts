/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation, Authorized } from 'type-graphql';
import Project from '../entities/ProjectEntity';
import ProjectModel from '../models/ProjectModel';
import ProjectInput from '../inputs/ProjectInput';
import ProjectInputUpdate from '../inputs/ProjectInputUpdate';
import countTicketsByProjectId from '../utils/countTicketsByProjectId';

import { IProject } from '../types/types';

@Resolver()
class ProjectsResolver {
  @Authorized()
  @Query(() => [Project])
  async getAllProjects() {
    try {
      const getAllProjects = await ProjectModel.find();

      // @FIX: add test for !getAllProjects
      if (!getAllProjects || getAllProjects.length === 0) {
        throw new Error('No projects found');
      }

      return await Promise.all(
        getAllProjects.map(async (project) => {
          const projectToJson: IProject = project.toJSON();

          projectToJson.totalTickets = await countTicketsByProjectId({
            projectId: project._id.toString(),
          });

          projectToJson.completedTickets = await countTicketsByProjectId({
            projectId: project._id.toString(),
            status: 'Done',
          });

          return projectToJson;
        })
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }

  @Authorized()
  @Query(() => Project)
  async getOneProject(
    @Arg('projectId', () => String) projectId: ProjectInputUpdate['_id']
  ) {
    try {
      const getOneProject: IProject | null = await ProjectModel.findById(
        projectId
      );
      
      // @FIX: add test for !getOneProject
      if (!getOneProject) {
        throw new Error('Project not found');
      }

      getOneProject.totalTickets = await countTicketsByProjectId({
        projectId: getOneProject._id.toString(),
      });

      getOneProject.completedTickets = await countTicketsByProjectId({
        projectId: getOneProject._id.toString(),
        status: 'Done',
      });

      return getOneProject;
    } catch (err: any) {
      throw new Error(err);
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
    } catch (err: any) {
      throw new Error(err);
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
    } catch (err: any) {
      throw new Error(err);
    }

    // This mutation does not return totalTickets and completedTickets
    return ProjectModel.findById(projectId);
  }

  @Authorized()
  @Mutation(() => String)
  async deleteProject(
    @Arg('ProjectId', () => String) projectId: ProjectInputUpdate['_id']
  ) {
    try {
      await ProjectModel.init();
      // only delete a project, not the tickets
      // @TODO: should we delete the ticket or the ID as well? check delete on cascade
      const result = await ProjectModel.findByIdAndRemove(projectId);

      if (!result) {
        return new Error('This project does not exist');
      }
    } catch (err: any) {
      throw new Error(err);
    }

    return 'Project successfully deleted';
  }
}

export default ProjectsResolver;
