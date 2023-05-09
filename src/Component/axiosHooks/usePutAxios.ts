import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface ApiResponse<T> {
    data: T | null;
    error: AxiosError<unknown> | null;
}

const usePutAxios = async <T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await axios.put<T>(url, data, options);
    return { data: response.data, error: null };
};

export default usePutAxios;
