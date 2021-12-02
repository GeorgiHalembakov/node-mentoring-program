import { Sequelize, DataTypes, ModelCtor } from 'sequelize';

const sequelize = new Sequelize('postgres', 'postgres', 'pass123', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const User = sequelize.define('user', {
  id: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  login: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
  }
});


const models = {
  user: User,
  sequelize
};

export default models;