import express, { Application, Request, Response, NextFunction } from 'express';
import  crypto  from 'crypto';
import { validateSchema, userSchema } from './validations'

interface IUser {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

const app: Application = express();

const port = 3000;

let users: IUser[] = [
  {id: crypto.randomBytes(3).toString("hex"), login: '1', password: 'pass123', age: 22, isDeleted: false},
  {id: crypto.randomBytes(3).toString("hex"), login: '2', password: 'pass123', age: 35, isDeleted: false},
  {id: crypto.randomBytes(3).toString("hex"), login: '3', password: 'pass123', age: 40, isDeleted: false},
  {id: crypto.randomBytes(3).toString("hex"), login: '4', password: 'pass123', age: 18, isDeleted: true},
  {id: crypto.randomBytes(3).toString("hex"), login: '5', password: 'pass123', age: 51, isDeleted: false},
];

app.use(express.urlencoded({extended: true}));
app.use(express.json())


app.get('/users/:userId', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    const searchedUser = users.find((user) => user.id === id);
    if (searchedUser) {
      searchedUser.isDeleted ? res.status(200).json({message: `User with id: ${id} has been deleted`}): res.json(searchedUser);
      res.json(searchedUser);
    } else {
      res.status(404).json({message: `user with id ${id} was not found`})
    }
});

app.get('/users', (req: Request, res: Response, next: NextFunction) => {
  const notDeletedUsers = users.filter((user) => !user.isDeleted)
  res.json(notDeletedUsers);
});

app.patch('/users', validateSchema(userSchema), (req: Request, res: Response, next: NextFunction) => {
  const newUser = req.body;
  const existingUser = users.find((user: IUser) => user.id === newUser.id);

  if (existingUser) {
    users = users.filter((user) => user.id !== existingUser.id);
  }
  console.log(`${existingUser ? 'Updated' : 'Created'} user: `, newUser)
  users.push(newUser);

  res.json(users);
});

app.delete('/users',  (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body;
  const deletedUserIndex = users.findIndex((user: IUser) => user.id === userId.id);

  if (deletedUserIndex > -1) {
    users[deletedUserIndex].isDeleted ? res.status(200).json({message: `User with id ${userId.id} has already been deleted`}) : res.status(200).json({message: `User with id ${userId.id} was deleted`});
    users[deletedUserIndex].isDeleted = true;
    console.log('Deleted user with id: ', userId.id);
  } else  {
    res.status(404).json({message: `User with id ${userId.id} was not found`})
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`));


