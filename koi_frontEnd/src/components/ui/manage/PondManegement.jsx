import React, { useState } from 'react';
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input } from "antd";
import { toast } from "react-toastify";
import { useUpdatePond } from '../../../hooks/koi/useUpdatePond'; // Assuming you have this hook
import { managePondActions } from '../../../store/managePond/slice';
import { LOCAL_STORAGE_POND_KEY } from '../../../constant/localStorage';

const PondManagement = () => {
    const [selectedPond, setSelectedPond] = useState(null);
    const [koiInPond, setKoiInPond] = useState([]);
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [imgSrc, setImgSrc] = useState("");
    const userLogin = useSelector((state) => state.manageUser.userLogin)
    const userId = userLogin?.id
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const {data: lstKoi} = useGetAllKoi(userId);    
    const {data: lstPond, refetch} = useGetAllPond(userId);
    const mutation = useUpdatePond();

    const handleClick = (pond) => {
        setSelectedPond(pond);
        setComponentDisabled(true);
        if (lstKoi) {
            const koiList = lstKoi.filter(koi => koi.pondId === pond.id);
            setKoiInPond(koiList);
        }
        setImgSrc(pond.imageUrl);
    };

    const handleDetailClick = (pondId) => {
        navigate(`/pond-detail/${pondId}`);
    };

    const handleClose = () => {
        setSelectedPond(null);
        setKoiInPond([]);
        setImgSrc("");
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            setSelectedPond(null);
            setKoiInPond([]);
            setImgSrc("");
        }
    };

    const handleChangeFile = (e) => {
        let file = e.target.files?.[0];
        if (
            file &&
            [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/webp",
            ].includes(file.type)
        ) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setImgSrc(e.target?.result);
            };
            formik.setFieldValue("image", file);
            setComponentDisabled(false);
        } else {
            setComponentDisabled(true);
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: selectedPond?.name || "",
            width: selectedPond?.width || "",
            length: selectedPond?.length || "",
            depth: selectedPond?.depth || "",
            image: null,
        },
        onSubmit: (values) => {
            const formData = new FormData();
            const updatePond = {
                name: values.name,
                width: parseFloat(values.width),
                length: parseFloat(values.length),
                depth: parseFloat(values.depth),
                userId: userId,
            };
            if (values.image) {
                formData.append("image", values.image);
            }
            formData.append("pond", JSON.stringify(updatePond));
            mutation.mutate(
                { id: selectedPond.id, payload: formData },
                {
                    onSuccess: (updatedPond) => {
                        const updatedPondWithImage = {
                            ...updatedPond,
                            imageUrl: imgSrc,
                        };
                        dispatch(managePondActions.updatePond(updatedPondWithImage));
                        setSelectedPond(updatedPondWithImage);
                        const updatedList = lstPond.map(pond => 
                            pond.id === updatedPondWithImage.id ? updatedPondWithImage : pond
                        );
                        localStorage.setItem(LOCAL_STORAGE_POND_KEY, JSON.stringify(updatedList));
                        setComponentDisabled(true);
                        refetch();
                        toast.success("Pond updated successfully");
                    },
                    onError: (error) => {
                        console.error("Error updating pond:", error);
                        toast.error(`Error updating pond: ${error.message}`);
                    },
                }
            );
        },
    });

    if (!lstPond) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
                <strong>Pond Management</strong>
            </div>

            <div className="container grid grid-cols-4 gap-6 my-16">
            {lstPond.map((pond, index) => (
                <div key={index} className="text-center">
                    <img
                        onClick={() => handleClick(pond)}
                        src={pond.imageUrl}
                        alt={pond.name}
                        className="w-32 h-32 mx-auto object-cover cursor-pointer"
                    />
                    <h3 className="text-lg mt-2 cursor-pointer" onClick={() => handleClick(pond)}>{pond.name}</h3>
                </div>
            ))}
            {selectedPond && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleOutsideClick}
                >
                    <div
                        className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
                        style={{width: '80%', maxWidth: '700px'}}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute -top-1 right-2 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        <div className="flex flex-row justify-center">
                            <div className="mr-6">
                            <img
                                src={selectedPond.imageUrl}
                                alt={selectedPond.name}
                                className="w-80 h-70 object-cover"
                            />
                                <div className="mt-2">
                                    <strong>Image:</strong>
                                    <input
                                        disabled={componentDisabled}
                                        type="file"
                                        accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                        onChange={handleChangeFile}
                                    />
                                    {imgSrc && formik.values.image && (
                                        <img
                                            src={imgSrc}
                                            alt="Preview"
                                            style={{
                                                width: "80px",
                                                height: "70px",
                                                objectFit: "cover",
                                                marginTop: "10px",
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <Checkbox
                                    checked={!componentDisabled}
                                    onChange={(e) => setComponentDisabled(!e.target.checked)}
                                    className="mb-4"
                                >
                                    Update Info
                                </Checkbox>
                                <Form
                                    disabled={componentDisabled}
                                    onFinish={formik.handleSubmit}
                                >
                                    <div className="flex justify-between m-1">
                                        <strong>Name:</strong>
                                        <Input
                                            className="text-right w-1/2 pr-2"
                                            style={{color: 'black'}}    
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="flex justify-between m-1">
                                        <strong>Width:</strong>
                                        <Input
                                            className="text-right w-1/2 pr-2"
                                            style={{color: 'black'}}   
                                            name="width"
                                            value={formik.values.width}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="flex justify-between m-1">
                                        <strong>Length:</strong>
                                        <Input
                                            className="text-right w-1/2 pr-2"
                                            style={{color: 'black'}}   
                                            name="length"
                                            value={formik.values.length}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                    <div className="flex justify-between m-1">
                                        <strong>Depth:</strong>
                                        <Input
                                            className="text-right w-1/2 pr-2"
                                            style={{color: 'black'}}   
                                            name="depth"
                                            value={formik.values.depth}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                    
                                    <Form.Item className="mt-4">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled={componentDisabled}
                                            loading={mutation.isPending}
                                        >
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            {koiInPond.length > 0 ? (
                                <>
                                    <div className="flex justify-between">
                                        <div className="text-left">
                                            <h4 className="text-lg font-bold mb-2">Koi in Pond</h4>
                                        </div>
                                        <div className="text-right">
                                        <h3
                                            className="underline text-blue-500 cursor-pointer"
                                            onClick={() => handleDetailClick(selectedPond.id)}
                                        >
                                            Pond Detail
                                        </h3>
                                        </div>
                                    </div>

                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                            {koiInPond.map((koi, index) => (
                                                <li key={index} className="flex flex-col items-center">
                                                    <img
                                                        src={koi.imageUrl}
                                                        alt={koi.name}
                                                        className="w-24 h-24 object-cover mb-2"
                                                    />
                                                    <span>{koi.name}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </>
                            ) : (
                                <h4 className="text-lg font-bold mb-2">There is no Koi in Pond</h4>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default PondManagement;