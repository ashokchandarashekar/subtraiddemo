import httpStatus from "http-status";
import { Request, Response, NextFunction } from 'express';
import * as applicantRepository from '../../repository/applicant.repository';
import * as brokerRepository from '../../repository/broker.repository';
import * as brokerageRepository from '../../repository/brokerage.repository';
import * as JoiValidator from '../../validator/joi-validation';
import { GlobleResponse } from '../../../util/response'
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from '../../../util/constant'
import APIError from '../../../util/APIError';
import { UserType } from '../../validator/enum'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


/**
 * Login Broker , Brokerage and Applicant with UserType, email and password
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType, email, password } = req.body;

        const { error } = JoiValidator.login({ email, userType });
        if (error) return next(new APIError(error.details[0].message, httpStatus.BAD_REQUEST, true));

        var userInfo: any;
        switch (userType) {
            case UserType.Applicant: userInfo = await applicantRepository.findApplicantByEmail(email);
                break;
            case UserType.Broker: userInfo = await brokerRepository.findBrokerByEmail(email);
                break;
            case UserType.Brokerage: userInfo = await brokerageRepository.findBrokerageByEmail(email);
                break;
            default: return next(new APIError(ERROR_MSGS.INVALID_USER_TYPE, httpStatus.BAD_REQUEST, true));
        }

        if (!userInfo) return next(new APIError(ERROR_MSGS.ACCOUNT_NOT_FOUND, httpStatus.BAD_REQUEST, true));
        if (!bcrypt.compareSync(password, userInfo.password)) return next(new APIError(ERROR_MSGS.INVALID_LOGIN, httpStatus.BAD_REQUEST, true)); 

        var payload = {
            id: userType === UserType.Applicant ? userInfo.applicantId : userType === UserType.Broker ? userInfo.brokerId : userType === UserType.Brokerage ? userInfo.brokerageId : null,
            email,
            userType: userType
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN });
        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.OK,
            msg: INFO_MSGS.SUCCESSFUL_LOGIN,
            data: {
                userType:userType,
                email,
                token
            },
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true))
    }
};

