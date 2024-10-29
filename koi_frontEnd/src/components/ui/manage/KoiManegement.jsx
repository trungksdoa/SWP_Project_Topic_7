import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { Button, Spin, Pagination, Select, Space, Checkbox, Modal, Input, InputNumber, Form, DatePicker } from "antd";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { useAddKoi } from "../../../hooks/koi/useAddKoi";
import { useFormik } from "formik";
import { manageKoiActions } from "../../../store/manageKoi/slice";
const { Option } = Select;

const KoiManegement = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const { data: lstKoi, refetch, isFetching } = useGetAllKoi(userId);
  const { data: lstPond } = useGetAllPond(userId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState('dateCreated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteKoiMutation = useDeleteKoi();
  const [selectedKoiForAction, setSelectedKoiForAction] = useState([]);
  const [isDeletingKoi, setIsDeletingKoi] = useState(false);
  const [isMovingKoi, setIsMovingKoi] = useState(false);
  const [showMoveKoiConfirmation, setShowMoveKoiConfirmation] = useState(false);
  const [selectedDestinationPond, setSelectedDestinationPond] = useState(null);
  const [allSelected, setAllSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddKoiModal, setShowAddKoiModal] = useState(false);
  const [newKoiImgSrc, setNewKoiImgSrc] = useState("");
  const addKoiMutation = useAddKoi();

  const updateKoiMutation = useUpdateKoi();

  const koiPerPage = 8;

  const dispatch = useDispatch();

  useEffect(() => {
    refetch();
    setAllSelected(false);
  }, [refetch, currentPage]);


  const handleDeleteKoi = () => {
    Modal.confirm({
      title: 'Delete Koi',
      content: 'Are you sure you want to delete this koi?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteKoi(selectedKoi.id);
      },
    });
  };

  const deleteKoi = async (koiId) => {
    setIsDeleting(true);
    try {
      await deleteKoiMutation.mutateAsync(koiId);
      toast.success("Koi deleted successfully!");
      setIsModalVisible(false);
      refetch();
    } catch (error) {
      toast.error(`Error deleting koi: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedKoi = useMemo(() => {
    if (!lstKoi) return [];
    return [...lstKoi].sort((a, b) => {
      let comparison = 0;
      switch (sortCriteria) {
        case 'dateCreated':
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          comparison = dateB - dateA;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'length':
          comparison = parseFloat(b.length) - parseFloat(a.length);
          break;
        case 'weight':
          comparison = parseFloat(b.weight) - parseFloat(a.weight);
          break;
        case 'age':
          comparison = calculateAge(b.dateOfBirth) - calculateAge(a.dateOfBirth);
          break;
        default:
          comparison = 0;
      }
      return sortCriteria === 'dateCreated' 
        ? comparison 
        : (sortOrder === 'asc' ? -comparison : comparison);
    });
  }, [lstKoi, sortCriteria, sortOrder]);

  useEffect(() => {
    if (sortedKoi.length > 0) {
      console.log('First few koi sorted by date:', 
        sortedKoi.slice(0, 3).map(k => ({
          name: k.name,
          createdAt: k.createdAt
        }))
      );
    }
  }, [sortedKoi]);

  const indexOfLastKoi = currentPage * koiPerPage;
  const indexOfFirstKoi = indexOfLastKoi - koiPerPage;
  const filteredKoi = useMemo(() => {
    return sortedKoi.filter(koi => 
      koi.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedKoi, searchTerm]);
  const currentKoi = filteredKoi.slice(indexOfFirstKoi, indexOfLastKoi);

  const handleAddClick = () => {
    setShowAddKoiModal(true);
  };

  const handleKoiClick = (koi) => {
    const koiPond = lstPond.find(pond => pond.id === koi.pondId);
    const age = calculateAge(koi.dateOfBirth);
    setSelectedKoi({ ...koi, pond: koiPond, age: formatAge(age) });
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedKoi(null);
  };


  const handleUpdateKoi = () => {
    navigate(`/update-koi/${selectedKoi.id}`, { state: { koi: selectedKoi } });
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value) => {
    setSortCriteria(value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleKoiSelection = (koiId) => {
    setSelectedKoiForAction(prev => {
      const newSelection = prev.includes(koiId)
        ? prev.filter(id => id !== koiId)
        : [...prev, koiId];
      setAllSelected(newSelection.length === currentKoi.length);
      return newSelection;
    });
  };

  const handleDeleteSelectedKoi = () => {
    if (selectedKoiForAction.length === 0) {
      toast.error("Please select at least one Koi to delete.");
      return;
    }

    Modal.confirm({
      title: 'Delete Koi',
      content: `Are you sure you want to delete ${selectedKoiForAction.length} koi?`,
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
      for (const koiId of selectedKoiForAction) {
        await deleteKoiMutation.mutateAsync(koiId);
      }
      toast.success(`Successfully deleted ${selectedKoiForAction.length} Koi!`);
      setSelectedKoiForAction([]);
      refetch();
    } catch (error) {
      console.error("Error deleting Koi:", error);
      toast.error(`Error deleting koi: ${error.message}`);
    } finally {
      setIsDeletingKoi(false);
    }
  };

  const handleMoveSelectedKoi = () => {
    if (selectedKoiForAction.length === 0) {
      toast.error("Please select at least one Koi to move.");
      return;
    }
    setShowMoveKoiConfirmation(true);
  };

  const confirmMoveKoi = async () => {
    if (!selectedDestinationPond) {
      toast.error("Please select a destination pond");
      return;
    }

    setIsMovingKoi(true);

    try {
      await Promise.all(selectedKoiForAction.map(koiId => {
        const koi = lstKoi.find(k => k.id === koiId);
        const formData = new FormData();
        const updateKoi = {
          ...koi,
          pondId: selectedDestinationPond.id,
        };
        formData.append("fish", JSON.stringify(updateKoi));
        
        return updateKoiMutation.mutateAsync(
          { id: koiId, payload: formData },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }));

      toast.success("Koi moved successfully!");
      setShowMoveKoiConfirmation(false);
      setSelectedKoiForAction([]);
      refetch();
    } catch (error) {
      console.error("Error moving koi:", error);
      toast.error(`Error moving koi: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setIsMovingKoi(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (birthDate) {
      const today = dayjs();
      const birthDayjs = dayjs(birthDate);
      const ageInMonths = today.diff(birthDayjs, 'month');
      return ageInMonths;
    }
    return null;
  };

  const formatAge = (ageInMonths) => {
    if (ageInMonths === null) return 'Unknown';
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0 || parts.length === 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return dayjs(date).format('DD/MM/YYYY');
  };

  const handleSelectAll = (checked) => {
    setAllSelected(checked);
    if (checked) {
      setSelectedKoiForAction(currentKoi.map(koi => koi.id));
    } else {
      setSelectedKoiForAction([]);
    }
  };

  const handleCancelSelect = () => {
    setSelectedKoiForAction([]);
    setAllSelected(false);
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
      pondId: null,
      dateOfBirth: null,
      image: null,
    },
    onSubmit: (values) => {
      const formData = new FormData();
      const ageMonth = calculateAgeMonths(values.dateOfBirth);

      const newKoi = {
        name: values.name || "",
        variety: values.variety || "",
        sex: values.sex === "true",
        purchasePrice: parseFloat(values.purchasePrice) || 0,
        weight: parseFloat(values.weight) || 0,
        length: parseFloat(values.length) || 0,
        pondId: parseInt(values.pondId) || null,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        userId: userId,
        date: dayjs().format('YYYY-MM-DD'),
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
          toast.success("Koi added successfully");
          refetch();
          handleCloseAddKoiModal();
        },
        onError: (error) => {
          console.error("Error adding koi:", error);
          toast.error(`Error adding koi: ${error.message}`);
        },
      });
    },
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[450px]">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-[450px]">
      <div className="flex justify-center items-center text-bold text-3xl h-full m-4 mt-1">
        <strong>My Koi</strong>
      </div>
      
      {lstPond?.length === 0 ? (
         <div className="flex flex-row items-center justify-center space-x-4">
         <div className="text-lg">You have no Koi</div>
         <Button 
           className="w-40 h-auto min-h-[2.5rem] py-2 px-4 border-black border-1 text-black rounded-full flex items-center justify-center font-bold text-lg"
           onClick={() => navigate('/pond-management')}
          >
            {t("Create a pond first!")}
          </Button>
        </div>
      
      ) : lstKoi?.length === 0 ? (
        <div className="flex flex-row items-center justify-center space-x-4">
          <div className="text-lg">You have no Koi</div>
          <Button 
           className="w-40 h-auto min-h-[2.5rem] py-2 px-4 border-black border-1 text-black rounded-full flex items-center justify-center font-bold text-lg"
           onClick={handleAddClick}
          >
            {t("Add a Koi")}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mx-4 my-6">
            <div className="flex justify-start items-center w-1/3">
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300, height: 45, fontSize: 16 }}
                className="mr-2"
                suffix={<SearchOutlined style={{ fontSize: 16 }} />}
              />
            </div> 
            <div className="flex justify-center items-center">
              <button
                className="w-40 h-auto min-h-[2.5rem] py-1 px-1 border-black border-2 rounded-full flex items-center justify-center font-bold mr-2"
                onClick={handleAddClick}
              >
                Add a new Koi
              </button>     
              <button
                className={`w-40 h-auto min-h-[2.5rem] py-1 px-1 ${selectedKoiForAction.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'} rounded-full flex items-center justify-center font-bold`}
                disabled={selectedKoiForAction.length === 0 || isDeletingKoi}
                onClick={handleDeleteSelectedKoi}
              >
                {isDeletingKoi ? "Deleting..." : "Delete Koi"}
              </button>
              <button
                className={`w-40 h-auto min-h-[2.5rem] py-1 px-1 ${selectedKoiForAction.length > 0 ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'} rounded-full flex items-center justify-center font-bold ml-2`}
                disabled={selectedKoiForAction.length === 0 || isMovingKoi}
                onClick={handleMoveSelectedKoi}
              >
                {isMovingKoi ? "Moving..." : "Move Koi"}
              </button>
            </div>
            <div className="flex justify-end items-center w-1/3">
              <Space>
                <Select
                  value={sortCriteria}
                  style={{ width: 120 }}
                  onChange={handleSortChange}
                >
                  <Option value="dateCreated">Date Created</Option>
                  <Option value="name">Name</Option>
                  <Option value="length">Length</Option>
                  <Option value="weight">Weight</Option>
                  <Option value="age">Age</Option>
                </Select>
                <Button onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                </Button>
              </Space>
              <Checkbox
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={allSelected}
                className="ml-2 mr-2 whitespace-nowrap"
              >
                Select All
              </Checkbox>
              <Button
                onClick={handleCancelSelect}
                disabled={selectedKoiForAction.length === 0}
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-14 mb-2">
            {currentKoi.map((koi, index) => {
              const age = calculateAge(koi.dateOfBirth);
              return (
                <div key={index} className="text-center relative">
                  <div 
                    className="w-full cursor-pointer rounded-xl relative flex flex-col"
                    onClick={() => handleKoiClick(koi)}
                  >
                    <div className="h-48 overflow-hidden rounded-xl relative">
                      <img
                        src={koi.imageUrl}
                        alt={koi.name}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                      <Checkbox
                        onChange={() => handleKoiSelection(koi.id)}
                        checked={selectedKoiForAction.includes(koi.id)}
                        className="absolute top-2 right-3 z-10 border-1 border-black rounded-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <h3 className="cursor-pointer mt-2 font-semibold truncate px-2">
                      {koi.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center mb-8">
            <Pagination
              current={currentPage}
              total={filteredKoi.length}
              pageSize={koiPerPage}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
      
          
          {isModalVisible && selectedKoi && (
            <div
              id="modal-overlay"
              className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-300 z-50"
              onClick={handleModalClose}
            >
              <div
                className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4 text-center">
                  {selectedKoi.name}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="absolute top-2 right-4 text-2xl font-bold"
                >
                  &times;
                </button>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 pr-4">
                    <img
                      src={selectedKoi.imageUrl}
                      alt={selectedKoi.name}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:w-1/2 mt-4 md:mt-0">
                    
                    <div className="flex justify-between m-1">
                      <strong>Length:</strong>
                      <p>{selectedKoi.length} cm</p>
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Weight:</strong>
                      <p>{selectedKoi.weight} kg</p>
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Variety:</strong>
                      <p>{selectedKoi.variety}</p>
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Gender:</strong>
                      <p>{selectedKoi.sex ? "Female" : "Male"}</p>
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Purchase Price:</strong>
                      <p>{selectedKoi.purchasePrice} VND</p>
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Date of Birth:</strong>
                      <p>{formatDate(selectedKoi.dateOfBirth)}</p>
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Age:</strong>
                      <p>{selectedKoi.age}</p>
                    </div>
                    
                    {selectedKoi.pond && (
                      <div>
                        <h4 className="font-bold">This koi is in:</h4>
                        <div className="flex items-center">
                          <img
                            src={selectedKoi.pond.imageUrl}
                            alt={selectedKoi.pond.name}
                            className="w-16 h-16 object-cover rounded-lg mr-5"
                          />
                        </div>
                        {selectedKoi.pond.name}
                      </div>
                    )}
                  </div>
                  
                </div>
                <div className="flex justify-center items-center">
                <button
                    onClick={handleUpdateKoi}
                    className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white 
                              rounded-full flex items-center justify-center font-bold mx-auto mt-8 mr-2"
                  >
                    View Details
                  </button>
                  <Button
                    onClick={handleDeleteKoi}
                    className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white 
                              rounded-full flex items-center justify-center font-bold mx-auto mt-8 ml-2"
                    disabled={isDeleting}
                    loading={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Koi"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
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
            {lstPond.map(pond => (
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
                  <Form.Item label="Weight (kg)" className="mb-1">
                    <InputNumber
                      name="weight"
                      min={0}
                      value={addKoiFormik.values.weight}
                      onChange={(value) => addKoiFormik.setFieldValue("weight", value)}
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item label="Length (cm)" className="mb-1">
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
                      value={addKoiFormik.values.dateOfBirth}
                      onChange={(date) => addKoiFormik.setFieldValue("dateOfBirth", date)}
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
              <div className="m-2">
                <div className="flex items-center space-x-4 mb-2 font-bold text-lg">
                  Pond
                </div>
                <div className="flex items-center space-x-2 mb-2 overflow-x-auto">
                  {lstPond?.map((pond) => (
                    <div
                      key={pond.id}
                      className={`flex-shrink-0 w-32 text-center cursor-pointer rounded-xl transition-all duration-300 ${
                        pond.id === addKoiFormik.values.pondId
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'filter grayscale hover:grayscale-0'
                      }`}
                      onClick={() => addKoiFormik.setFieldValue("pondId", pond.id)}
                    >
                      <img
                        src={pond.imageUrl}
                        alt={pond.name}
                        className="w-full h-20 object-cover rounded-t-xl"
                      />
                      <p className="mt-1 text-xs p-1 truncate">{pond.name}</p>
                    </div>
                  ))}
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
    </div>
  );
};

export default KoiManegement;
