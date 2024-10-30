import { useState } from "react";
import { Modal, Button, Checkbox, Spin } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { Modal as AntModal } from "antd";
import { useDeleteGrowth } from "../../../hooks/koi/useDeleteGrowth";
import { toast } from "react-toastify";

const GrowthListModal = ({
  growthData,
  isGrowthListVisible,
  hideGrowthList,
  isOpenAddGrowthModal,
  isLoading,
  isError,
  error,
  refetchGrowthData,
}) => {
  // State
  const [allGrowthSelected, setAllGrowthSelected] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [selectedGrowths, setSelectedGrowths] = useState([]);
  

  // Hooks
  const deleteGrowthMutation = useDeleteGrowth();

  if (isLoading) {
    return (
      <Modal visible={isLoading} footer={null}>
        <Spin size="large" />
      </Modal>
    );
  }
  // Helper function
  const getStatusText = (status) => {
    const statusMap = {
      1: "Slow Growth",
      2: "Fast Growth",
      3: "Normal Growth",
      4: "Initial Measurement",
      5: "Single Measurement",
    };
    return statusMap[status] || "Unknown";
  };

  // Handlers
  const handleAddGrowth = () => {
    isOpenAddGrowthModal(true);
  };

  const handleSelectAllGrowth = (checked) => {
    setAllGrowthSelected(checked);
    setSelectedGrowths(checked ? growthData.map((growth) => growth.id) : []);
  };

  const handleCancelSelectGrowth = () => {
    setSelectedGrowths([]);
    setAllGrowthSelected(false);
  };

  const handleGrowthCheckboxChange = (growthId) => {
    setSelectedGrowths((prev) => {
      const newSelection = prev.includes(growthId)
        ? prev.filter((id) => id !== growthId)
        : [...prev, growthId];
      setAllGrowthSelected(newSelection.length === growthData.length);
      return newSelection;
    });
  };

  const handleDeleteSelectedGrowths = async () => {
    AntModal.confirm({
      title: "Delete Growth History",
      content: `Are you sure you want to delete these growth history? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setIsDeletingMultiple(true);
        try {
          await deleteSelectedGrowths();
          hideGrowthList();
        } finally {
          setIsDeletingMultiple(false);
        }
      },
    });
  };

  const deleteSelectedGrowths = async () => {
    setIsDeletingMultiple(true);
    try {
      for (const growthId of selectedGrowths) {
        await deleteGrowthMutation.mutateAsync(growthId);
      }
      await refetchGrowthData();
      toast.success(
        `Successfully deleted ${selectedGrowths.length} growth history!`
      );
      setSelectedGrowths([]);
    } catch (error) {
      toast.error(`Error deleting growth entries: ${error.message}`);
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  // Error handling
  if (isError) {
    return <div>Error loading growth data: {error.message}</div>;
  }

  return (
    <Modal
      open={isGrowthListVisible}
      onCancel={hideGrowthList}
      footer={[
        <div key="footer" className="flex justify-between items-center">
          <div>
            <Button
              className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleAddGrowth}
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </div>
          <Button onClick={hideGrowthList}>Close</Button>
        </div>,
      ]}
      width={700}
    >
      <div className="flex justify-between items-center mb-4 mr-6">
        <h2 className="text-2xl font-bold">Growth List</h2>
        <div className="flex items-center">
          <Button
            className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleAddGrowth}
            icon={<PlusOutlined />}
          >
            Add Growth
          </Button>
          <Checkbox
            onChange={(e) => handleSelectAllGrowth(e.target.checked)}
            checked={allGrowthSelected}
            className="mr-2"
          >
            Select All
          </Checkbox>
          <Button
            onClick={handleCancelSelectGrowth}
            disabled={selectedGrowths.length === 0 || isDeletingMultiple}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            onClick={handleDeleteSelectedGrowths}
            disabled={selectedGrowths.length === 0 || isDeletingMultiple}
            icon={isDeletingMultiple ? <LoadingOutlined /> : <DeleteOutlined />}
          >
            {isDeletingMultiple
              ? `Deleting ${selectedGrowths.length} entries...`
              : `Delete History (${selectedGrowths.length})`}
          </Button>
        </div>
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
            <span className="ml-2">Loading growth data...</span>
          </div>
        ) : growthData && growthData.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {growthData.map((entry, index) => (
              <div
                key={index}
                className="border p-2 rounded-lg shadow text-sm relative"
              >
                <Checkbox
                  className="absolute top-2 right-2"
                  checked={selectedGrowths.includes(entry.id)}
                  onChange={() => handleGrowthCheckboxChange(entry.id)}
                />
                <p>
                  <strong>Date:</strong> {entry.date}
                </p>
                <p>
                  <strong>Age:</strong> {entry.ageMonthHis} months
                </p>
                <p>
                  <strong>Weight:</strong> {entry.weight} kg
                </p>
                <p>
                  <strong>Length:</strong> {entry.length} cm
                </p>
                <p>
                  <strong>Status:</strong> {getStatusText(entry.status)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No growth data available for this koi.</p>
        )}
      </div>
    </Modal>
  );
};

GrowthListModal.propTypes = {
  isGrowthListVisible: PropTypes.bool.isRequired,
  hideGrowthList: PropTypes.func.isRequired,
  isOpenAddGrowthModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  refetchGrowthData: PropTypes.func.isRequired,
  growthData: PropTypes.array.isRequired,
};

export default GrowthListModal;