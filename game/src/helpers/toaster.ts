import { ToastPosition, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

enum AlertType {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
}

function Alert(type: AlertType, message: string, time: number = 5) {
  const options = {
    position: 'top-right' as ToastPosition,
    autoClose: time * 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  toast[type](`${type.toUpperCase()}: ${message}`, options);
}

export { Alert, AlertType };
