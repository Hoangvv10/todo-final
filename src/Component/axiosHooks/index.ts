import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface ApiResponse<T> {
    data: T | null;
    error: AxiosError<unknown> | null;
}

const axiosGet = async <T>(url: string, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
        const response = await axios.get<T>(url, options);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error as AxiosError<unknown> };
    }
};

const axiosPost = async <T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
        const response = await axios.post<T>(url, data, options);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error as AxiosError<unknown> };
    }
};

const axiosPut = async <T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
        const response = await axios.put<T>(url, data, options);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error as AxiosError<unknown> };
    }
};

const axiosDel = async <T>(url: string, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
        const response = await axios.delete<T>(url, options);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error as AxiosError<unknown> };
    }
};

export { axiosGet, axiosPost, axiosPut, axiosDel };
