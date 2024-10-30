import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetPondById = (pondId) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchPond = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/ponds/${pondId}`);
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (pondId) {
            fetchPond().catch(err => console.error('Unhandled error in fetchPond:', err));
        } else {
            setLoading(false);
        }

        return () => {
        };
    }, [pondId]);

    return { data, error, loading };
};