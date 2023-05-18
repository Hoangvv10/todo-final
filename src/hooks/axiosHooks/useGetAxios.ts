import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../store/UserContext';

interface FetchResponse<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
}

const useGetAxios = <T>(url: string) => {
    const [response, setResponse] = useState<FetchResponse<T>>({
        data: null,
        error: null,
        isLoading: true,
    });

    const { userId } = useContext(UserContext);

    const fetchData = async () => {
        const result = await axios.get(url);
        setResponse({
            data: result.data,
            error: null,
            isLoading: false,
        });
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    return { data: response.data, error: response.error };
};

export default useGetAxios;
