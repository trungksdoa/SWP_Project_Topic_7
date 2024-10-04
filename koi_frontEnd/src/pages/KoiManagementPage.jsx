import React, { useEffect } from "react";
import { useGetAllKoi } from "../hooks/koi/useGetAllKoi.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constant/config.js";
import { toast } from "react-toastify";
import KoiManagement from "../components/ui/manage/KoiManegement.jsx"
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent.jsx";

const KoiManagementPage = () => {
    const userLogin = useSelector((state) => state.manageUser.userLogin);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLogin) {
            toast.warning("Let's Login or Register to use this feature !");
            navigate(PATH.HOME);
        }
    }, []);

    const { data: lstKoi } = useGetAllKoi();

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