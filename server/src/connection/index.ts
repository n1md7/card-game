import {Sequelize} from 'sequelize-typescript'
import path from 'path';

const connection = new Sequelize('sqlite::memory:');
connection.addModels([path.join(__dirname + '/../models')]);

export default connection;