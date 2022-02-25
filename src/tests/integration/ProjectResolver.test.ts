import { ApolloServer, gql } from 'apollo-server';
import createServer from '../../server';
import ProjectModel from '../../models/ProjectModel';

let server: ApolloServer;

beforeAll(async () => {
  server = await createServer();
});

describe('ProjectResolver', () => {
  let projectData1 = {};
  let projectData2 = {};
  let fakeUserId: String;
  let emptyObjectId: String;

  beforeEach(() => {
    emptyObjectId = '000000000000000000000000';
    fakeUserId = '619e14d317fc7b24dca41e56';
    projectData1 = {
      name: 'project-1',
      status: 'In progress',
      description: 'Blabla',
      projectOwner: emptyObjectId,
      members: [{ _id: fakeUserId }],
    };
    projectData2 = {
      name: 'project-2',
      status: 'Done',
      description: 'Blabla',
      projectOwner: emptyObjectId,
      members: [{ _id: fakeUserId }],
    };
  });

  describe('getAllProjects()', () => {
    it.skip('gets an array of all projects', async () => {
      const project1InDb = new ProjectModel(projectData1);
      const project2InDb = new ProjectModel(projectData2);
      await project1InDb.save();
      await project2InDb.save();

      const getAllProjectsQuery = gql`
        query getAllProjects {
          getAllProjects {
            _id
            name
            status
            description
            projectOwner
            members {
              _id
            }
          }
        }
      `;

      const res = await server.executeOperation({
        query: getAllProjectsQuery,
      });

      expect(res.data?.getAllProjects[0]).toEqual(
        expect.objectContaining({
          name: 'project-1',
          projectOwner: emptyObjectId,
          members: [{ _id: fakeUserId }],
        })
      );
      expect(res.data?.getAllProjects[0]).toHaveProperty('_id');
      expect(res.data?.getAllProjects[1]).toHaveProperty('_id');

      expect(res.data?.getAllProjects[0]._id).toBe(project1InDb._id.toString());
      expect(res.data?.getAllProjects[1]._id).toBe(project2InDb._id.toString());
    });
    it.skip('console logs an error if data does not exist in query', async () => {
      const project1InDb = new ProjectModel(projectData1);
      const project2InDb = new ProjectModel(projectData2);
      await project1InDb.save();
      await project2InDb.save();

      const getAllProjectsQuery = gql`
        query getAllProjects {
          getAllProjects {
            _id
            name
            status
            description
            projectOwner
            members {
              _id
            }
            plop
          }
        }
      `;

      const res = await server.executeOperation({
        query: getAllProjectsQuery,
      });
      expect(res.errors).toMatchSnapshot();
    });
  });
  describe('getOneProject()', () => {
    it.skip('gets a specific project', async () => {
      const project1InDb = new ProjectModel(projectData1);
      const project2InDb = new ProjectModel(projectData2);
      await project1InDb.save();
      await project2InDb.save();

      const getOneProjectQuery = gql`
        query getOneProject($projectId: String!) {
          getOneProject(projectId: $projectId) {
            _id
            name
            status
            description
            projectOwner
            members {
              _id
            }
          }
        }
      `;

      const variables = { projectId: project1InDb._id.toString() };
      const res = await server.executeOperation({
        query: getOneProjectQuery,
        variables,
      });

      expect(res.data?.getOneProject).toEqual(
        expect.objectContaining({
          name: 'project-1',
          projectOwner: emptyObjectId,
          members: [{ _id: fakeUserId }],
        })
      );
      expect(res.data?.getOneProject).toHaveProperty('_id');
      expect(res.data?.getOneProject._id).toBe(project1InDb._id.toString());
    });
    it.skip('fails getting a specific project if wrong ID in query', async () => {
      const project1InDb = new ProjectModel(projectData1);
      const project2InDb = new ProjectModel(projectData2);
      await project1InDb.save();
      await project2InDb.save();

      const getOneProjectQuery = gql`
        query getOneProject($projectId: String!) {
          getOneProject(projectId: $projectId) {
            _id
            name
            status
            description
            projectOwner
            members {
              _id
            }
          }
        }
      `;

      const wrongId = '619e14d317fc7b24dca41e56';
      const variables = { projectId: wrongId };
      const res = await server.executeOperation({
        query: getOneProjectQuery,
        variables,
      });

      expect(res.data).toEqual(null);
      expect(res.errors).toMatchSnapshot();
    });
  });

  describe('createProject()', () => {
    it.skip('creates a new project', async () => {
      const createProjectQuery = gql`
        mutation createProject($projectInput: ProjectInput!) {
          createProject(projectInput: $projectInput) {
            _id
            name
            status
            description
            projectOwner
            members {
              _id
            }
          }
        }
      `;

      const variables = { projectInput: projectData2 };
      const res = await server.executeOperation({
        query: createProjectQuery,
        variables,
      });

      expect(res.data?.createProject).toEqual(
        expect.objectContaining(projectData2)
      );
    });
  });

  describe('updateProject()', () => {
    it.skip('updates a project', async () => {
      const project1InDb = new ProjectModel(projectData1);
      await project1InDb.save();

      const updateProjectQuery = gql`
        mutation UpdateProject(
          $projectInputUpdate: ProjectInputUpdate!
          $updateProjectId: String!
        ) {
          updateProject(
            projectInputUpdate: $projectInputUpdate
            id: $updateProjectId
          ) {
            name
            status
            description
            projectOwner
            members {
              _id
            }
          }
        }
      `;

      const variables = {
        projectInputUpdate: {
          name: 'super great project',
          status: 'super status',
          description: 'super description',
          projectOwner: '61e7f93050acb74fc893e17e',
          members: [{ _id: '61e7f93050acb74fc893e17d' }],
        },
        updateProjectId: project1InDb._id.toString(),
      };
      const res = await server.executeOperation({
        query: updateProjectQuery,
        variables,
      });

      expect(res.data?.updateProject).toEqual(
        expect.objectContaining({
          name: 'super great project',
          status: 'super status',
          description: 'super description',
          projectOwner: '61e7f93050acb74fc893e17e',
          members: [{ _id: '61e7f93050acb74fc893e17d' }],
        })
      );
    });
    it.skip('updates a project with some empty fields', async () => {
      const project1InDb = new ProjectModel(projectData1);
      await project1InDb.save();

      const updateProjectQuery = gql`
        mutation UpdateProject(
          $projectInputUpdate: ProjectInputUpdate!
          $updateProjectId: String!
        ) {
          updateProject(
            projectInputUpdate: $projectInputUpdate
            id: $updateProjectId
          ) {
            name
            projectOwner
            members {
              _id
            }
          }
        }
      `;

      const variables = {
        projectInputUpdate: {
          name: 'super great project',
          projectOwner: '61e7f93050acb74fc893e17e',
          members: [{ _id: '61e7f93050acb74fc893e17d' }],
        },
        updateProjectId: project1InDb._id.toString(),
      };
      const res = await server.executeOperation({
        query: updateProjectQuery,
        variables,
      });

      expect(res.data?.updateProject).toEqual(
        expect.objectContaining({
          name: 'super great project',
          projectOwner: '61e7f93050acb74fc893e17e',
          members: [{ _id: '61e7f93050acb74fc893e17d' }],
        })
      );
    });
    it.skip('does not update a project with a wrong project id', async () => {
      const project1InDb = new ProjectModel(projectData1);
      await project1InDb.save();

      const updateProjectQuery = gql`
        mutation UpdateProject(
          $projectInputUpdate: ProjectInputUpdate!
          $updateProjectId: String!
        ) {
          updateProject(
            projectInputUpdate: $projectInputUpdate
            id: $updateProjectId
          ) {
            name
            projectOwner
            members {
              _id
            }
          }
        }
      `;

      const wrongProjectId = '619e14d317fc7b24dca41e56';
      const variables = {
        projectInputUpdate: {
          name: 'super great project',
          projectOwner: '000000000000000000000001',
          members: [{ _id: fakeUserId }],
        },
        updateProjectId: wrongProjectId,
      };
      const res = await server.executeOperation({
        query: updateProjectQuery,
        variables,
      });

      expect(res.data).toEqual(null);
      expect(res.errors).toMatchSnapshot();
    });
  });

  describe('deleteProject()', () => {
    it('deletes a specific project', async () => {
      const project1InDb = new ProjectModel(projectData1);
      const project2InDb = new ProjectModel(projectData2);
      await project1InDb.save();
      await project2InDb.save();

      const deleteProject = gql`
        mutation deleteProject($deleteProjectId: String!) {
          deleteProject(id: $deleteProjectId)
        }
      `;

      const variables = { deleteProjectId: project1InDb._id.toString() };
      const res = await server.executeOperation({
        query: deleteProject,
        variables,
      });

      const allProjects = await ProjectModel.find();

      expect(res.data?.deleteProject).toEqual('Project successfully deleted');
      expect(allProjects.length).toEqual(1);
      expect(allProjects[0]._id).not.toEqual(project1InDb._id);
    });
    it('fails deleting a specific project', async () => {
      const project1InDb = new ProjectModel(projectData1);
      const project2InDb = new ProjectModel(projectData2);
      await project1InDb.save();
      await project2InDb.save();

      const deleteProject = gql`
        mutation deleteProject($deleteProjectId: String!) {
          deleteProject(id: $deleteProjectId)
        }
      `;

      const wrongId = '619fa6b902b538d856541718';
      const variables = { deleteProjectId: wrongId };
      const res = await server.executeOperation({
        query: deleteProject,
        variables,
      });

      const allProjects = await ProjectModel.find();

      expect(res.errors).toMatchSnapshot();
      expect(allProjects.length).toEqual(2);
      expect(allProjects[0]._id).toEqual(project1InDb._id);
      expect(allProjects[1]._id).toEqual(project2InDb._id);
    });
  });
});
