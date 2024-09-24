import db from '../../connection/sequelize-config';
import { BrokerInstance } from '../model/broker.model';

export const createBroker = async (brokerData: any): Promise<BrokerInstance> => {
    try {
        const broker: BrokerInstance = await db.Broker.create(brokerData);
        return broker;
    } catch (err) {
        console.error('Error creating Broker:', err);
        throw err;
    }
};

export const findBrokerByEmail = async (email: string): Promise<BrokerInstance | null> => {
    try {
        const broker: BrokerInstance | null = await db.Broker.findOne({ where: { email: email } });
        const brokerData: any = broker?.get()
        return brokerData;
    } catch (err) {
        console.error('Error retrieving Broker by Email:', err);
        throw err;
    }
};

export const findAllBrokers = async (condition: any, includeOptions?: any): Promise<BrokerInstance[]> => {
    try {
        const options: any = {
            where: condition,
            include: includeOptions,
            attributes: {
                exclude: ['password'] // Exclude the 'password' field from the result
            }, 
        };
        const brokers: BrokerInstance[] = await db.Broker.findAll(options);
        return brokers;
    } catch (err) {
        console.error('Error retrieving Brokers:', err);
        throw err;
    }
};

