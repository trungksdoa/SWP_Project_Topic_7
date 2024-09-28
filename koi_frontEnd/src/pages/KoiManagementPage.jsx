import React, { useEffect } from "react";
import KoiManegement from "../components/ui/manage/KoiManegement";
import { useGetAllKoi } from "../hooks/koi/useGetAllKoi.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constant/config.js";
import { toast } from "react-toastify";

const KoiManagementPage = () => {
    const userLogin = useSelector((state) => state.manageUser.userLogin);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userLogin) {
            toast.warning("Let's Login or Register to use this feature !")
            navigate(PATH.HOME);
        }
    }, []);
    const { data: lstKoi } = useGetAllKoi();

    return (
        <div>
            <KoiManegement lstKoi={lstKoi} />
        </div>
    );
};

export default KoiManagementPage;