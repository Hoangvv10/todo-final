import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
    data: T | null;
    error: AxiosError<unknown> | null;
    header?: any;
}

const useDeleteAxios = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await axios.delete<T>(url, data);
    return { data: response.data, error: null };
};

export default useDeleteAxios;
