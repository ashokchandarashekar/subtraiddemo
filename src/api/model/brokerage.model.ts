import { DataTypes, Model, Sequelize } from 'sequelize';

interface BrokerageAttributes {
    legalName: string;
    contactNumber: number;
    email: string;
    password: string;
    termCondition: boolean;
}

export interface BrokerageInstance extends Model<BrokerageAttributes>, BrokerageAttributes { }

const Brokerage = (sequelize: Sequelize) => {
    const attributes = {
        brokerageId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        legalName: {
            type: DataTypes.STRING,
        },
        contactNumber: {
            type: DataTypes.BIGINT,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        termCondition: {
            type: DataTypes.BOOLEAN,
        },
    };

    const Brokerage = sequelize.define<BrokerageInstance>('brokerage', attributes);

    return Brokerage;
};

export default Brokerage;
