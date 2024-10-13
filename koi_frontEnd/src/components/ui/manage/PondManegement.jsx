import React, { useState } from "react";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input, Spin, Modal } from "antd"; // Removed Radio
import { toast } from "react-toastify";
import { useUpdatePond } from "../../../hooks/koi/useUpdatePond";
import { useDeletePond } from "../../../hooks/koi/useDeletePond"; // Add this import
import { managePondActions } from "../../../store/managePond/slice";
import { LOCAL_STORAGE_POND_KEY } from "../../../constant/localStorage";
import { useAddPond } from "../../../hooks/koi/useAddPond";
import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { Select } from 'antd';
import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi"; // Assuming you have this hook

const { Option } = Select;

const PondManagement = () => {
  const [selectedPond, setSelectedPond] = useState(null);
  const [koiInPond, setKoiInPond] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState(true);
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

  const { data: lstKoi } = useGetAllKoi(userId);
  const { data: lstPond, refetch, isFetching } = useGetAllPond(userId);
  console.log(lstPond);
  const mutation = useUpdatePond();
  const addPondMutation = useAddPond();

  const handleClick = (pond) => {
    setSelectedPond(pond);
    setComponentDisabled(true);
    if (lstKoi) {
      const koiList = lstKoi.filter((koi) => koi.pondId === pond.id);
      setKoiInPond(koiList);
    }
    setImgSrc(pond.imageUrl);
  };

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
    navigate(`/pond-detail/${pondId}`);
  };

  const handleClose = () => {
    setSelectedPond(null);
    setKoiInPond([]);
    setImgSrc("");
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
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
            const updatedList = lstPond.map((pond) =>
              pond.id === updatedPondWithImage.id ? updatedPondWithImage : pond
            );
            localStorage.setItem(
              LOCAL_STORAGE_POND_KEY,
              JSON.stringify(updatedList)
            );
            refetch();
            toast.success("Pond updated successfully");

            setSelectedPond(null); // Close the popup
            setImgSrc("");
            setComponentDisabled(true);
          },
          onError: (error) => {
            toast.error(`Error updating pond: ${error.message}`);
          },
        }
      );
    },
  });

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

  const handlePondSelect = (pondId) => {
    setSelectedPond(pondId);
    const otherPondOptions = lstPond
      .filter(pond => pond.id !== pondId)
      .map(pond => ({ value: pond.id, label: pond.name }));
    setOtherPonds(otherPondOptions);
    setSelectedDestinationPonds([]);
  };

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
                  Modal.destroyAll(); // Close the modal
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
                  Modal.destroyAll(); // Close the modal
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
                  Modal.destroyAll(); // Close the modal
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
      toast.success("Pond and fish deleted successfully!");
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

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Pond Management" }]}
      />
      <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
        <strong>Pond Management</strong>
      </div>
      {/* Add Koi message */}
      {lstPond?.length > 0 && (!lstKoi || lstKoi.length === 0) && (
        <div className="flex items-center justify-center">
          <Button 
            className="w-50 h-auto min-h-[2.5rem] text-xl py-2 px-4 bg-black text-white rounded-full flex items-center justify-center font-bold"
            onClick={() => navigate('/koi-management')}
          >
            Let's add koi!
          </Button>
        </div>
      )}
      {/* Add Pond button - always visible */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={handleAddClick}
          className="w-50 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white 
                    rounded-full flex items-center justify-center font-bold"
        >
          Add a new Pond
        </button>
      </div>
      <div className="container grid grid-cols-4 gap-6 my-16">
        {lstPond &&
          lstPond.map((pond, index) => (
            <div key={index} className="text-center">
              <img
                onClick={() => handleClick(pond)}
                src={pond.imageUrl}
                alt={pond.name}
                className="w-[100%] max-h-[200px] object-cover cursor-pointer"
              />
              <h3
                className="text-lg mt-2 cursor-pointer"
                onClick={() => handleClick(pond)}
              >
                {pond.name}
              </h3>
            </div>
          ))}

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
                    className="w-80 h-70 object-cover"
                  />
                  <div className="mt-2">
                    <strong>Image:</strong>
                    <input
                      type="file"
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                      onChange={handleAddPondChangeFile}
                    />
                    {imgSrc && (
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
                      <strong>Width:</strong>
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
                      <strong>Length:</strong>
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
                      <strong>Depth:</strong>
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

                    <Form.Item className="mt-4">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={addPondMutation.isLoading}
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

        {selectedPond && (
          <div
            id="modal-overlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOutsideClick}
          >
            <div
              className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
              style={{ width: "80%", maxWidth: "700px" }}
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
                        style={{ color: "black" }}
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Width:</strong>
                      <Input
                        className="text-right w-1/2 pr-2"
                        style={{ color: "black" }}
                        min={0}
                        type="number"
                        name="width"
                        value={formik.values.width}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Length:</strong>
                      <Input
                        className="text-right w-1/2 pr-2"
                        style={{ color: "black" }}
                        min={0}
                        type="number"
                        name="length"
                        value={formik.values.length}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="flex justify-between m-1">
                      <strong>Depth:</strong>
                      <Input
                        className="text-right w-1/2 pr-2"
                        style={{ color: "black" }}
                        min={0}
                        type="number"
                        name="depth"
                        value={formik.values.depth}
                        onChange={formik.handleChange}
                      />
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={componentDisabled}
                        loading={mutation.isPending}
                      >
                        Update
                      </Button>
                      <Button
                        type="primary"
                        danger
                        onClick={() => handleDeleteClick(selectedPond.id)}
                        disabled={componentDisabled}
                        loading={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
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
                  <h4 className="text-lg font-bold mb-2">
                    There is no Koi in Pond
                  </h4>
                )}
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default PondManagement;