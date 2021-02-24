import {Alert, AlertType} from './toaster';
import {AxiosError} from 'axios';

export default (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx and [401, 403]
    Alert(AlertType.ERROR, error.response.data, 10);
  } else if (error.request) {
    // The request was made but no response was received
    Alert(AlertType.ERROR, error.request, 10);
  } else {
    // Something happened in setting up the request that triggered an Error
    Alert(AlertType.ERROR, error.message, 10);
  }
};
