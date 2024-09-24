import db from '../../connection/sequelize-config';
import { QuickBookInstance } from '../model/quickbook.model';

export const createQuickbook = async (quickbookData: any): Promise<QuickBookInstance> => {
    try {
        const quickbook: QuickBookInstance = await db.QuickBook.create(quickbookData);
        return quickbook;
    } catch (err) {
        console.error('Error creating Quickbook:', err);
        throw err;
    }
};

export const findQuickbookByUserId = async (userId: number): Promise<QuickBookInstance | null> => {
    try {
        const quickinfo: QuickBookInstance | null = await db.QuickBook.findOne({ where: { userId: userId } });
        const quickbookData: any = quickinfo?.get()
        return quickbookData;
    } catch (err) {
        console.error('Error retrieving Quickbook by Email:', err);
        throw err;
    }
};
export const findQuickbookById = async (quickBookId: string): Promise<QuickBookInstance | null> => {
    try {
        const quickbook: QuickBookInstance | null = await db.QuickBook.findOne({ where: { quickBookId: quickBookId } });
        const quickbookData: any = quickbook?.get()
        return quickbookData;
    } catch (err) {
        console.error('Error retrieving Quickbook by Email:', err);
        throw err;
    }
};

export const updateData = async (quickBookId: number, updateData: any): Promise<boolean> => {
    try {
        const [numUpdated, _] = await db.QuickBook.update(updateData, {
            where: { quickBookId: quickBookId },
        });
        return numUpdated === 1;
    } catch (err) {
        console.error('Error updating Applicant:', err);
        throw err;
    }
};

export const findAllQuickbook = async (condition: any, includeOptions?: any): Promise<QuickBookInstance[]> => {
    try {
        const options: any = {
            where: condition,
            include: includeOptions,
            attributes: {
                exclude: ['password'] // Exclude the 'password' field from the result
            }, 
        };
        const quickbook: QuickBookInstance[] = await db.QuickBook.findAll(options);
        return quickbook;
    } catch (err) {
        console.error('Error retrieving Quickbook:', err);
        throw err;
    }
};

