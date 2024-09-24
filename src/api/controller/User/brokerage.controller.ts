import httpStatus from "http-status";
import { Request, Response, NextFunction } from 'express';
import * as brokerageRepository from '../../repository/brokerage.repository';
import { GlobleResponse } from '../../../util/response'
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from '../../../util/constant'
import APIError from '../../../util/APIError';


/**
 * Get All Applicants Details  
 * associated with Broker model using include:model
 */
export const getAllBrokerage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const condition = {};
    
        const getAllBrokerage = await brokerageRepository.findAllBrokerage(condition);
        if (!getAllBrokerage) return next(new APIError(ERROR_MSGS.USER_NOT_FOUND, httpStatus.BAD_REQUEST, true));

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.OK,
            msg: INFO_MSGS.SUCCESS,
            data: getAllBrokerage
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true));
    }
};