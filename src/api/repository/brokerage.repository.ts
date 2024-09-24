import db from '../../connection/sequelize-config';
import { BrokerageInstance } from '../model/brokerage.model';

export const createBrokerage = async (brokerageData: any): Promise<BrokerageInstance> => {
    try {
        const brokerage: BrokerageInstance = await db.Brokerage.create(brokerageData);
        return brokerage;
    } catch (err) {
        console.error('Error creating Brokerage:', err);
        throw err;
    }
};

export const findBrokerageByEmail = async (email: string): Promise<BrokerageInstance | null> => {
    try {
        const brokerage: BrokerageInstance | null = await db.Brokerage.findOne({ where: { email: email } });
        const brokerageData: any = brokerage?.get()
        return brokerageData;
    } catch (err) {
        console.error('Error retrieving Brokerage by Email:', err);
        throw err;
    }
};

export const findAllBrokerage = async (condition: any, includeOptions?: any): Promise<BrokerageInstance[]> => {
    try {
        const options: any = {
            where: condition,
            include: includeOptions,
            attributes: {
                exclude: ['password'] // Exclude the 'password' field from the result
            }, 
        };
        const brokerage: BrokerageInstance[] = await db.Brokerage.findAll(options);
        return brokerage;
    } catch (err) {
        console.error('Error retrieving Brokerage:', err);
        throw err;
    }
};

