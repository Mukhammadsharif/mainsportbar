import axios from 'axios';

export const backendUrl = 'https://mainsportbar.website/';

export const domain = backendUrl.endsWith('/')
  ? backendUrl.substr(0, backendUrl.length - 1)
  : backendUrl;

//  Add Base URL and change snake_case to camelCase
const baseAxios = axios.create({
  baseURL: `${domain}`,
});

baseAxios.interceptors.request.use(config => ({
  ...config,
}));

export default baseAxios;
