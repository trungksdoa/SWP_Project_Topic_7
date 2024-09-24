import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetPondById = (pondId) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(`useGetPondById hook called with pondId: ${pondId}`);

        const fetchPond = async () => {
            console.log('Starting to fetch pond data...');
            setLoading(true);
            try {
                console.log(`Making API call to /api/ponds/${pondId}`);
                const response = await axios.get(`/api/ponds/${pondId}`);
                console.log('API response received:', response.data);
                setData(response.data);
                console.log('Data state updated with API response');
            } catch (err) {
                console.error('Error occurred while fetching pond data:', err);
                setError(err);
                console.log('Error state updated');
            } finally {
                setLoading(false);
                console.log('Loading state set to false');
            }
        };

        if (pondId) {
            console.log(`pondId is truthy (${pondId}), calling fetchPond`);
            fetchPond().catch(err => console.error('Unhandled error in fetchPond:', err));
        } else {
            console.log('pondId is falsy, skipping API call');
            setLoading(false);
        }

        return () => {
            console.log('Cleanup function called for useGetPondById');
        };
    }, [pondId]);

    console.log('useGetPondById hook returning:', { data, error, loading });
    return { data, error, loading };
};