import httpStatus from "http-status";
import db from "../../../connection/sequelize-config";
import { ApplicantInstance } from '../../model/applicant.model';
import { BrokerageInstance } from '../../model/brokerage.model';
import { BrokerInstance } from '../../model/broker.model';
import { Request, Response, NextFunction } from 'express';
import * as applicantRepository from '../../repository/applicant.repository';
import * as brokerRepository from '../../repository/broker.repository';
import * as brokerageRepository from '../../repository/brokerage.repository';
const Op = db.Sequelize.Op;
import * as JoiValidator from '../../validator/joi-validation';
import { GlobleResponse } from '../../../util/response'
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from '../../../util/constant'
import APIError from '../../../util/APIError';
import { UserType } from '../../validator/enum'
import bcrypt from 'bcrypt'


/**
 * Register a new Applicant with email and password
 */
export const registerApplicant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { companyName, email, password, termCondition } = req.body;

        const { error } = JoiValidator.registerWithEmailAndPassword({ email, password });
        if (error) return next(new APIError(error.details[0].message, httpStatus.BAD_REQUEST, true));

        const existApplicant: ApplicantInstance = await applicantRepository.findApplicantByEmail(email);
        if (existApplicant) return next(new APIError(ERROR_MSGS.EMAIL_EXISTS, httpStatus.BAD_REQUEST, true));

        // Encrypt password By Bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        // Create User Document in Mongodb
        const createApplicant: ApplicantInstance = await applicantRepository.createApplicant({
            companyName,
            email,
            password: passwordHash,
            termCondition
        });

        console.log("createApplicant", createApplicant)

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.CREATED,
            msg: INFO_MSGS.SUCCESSFUL_REGISTER,
            data: {
                email,
            },
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true))
    }
};


/**
 * Register a new Broker with email and password
 */
export const registerBroker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName, contactNumber, email, password, brokerageId, termCondition } = req.body;

        const { error } = JoiValidator.registerBroker({ email, password, brokerageId });
        if (error) return next(new APIError(error.details[0].message, httpStatus.BAD_REQUEST, true));

        const existBroker: BrokerInstance = await brokerRepository.findBrokerByEmail(email);
        if (existBroker) return next(new APIError(ERROR_MSGS.EMAIL_EXISTS, httpStatus.BAD_REQUEST, true));

        // Encrypt password By Bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        // Create User Document in Mongodb
        const createBroker: BrokerInstance = await brokerRepository.createBroker({
            firstName,
            lastName,
            contactNumber,
            email,
            password: passwordHash,
            termCondition,
            brokerageId
        });

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.CREATED,
            msg: INFO_MSGS.SUCCESSFUL_REGISTER,
            data: {
                email,
            },
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true))
    }
};


/**
 * Register a new Brokerage with email and password
 */
export const registerBrokerage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { legalName, email, password, termCondition } = req.body;

        const { error } = JoiValidator.registerWithEmailAndPassword({ email, password });
        if (error) return next(new APIError(error.details[0].message, httpStatus.BAD_REQUEST, true));

        const existBrokerage: BrokerageInstance = await brokerageRepository.findBrokerageByEmail(email);
        if (existBrokerage) return next(new APIError(ERROR_MSGS.EMAIL_EXISTS, httpStatus.BAD_REQUEST, true));

        // Encrypt password By Bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        // Create User Document in Mongodb
        const createBrokerage: BrokerageInstance = await brokerageRepository.createBrokerage({
            legalName,
            email,
            password: passwordHash,
            termCondition
        });

        // console.log("createBrokerage", createBrokerage)

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.CREATED,
            msg: INFO_MSGS.SUCCESSFUL_REGISTER,
            data: {
                email,
            },
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true))
    }
};


/**
 * Register a new User with User Type and email and password
 * Applicant - Broker - Brokerage
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType, userData } = req.body;

        let validationSchema: any, repositoryFunction: any, existingUser: any;

        switch (userType) {
            case UserType.Applicant:
                validationSchema = JoiValidator.registerWithEmailAndPassword({
                    email: userData.email,
                    password: userData.password,
                });
                existingUser = await applicantRepository.findApplicantByEmail(userData.email);
                repositoryFunction = applicantRepository.createApplicant;
                break;

            case UserType.Broker:
                validationSchema = JoiValidator.registerBroker({
                    email: userData.email,
                    password: userData.password,
                    brokerageId: userData.brokerageId,
                });
                existingUser = await brokerRepository.findBrokerByEmail(userData.email);
                repositoryFunction = brokerRepository.createBroker;
                break;

            case UserType.Brokerage:
                validationSchema = JoiValidator.registerWithEmailAndPassword({
                    email: userData.email,
                    password: userData.password,
                });
                existingUser = await brokerageRepository.findBrokerageByEmail(userData.email);
                repositoryFunction = brokerageRepository.createBrokerage;
                break;

            default: return next(new APIError(ERROR_MSGS.INVALID_USER_TYPE, httpStatus.BAD_REQUEST, true));
        }

        const { error } = validationSchema;
        if (error) {
            return next(new APIError(error.details[0].message, httpStatus.BAD_REQUEST, true));
        }
        if (existingUser) {0
            return next(new APIError(ERROR_MSGS.EMAIL_EXISTS, httpStatus.BAD_REQUEST, true));
        }

        // Encrypt password By Bcrypt
        const passwordHash = await bcrypt.hash(userData.password, 10);

        // Create User Document
        const createUser = await repositoryFunction({
            ...userData,
            password: passwordHash,
        });

        // Send Response To Client
        const obj = {
            res,
            status: STATUS_CODE.CREATED,
            msg: INFO_MSGS.SUCCESSFUL_REGISTER,
            data: {
                email: userData.email,
            },
        };
        return GlobleResponse.success(obj);
    } catch (error) {
        return next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true))
    }
};

