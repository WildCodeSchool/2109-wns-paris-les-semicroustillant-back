/* eslint-disable no-console */
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import Project from '../entities/Projects';
import ProjectModel from '../models/ProjectModel';
import ProjectInput from '../inputs/ProjectInput';
import ProjectInputUpdate from '../inputs/ProjectInputUpdate';
import IdInput from '../inputs/IdInput';

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

  // Answer from Lorris : We shouldn't ask for name, projectowner and members for a getOneProject. This causes a lot of issues. Id should be a string, not an object
  @Query(() => Project)
  async getOneProject(@Arg('projectId', () => String) projectId: IdInput) {
    try {
      const getOneProject = await ProjectModel.findById(projectId);

      if (!getOneProject) {
        return 'Cannot find this project';
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

  // @FIXME: inside projectInputUpdate, fields "name" and "projectOwner", at least, are mandatory and they should be optionnal
  @Mutation(() => Project)
  async updateProject(
    @Arg('projectInputUpdate')
    { _id: projectId, ...projectInputUpdate }: ProjectInputUpdate
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
        return 'This user does not exist';
      }
    } catch (err) {
      console.log(err);
    }

    return 'Project deleted';
  }
}

export default ProjectsResolver;
