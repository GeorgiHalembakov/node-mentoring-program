import express, { Application, Request, Response, NextFunction } from 'express';
import models from './models';
import { createDefaultUserEntries, UserController } from './controllers';

const app: Application = express();
const port = 3000;

models.sequelize.authenticate().then(() => {
  console.log('Connection with DB has been established.');
})
.catch(err => {
  console.log('Unable to connect to the DB:', err);
})

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use(UserController);

models.sequelize.sync().then(() =>{
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);

    models.sequelize.query('CREATE DATABASE users;')
    .then(data => { console.log(data)})
    .catch((err) => console.log(err))

    createDefaultUserEntries();
  });
})



