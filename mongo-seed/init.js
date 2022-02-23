const fakemeup = require('fakemeup/dist').default;

const position = [
  'Developer',
  'Product Owner',
  'Scrum Master',
  'Team Lead',
  'Test Engineer',
];

const db = 'semidb';
const collectionProject = 'projects';
const collectionUsers = 'users';
const collectionComments = 'comments';
const collectionTickets = 'tickets';
const numberOfUsers = 5;
const numberOfTickets = 15;
const numberOfComments = 3;
const numberOfProjects = 6;

const clearDatabase = async (mongoConnection) => {
  await mongoConnection.clear(
    [collectionProject, collectionTickets, collectionComments, collectionUsers],
    function (err) {
      if (!err) {
        console.log(
          'collections: ',
          collectionProject,
          collectionUsers,
          collectionTickets,
          collectionComments,
          'cleared'
        );
      }
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
};

const createCollections = () => {
  var id = require('pow-mongodb-fixtures').createObjectId;

  let users = [];

  //   Creating Users collection data
  for (let i = 0; i < numberOfUsers; i++) {
    const user = {
      _id: id(),
      email: fakemeup.user.email(),
      hash: Math.random().toString(36).substring(7),
      firstname: fakemeup.user.firstName(),
      lastname: fakemeup.user.lastName(),
      position: position[i],
      role: 'admin',
    };
    users.push(user);
  }
  // Creating UsersIds Array that will be used in projects collection
  const usersIdsArray = users.map((item, index) => {
    return users[index]._id;
  });

  //   Creating Tickets collection data
  let tickets = [];

  for (let i = 0; i < numberOfTickets; i++) {
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

  // Creating comments data
  let comments = [];

  for (let i = 0; i < numberOfComments; i++) {
    const comment = {
      content: fakemeup.lorem.sentence(10, 15),
      user: usersIdsArray[Math.floor(Math.random() * usersIdsArray.length)],
      date: fakemeup.date.full('slash'),
    };

    comments.push(comment);
  }

  // Creating total_time_spent data
  tickets.forEach((item) => {
    item.total_time_spent =
      item.initial_time_estimated - fakemeup.numbers.floatPrice(1, 3);
    item.comments = comments;
  });

  //   Creating projects collection data

  let projects = [];
  const ticketsIdsArray = tickets.map((item, index) => {
    return tickets[index]._id;
  });
  for (let i = 0; i < numberOfProjects; i++) {
    const project = {
      name: fakemeup.user.fullName() + "'s project",
      projectOwner: 'lol',
      members: [
        ticketsIdsArray[0],
        ticketsIdsArray[1],
        ticketsIdsArray[2],
        ticketsIdsArray[3],
        ticketsIdsArray[4],
        ticketsIdsArray[5],
      ],
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
  return { users, projects, tickets, comments };
};

const mongo = async () => {
  // Connecting to DB
  const fixtures = require('pow-mongodb-fixtures').connect(db, {
    host: 'localhost',
    port: 27017,
  });

  console.log('passed in connection');
  // Clearing DB
  await clearDatabase(fixtures);
  const { users, projects, comments, tickets } = await createCollections();
  // Seeding DB
  await fixtures.load(
    {
      [collectionUsers]: users,
      [collectionComments]: comments,
      [collectionProject]: projects,
      [collectionTickets]: tickets,
    },
    () => console.log('Database Seeded !')
  );
};

(async function () {
  await mongo();
})();
