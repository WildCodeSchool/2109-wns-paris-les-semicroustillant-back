import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import createServer from '../../server';
import ProjectModel from '../../models/ProjectModel';
import TicketModel from '../../models/TicketModel';
import UserModel from '../../models/UserModel';
import authHeaderMock from '../authHeaderMock';

let server: ApolloServer;

beforeAll(async () => {
  server = await createServer();
});

describe('ProjectResolver', () => {
  let projectData1 = {};
  let projectData2 = {};
  let ticketData1 = {};
  let ticketData2 = {};
  let userData1 = {};
  let userData2 = {};
  let fakeUserId: String;
  // let fakeUserId2: String;
  // let emptyObjectId: String;

  let userJWT: string;

  beforeEach(async () => {
    // emptyObjectId = '000000000000000000000000';
    fakeUserId = '619e14d317fc7b24dca41e56';
    // fakeUserId2 = '619e14d317fc7b24dca41e88';

    projectData1 = {
      name: 'project-1',
      created_by: fakeUserId,
      status: 'In progress',
      description: 'Blabla',
    };
    projectData2 = {
      name: 'project-2',
      created_by: fakeUserId,
      status: 'Done',
      description: 'Blabla',
    };
    ticketData1 = {
      created_by: fakeUserId,
      subject: 'ticket1-subject',
      status: 'In progress',
      deadline: new Date('2022-07-22'),
      description: 'ticket1-description',
      initial_time_estimated: 20,
      total_time_spent: 10,
      advancement: 50,
    }
    ticketData2 = {
      created_by: fakeUserId,
      subject: 'ticket2-subject',
      status: 'Done',
      deadline: new Date('2022-07-20'),
      description: 'ticket2-description',
      initial_time_estimated: 30,
      total_time_spent: 20,
      advancement: 73,
    }
    userData1 = {
      firstname: 'user1-firstname',
      lastname: 'user1-lastname',
      email: 'user1@email.com',
      hash: 'user1-hash',
      role: 'admin',
      position: 'Product Owner',
    }
    userData2 = {
      firstname: 'user2-firstname',
      lastname: 'user2-lastname',
      email: 'user2@email.com',
      hash: 'user2-hash',
      role: 'users',
      position: 'Developer',
    }

    userJWT = await authHeaderMock(server);
  });

  describe('getAllProjects()', () => {
    it('gets an array of all projects', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);
      const project1InDb = new ProjectModel({
        ...projectData1,
        project_owner: user1InDb,
        members: [user2InDb._id],
        });
        const project2InDb = new ProjectModel({
          ...projectData2,
          project_owner: user1InDb,
          members: [user2InDb._id],
          });
      const ticketsData1 = new TicketModel({
        ...ticketData1,
        project_id: project1InDb._id,
        users: [user1InDb._id],
      });
      const ticketsData2 = new TicketModel({
        ...ticketData2,
        project_id: project2InDb._id,
        users: [user2InDb._id],
      });
      await project1InDb.save();
      await project2InDb.save();
      await ticketsData1.save();
      await ticketsData2.save();
      await user1InDb.save();
      await user2InDb.save();

      const getAllProjectsQuery = gql`
        query GetAllProjects {
          getAllProjects {
            _id
            name
            project_owner {
              _id
            }
            members {
              _id
            }
          }
        }
      `;

      const res = await server.executeOperation(
        {
          query: getAllProjectsQuery,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

      expect(res.data?.getAllProjects[0]).toEqual({
          _id: project1InDb._id.toString(),
          name: 'project-1',
          project_owner: { _id: user1InDb._id.toString()},
          members: [{ _id: user2InDb._id.toString() }],
        });
      expect(res.data?.getAllProjects[0]).toHaveProperty('_id');
      expect(res.data?.getAllProjects[1]).toHaveProperty('_id');

      expect(res.data?.getAllProjects[0]._id).toBe(project1InDb._id.toString());
      expect(res.data?.getAllProjects[1]._id).toBe(project2InDb._id.toString());
    });

    it('console logs an error if data does not exist in query', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);
      const project1InDb = new ProjectModel({
        ...projectData1,
        project_owner: user1InDb,
        members: [user2InDb._id],
        });
        const project2InDb = new ProjectModel({
          ...projectData2,
          project_owner: user1InDb,
          members: [user2InDb._id],
          });
      const ticketsData1 = new TicketModel({
        ...ticketData1,
        project_id: project1InDb._id,
        users: [user1InDb._id],
      });
      const ticketsData2 = new TicketModel({
        ...ticketData2,
        project_id: project2InDb._id,
        users: [user2InDb._id],
      });
      await project1InDb.save();
      await project2InDb.save();
      await ticketsData1.save();
      await ticketsData2.save();
      await user1InDb.save();
      await user2InDb.save();

      const getAllProjectsQuery = gql`
        query getAllProjects {
          getAllProjects {
            _id
            name
            project_owner {
              _id
            }
            members {
              _id
            }
            plop
          }
        }
      `;

      const res = await server.executeOperation(
        {
          query: getAllProjectsQuery,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );
      expect(res.errors).toMatchSnapshot();
    });
  });
  describe('getOneProject()', () => {
    it('gets a specific project', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);
      const project1InDb = new ProjectModel({
        ...projectData1,
        project_owner: user1InDb,
        members: [user2InDb._id],
        });
      const ticketsData1 = new TicketModel({
        ...ticketData1,
        project_id: project1InDb._id,
        users: [user1InDb._id],
      });

      await project1InDb.save();
      await ticketsData1.save();
      await user1InDb.save();
      await user2InDb.save();

      const getOneProjectQuery = gql`
        query getOneProject($projectId: String!) {
          getOneProject(projectId: $projectId) {
            _id
            name
            project_owner {
              _id
            }
            members {
              _id
            }
          }
        }
      `;

      const variables = { projectId: project1InDb._id.toString() };
      const res = await server.executeOperation(
        {
          query: getOneProjectQuery,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

      expect(res.data?.getOneProject).toEqual({
        _id: project1InDb._id.toString(),
        name: 'project-1',
        project_owner: { _id: user1InDb._id.toString()},
        members: [{ _id: user2InDb._id.toString() }],
      });
      expect(res.data?.getOneProject).toHaveProperty('_id');
      expect(res.data?.getOneProject._id).toBe(project1InDb._id.toString());
    });

    it('fails getting a specific project if wrong ID in query', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);
      const project1InDb = new ProjectModel({
        ...projectData1,
        project_owner: user1InDb,
        members: [user2InDb._id],
        });
      const ticketsData1 = new TicketModel({
        ...ticketData1,
        project_id: project1InDb._id,
        users: [user1InDb._id],
      });

      await project1InDb.save();
      await ticketsData1.save();
      await user1InDb.save();
      await user2InDb.save();

      const getOneProjectQuery = gql`
        query getOneProject($projectId: String!) {
          getOneProject(projectId: $projectId) {
            _id
            name
            project_owner {
              _id
            }
            members {
              _id
            }
          }
        }
      `;

      const wrongId = '619e14d317fc7b24dca41e56';
      const variables = { projectId: wrongId };
      const res = await server.executeOperation(
        {
          query: getOneProjectQuery,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

      expect(res.data).toEqual(null);
      expect(res.errors).toMatchSnapshot();
    });
  });

  describe('createProject()', () => {
    it('creates a new project', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);

      await user1InDb.save();
      await user2InDb.save();

      const createProjectData = {
        created_by: user1InDb._id.toString(),
        name: 'project-1',
        status: 'Pending',
        description: 'project-description',
        project_owner: user1InDb._id.toString(),
        members: [user2InDb._id.toString()],
      };

      const createProjectQuery = gql`
        mutation createProject($projectInput: ProjectInput!) {
          createProject(projectInput: $projectInput) {
            _id
            created_by
            name
            status
            description
            project_owner {
              _id
            }
            members {
              _id
            }
          }
        }
      `;

      const variables = { projectInput: createProjectData };
      const res = await server.executeOperation(
        {
          query: createProjectQuery,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

      expect(res.data?.createProject).toEqual(
        expect.objectContaining({
        name: 'project-1',
        status: 'Pending',
        created_by: user1InDb._id.toString(),
        description: 'project-description',
        project_owner: { _id: user1InDb._id.toString()},
        members: [{ _id: user2InDb._id.toString() }],
      }));
    });
  });

  describe('updateProject()', () => {
    it('updates a project', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);
      const project1InDb = new ProjectModel({
        ...projectData1,
        project_owner: user1InDb,
        members: [user2InDb._id],
        });
      const ticketsData1 = new TicketModel({
        ...ticketData1,
        project_id: project1InDb._id,
        users: [user1InDb._id],
      });

      await project1InDb.save();
      await ticketsData1.save();
      await user1InDb.save();
      await user2InDb.save();


      const updateProjectQuery = gql`
        mutation UpdateProjectById($projectInputUpdate: ProjectInputUpdate!) {
          updateProject(projectInputUpdate: $projectInputUpdate) {
            _id
            name
            status
            description
            project_owner { _id }
            members { _id }
          }
        }
      `;

      const variables = {
        projectInputUpdate: {
          _id: project1InDb._id.toString(),
          created_by: user1InDb._id.toString(),
          name: 'project-1-updated',
          status: 'Pending',
          description: 'project-description-updated',
          project_owner: user1InDb._id.toString(),
          members: [user2InDb._id.toString()],
        },
      };
      const res = await server.executeOperation(
        {
          query: updateProjectQuery,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

      expect(res.data?.updateProject).toEqual(
        expect.objectContaining({
          _id: project1InDb._id.toString(),
          name: 'project-1-updated',
          status: 'Pending',
          description: 'project-description-updated',
          project_owner: { _id: user1InDb._id.toString()},
          members: [{ _id: user2InDb._id.toString() }],
        })
      );
    });

    it('updates a project with some empty fields', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);
      const project1InDb = new ProjectModel({
        ...projectData1,
        project_owner: user1InDb,
        members: [user2InDb._id],
        });
      const ticketsData1 = new TicketModel({
        ...ticketData1,
        project_id: project1InDb._id,
        users: [user1InDb._id],
      });

      await project1InDb.save();
      await ticketsData1.save();
      await user1InDb.save();
      await user2InDb.save();

      const updateProjectQuery = gql`
        mutation UpdateProjectById($projectInputUpdate: ProjectInputUpdate!) {
          updateProject(projectInputUpdate: $projectInputUpdate) {
            _id
            name
            status
            description
            project_owner { _id }
            members { _id }
          }
        }
      `;

      const variables = {
        projectInputUpdate: {
          _id: project1InDb._id.toString(),
          created_by: user1InDb._id.toString(),
          name: 'project-1-updated',
          status: 'Pending',
          project_owner: user1InDb._id.toString(),
          members: [user2InDb._id.toString()],
        },
      };

      const res = await server.executeOperation(
        {
          query: updateProjectQuery,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

      expect(res.data?.updateProject).toEqual(
        expect.objectContaining({
          _id: project1InDb._id.toString(),
          name: 'project-1-updated',
          status: 'Pending',
          description: 'Blabla',
          project_owner: { _id: user1InDb._id.toString()},
          members: [{ _id: user2InDb._id.toString() }],
        })
      );
    });

    it('does not update a project with a wrong project id', async () => {
      const user1InDb = new UserModel(userData1);
      const user2InDb = new UserModel(userData2);
      const project1InDb = new ProjectModel({
        ...projectData1,
        project_owner: user1InDb,
        members: [user2InDb._id],
        });
      const ticketsData1 = new TicketModel({
        ...ticketData1,
        project_id: project1InDb._id,
        users: [user1InDb._id],
      });

      await project1InDb.save();
      await ticketsData1.save();
      await user1InDb.save();
      await user2InDb.save();

      const updateProjectQuery = gql`
        mutation UpdateProjectById($projectInputUpdate: ProjectInputUpdate!) {
          updateProject(projectInputUpdate: $projectInputUpdate) {
            _id
            name
            status
            description
            project_owner { _id }
            members { _id }
          }
        }
      `;

      const wrongProjectId = '619e14d317fc7b24dca41e56';

      const variables = {
        projectInputUpdate: {
          _id: wrongProjectId,
          created_by: user1InDb._id.toString(),
          name: 'project-1-updated',
          status: 'Pending',
          description: 'project-description-updated',
          project_owner: user1InDb._id.toString(),
          members: [user2InDb._id.toString()],
        },
      };
      const res = await server.executeOperation(
        {
          query: updateProjectQuery,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

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
        mutation DeleteProjectMutation($projectId: String!) {
          deleteProject(ProjectId: $projectId)
        }
      `;

      const variables = { projectId: project1InDb._id.toString() };
      const res = await server.executeOperation(
        {
          query: deleteProject,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

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
        mutation DeleteProjectMutation($projectId: String!) {
          deleteProject(ProjectId: $projectId)
        }
      `;

      const wrongId = '619fa6b902b538d856541718';
      const variables = { projectId: wrongId };
      const res = await server.executeOperation(
        {
          query: deleteProject,
          variables,
        },
        {
          req: { headers: { authorization: userJWT } },
        } as any
      );

      const allProjects = await ProjectModel.find();

      expect(res.errors).toMatchSnapshot();
      expect(allProjects.length).toEqual(2);
      expect(allProjects[0]._id).toEqual(project1InDb._id);
      expect(allProjects[1]._id).toEqual(project2InDb._id);
    });
  });
});
