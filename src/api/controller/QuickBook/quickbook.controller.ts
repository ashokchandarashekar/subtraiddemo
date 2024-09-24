import QuickBooks from "node-quickbooks";
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import APIError from '../../../util/APIError';
import moment from "moment";
import * as quickbookRepository from '../../repository/quickbook.repository';
import OAuthClient, { Token } from 'intuit-oauth';
import { GlobleResponse } from '../../../util/response'
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from '../../../util/constant'
import { handleException } from '../../../util/exception'
const fetch = async (...args: any[]) => {
  const { default: fetch } = await import('node-fetch');
  return fetch.apply(null, args);
};


const envVars = process.env;

// ------------------------------ Start of Initialize QuickBooks OAuth client ------------------------------
// Initialize QuickBooks OAuth client
const oauthClient = new OAuthClient({
  clientId: envVars.QB_Client_ID,
  clientSecret: envVars.QB_Client_Secret_ID,
  environment: envVars.QBO_ENV,
  redirectUri: envVars.QB_REDIRECT_URL,
});

/**
 * redirect to authorizeUri for connect QuickBook
 */
export async function quickBookAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Check if OAuth tokens are available, if not, initiate OAuth flow
    console.log("isAccessTokenValid", oauthClient.isAccessTokenValid())
    if (!oauthClient.isAccessTokenValid()) {
      // Redirect user to QuickBooks for authorization
      const authUri = oauthClient.authorizeUri({
        scope: [
          OAuthClient.scopes.Accounting,
          OAuthClient.scopes.OpenId,
          OAuthClient.scopes.Address,
          OAuthClient.scopes.Phone,
          OAuthClient.scopes.Email,
          OAuthClient.scopes.Profile
        ]
      });
      res.redirect(authUri);
      return;
    }

    // Use the existing access token to update value in db
    const accessToken: Token = oauthClient.getToken();
    const userId = 1

    if (accessToken) {
      await updateOrInsertQuickBookData(userId, accessToken);
    }
    const obj = {
      res,
      msg: INFO_MSGS.SUCCESS,
      status: STATUS_CODE.OK,
    };
    return GlobleResponse.success(obj);

  } catch (error) {
    console.log('[quickBookAuth.catch]', error);
    return handleException(res, error);
  }
}

/**
 * Call 
 * Callback route for OAuth authorization
 */
export async function oauthCallback(req: Request, res: Response) {
  try {
    const authResponse = await oauthClient.createToken(req.url);
    // Store the tokens securely (e.g., in a database) for future API requests
    const userId = 1
    await updateOrInsertQuickBookData(userId, authResponse.token);
    const obj = {
      res,
      msg: INFO_MSGS.SUCCESS,
      status: STATUS_CODE.OK,
    };
    return GlobleResponse.success(obj);
  } catch (error) {
    console.log('[oauthCallback.catch]', error);
    return handleException(res, error);
  }
}

// update or insert Quickbook Token Data Using UserId
async function updateOrInsertQuickBookData(userId, accessToken) {
  console.log("accessToken-Node", accessToken)
  const QBOData = {
    userId,
    access_token: accessToken.access_token,
    refresh_token: accessToken.refresh_token,
    realmeId: accessToken.realmId,
    access_token_expiry: moment().add(accessToken.expires_in, 'seconds'),
    refresh_token_expiry: moment().add(accessToken.x_refresh_token_expires_in, 'seconds')
  };
  const quickbookInfo = await quickbookRepository.findQuickbookByUserId(userId);
  if (quickbookInfo) {
    await quickbookRepository.updateData(quickbookInfo.quickBookId, QBOData);
  } else {
    await quickbookRepository.createQuickbook(QBOData);
  }
}


// ------------------------------ End of Initialize QuickBooks OAuth client ------------------------------


/**
 *  validate old value and update tokens
*/
async function updateTokens(oldData) {
  try {

    // console.log("oldData", oldData)
    let tokens: any
    if (oldData && oldData.refresh_token_expiry && moment(oldData.refresh_token_expiry) > moment()) {
      tokens = await updateAccessTokens(oldData);
      // console.log("tokens", tokens)

      if (!tokens || tokens === null || (tokens && (!tokens.access_token || tokens.access_token === null || !tokens.refresh_token || tokens.refresh_token === null))) {
        await updateTokens(oldData);
      }
    }

    return tokens;
  } catch (error) {
    console.log(error);
    return { tokenUpdated: false };
  }
}

/**
 * update access tokens
 */
async function updateAccessTokens(data) {
  let auth = Buffer.from(envVars.QB_Client_ID + ':' + envVars.QB_Client_Secret_ID).toString('base64');
  const url = `https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer`;

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + auth,
  };

  let formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', data.refresh_token);
  console.log("runUpdateAcess")
  const tokens = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  })
    .then((res) => {
      return res.json();
    });
  return tokens;
}

/**
 * qbo configuration
 */
async function qboConfig() {
  try {
    console.log('in==qboConfig=>')
    var userId = 1
    let oldData = await quickbookRepository.findQuickbookByUserId(userId)

    const tokens = await updateTokens(oldData);
    // console.log('in=2=qboConfig=>', tokens)

    if (tokens && tokens.access_token && tokens.refresh_token) {
      var updatedQBData = {
        userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        realmeId: oldData.realmeId,
        access_token_expiry: moment().add(1, 'hours'),
        refresh_token_expiry: moment().add(100, 'days'),
      };

      await quickbookRepository.updateData(oldData.quickBookId, updatedQBData);
      console.log("token updated successfully!!!!")
    }

    var qbo;
    console.log("oldData", oldData)
    if (tokens && !!tokens.access_token && !!tokens.refresh_token) {
      qbo = new QuickBooks(
        envVars.QB_Client_ID,
        envVars.QB_Client_Secret_ID,
        tokens.access_token, // Replace with your actual access token
        false, // no token secret for oAuth 2.0
        updatedQBData.realmeId,// envVars.QB_company_ID,
        true, // use the sandbox?
        true, // enable debugging?
        envVars.QB_minorversion, // set minorversion, or null for the latest version
        '2.0', // oAuth version
        tokens.refresh_token
      );
    }

    return qbo;
  } catch (error) {
    console.log(error);
    throw new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true);
  }
}


// ------------------------------ QBO API'S START ------------------------------

/**
 * Get company info
 */
export async function getCompanyInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const companyId = envVars.QB_company_ID;
    const qbo = await qboConfig();

    qbo.getCompanyInfo(companyId, (err: any, companyInfo: any) => {
      // qbo.getCompanyInfo('', (err: any, companyInfo: any) => {
      if (companyInfo) {
        // console.log('in3===>')
        // res.json(companyInfo);
        const obj = {
          res,
          msg: INFO_MSGS.SUCCESS,
          status: STATUS_CODE.OK,
          data: companyInfo,
        };
        return GlobleResponse.success(obj);
      } else {
        console.log('[getCompanyInfo.else]', err)
        return handleException(res, err);
      }
    });
  } catch (error) {
    console.log('[getCompanyInfo.catch]', error)
    return handleException(res, error);
    // next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true));
  }
}

/**
 * Get all company info
 */
export async function getAllCompanyInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const qbo = await qboConfig();

    // qbo.findInvoices({
    // qbo.findCustomers({
    // qbo.findBills({
    qbo.findCompanyInfos({
      fetchAll: true
    }, (err: any, AllCompanyInfo: any) => {
      if (AllCompanyInfo) {
        // console.log('in3===>')
        // res.json(AllCompanyInfo);
        const obj = {
          res,
          msg: INFO_MSGS.SUCCESS,
          status: STATUS_CODE.OK,
          data: AllCompanyInfo,
        };
        return GlobleResponse.success(obj);
      } else {
        console.log('[getAllCompanyInfo.else]', err)
        return handleException(res, err);
      }
    });
  } catch (error) {
    console.log('[getAllCompanyInfo.catch]', error)
    return handleException(res, error);
    // next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true));
  }
}

/**
 * Get all Customers 
 */
export async function getAllCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const qbo = await qboConfig();

    qbo.reportCustomerSales({}, (err: any, getAllCustomers: any) => {
      if (getAllCustomers) {
        const obj = {
          res,
          msg: INFO_MSGS.SUCCESS,
          status: STATUS_CODE.OK,
          data: getAllCustomers,
        };
        return GlobleResponse.success(obj);
      } else {
        console.log('[getgetAllCustomers.else]', err)
        return handleException(res, err);
      }
    });
  } catch (error) {
    console.log('[getgetAllCustomers.catch]', error)
    return handleException(res, error);
  }
}

/**
 * Get reportProfitAndLossDetail info
 */
export async function getReportProfitAndLossDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const qbo = await qboConfig();
    // console.log('in2===>')
    qbo.reportProfitAndLossDetail({
      fetchAll: true
    }, (err: any, reportPnL: any) => {
      if (reportPnL) {
        // console.log('in3===>')
        console.log('reportPnL===>', reportPnL)

        const obj = {
          res,
          msg: INFO_MSGS.SUCCESS,
          status: STATUS_CODE.OK,
          data: reportPnL,
        };
        return GlobleResponse.success(obj);
      } else {
        console.log('[getReportProfitAndLossDetail.else]', err)
        return handleException(res, err);
      }
    });
  } catch (error) {
    console.log('[getReportProfitAndLossDetail.catch]', error)
    return handleException(res, error);
    // next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true));
  }
}

/**
 * Get all Invoices
 */
export async function getAllInvoices(req: Request, res: Response, next: NextFunction) {
  try {
    const qbo = await qboConfig();
    // console.log('in2===>')

    qbo.findInvoices({
      fetchAll: true
    }, (err: any, allInvoices: any) => {
      if (allInvoices) {
        // console.log('in3===>')
        const obj = {
          res,
          msg: INFO_MSGS.SUCCESS,
          status: STATUS_CODE.OK,
          data: allInvoices,
        };
        return GlobleResponse.success(obj);
      } else {
        console.log('[getAllInvoices.else]', err)
        return handleException(res, err);
      }
    });
  } catch (error) {
    console.log('[getAllInvoices.catch]', error)
    return handleException(res, error);
    // next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR, true));
  }
}

// ------------------------------ QBO API'S END ------------------------------