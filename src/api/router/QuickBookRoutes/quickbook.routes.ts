import express from 'express';
import * as quickbookcontroller from '../../controller/QuickBook/quickbook.controller';

const router = express.Router();

// QuickBook fetch Details Routes 
router.get('/get-comapny-info', quickbookcontroller.getCompanyInfo);
router.get('/get-all-comapny-info', quickbookcontroller.getAllCompanyInfo);
router.get('/get-all-invoices', quickbookcontroller.getAllInvoices);
router.get('/get-all-customers', quickbookcontroller.getAllCustomers);
router.get('/get-profit-loss-report', quickbookcontroller.getReportProfitAndLossDetail);


// QuickBook OAuth Routes For token 
router.get('/quickBookAuth-token', quickbookcontroller.quickBookAuth);
router.get('/oauthCallback', quickbookcontroller.oauthCallback);
export default router;
