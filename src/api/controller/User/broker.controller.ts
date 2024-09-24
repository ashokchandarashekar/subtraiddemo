import httpStatus from "http-status";
import { Request, Response, NextFunction } from 'express';
import db from '../../../connection/sequelize-config';
import * as brokerRepository from '../../repository/broker.repository';
import { GlobleResponse } from '../../../util/response'
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from '../../../util/constant'
import APIError from '../../../util/APIError';

/**
 * Get All Broker Details  
 * associated with Brokerage model using include:model
 */
export const getAllBroker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const condition = {};
        const includeOptions = [
            { model: db.Brokerage, as: 'brokerage', attributes: { exclude: ['password'] } }
        ];

        const getAllBrokers = await brokerRepository.findAllBrokers(condition, includeOptions);
        if (!getAllBrokers) return next(new APIError(ERROR_MSGS.USER_NOT_FOUND, httpStatus.BAD_REQUEST, true));

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.OK,
            msg: INFO_MSGS.SUCCESS,
            data: getAllBrokers
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true));
    }
};