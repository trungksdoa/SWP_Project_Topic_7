import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";
import { useGetPondById } from "../../../hooks/koi/useGetPondById.js";
import { useUpdateKoi } from '../../../hooks/koi/useUpdateKoi';
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input, Select, Spin, InputNumber, DatePicker, Modal } from "antd";
import { toast } from "react-toastify";
import { manageKoiActions } from '../../../store/manageKoi/slice';
import dayjs from 'dayjs';
import { useUpdatePond } from '../../../hooks/koi/useUpdatePond';
import { managePondActions } from '../../../store/managePond/slice';
import { useDeletePond } from "../../../hooks/koi/useDeletePond";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";

const { Option } = Select;

const PondDetail = () => {
    const { pondId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const pond = location.state?.pond;
    const pondIdNumber = Number(pondId);
    const userLogin = useSelector((state) => state.manageUser.userLogin);
    const userId = userLogin?.id;
    const { data: lstKoi, error: koiError, refetch, isFetching: koiLoading } = useGetAllKoi(userId);
    const [selectedKoi, setSelectedKoi] = useState(null);
    const { data: selectedPond, error: pondError, loading: pondLoading } = useGetPondById(pondIdNumber);
    const [koiInPond, setKoiInPond] = useState([]);
    const [imgSrc, setImgSrc] = useState("");
    const updateKoiMutation = useUpdateKoi();
    const [componentDisabled, setComponentDisabled] = useState(true);
    const updatePondMutation = useUpdatePond();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteOption, setDeleteOption] = useState(null);
    const [destinationPond, setDestinationPond] = useState(null);
    const [showMoveConfirmation, setShowMoveConfirmation] = useState(false);
    const [isMovingFish, setIsMovingFish] = useState(false);
    const deletePondMutation = useDeletePond();
    const { data: lstPond } = useGetAllPond(userId);
    const [otherPonds, setOtherPonds] = useState([]);

    const pondData = pond || selectedPond;

    useEffect(() => {
        if (lstKoi && pondIdNumber) {
            const filteredKoi = lstKoi.filter(koi => koi.pondId === pondIdNumber);
            setKoiInPond(filteredKoi);
        }
    }, [lstKoi, pondIdNumber]);

    const handleChangeFile = (e) => {
        let file = e.target.files?.[0];
        if (
            file &&
            ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(file.type)
        ) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setImgSrc(e.target?.result);
            };
            formik.setFieldValue("image", file);
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: selectedKoi?.name || "",
            variety: selectedKoi?.variety || "",
            sex: selectedKoi?.sex ? "true" : "false",
            purchasePrice: selectedKoi?.purchasePrice || 0,
            weight: selectedKoi?.weight || 0,
            length: selectedKoi?.length || 0,
            pondId: selectedKoi?.pondId || null,
            dateOfBirth: selectedKoi?.dateOfBirth ? dayjs(selectedKoi.dateOfBirth) : null,
            image: null,
        },
        onSubmit: (values) => {
            const formData = new FormData();
            const updatedKoi = {
                name: values.name || "",
                variety: values.variety || "",
                sex: values.sex === "true",
                purchasePrice: parseFloat(values.purchasePrice) || 0,
                weight: parseFloat(values.weight) || 0,
                length: parseFloat(values.length) || 0,
                pondId: parseInt(values.pondId) || null,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
                userId: userId,
            };
            formData.append("fish", JSON.stringify(updatedKoi));
            if (values.image) {
                formData.append("image", values.image);
            }
            updateKoiMutation.mutate(
                { id: selectedKoi.id, payload: formData },
                {
                    onSuccess: (updatedKoi) => {
                        dispatch(manageKoiActions.updateKoi(updatedKoi));
                        toast.success("Koi updated successfully");
                        setSelectedKoi(null);
                        refetch();
                    },
                    onError: (error) => {
                        console.error("Error updating koi:", error);
                        toast.error(`Error updating koi: ${error.message}`);
                    },
                }
            );
        },
    });

    const handleClick = (koi) => {
        setSelectedKoi(koi);
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

    const handleReturn = () => {
        navigate('/pond-management');
    };

    const handlePondChangeFile = (e) => {
        let file = e.target.files?.[0];
        if (
            file &&
            ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(file.type)
        ) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setImgSrc(e.target?.result);
            };
            pondFormik.setFieldValue("image", file);
            setComponentDisabled(false);
        }
    };

    const pondFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: pondData?.name || "",
            width: pondData?.width || 0,
            length: pondData?.length || 0,
            depth: pondData?.depth || 0,
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
            updatePondMutation.mutate(
                { id: pondIdNumber, payload: formData },
                {
                    onSuccess: (updatedPond) => {
                        const updatedPondWithImage = {
                            ...updatedPond,
                            imageUrl: imgSrc || pondData.imageUrl,
                        };
                        dispatch(managePondActions.updatePond(updatedPondWithImage));
                        toast.success("Pond updated successfully");
                        navigate('/pond-management');
                    },
                    onError: (error) => {
                        toast.error(`Error updating pond: ${error.message}`);
                    },
                }
            );
        },
    });

    const handleDeleteClick = (pondId) => {
        const pond = lstPond.find(p => p.id === pondId);
        const fishCount = koiInPond.length;
    
        Modal.confirm({
          title: 'Delete Pond',
          content: (
            <div>
              <p>Are you sure you want to delete this pond?</p>
              {fishCount > 0 && (
                <>
                  <p>This pond contains {fishCount} fish. What would you like to do with them?</p>
                </>
              )}
            </div>
          ),
          footer: (_, { OkBtn, CancelBtn }) => (
            <>
              {fishCount > 0 ? (
                <div className="flex justify-between mt-4">
                  <Button
                    className="w-1/3"
                    onClick={() => {
                      setDeleteOption('delete');
                      deletePond(pondId);
                      Modal.destroyAll();
                    }}
                    type="primary"
                    danger
                  >
                    Delete fish and pond
                  </Button>
                  <Button
                    className="w-1/3"
                    onClick={() => {
                      setDeleteOption('move');
                      handleMoveFish(pondId);
                      Modal.destroyAll();
                    }}
                    type="primary"
                  >
                    Move fish
                  </Button>
                  <Button
                    className="w-1/3"
                    onClick={() => {
                      setDeleteOption(null);
                      Modal.destroyAll();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end mt-4">
                  <Button
                    className="mr-2"
                    onClick={() => {
                      deletePond(pondId);
                      Modal.destroyAll();
                    }}
                    type="primary"
                    danger
                  >
                    Delete pond
                  </Button>
                  <Button
                    onClick={() => {
                      setDeleteOption(null);
                      Modal.destroyAll();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </>
          ),
          closable: true,
          maskClosable: true,
        });
    };
    
    const deletePond = async (pondId) => {
        setIsDeleting(true);
        try {
          await deletePondMutation.mutateAsync(pondId);
          toast.success("Pond deleted successfully!");
          navigate('/pond-management');
        } catch (error) {
          toast.error(`Error deleting pond: ${error.message}`);
        } finally {
          setIsDeleting(false);
        }
    };
    
    const handleMoveFish = (pondId) => {
        const otherPonds = lstPond.filter(pond => pond.id !== pondId);
        setOtherPonds(otherPonds);
        setShowMoveConfirmation(true);
    };
    
    const confirmMoveFish = async () => {
        if (!destinationPond) {
          toast.error("Please select a destination pond");
          return;
        }
    
        setIsMovingFish(true);
    
        try {
          // Update each koi's pond ID
          await Promise.all(koiInPond.map(koi => {
            const formData = new FormData();
            const updateKoi = {
              ...koi,
              pondId: destinationPond,
            };
            formData.append("fish", JSON.stringify(updateKoi));
            
            return updateKoiMutation.mutateAsync(
              { id: koi.id, payload: formData },
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
          }));
    
          // Delete the original pond
          await deletePondMutation.mutateAsync(pondIdNumber);
    
          toast.success("Pond deleted and fish moved successfully!");
          setShowMoveConfirmation(false);
          navigate('/pond-management');
        } catch (error) {
          console.error("Error moving fish:", error);
          toast.error(`Error moving fish: ${error.message || 'An unexpected error occurred'}`);
        } finally {
          setIsMovingFish(false);
        }
    };

    if (koiError) {
        console.error('Error fetching koi:', koiError);
        return <div>Error loading koi.</div>;
    }

    if (pondError) {
        console.error('Error fetching pond:', pondError);
        return <div>Error loading pond details.</div>;
    }

    if (koiLoading || pondLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin tip="Loading" size="large" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button onClick={handleReturn} className="bg-gray-200 hover:bg-gray-300 m-8">
                Return
            </Button>
            <div className="flex justify-center items-center text-bold text-3xl">
                <strong>Pond Details</strong>
            </div>
            {pondData && (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                    <Form onFinish={pondFormik.handleSubmit} layout="vertical">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex justify-center items-center"> {/* Added flex and centering classes */}
                                <img
                                    src={imgSrc || pondData.imageUrl}
                                    alt={pondData.name}
                                    className="w-full max-w-xs h-auto object-cover rounded mb-4"
                                />
                            </div>
                            <div>
                                <Form.Item label="Name" className="mb-2">
                                    <Input
                                        name="name"
                                        value={pondFormik.values.name}
                                        onChange={pondFormik.handleChange}
                                        className="w-full"
                                    />
                                </Form.Item>
                                <Form.Item label="Width (meters)" className="mb-2">
                                    <InputNumber
                                        name="width"
                                        min={0}
                                        value={pondFormik.values.width}
                                        onChange={(value) => pondFormik.setFieldValue("width", value)}
                                        className="w-full"
                                    />
                                </Form.Item>
                                <Form.Item label="Length (meters)" className="mb-2">
                                    <InputNumber
                                        name="length"
                                        min={0}
                                        value={pondFormik.values.length}
                                        onChange={(value) => pondFormik.setFieldValue("length", value)}
                                        className="w-full"
                                    />
                                </Form.Item>
                                <Form.Item label="Depth (meters)" className="mb-2">
                                    <InputNumber
                                        name="depth"
                                        min={0}
                                        value={pondFormik.values.depth}
                                        onChange={(value) => pondFormik.setFieldValue("depth", value)}
                                        className="w-full"
                                    />
                                </Form.Item>
                                <Form.Item label="Image" className="mb-2">
                                    <input
                                        type="file"
                                        accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                        onChange={handlePondChangeFile}
                                    />
                                </Form.Item>
                            </div>
                            
                        </div>
                        <Form.Item className="flex justify-center mt-6">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-black text-white hover:bg-gray-800 px-8 py-2 text-xl font-bold"
                                loading={updatePondMutation.isPending}
                            >
                                Update Pond
                            </Button>
                            <Button
                                onClick={() => handleDeleteClick(pondIdNumber)}
                                className="bg-red-500 text-white hover:bg-red-600 font-bold text-xl px-8 py-2 ml-4"
                                loading={isDeleting}
                            >
                                Delete Pond
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}

            <h2 className="text-2xl font-bold my-6 text-center">Koi in Pond</h2>
            {koiInPond.length === 0 ? (
                <p className="text-center">No koi found in this pond.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 m-8">
                    {koiInPond.map((koi, index) => (
                        <div key={index} className="text-center bg-white shadow-md rounded-lg p-4">
                            <img
                                onClick={() => handleClick(koi)}
                                src={koi.imageUrl}
                                alt={koi.name}
                                className="w-32 h-32 mx-auto object-cover cursor-pointer rounded-full"
                            />
                            <h3 className="text-lg mt-2 cursor-pointer font-semibold" onClick={() => handleClick(koi)}>{koi.name}</h3>
                            <p className="text-sm text-gray-600">{koi.variety}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedKoi && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleOutsideClick}
                >
                    <div
                        className="relative bg-white p-8 rounded-lg shadow-lg flex flex-col"
                        style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-center">Koi Information</h2>
                        <Form onFinish={formik.handleSubmit} layout="vertical">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <img
                                        src={imgSrc || selectedKoi.imageUrl}
                                        alt={selectedKoi.name}
                                        className="w-full h-auto object-cover rounded mb-4"
                                    />
                                    <Form.Item label="Image">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                            onChange={handleChangeFile}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item label="Name" className="mb-2">
                                        <Input
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Variety" className="mb-2">
                                        <Input
                                            name="variety"
                                            value={formik.values.variety}
                                            onChange={formik.handleChange}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Sex" className="mb-2">
                                        <Select
                                            name="sex"
                                            value={formik.values.sex}
                                            onChange={(value) => formik.setFieldValue("sex", value)}
                                            className="w-full"
                                        >
                                            <Select.Option value="true">Female</Select.Option>
                                            <Select.Option value="false">Male</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Purchase Price (VND)" className="mb-2">
                                        <InputNumber
                                            name="purchasePrice"
                                            min={0}
                                            value={formik.values.purchasePrice}
                                            onChange={(value) => formik.setFieldValue("purchasePrice", value)}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Weight (grams)" className="mb-2">
                                        <InputNumber
                                            name="weight"
                                            min={0}
                                            value={formik.values.weight}
                                            onChange={(value) => formik.setFieldValue("weight", value)}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Length (centimeters)" className="mb-2">
                                        <InputNumber
                                            name="length"
                                            min={0}
                                            value={formik.values.length}
                                            onChange={(value) => formik.setFieldValue("length", value)}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Date of Birth" className="mb-2">
                                        <DatePicker
                                            name="dateOfBirth"
                                            value={formik.values.dateOfBirth}
                                            onChange={(date) => formik.setFieldValue("dateOfBirth", date)}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item className="flex justify-center mt-6">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-black text-white hover:bg-gray-800 px-8 py-2 text-xl font-bold"
                                    loading={updateKoiMutation.isPending}
                                >
                                    Update Koi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}

            {showMoveConfirmation && (
              <Modal
                title="Move Fish"
                visible={showMoveConfirmation}
                onCancel={() => setShowMoveConfirmation(false)}
                footer={null}
              >
                <p>Select a pond to move the fish to:</p>
                <Select
                  style={{ width: '100%', marginBottom: '20px' }}
                  placeholder="Select a pond"
                  onChange={(value) => setDestinationPond(value)}
                  value={destinationPond}
                >
                  {otherPonds.map(pond => (
                    <Option key={pond.id} value={pond.id}>{pond.name}</Option>
                  ))}
                </Select>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    key="cancel" 
                    onClick={() => setShowMoveConfirmation(false)}
                    style={{ marginRight: '10px' }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    key="submit" 
                    type="primary" 
                    onClick={confirmMoveFish}
                    disabled={!destinationPond || isMovingFish}
                    loading={isMovingFish}
                  >
                    Confirm Move
                  </Button>
                </div>
              </Modal>
            )}
        </div>
    );
}

export default PondDetail;