import db from '../../connection/sequelize-config';
import { ApplicantInstance } from '../model/applicant.model';

export const createApplicant = async (applicantData: any): Promise<ApplicantInstance> => {
    try {
        const applicant: ApplicantInstance = await db.Applicant.create(applicantData);
        return applicant;
    } catch (err) {
        console.error('Error creating Applicant:', err);
        throw err;
    }
};

export const findApplicantByEmail = async (email: string): Promise<ApplicantInstance | null> => {
    try {
        const applicant: ApplicantInstance | null = await db.Applicant.findOne({ where: { email: email } });
        const applicantData: any = applicant?.get()
        return applicantData;
    } catch (err) {
        console.error('Error retrieving Applicant by Email:', err);
        throw err;
    }
};

export const findAllApplicants = async (condition: any, includeOptions?: any): Promise<ApplicantInstance[]> => {
    try {
        const options: any = {
            where: condition,
            include: includeOptions,
            attributes: {
                exclude: ['password'] // Exclude the 'password' field from the result
            }, 
        };
        const brokers: ApplicantInstance[] = await db.Applicant.findAll(options);
        return brokers;
    } catch (err) {
        console.error('Error retrieving Brokers:', err);
        throw err;
    }
};

export const findApplicantById = async (id: string): Promise<ApplicantInstance | null> => {
    try {
        const applicant: ApplicantInstance | null = await db.Applicant.findByPk(id, {
            include: [{ model: db.Broker, as: 'broker' }], // Include the associated Broker
        });
        return applicant;
    } catch (err) {
        console.error('Error retrieving Applicant:', err);
        throw err;
    }
};

export const updateApplicant = async (id: string, updateData: any): Promise<boolean> => {
    try {
        const [numUpdated, _] = await db.Applicant.update(updateData, {
            where: { id: id },
        });
        return numUpdated === 1;
    } catch (err) {
        console.error('Error updating Applicant:', err);
        throw err;
    }
};

export const deleteApplicant = async (id: string): Promise<boolean> => {
    try {
        const numDeleted: number = await db.Applicant.destroy({
            where: { id: id },
        });
        return numDeleted === 1;
    } catch (err) {
        console.error('Error deleting Applicant:', err);
        throw err;
    }
};
