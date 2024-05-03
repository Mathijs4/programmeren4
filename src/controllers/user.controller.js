let users = [];
let id = 0;

let controller = {
  addUser: (req, res) => {
    let user = req.body;
    id++;

    console.log('User:', user);

    user = {
      id,
      ...user,
    };

    users.push(user);
    console.log('Database:', users);

    res.status(201).json({
      status: 201,
      message: 'User created',
      user,
    });
  },

  getAllUsers: (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'List of users',
      users,
    });
  },

  getUserById: (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      res.status(200).json({
        status: 200,
        message: 'User found',
        user,
      });
    }
  },

  editUserById: (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));
    const updatedUser = req.body;

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      users[userId - 1] = {
        ...users[userId - 1],
        ...updatedUser,
      };

      res.status(200).json({
        status: 200,
        message: 'User updated',
        user: users[userId - 1],
      });
    }
  },

  deleteUserById: (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      users = users.filter((user) => user.id !== Number(userId));

      res.status(200).json({
        status: 200,
        message: 'User deleted',
      });
    }
  },
};

module.exports = controller;
