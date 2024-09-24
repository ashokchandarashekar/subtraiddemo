import { DataTypes, Model, Sequelize } from 'sequelize';

interface BrokerAttributes {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    termCondition: boolean;
    brokerageId: number; // Foreign key referencing Brokerage
    contactNumber: number;
}

export interface BrokerInstance extends Model<BrokerAttributes>, BrokerAttributes { }

const Broker = (sequelize: Sequelize) => {
    const attributes = {
        brokerId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactNumber: {
            type: DataTypes.BIGINT,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        termCondition: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        brokerageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    };

    const Broker = sequelize.define<BrokerInstance>('broker', attributes);

    return Broker;
};

export default Broker;