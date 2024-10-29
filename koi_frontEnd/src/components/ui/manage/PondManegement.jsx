import React, { useState, useEffect, useMemo } from "react";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input, Spin, Modal, Select, Space, Pagination } from "antd"; // Removed Radio
import { toast } from "react-toastify";
import { useUpdatePond } from "../../../hooks/koi/useUpdatePond";
import { useDeletePond } from "../../../hooks/koi/useDeletePond"; // Add this import
import { managePondActions } from "../../../store/managePond/slice";
import { LOCAL_STORAGE_POND_KEY } from "../../../constant/localStorage";
import { useAddPond } from "../../../hooks/koi/useAddPond";
import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi"; // Assuming you have this hook
import { SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';
import { manageKoiActions } from '../../../store/manageKoi/slice';

const { Option } = Select;

const PondManagement = () => {
  const [selectedPond, setSelectedPond] = useState(null);
  const [koiInPond, setKoiInPond] = useState([]);
  const [imgSrc, setImgSrc] = useState("");
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePondMutation = useDeletePond();
  const [otherPonds, setOtherPonds] = useState([]);
  const [selectedDestinationPonds, setSelectedDestinationPonds] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteOption, setDeleteOption] = useState(null);
  const [destinationPond, setDestinationPond] = useState(null);
  const [showMoveConfirmation, setShowMoveConfirmation] = useState(false);
  const updateKoiMutation = useUpdateKoi(); // Hook to update koi
  const [isMovingFish, setIsMovingFish] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pondsPerPage = 8;
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [koiInSelectedPond, setKoiInSelectedPond] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: lstKoi } = useGetAllKoi(userId);
  const { data: lstPond, refetch, isFetching } = useGetAllPond(userId);
  const mutation = useUpdatePond();
  const addPondMutation = useAddPond();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleAddClick = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const handleOutsideClickPopup = (e) => {
    if (e.target.id === "modal-overlay") {
      setShowAddPopup(false);
    }
  };

  const handleDetailClick = (pondId) => {
    handleModalClose();
    navigate(`/pond-detail/${pondId}`, { state: { pond: selectedPond } });
  };


  const handleAddPondChangeFile = (e) => {
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
      addPondFormik.setFieldValue("image", file);
    }
  };

  const addPondFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      width: 0,
      length: 0,
      depth: 0,
      image: null,
    },
    onSubmit: (values) => {
      const newPond = {
        name: values.name,
        width: parseFloat(values.width),
        length: parseFloat(values.length),
        depth: parseFloat(values.depth),
        volume:
          parseFloat(values.width) *
          parseFloat(values.length) *
          parseFloat(values.depth),
        fishCount: 0, // Assuming a new pond starts with no fish
        userId: userId,
      };

      const payload = {
        pond: newPond,
        image: values.image,
      };

      addPondMutation.mutate(payload, {
        onSuccess: (addedPond) => {
          const newPondWithImage = {
            ...addedPond,
            imageUrl: imgSrc,
          };
          dispatch(managePondActions.addPond(newPondWithImage));
          setShowAddPopup(false);
          setImgSrc("");
          addPondFormik.resetForm();
          refetch();
          toast.success("Pond added successfully");
        },
        onError: (error) => {
          console.error("Error adding pond:", error);
          toast.error(`Error adding pond: ${error.message}`);
        },
      });
    },
  });



  const handleDeleteClick = (pondId) => {
    const pond = lstPond.find(p => p.id === pondId);
    const fishCount = koiInSelectedPond.length;

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
                loading={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete fish and pond'}
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
      onCancel: handleModalClose, 
    });
  };

  const deletePond = async (pondId) => {
    setIsDeleting(true);
    try {
      await deletePondMutation.mutateAsync(pondId);
      toast.success("Pond deleted successfully!");
      setSelectedPond(null);
      refetch();
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
      // Get all koi in the pond to be deleted
      const koiToMove = lstKoi.filter(koi => koi.pondId === selectedPond.id);

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
              toast.error(`Error updating koi ${koi.id}: ${error.message}`);
            }
          }
        );
      }));

      // Delete the original pond
      await deletePondMutation.mutateAsync(selectedPond.id);

      toast.success("Fish moved and pond deleted successfully!");
      setShowMoveConfirmation(false);
      setSelectedPond(null);
      setDestinationPond(null);
      refetch();
    } catch (error) {
      console.error("Error moving fish:", error);
      toast.error(`Error moving fish: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setIsMovingFish(false);
    }
  };

  const sortedPonds = useMemo(() => {
    if (!lstPond) return [];
    return [...lstPond].sort((a, b) => {
      let comparison = 0;
      switch (sortCriteria) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'length':
          comparison = a.length - b.length;
          break;
        case 'width':
          comparison = a.width - b.width;
          break;
        case 'depth':
          comparison = a.depth - b.depth;
          break;
        case 'dateCreated':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'koiAmount':
          comparison = a.fishCount - b.fishCount;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [lstPond, sortCriteria, sortOrder]);

  const filteredPonds = useMemo(() => {
    return sortedPonds.filter(pond => 
      pond.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedPonds, searchTerm]);

  const indexOfLastPond = currentPage * pondsPerPage;
  const indexOfFirstPond = indexOfLastPond - pondsPerPage;
  const currentPonds = filteredPonds.slice(indexOfFirstPond, indexOfLastPond);

  const handleSortChange = (value) => {
    setSortCriteria(value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePondClick = (pond) => {
    setSelectedPond(pond);
    const koiInPond = lstKoi.filter(koi => koi.pondId === pond.id);
    setKoiInSelectedPond(koiInPond);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPond(null);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[450px]">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-[450px]">
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Pond Management" }]}
      />
        <div className="flex justify-center items-center text-bold text-3xl h-full m-4 mt-1">
          <strong>My Pond</strong>
        </div>
      {/* Add Koi message */}
      {lstPond?.length > 0 && (!lstKoi || lstKoi.length === 0) && (
        <div className="flex flex-row items-center justify-center space-x-4">
          <div className="text-lg">You have no Koi</div>
          <Button 
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 border-black border-1 text-black rounded-full flex items-center justify-center font-bold text-lg"
            onClick={() => navigate('/add-koi')}
          >
            Add a Koi
          </Button>
        </div>
      )}

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
        <div className="flex justify-center items-center w-1/3">
          <button
            onClick={handleAddClick}
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white 
                      rounded-full flex items-center justify-center font-bold"
          >
            Add a new Pond
          </button>
          {/* <button
            onClick={() => navigate('/move-koi')}
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-orange-500 text-white 
                      rounded-full flex items-center justify-center font-bold ml-2"
          >
            Move Koi
          </button> */}
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
              <Option value="width">Width</Option>
              <Option value="depth">Depth</Option>
              <Option value="dateCreated">Date Created</Option>
              <Option value="koiAmount">Koi Amount</Option>
            </Select>
            <Button onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            </Button>
          </Space>
        </div>
      </div>


      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-16 mb-2">
        {currentPonds.map((pond, index) => (
          <div key={index} className="text-center flex flex-col items-center">
            <div 
              className="w-full h-48 overflow-hidden cursor-pointer rounded-xl"
              onClick={() => handlePondClick(pond)}
            >
              <img
                src={pond.imageUrl}
                alt={pond.name}
                className="w-full h-full object-cover transition-transform duration-300 rounded-xl"
              />
            </div>
            <h3
              className="text-lg mt-2 cursor-pointer"
              onClick={() => handlePondClick(pond)}
            >
              {pond.name}
            </h3>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <Pagination
          current={currentPage}
          total={filteredPonds.length}
          pageSize={pondsPerPage}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>

      {showAddPopup && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClickPopup}
        >
          <div
            className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col rounded-xl"
            style={{ width: "80%", maxWidth: "700px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Add New Pond
            </h2>
            <button
              onClick={handleCloseAddPopup}
              className="absolute -top-1 right-2 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="flex flex-row">
              <div className="mr-6">
                <img
                  src={imgSrc || "placeholder-image-url"}
                  className="w-80 h-40 object-cover"
                />
                <div className="mt-2">
                  <strong>Image:</strong>
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                    onChange={handleAddPondChangeFile}
                  />
                  
                </div>
              </div>
              <div className="flex flex-col w-full">
                <Form onFinish={addPondFormik.handleSubmit}>
                  <div className="flex justify-between m-1">
                    <strong>Name:</strong>
                    <Input
                      className="text-right w-1/2 pr-2"
                      style={{ color: "black" }}
                      name="name"
                      value={addPondFormik.values.name}
                      onChange={addPondFormik.handleChange}
                    />
                  </div>
                  <div className="flex justify-between m-1">
                    <strong>Width (meters):</strong>
                    <Input
                      className="text-right w-1/2 pr-2"
                      style={{ color: "black" }}
                      name="width"
                      min={0}
                      type="number"
                      value={addPondFormik.values.width}
                      onChange={addPondFormik.handleChange}
                    />
                  </div>
                  <div className="flex justify-between m-1">
                    <strong>Length (meters):</strong>
                    <Input
                      className="text-right w-1/2 pr-2"
                      style={{ color: "black" }}
                      name="length"
                      min={0}
                      type="number"
                      value={addPondFormik.values.length}
                      onChange={addPondFormik.handleChange}
                    />
                  </div>
                  <div className="flex justify-between m-1">
                    <strong>Depth (meters):</strong>
                    <Input
                      className="text-right w-1/2 pr-2"
                      style={{ color: "black" }}
                      name="depth"
                      min={0}
                      type="number"
                      value={addPondFormik.values.depth}
                      onChange={addPondFormik.handleChange}
                    />
                  </div>

                  <Form.Item className="flex justify-center mt-6 mb-2">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-40 h-auto min-h-[2.5rem] py-2 px-2 bg-black text-white rounded-full font-bold mt-4"
                      loading={addPondMutation.isPending}
                    >
                      Add Pond
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalVisible && selectedPond && (
        <Modal
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={800}
        >
          <div className="p-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 ml-4">
                <img
                  src={selectedPond.imageUrl}
                  alt={selectedPond.name}
                  className="w-80 h-40 object-cover rounded-lg"
                />
              </div>
              <div className="md:w-1/2 mt-4 md:mt-0">
                <div className="flex justify-between m-1">
                  <strong>Name:</strong>
                  <p>{selectedPond.name}</p>
                </div>
                <div className="flex justify-between m-1">
                  <strong>Width:</strong>
                  <p>{selectedPond.width} meters</p>
                </div>
                <div className="flex justify-between m-1">
                  <strong>Length:</strong>
                  <p>{selectedPond.length} meters</p>
                </div>
                <div className="flex justify-between m-1">
                  <strong>Depth:</strong>
                  <p>{selectedPond.depth} meters</p>
                </div>
                <div className="flex justify-between m-1">
                  <strong>Volume:</strong>
                  <p>{selectedPond.volume} cubic meters</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              {koiInSelectedPond.length > 0 ? (
                <div>
                  <h4 className="font-bold text-lg mb-4 ml-4">Koi in this pond</h4>
                  <div className="flex flex-row ml-4 space-x-4 overflow-x-auto">

                    {koiInSelectedPond.map((koi, index) => (
                      <div key={index} className="flex flex-col items-center flex-shrink-0">
                        <img
                          src={koi.imageUrl}
                          alt={koi.name}
                          className="w-16 h-16 object-cover rounded-full mb-2"
                        />
                        <p className="text-center font-semibold text-sm">{koi.name}</p>
                      </div>  
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">This pond has no koi.</p>
              )}
            </div>
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => handleDetailClick(selectedPond.id)}
                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold mr-2"
              >
                View Details
              </Button>
              <Button
                onClick={() => {
                  handleDeleteClick(selectedPond.id);
                }}
                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white rounded-full font-bold ml-2"
              >
                Delete Pond
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showDeleteConfirmation && (
        <div
          id="delete-confirmation-overlay"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 w-500 h-full"
          onClick={() => setShowDeleteConfirmation(false)}
        >
          <div
            className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
            style={{ width: "500px", maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            {koiInPond.length > 0 && (
              <>
                <p>Select destination ponds for the fish:</p>
                <DualListBox
                  options={otherPonds}
                  selected={selectedDestinationPonds}
                  onChange={(selected) => setSelectedDestinationPonds(selected)}
                  canFilter
                />
              </>
            )}
            <div className="flex justify-end mt-4">
              <Button
                type="default"
                onClick={() => setShowDeleteConfirmation(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleDelete}
                loading={isDeleting}
              >
                Confirm Delete
              </Button>
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
    </div>
  );
};

export default PondManagement;
