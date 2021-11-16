import express from 'express';
import crypto  from 'crypto';
import models from '../models';
import { validateSchema, userSchema } from '../validations';

export const UserController = express.Router(); 
const { user } = models;

UserController.route('/users')
.get(async (req, res) => {
  const users = await user.findAll({
    where: {
      isDeleted: false
    }
  });
  res.json(users);
})
.patch(validateSchema(userSchema), async (req, res) => {
  const newUser = req.body;
  user.findOrCreate({
    where: {
      id: newUser.id
    },
    defaults: {
      id: newUser.id,
      login: newUser.login,
      password: newUser.password,
      age: newUser.age,
      isDeleted: newUser.isDeleted
    }
  })
  .then((createdUser) => {
    if (createdUser[1]) {
      res.status(200).json({message: `user with id ${newUser.id} was successfully created!`})
    } else {
      user.update(
        {
          id: newUser.id,
          login: newUser.login,
          password: newUser.password,
          age: newUser.age,
          isDeleted: newUser.isDeleted
        },
        {
          returning: true, 
          where: {
            id: newUser.id
          }
        }
      )
      .then(([rowsUpdate, [updatedUser]]) => {
        res.status(200).json({message:`user with id ${newUser.id} was successfully updated`, user: updatedUser});
      })
      .catch((err) => res.json(err))
    }
  })
  .catch((err) => res.json(err))
})
.delete(async (req, res) => {
  const userId = req.body;
  console.log(userId)
  const userToDelete = await user.findOne({
    where: {
      id: userId.id
    }
  })

  if (userToDelete) { 
    user.update(
      {
        isDeleted: true
      },
      {
        where: {
          id: userId.id
        }
      }
    )
    .then(() => res.json({message: `user with id ${userId.id} was successfully deleted`}))
    .catch((err) => `Failed to delete user with id ${userId.id}`)
  } else {
    res.json({message: `Could not find user with id ${userId.id}`})
  }
})

UserController.route('/users/:userId')
.get(async (req, res) => {
  const id = req.params.userId;
  user.findOne({
    where: {
      id: id
    }
  })
  .then((foundUser) => {
    if (foundUser) {
      res.json(foundUser)
    } else {
      res.json({message: `User with id ${id} was not found`});
    };
  })
  .catch((err) => {
    res.json({message: "Failed to search for a user", err});
  })
})

export const createDefaultUserEntries = () => {
  user.bulkCreate([
    {
      id: crypto.randomBytes(3).toString("hex"),
      login: '1',
      password: 'pass123',
      age: 22,
      isDeleted: false
    },
    {
      id: crypto.randomBytes(3).toString("hex"),
      login: '2',
      password: 'pass123',
      age: 40,
      isDeleted: false
    },
    {
      id: crypto.randomBytes(3).toString("hex"),
      login: '3',
      password: 'pass123',
      age: 35,
      isDeleted: false
    },
    {
      id: crypto.randomBytes(3).toString("hex"),
      login: '4',
      password: 'pass123',
      age: 18,
      isDeleted: true
    },
    {
      id: crypto.randomBytes(3).toString("hex"),
      login: '5',
      password: 'pass123',
      age: 51,
      isDeleted: true
    }
  ])
};
