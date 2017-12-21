import axios from 'axios/index';
import sleep from '../utils/sleep';

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

axios.interceptors.response.use(async (response) => {
  // get original request configuration
  const originalRequest = response.config;

  // if request is empty
  if (isBlank(response.data)) {
    if (originalRequest.retry === undefined) {
      originalRequest.retry = 1;
    }

    // check if not allready refreshing
    if (originalRequest.retry <= 50) {
      originalRequest.retry += 1;

      // wait 1 s berore retrying request
      await sleep(1);

      // try refresh
      return axios(originalRequest);
    }
  }

  return response;
}, error => error);

export default axios;
