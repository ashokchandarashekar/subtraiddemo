import { DataTypes, Model, Sequelize } from 'sequelize';

interface ApplicantAttributes {
    companyName: string;
    email: string;
    password: string;
    officeAddress: string;
    termCondition: boolean;
    brokerId: number; // New field for the foreign key
}

export interface ApplicantInstance extends Model<ApplicantAttributes>, ApplicantAttributes { }

const Applicant = (sequelize: Sequelize) => {
    const attributes = {
        applicantId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        companyName: {
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
        officeAddress: {
            type: DataTypes.STRING,
        },
        brokerId: {
            type: DataTypes.INTEGER,
        },
        termCondition: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    };

    const Applicant = sequelize.define<ApplicantInstance>('applicant', attributes);

    return Applicant;
};

export default Applicant;



