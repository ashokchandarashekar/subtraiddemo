import express from 'express';
import * as applicantController from '../../controller/User/applicant.controller';
import * as brokerController from '../../controller/User/broker.controller';
import * as brokerageController from '../../controller/User/brokerage.controller';

const router = express.Router();

// Applicants Routes
router.put('/applicant/update/:id', applicantController.updateApplicantProfile);
router.get('/applicant/get/:id', applicantController.getApplicantById);


// Brokers Routes
router.get('/broker/getall', brokerController.getAllBroker);


// Brokerage Routes
router.get('/brokerage/getall', brokerageController.getAllBrokerage);

export default router;
