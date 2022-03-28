/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import Project from '../entities/ProjectEntity';
import ProjectModel from '../models/ProjectModel';
import ProjectInput from '../inputs/ProjectInput';
import ProjectInputUpdate from '../inputs/ProjectInputUpdate';

@Resolver()
class ProjectsResolver {
  @Query(() => [Project])
  async getAllProjects() {
    try {
      const getAllProjects = await ProjectModel.find();

      return getAllProjects;
    } catch (err) {
      return console.log(err);
    }
  }

  @Query(() => Project)
  async getOneProject(@Arg('projectId', () => String) projectId: ProjectInputUpdate["_id"]) {
    try {
      const getOneProject = await ProjectModel.findById(projectId);

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

  @Mutation(() => String)
  async deleteProject(@Arg('ProjectId', () => String) projectId: ProjectInputUpdate["_id"]) {
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
