import * as Constant from './constant'

interface ResponseOptions {
  res: any; 
  headers?: any; 
  status?: number;
  msg?: string;
  data?: any;
}

class Response {
  statusCode: number = Constant.STATUS_CODE.OK;
  message: string = 'Request Success';
  errorMessage: string = 'Something went wrong, Kindly try again';

  success({ res, headers, status, msg, data }: ResponseOptions): void {
    if (headers) {
      res.set(headers);
    }
    if (!data) {
      this.statusCode = Constant.STATUS_CODE.NO_CONTENT;
    }
    res.status(status || this.statusCode).json({
      msg: msg || this.message,
      data: data,
    });
  }

  error({ res, headers, status, msg, data }: ResponseOptions): void {
    if (headers) {
      res.set(headers);
    }
    res.status(status || 400).json({
      msg: msg || this.errorMessage,
      data: data,
    });
  }
}

const GlobleResponse = new Response();

export { GlobleResponse };
