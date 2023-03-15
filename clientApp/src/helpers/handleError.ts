import { Alert, AlertType } from './toaster';
import { AxiosError } from 'axios';

export default (error: AxiosError): string => {
  let message = '';
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx and [401, 403]
    message = error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    message = error.request;
  } else {
    // Something happened in setting up the request that triggered an Error
    message = error.message;
  }
  console.log('ClientError', message);
  Alert(AlertType.ERROR, message, 10);

  return message;
};
