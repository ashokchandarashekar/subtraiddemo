import { STATUS_CODE, ERROR_MSGS } from './constant';
import { GlobleResponse } from './response';

const handleException = ( res: any, error: string | undefined) => {
  const obj = {
    res,
    status: STATUS_CODE.INTERNAL_SERVER_ERROR,
    msg: error || ERROR_MSGS.INTERNAL_SERVER_ERROR,
  };
  return GlobleResponse.error(obj);
};

export { handleException };
