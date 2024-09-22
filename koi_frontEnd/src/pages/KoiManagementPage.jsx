import React from 'react';
import KoiManegement from '../components/ui/manage/KoiManegement';
import { useGetAllKoi } from '../hooks/koi/useGetAllKoi.js';

const KoiManagementPage = () => {
    const { data: lstKoi } = useGetAllKoi();

    return (
        <div>
            <KoiManegement lstKoi={lstKoi} />
        </div>
    );
}

export default KoiManagementPage;