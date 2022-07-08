/* eslint-disable no-console */
/* eslint-disable global-require */
const fakemeup = require('fakemeup/dist').default;
const bcrypt = require('bcrypt');
require('dotenv').config();
const mongoose = require('mongoose');

const UserModel = mongoose.model(
  'users',
  new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    hash: { type: String, unique: true },
    role: String,
    position: String,
  })
);
const ProjectModel = mongoose.model(
  'projects',
  new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    created_by: mongoose.Types.ObjectId,
    name: String,
    status: String,
    description: String,
    project_owner: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: 'users',
    },
    members: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  })
);
const TicketModel = mongoose.model(
  'tickets',
  new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    created_by: mongoose.Types.ObjectId,
    subject: String,
    status: String,
    deadline: Date,
    description: String,
    initial_time_estimated: Number,
    total_time_spent: Number,
    advancement: Number,
    project_id: String,
    users: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  })
);

const position = [
  'Developer',
  'Product Owner',
  'Scrum Master',
  'Team Lead',
  'Test Engineer',
];

const numberOfUsers = 5;
const numberOfTickets = 15;
// const numberOfComments = 3;
const numberOfProjects = 6;

const createCollections = async () => {
  const id = require('pow-mongodb-fixtures').createObjectId;

  const users = [];

  //   Creating Users collection data
  for (let i = 0; i < numberOfUsers; i += 1) {
    let dynamicHash = '';
    let dynamicRole = '';
    let dynamicEmail = '';
    if (i === 0) {
      dynamicHash = bcrypt.hashSync('semi', 10);
      dynamicRole = 'super admin';
      dynamicEmail = 'semi@semi.com';
    }
    if (i === 1) {
      dynamicHash = bcrypt.hashSync('semi', 10);
      dynamicRole = 'admin';
      dynamicEmail = fakemeup.user.email();
    }
    if (i === 2) {
      dynamicHash = bcrypt.hashSync('semi', 10);
      dynamicRole = 'users';
      dynamicEmail = 'semiuser@semi.com';
    }
    if (i > 2) {
      dynamicHash = Math.random().toString(36).substring(7);
      dynamicRole = 'users';
      dynamicEmail = fakemeup.user.email();
    }

    const user = {
      _id: id(),
      email: dynamicEmail,
      hash: dynamicHash,
      firstname: fakemeup.user.firstName(),
      lastname: fakemeup.user.lastName(),
      position: position[i],
      role: dynamicRole,
    };
    users.push(user);
  }
  // Creating UsersIds Array that will be used in projects collection
  const usersIdsArray = users.map((_, index) => users[index]._id);

  //   Creating Tickets collection data
  const projectIds = [id(), id(), id(), id(), id(), id()];
  const tickets = [];

  for (let i = 0; i < numberOfTickets; i += 1) {
    const ticket = {
      _id: id(),
      subject: fakemeup.lorem.sentence(2, 3),
      status: 'In progress',
      users: [usersIdsArray[1], usersIdsArray[2]],
      deadline: fakemeup.date.full('slash'),
      description: fakemeup.lorem.sentence(10, 15),
      initial_time_estimated: fakemeup.numbers.floatPrice(4, 35),
      // comments will be created later
      // total_time_spent will be created later
      advancement: Math.floor(Math.random() * 100),
      project_id: i < 6 ? projectIds[i] : projectIds[0],
      created_by:
        usersIdsArray[Math.floor(Math.random() * usersIdsArray.length)],
    };
    tickets.push(ticket);
  }

  // Creating ticketsIds Array that will be used in projects collection
  const ticketsIdsArray = tickets.map((_, index) => tickets[index]._id);

  //   Creating projects collection data
  const projects = [];
  for (let i = 0; i < numberOfProjects; i += 1) {
    const project = {
      _id: projectIds[i],
      name: `${fakemeup.user.fullName()}'s project`,
      projectOwner: users[1]._id,
      members: [users[1]._id, users[2]._id, users[3]._id, users[4]._id],
      description: fakemeup.lorem.sentence(10, 15),
      ticketsIds: [
        ticketsIdsArray[Math.floor(Math.random() * ticketsIdsArray.length)],
        ticketsIdsArray[Math.floor(Math.random() * ticketsIdsArray.length)],
        ticketsIdsArray[Math.floor(Math.random() * ticketsIdsArray.length)],
        ticketsIdsArray[Math.floor(Math.random() * ticketsIdsArray.length)],
        ticketsIdsArray[Math.floor(Math.random() * ticketsIdsArray.length)],
        ticketsIdsArray[Math.floor(Math.random() * ticketsIdsArray.length)],
      ],
    };

    projects.push(project);
  }

  return {
    users,
    projects,
    tickets,
  };
};

// Seeding DB
const seed = async () => {
  const { users, projects, tickets } = await createCollections();

  const database = process.env.DB_NAME;
  const dbUrl = `mongodb://mongodb:27017/semidb`;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  console.log('...waiting for database connection...');

  await mongoose.connect(dbUrl, options);

  await UserModel.deleteMany();
  console.log('users collection deleted');
  await ProjectModel.deleteMany();
  console.log('projects collection deleted');
  await TicketModel.deleteMany();
  console.log('tickets collection deleted');

  console.log('Start Seeding...');
  const newPromises = [];
  users.forEach(async (user) => {
    const userInDB = new UserModel(user);
    newPromises.push(userInDB.save());
    console.log(`New user created!`);
  });
  console.log('==> users collection creation done!');

  projects.forEach(async (project) => {
    const projectInDB = new ProjectModel(project);
    newPromises.push(projectInDB.save());
    console.log(`New project created!`);
  });
  console.log('==> projects collection creation done!');

  tickets.forEach(async (ticket) => {
    const ticketInDB = new TicketModel(ticket);
    newPromises.push(ticketInDB.save());
    console.log(`New ticket created!`);
  });
  console.log('==> tickets collection creation done!');

  Promise.all(newPromises).then(mongoose.disconnect);
  console.log(`☆(◒‿◒)☆ Database Seeded!`);
};

seed();
