import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ERROR_MSGS } from "src/util/constant";
import APIError from "src/util/APIError";
import { UserType } from "../validator/enum";
import * as applicantRepository from "../repository/applicant.repository";
import * as brokerRepository from "../repository/broker.repository";
import * as brokerageRepository from "../repository/brokerage.repository";

/**
 * autorize middleware to check if user is logged in or not
 */
export async function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string, error: string;

    if (req.headers.authorization) {
      if (typeof req.headers.authorization !== "string" || req.headers.authorization.indexOf("Bearer ") === -1) {
        error = ERROR_MSGS.BAD_AUTH;
      } else {
        token = req.headers.authorization.split(" ")[1];
      }
    } else {
      error = ERROR_MSGS.TOKEN_MISSING;
    }

    if (!token && error) {
      return next(new APIError(error, httpStatus.UNAUTHORIZED, true));
    }

    return jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decoded: { id: any; userType: any; email: any }) => {
        if (err || !decoded || !decoded.id || !decoded.userType || !decoded.email) {
          return next(new APIError(ERROR_MSGS.BAD_TOKEN, httpStatus.UNAUTHORIZED, true));
        }

        let userObj: any;
        const userType = decoded.userType;

        switch (userType) {
          case UserType.Applicant:
            userObj = await applicantRepository.findApplicantByEmail(decoded.email);
            break;
          case UserType.Broker:
            userObj = await brokerRepository.findBrokerByEmail(decoded.email);
            break;
          case UserType.Brokerage:
            userObj = await brokerageRepository.findBrokerageByEmail(decoded.email);
            break;
        }

        if (!userObj) return next(new APIError(ERROR_MSGS.USER_NOT_FOUND, httpStatus.NOT_FOUND, true));

        userObj = {
          id: userType === UserType.Applicant ? userObj.applicantId : userType === UserType.Broker ? userObj.brokerId : userType === UserType.Brokerage ? userObj.brokerageId : null,
          ...userObj,
        };

        req.user = userObj;
        return next();
      }
    );
  } catch (err) {
    return next(new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true));
  }
}
