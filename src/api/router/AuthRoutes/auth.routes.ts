import express from 'express';
import * as registercontroller from '../../controller/Auth/register.controller';
import * as userLogincontroller from '../../controller/Auth/login.controller';

const router = express.Router();

// register user
router.post('/register/applicant', registercontroller.registerApplicant);
router.post('/register/broker', registercontroller.registerBroker);
router.post('/register/brokerage', registercontroller.registerBrokerage);

// all users signup :applicant/broker/brokerage
router.post('/register/user', registercontroller.registerUser);

// Login user's
router.post('/login', userLogincontroller.loginUser);

export default router;
