import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllKoi } from '../../../hooks/koi/useGetAllKoi';
import { useUpdateKoi } from '../../../hooks/koi/useUpdateKoi';
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { toast } from "react-toastify";
import { LOCAL_STORAGE_KOI_KEY } from '../../../constant/localStorage';
import { manageKoiActions } from '../../../store/manageKoi/slice';

const KoiManagement = () => {
    const [selectedKoi, setSelectedKoi] = useState(null);
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [imgSrc, setImgSrc] = useState("");
    const userLogin = useSelector((state) => state.manageUser.userLogin)
    const userId = userLogin?.id
    const dispatch = useDispatch()
    const { data: lstKoi, refetch } = useGetAllKoi(userId)
    const mutation = useUpdateKoi();

    const handleClick = (koi) => {
        setSelectedKoi(koi);
        setComponentDisabled(true);
        setImgSrc(koi.imageUrl);
    };

    const handleClose = () => {
        setSelectedKoi(null);
        setImgSrc("");
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            setSelectedKoi(null);
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
            name: selectedKoi?.name || "",
            variety: selectedKoi?.variety || "",
            sex: selectedKoi?.sex ? "Female" : "Male",
            purchasePrice: selectedKoi?.purchasePrice || "",
            pondId: selectedKoi?.pondId || "",
            image: null,
        },
        onSubmit: (values) => {
            const formData = new FormData();
            const updateKoi = {
                name: values.name,
                variety: values.variety,
                sex: values.sex === "Female",
                purchasePrice: parseFloat(values.purchasePrice),
                pondId: values.pondId,
                userId: userId,
            };
            if (values.image) {
                formData.append("image", values.image);
            }
            formData.append("fish", JSON.stringify(updateKoi));
            mutation.mutate(
                { id: selectedKoi?.id, payload: formData },
                {
                    onSuccess: (updatedKoi) => {
                        const updatedKoiWithImage = {
                            ...updatedKoi,
                            imageUrl: imgSrc,
                        };
                        dispatch(manageKoiActions.updateKoi(updatedKoiWithImage));
                        setSelectedKoi(updatedKoiWithImage);
                        // Update the specific koi in the list instead of the entire list
                        const updatedList = lstKoi.map(koi => 
                            koi.id === updatedKoiWithImage.id ? updatedKoiWithImage : koi
                        );
                        localStorage.setItem(LOCAL_STORAGE_KOI_KEY, JSON.stringify(updatedList));
                        setComponentDisabled(true);
                        refetch();
                        toast.success("Koi updated successfully");
                    },
                    onError: (error) => {
                        console.error("Error updating koi:", error);
                        toast.error(`Error updating koi: ${error.message}`);
                    },
                }
            );
        },
    });

    if (!lstKoi) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
                <strong>Koi Management</strong>
            </div>
        <div className="container grid grid-cols-4 gap-6 my-16">
            {lstKoi && lstKoi.map((koi, index) => (
                <div key={index} className="text-center">
                    <img
                        onClick={() => handleClick(koi)}
                        src={koi.imageUrl}
                        alt={koi.name}
                        className="w-32 h-32 mx-auto object-cover cursor-pointer"
                    />
                    <h3 className="text-lg mt-2 cursor-pointer" onClick={() => handleClick(koi)}>{koi.name}</h3>
                </div>
            ))}
            {selectedKoi && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleOutsideClick}
                >
                    <div
                        className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col rounded-xl"
                        style={{ width: '80%', maxWidth: '700px' }}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute -top-1 right-2 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <div className="flex flex-row">
                            <div className="mr-6">
                                <img
                                    src={imgSrc || selectedKoi.imageUrl}
                                    alt={selectedKoi.name}
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
                                        <strong>Variety:</strong>
                                        <Input
                                            className="text-right w-1/2 pr-2"
                                            style={{color: 'black'}}   
                                            name="variety"
                                            value={formik.values.variety}
                                            onChange={formik.handleChange}
                                        />
                                    </div>

                                    <div className="flex justify-between m-1">
                                        <strong>Sex:</strong>
                                        <Select
                                            style={{ 
                                                width: '50%', 
                                                textAlign: 'right', 
                                                borderRadius: '0.25rem',
                                                color: 'black' 
                                            }}
                                            name="sex"
                                            value={formik.values.sex}
                                            onChange={(value) => formik.setFieldValue("sex", value)}
                                            disabled={componentDisabled}
                                        >
                                            <Select.Option value="Male">Male</Select.Option>
                                            <Select.Option value="Female">Female</Select.Option>
                                        </Select>
                                    </div>

                                    <div className="flex justify-between m-1">
                                        <strong>Purchase Price:</strong>
                                        <Input
                                            className="text-right w-1/2 pr-2"
                                            style={{color: 'black'}}   
                                            name="purchasePrice"
                                            value={formik.values.purchasePrice}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                    
                                    <div className="flex justify-between m-1">
                                        <strong>Pond ID:</strong>
                                        <Input
                                            className="text-right  w-1/2 pr-2"
                                            style={{color: 'black'}}   
                                            name="pondId"
                                            value={formik.values.pondId}
                                            onChange={formik.handleChange}
                                        />
                                    </div>

                                    <div className="flex justify-between m-1">
                                        <strong>Fish ID:</strong>
                                        <div className="text-right w-1/2 pr-2">{selectedKoi.id}</div>
                                    </div>
                                    <Form.Item className="mt-4">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled={componentDisabled}
                                            loading={mutation.isLoading}
                                        >
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default KoiManagement;