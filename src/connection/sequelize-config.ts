import { Sequelize } from 'sequelize';

import Applicant, { ApplicantInstance } from '../api/model/applicant.model';
import Broker, { BrokerInstance } from '../api/model/broker.model';
import Brokerage, { BrokerageInstance } from '../api/model/brokerage.model';
import Accountant, { AccountantInstance } from '../api/model/accountant.model';
import QuickBook, { QuickBookInstance } from '../api/model/quickbook.model';

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false // Set to true if you want to see SQL queries in the console 
    }
);

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

try {
    sequelize.sync({ alter: true });
    console.error("Success sync");
} catch (error) {
    console.error("error========================", error);
}


db.Applicant = Applicant(sequelize);
db.Brokerage = Brokerage(sequelize);
db.Broker = Broker(sequelize);
// db.Accountant = Accountant(sequelize);
db.QuickBook = QuickBook(sequelize);

// Define associations
db.Applicant.belongsTo(db.Broker, { foreignKey: 'brokerId', as: 'broker' });
db.Broker.belongsTo(db.Brokerage, { foreignKey: 'brokerageId', as: 'brokerage' });


// db.Applicant.belongsTo(db.Broker, { foreignKey: 'brokerId' });
// db.Broker.hasOne(db.Applicant, { foreignKey: 'brokerId' });

// db.Broker.belongsTo(db.Brokerage, { foreignKey: 'brokerageId' });
// db.Brokerage.hasOne(db.Broker, { foreignKey: 'brokerageId' });

export default db;
export { sequelize };

