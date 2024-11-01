import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";
import { useGetPondById } from "../../../hooks/koi/useGetPondById.js";
import { useUpdateKoi } from '../../../hooks/koi/useUpdateKoi';
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input, Select, Spin, InputNumber, DatePicker, Modal, Pagination, Space, message } from "antd";
import { manageKoiActions } from '../../../store/manageKoi/slice';
import dayjs from 'dayjs';
import { useUpdatePond } from '../../../hooks/koi/useUpdatePond';
import { managePondActions } from '../../../store/managePond/slice';
import { useDeletePond } from "../../../hooks/koi/useDeletePond";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
import { useAddKoi } from "../../../hooks/koi/useAddKoi";
import { SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';

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
    const [koiAge, setKoiAge] = useState(null);
    const [selectedPondId, setSelectedPondId] = useState(null);
    const [selectedKoiForDeletion, setSelectedKoiForDeletion] = useState([]);
    const [isDeletingKoi, setIsDeletingKoi] = useState(false);
    const deleteKoiMutation = useDeleteKoi();
    const [showAddKoiModal, setShowAddKoiModal] = useState(false);
    const [newKoiImgSrc, setNewKoiImgSrc] = useState("");
    const addKoiMutation = useAddKoi();
    const [sortCriteria, setSortCriteria] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showMoveKoiConfirmation, setShowMoveKoiConfirmation] = useState(false);
    const [selectedDestinationPond, setSelectedDestinationPond] = useState(null);
    const [isMovingKoi, setIsMovingKoi] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const pondData = pond || selectedPond;

    const [currentPage, setCurrentPage] = useState(1);
    const koiPerPage = 8;

    useEffect(() => {
        refetch();
    }, [refetch]);

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

    const calculateAge = (birthDate) => {
        if (birthDate) {
            const today = dayjs();
            const birthDayjs = dayjs(birthDate);
            const ageInMonths = today.diff(birthDayjs, 'month');
            setKoiAge(ageInMonths);
        } else {
            setKoiAge(null);
        }
    };

    // Add a new function to format the age
    const formatAge = (ageInMonths) => {
        if (ageInMonths === null) return 'Unknown';
        const years = Math.floor(ageInMonths / 12);
        const months = ageInMonths % 12;

        const parts = [];
        if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
        if (months > 0 || parts.length === 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);

        return parts.join(', ');
    };

    useEffect(() => {
        if (selectedKoi) {
            calculateAge(selectedKoi.dateOfBirth);
        }
    }, [selectedKoi]);

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
                        message.success("Koi updated successfully");
                        setSelectedKoi(null);
                        refetch();
                    },
                    onError: (error) => {
                        console.error("Error updating koi:", error);
                        message.error(`Error updating koi: ${error.message}`);
                    },
                }
            );
            calculateAge(values.dateOfBirth);
        },
    });

    const handleClick = (koi) => {
        setSelectedKoi(koi);
        setImgSrc(koi.imageUrl);
        calculateAge(koi.dateOfBirth);
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
                        message.success("Pond updated successfully");
                        refetch();
                    },
                    onError: (error) => {
                        message.error(`Error updating pond: ${error.message}`);
                    },
                }
            );
        },
    });

    const handleDeleteClick = (pondId) => {
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
                <div className="flex justify-center items-center mt-4 space-x-4 w-full">
                    <Button
                    className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white rounded-full font-bold"
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
                    className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-blue-500 text-white rounded-full font-bold"
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
                    className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-gray-300 text-black rounded-full font-bold"
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
          message.success("Pond deleted successfully!");
          navigate('/pond-management');
        } catch (error) {
          message.error(`Error deleting pond: ${error.message}`);
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
          message.error("Please select a destination pond");
          return;
        }
    
        setIsMovingFish(true);
    
        try {
          // Get all koi in the pond to be deleted
          const koiToMove = koiInPond;
    
          // Update each koi's pond ID
          await Promise.all(koiToMove.map(koi => {
            const formData = new FormData();
            const updatedKoi = {
              ...koi,
              pondId: destinationPond,
            };
            formData.append("fish", JSON.stringify(updatedKoi));
            
            return updateKoiMutation.mutateAsync(
              { id: koi.id, payload: formData },
              {
                onSuccess: (updatedKoi) => {
                  dispatch(manageKoiActions.updateKoi(updatedKoi));
                },
                onError: (error) => {
                  console.error(`Error updating koi ${koi.id}:`, error);
                  message.error(`Error updating koi ${koi.id}: ${error.message}`);
                }
              }
            );
          }));
    
          // Delete the original pond
          await deletePondMutation.mutateAsync(pondIdNumber);
    
          message.success("Fish moved and pond deleted successfully!");
          setShowMoveConfirmation(false);
          setDestinationPond(null);
          navigate('/pond-management');
        } catch (error) {
          console.error("Error moving fish:", error);
          message.error(`Error moving fish: ${error.message || 'An unexpected error occurred'}`);
        } finally {
          setIsMovingFish(false);
        }
    };

    const handleKoiSelectionForDeletion = (koiId) => {
        setSelectedKoiForDeletion(prev => {
            const newSelection = prev.includes(koiId)
                ? prev.filter(id => id !== koiId)
                : [...prev, koiId];
            setAllSelected(newSelection.length === currentKoi.length);
            return newSelection;
        });
    };

    const handleDeleteSelectedKoi = () => {
        if (selectedKoiForDeletion.length === 0) {
            message.error("Please select at least one Koi to delete.");
            return;
        }

        Modal.confirm({
            title: 'Delete Koi',
            content: `Are you sure you want to delete ${selectedKoiForDeletion.length} koi?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteSelectedKoi();
            },
        });
    };

    const deleteSelectedKoi = async () => {
        setIsDeletingKoi(true);
        try {
            for (const koiId of selectedKoiForDeletion) {
                await deleteKoiMutation.mutateAsync(koiId);
            }
            message.success(`Successfully deleted ${selectedKoiForDeletion.length} Koi!`);
            setSelectedKoiForDeletion([]);
            refetch();
        } catch (error) {
            console.error("Error deleting Koi:", error);
            message.error(`Error deleting koi: ${error.message}`);
        } finally {
            setIsDeletingKoi(false);
        }
    };

    const handleAddNewKoi = () => {
        setShowAddKoiModal(true);
    };

    const handleCloseAddKoiModal = () => {
        setShowAddKoiModal(false);
        setNewKoiImgSrc("");
    };

    const handleNewKoiChangeFile = (e) => {
        let file = e.target.files?.[0];
        if (
            file &&
            ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(file.type)
        ) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                setNewKoiImgSrc(e.target?.result);
            };
            addKoiFormik.setFieldValue("image", file);
        }
    };

    const calculateAgeMonths = (dateOfBirth) => {
        if (!dateOfBirth) return 0;
        const birthDate = dayjs(dateOfBirth);
        const currentDate = dayjs();
        const diffMonths = currentDate.diff(birthDate, 'month');
        return diffMonths;
    };

    const addKoiFormik = useFormik({
        initialValues: {
            name: "",
            variety: "",
            sex: true,
            purchasePrice: 0,
            weight: 0,
            length: 0,
            dateOfBirth: null,
            image: null,
        },
        onSubmit: (values, { resetForm }) => {
            const formData = new FormData();
            const currentDate = dayjs();
            const ageMonth = calculateAgeMonths(values.dateOfBirth);

            const newKoi = {
                name: values.name || "",
                variety: values.variety || "",
                sex: values.sex === "true",
                purchasePrice: parseFloat(values.purchasePrice) || 0,
                weight: parseFloat(values.weight) || 0,
                length: parseFloat(values.length) || 0,
                pondId: pondIdNumber,
                dateOfBirth: values.dateOfBirth,
                userId: userId,
                date: currentDate.format('YYYY-MM-DD'),
                ageMonth: ageMonth,
            };
            formData.append("fish", JSON.stringify(newKoi));
            if (values.image) {
                formData.append("image", values.image);
            }
            addKoiMutation.mutate(formData, {
                onSuccess: (addedKoi) => {
                    const newKoiWithImage = {
                        ...addedKoi,
                        imageUrl: newKoiImgSrc,
                    };
                    dispatch(manageKoiActions.addKoi(newKoiWithImage));
                    message.success("Koi added successfully");
                    handleCloseAddKoiModal();
                    refetch().then(() => {
                        resetForm();
                        setNewKoiImgSrc("");
                    });
                },
                onError: (error) => {
                    console.error("Error adding koi:", error);
                    message.error(`Error adding koi: ${error.message}`);
                },
            });
        },
    });

    const handleSortChange = (value) => {
        setSortCriteria(value);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedKoiInPond = useMemo(() => {
        if (!koiInPond) return [];
        return [...koiInPond].sort((a, b) => {
            let comparison = 0;
            switch (sortCriteria) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'length':
                    comparison = a.length - b.length;
                    break;
                case 'weight':
                    comparison = a.weight - b.weight;
                    break;
                case 'age':
                    comparison = new Date(a.dateOfBirth) - new Date(b.dateOfBirth);
                    break;
                case 'dateCreated':
                    comparison = new Date(a.createdAt) - new Date(b.createdAt);
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [koiInPond, sortCriteria, sortOrder]);

    const filteredKoiInPond = useMemo(() => {
        return sortedKoiInPond.filter(koi => 
            koi.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedKoiInPond, searchTerm]);

    const indexOfLastKoi = currentPage * koiPerPage;
    const indexOfFirstKoi = indexOfLastKoi - koiPerPage;
    const currentKoi = filteredKoiInPond.slice(indexOfFirstKoi, indexOfLastKoi);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const handleMoveSelectedKoi = () => {
        if (selectedKoiForDeletion.length === 0) {
            message.error("Please select at least one Koi to move.");
            return;
        }
        setShowMoveKoiConfirmation(true);
    };

    const confirmMoveKoi = async () => {
        if (!selectedDestinationPond) {
            message.error("Please select a destination pond");
            return;
        }

        setIsMovingKoi(true);

        try {
            // Update each selected koi's pond ID
            await Promise.all(selectedKoiForDeletion.map(koiId => {
                const koi = koiInPond.find(k => k.id === koiId);
                const formData = new FormData();
                const updateKoi = {
                    ...koi,
                    pondId: selectedDestinationPond.id,
                };
                formData.append("fish", JSON.stringify(updateKoi));
                
                return updateKoiMutation.mutateAsync(
                    { id: koiId, payload: formData },
                    {
                        onSuccess: (updatedKoi) => {
                            dispatch(manageKoiActions.updateKoi(updatedKoi));
                        },
                        onError: (error) => {
                            console.error(`Error updating koi ${koiId}:`, error);
                            message.error(`Error updating koi ${koiId}: ${error.message}`);
                        }
                    }
                );
            }));

            message.success("Koi moved successfully!");
            setShowMoveKoiConfirmation(false);
            setSelectedKoiForDeletion([]);
            refetch();
        } catch (error) {
            message.error(`Error moving koi: ${error.message || 'An unexpected error occurred'}`);
        } finally {
            setIsMovingKoi(false);
        }
    };

    const handleSelectAll = (checked) => {
        setAllSelected(checked);
        if (checked) {
            setSelectedKoiForDeletion(currentKoi.map(koi => koi.id));
        } else {
            setSelectedKoiForDeletion([]);
        }
    };

    const handleCancelSelect = () => {
        setSelectedKoiForDeletion([]);
        setAllSelected(false);
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
            <Button onClick={handleReturn} className="bg-gray-200 hover:bg-gray-300">
                Return
            </Button>
            <div className="flex justify-center items-center text-bold text-3xl">
                <strong>Pond Details</strong>
            </div>
            {pondData && (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                    <Form onFinish={pondFormik.handleSubmit} layout="vertical">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex justify-center items-center"> 
                                <img
                                    src={imgSrc || pondData.imageUrl}
                                    alt={pondData.name}
                                    className="w-80 h-80 object-cover rounded-xl mb-4"
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
                                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold mr-2"
                                loading={updatePondMutation.isPending}
                            >
                                Update Pond
                            </Button>
                            <Button
                                onClick={() => handleDeleteClick(pondIdNumber)}
                                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white rounded-full font-bold ml-2"
                                loading={isDeleting}
                            >
                                Delete Pond
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}

            <h2 className="text-2xl font-bold my-6 text-center">Koi in Pond</h2>
            
            <div className="flex justify-between items-center mx-4 my-6">
                <div className="flex justify-start items-center w-1/3">
                    <Input
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 300, height: 50, fontSize: 18 }}
                        className="mr-2"
                        suffix={<SearchOutlined style={{ fontSize: 18 }} />}
                    />
                </div>
                <div className="flex justify-center items-center">
                    <button
                        className="w-40 h-auto min-h-[2.5rem] py-1 px-1 border-black border-2 rounded-full flex items-center justify-center font-bold mr-2"
                        onClick={handleAddNewKoi}
                    >
                        Add a new Koi
                    </button>
                    <button
                        className={`w-40 h-auto min-h-[2.5rem] py-1 px-1 ${selectedKoiForDeletion.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'} rounded-full flex items-center justify-center font-bold`}
                        disabled={selectedKoiForDeletion.length === 0 || isDeletingKoi}
                        onClick={handleDeleteSelectedKoi}
                    >
                        {isDeletingKoi ? "Deleting..." : "Delete Koi"}
                    </button>
                    <button
                        className={`w-40 h-auto min-h-[2.5rem] py-1 px-1 ${selectedKoiForDeletion.length > 0 ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'} rounded-full flex items-center justify-center font-bold ml-2`}
                        disabled={selectedKoiForDeletion.length === 0 || isMovingKoi}
                        onClick={handleMoveSelectedKoi}
                    >
                        {isMovingKoi ? "Moving..." : "Move Koi"}
                    </button>
                </div>
                <div className="flex justify-end items-center w-1/3">
                    <Space>
                        <Select
                            defaultValue="name"
                            style={{ width: 120 }}
                            onChange={handleSortChange}
                        >
                            <Option value="name">Name</Option>
                            <Option value="length">Length</Option>
                            <Option value="weight">Weight</Option>
                            <Option value="age">Age</Option>
                            <Option value="dateCreated">Date Created</Option>
                        </Select>
                        <Button onClick={toggleSortOrder}>
                            {sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                        </Button>
                    </Space>
                    <Checkbox
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={allSelected}
                        className="ml-1 mr-1 whitespace-nowrap"
                    >
                        Select All
                    </Checkbox>
                    <Button
                        onClick={handleCancelSelect}
                        disabled={selectedKoiForDeletion.length === 0}
                    >
                        Cancel
                    </Button>
                </div>
            </div>

            {filteredKoiInPond.length === 0 ? ( 
                <p className="text-center mt-6">No koi found in this pond.</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 m-8">
                        {currentKoi.map((koi, index) => (
                            <div key={index} className="relative text-center bg-white shadow-md rounded-lg p-4">
                                <Checkbox
                                    className="absolute top-2 right-2"
                                    checked={selectedKoiForDeletion.includes(koi.id)}
                                    onChange={() => handleKoiSelectionForDeletion(koi.id)}
                                />
                                <img
                                    onClick={() => handleClick(koi)}
                                    src={koi.imageUrl}
                                    alt={koi.name}
                                    className="w-32 h-32 mx-auto object-cover cursor-pointer rounded-full"
                                />
                                <h3 className="text-lg mt-2 cursor-pointer font-semibold" onClick={() => handleClick(koi)}>{koi.name}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-8 mb-8">
                        <Pagination
                            current={currentPage}
                            total={filteredKoiInPond.length}
                            pageSize={koiPerPage}
                            onChange={onPageChange}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            )}
        

            {selectedKoi && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleOutsideClick}
                >
                    <div
                        className="relative bg-white p-8 rounded-lg shadow-lg flex flex-col"
                        style={{ width: 700, maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-4 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center">Koi Information</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="flex items-center justify-center"> 
                                <img
                                    src={imgSrc || selectedKoi.imageUrl}
                                    alt={selectedKoi.name}
                                    className="w-80 h-40 object-cover rounded"
                                />
                            </div>
                            <div className="col-span-2">
                                <p className="flex justify-between mb-1"><strong>Name:</strong> <span>{selectedKoi.name}</span></p>
                                <p className="flex justify-between mb-1"><strong>Variety:</strong> <span>{selectedKoi.variety}</span></p>
                                <p className="flex justify-between mb-1"><strong>Sex:</strong> <span>{selectedKoi.sex ? 'Female' : 'Male'}</span></p>
                                <p className="flex justify-between mb-1"><strong>Purchase Price:</strong> <span>{selectedKoi.purchasePrice} VND</span></p>  
                                <p className="flex justify-between mb-1"><strong>Weight:</strong> <span>{selectedKoi.weight} grams</span></p>
                                <p className="flex justify-between mb-1"><strong>Length:</strong> <span>{selectedKoi.length} cm</span></p>
                                <p className="flex justify-between mb-1"><strong>Date of Birth:</strong> <span>{selectedKoi.dateOfBirth ? dayjs(selectedKoi.dateOfBirth).format('YYYY-MM-DD') : 'Unknown'}</span></p>
                                <p className="flex justify-between mb-1"><strong>Age:</strong> <span>{formatAge(koiAge)}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showMoveConfirmation && (
              <Modal
                title="Move Fish"
                visible={showMoveConfirmation}
                onCancel={() => setShowMoveConfirmation(false)}
                footer={null}
                width={800}
              >
                <p>Select a pond to move the fish to:</p>
                <div className="grid grid-cols-4 gap-4 mt-4 mb-6">
                  {otherPonds.map(pond => (
                    <div 
                      key={pond.id} 
                      className={`cursor-pointer border p-2 rounded ${destinationPond === pond.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
                      onClick={() => setDestinationPond(pond.id)}
                    >
                      <img 
                        src={pond.imageUrl} 
                        alt={pond.name} 
                        className="w-50 h-50 object-cover rounded mb-2"
                      />
                      <p className="text-center font-semibold">{pond.name}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button 
                    key="cancel" 
                    onClick={() => setShowMoveConfirmation(false)}
                    className="mr-2"
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

            {showAddKoiModal && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleCloseAddKoiModal}
                >
                    <div
                        className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
                        style={{ width: '90%', maxWidth: '800px', height: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseAddKoiModal}
                            className="absolute top-2 right-4 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center">Add New Koi</h2>
                        <Form onFinish={addKoiFormik.handleSubmit} layout="vertical">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex justify-center items-center">
                                    <img
                                        src={newKoiImgSrc || "placeholder-image-url"}
                                        alt="New Koi preview"
                                        className="w-60 h-60 object-cover rounded-xl"
                                    />
                                </div>
                                <div>
                                    <Form.Item label="Name" className="mb-1">
                                        <Input
                                            name="name"
                                            value={addKoiFormik.values.name}
                                            onChange={addKoiFormik.handleChange}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Variety" className="mb-1">
                                        <Input
                                            name="variety"
                                            value={addKoiFormik.values.variety}
                                            onChange={addKoiFormik.handleChange}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Sex" className="mb-1">
                                        <Select
                                            name="sex"
                                            value={addKoiFormik.values.sex}
                                            onChange={(value) => addKoiFormik.setFieldValue("sex", value)}
                                            className="w-full"
                                        >
                                            <Select.Option value={true}>Female</Select.Option>
                                            <Select.Option value={false}>Male</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Purchase Price (VND)" className="mb-1">
                                        <InputNumber
                                            name="purchasePrice"
                                            min={0}
                                            value={addKoiFormik.values.purchasePrice}
                                            onChange={(value) => addKoiFormik.setFieldValue("purchasePrice", value)}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item label="Weight (grams)" className="mb-1">
                                        <InputNumber
                                            name="weight"
                                            min={0}
                                            value={addKoiFormik.values.weight}
                                            onChange={(value) => addKoiFormik.setFieldValue("weight", value)}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Length (centimeters)" className="mb-1">
                                        <InputNumber
                                            name="length"
                                            min={0}
                                            value={addKoiFormik.values.length}
                                            onChange={(value) => addKoiFormik.setFieldValue("length", value)}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Date of Birth" className="mb-1">
                                        <DatePicker
                                            name="dateOfBirth"
                                            value={addKoiFormik.values.dateOfBirth ? dayjs(addKoiFormik.values.dateOfBirth) : null}
                                            onChange={(date, dateString) => addKoiFormik.setFieldValue("dateOfBirth", dateString)}
                                            className="w-full"
                                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Image" className="mb-1">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                            onChange={handleNewKoiChangeFile}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item className="flex justify-center mt-4 mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold text-xl"
                                    loading={addKoiMutation.isPending}
                                >
                                    Add Koi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}

            {showMoveKoiConfirmation && (
                <Modal
                    title="Move Koi"
                    visible={showMoveKoiConfirmation}
                    onCancel={() => setShowMoveKoiConfirmation(false)}
                    footer={null}
                    width={800}
                >
                    <p>Select a pond to move the koi to:</p>
                    <div className="grid grid-cols-4 gap-4 mt-4 mb-6">
                        {lstPond.filter(pond => pond.id !== pondIdNumber).map(pond => (
                            <div 
                                key={pond.id} 
                                className={`cursor-pointer border p-2 rounded ${selectedDestinationPond?.id === pond.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
                                onClick={() => setSelectedDestinationPond(pond)}
                            >
                                <img 
                                    src={pond.imageUrl} 
                                    alt={pond.name} 
                                    className="w-50 h-50 object-cover rounded mb-2"
                                />
                                <p className="text-center font-semibold">{pond.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center mt-4 space-x-4">
                        <Button 
                            key="cancel" 
                            onClick={() => setShowMoveKoiConfirmation(false)}
                            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 text-black rounded-full font-bold"
                        >
                            Cancel
                        </Button>
                        <Button 
                            key="submit" 
                            type="primary" 
                            onClick={confirmMoveKoi}
                            disabled={!selectedDestinationPond || isMovingKoi}
                            loading={isMovingKoi}
                            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold"
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
