import httpStatus from "http-status";
import { Request, Response, NextFunction } from 'express';
import { ApplicantInstance } from '../../model/applicant.model';
import * as applicantRepository from '../../repository/applicant.repository';
import { GlobleResponse } from '../../../util/response'
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from '../../../util/constant'
import APIError from '../../../util/APIError';


/**
 * Update Applicant Profile By Id
 */
export const updateApplicantProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id: string = req.params.id;
        const updateApplicant: boolean = await applicantRepository.updateApplicant(id, req.body);

        if (!updateApplicant) return next(new APIError(ERROR_MSGS.UPDATED_FAILED, httpStatus.BAD_REQUEST, true));

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.OK,
            msg: INFO_MSGS.UPDATED_SUCCESSFULLY
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true));
    }
};

/**
 * Get Applicant Profile Details By Id 
 * associated with Broker model using include:model
 */
export const getApplicantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id: string = req.params.id;

        const findOneApplicant: ApplicantInstance = await applicantRepository.findApplicantById(id);
        if (!findOneApplicant) return next(new APIError(ERROR_MSGS.USER_NOT_FOUND, httpStatus.BAD_REQUEST, true));

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.OK,
            msg: INFO_MSGS.SUCCESS,
            data: findOneApplicant
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true))
    }
};
