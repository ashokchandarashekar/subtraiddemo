import { DataTypes, Model, Sequelize } from 'sequelize';

interface AccountantAttributes {
    accountantId: number;
    name: string;
    email: string;
    password: string;
    contactNumber: number;
    termCondition: boolean;
}

export interface AccountantInstance extends Model<AccountantAttributes>, AccountantAttributes { }

const Accountant = (sequelize: Sequelize) => {
    const attributes = {
        accountantId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactNumber: {
            type: DataTypes.BIGINT,
        },
        termCondition: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    };

    const Accountant = sequelize.define<AccountantInstance>('accountant', attributes);

    return Accountant;
};

export default Accountant;
