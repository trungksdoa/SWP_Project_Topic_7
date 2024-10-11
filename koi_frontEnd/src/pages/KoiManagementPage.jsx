import React, { useEffect } from "react";
import { useGetAllKoi } from "../hooks/koi/useGetAllKoi.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constant/config.js";
import { toast } from "react-toastify";
import KoiManagement from "../components/ui/manage/KoiManegement.jsx"
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent.jsx";
import { useTranslation } from 'react-i18next'


const KoiManagementPage = () => {
    const userLogin = useSelector((state) => state.manageUser.userLogin);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLogin) {
            toast.warning(t("Please sign in or create an account to access this feature."));
            navigate(PATH.HOME);
        }
    }, []);

    const { data: lstKoi } = useGetAllKoi();
    const { t } = useTranslation();

    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Koi Management' }
    ];

    return (
        <div>
            <BreadcrumbComponent items={breadcrumbItems} />
            <KoiManagement lstKoi={lstKoi} />
        </div>
    );
};

export default KoiManagementPage;