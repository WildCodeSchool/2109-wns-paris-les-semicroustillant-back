/* eslint-disable global-require */
const fs = require('fs');
const fakemeup = require('fakemeup/dist').default;
const bcrypt = require('bcrypt');

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
    if (i > 1) {
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
  const tickets = [];

  for (let i = 0; i < numberOfTickets; i += 1) {
    const ticket = {
      _id: id(),
      subject: fakemeup.lorem.sentence(2, 3),
      status: 'in progress',
      users: [usersIdsArray[1], usersIdsArray[2]],
      deadline: fakemeup.date.full('slash'),
      description: fakemeup.lorem.sentence(10, 15),
      initial_time_estimated: fakemeup.numbers.floatPrice(4, 35),
      // comments will be created later
      // total_time_spent will be created later
      advancement: Math.floor(Math.random() * 100),
      file_links: ['file1.pdf', 'file2.pdf'],
    };
    tickets.push(ticket);
  }

  //   Creating projects collection data
  const projects = [];
  const ticketsIdsArray = tickets.map((_, index) => tickets[index]._id);
  for (let i = 0; i < numberOfProjects; i += 1) {
    const project = {
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

  try {
    fs.writeFile(
      'src/seed/usersSeed.json',
      JSON.stringify(users),
      'utf8',
      (err) => {
        if (err) console.log(err);
      }
    );
    fs.writeFile(
      'src/seed/projectsSeed.json',
      JSON.stringify(projects),
      'utf8',
      (err) => {
        if (err) console.log(err);
      }
    );
    fs.writeFile(
      'src/seed/ticketsSeed.json',
      JSON.stringify(tickets),
      'utf8',
      (err) => {
        if (err) console.log(err);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

seed();
