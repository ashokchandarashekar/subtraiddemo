import { sequelize } from './sequelize-config';
import { error, info } from '../common/logger';

async function connectToDatabase(): Promise<boolean> {
    try {
        await sequelize.authenticate();
        info('Database Connection Established Successfully...');
        return true;
    } catch (errors: any) {
        console.log("errors", errors)
        error('Failed to connect to database:', errors);
        return false;
    }
}

export { connectToDatabase }
