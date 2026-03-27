import axios, { AxiosInstance } from 'axios'

let axiosClient = axios.create({ 
    baseURL: `${process.env.SERVER_API}`,
    withCredentials: true,
    withXSRFToken: true
}) as AxiosInstance

export default axiosClient