import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { Spin, message, Button, Modal } from "antd";
import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";
import { manageKoiFishServices } from "../../../services/koifish/manageKoiFishServices";
import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
import { toast } from "react-toastify";

const KoiMove = () => {
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.manageUser.userLogin);
    const userId = userLogin?.id;
    const { data: lstKoi, isFetching: koiLoading, refetch: refetchKoi } = useGetAllKoi(userId);
    const { data: lstPond, isFetching: pondLoading, refetch: refetchPond } = useGetAllPond(userId);

    const [selectedPond, setSelectedPond] = useState(null);
    const [koiInSelectedPond, setKoiInSelectedPond] = useState([]);
    const [filteredKoi, setFilteredKoi] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const koiPerPage = 6;

    const [isMoving, setIsMoving] = useState(false);
    const [availableSelectedKoi, setAvailableSelectedKoi] = useState([]);
    const [selectedPondKoi, setSelectedPondKoi] = useState([]);

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteKoiMutation = useDeleteKoi();

    useEffect(() => {
        if (selectedPond && lstKoi) {
            const filteredKoi = lstKoi.filter(koi => koi.pondId === selectedPond.id);
            setKoiInSelectedPond(filteredKoi);
            setFilteredKoi(lstKoi.filter(koi => koi.pondId !== selectedPond.id));
        } else {
            setKoiInSelectedPond([]);
            setFilteredKoi(lstKoi || []);
        }
    }, [selectedPond, lstKoi]);

    if (koiLoading || pondLoading) {
        return (
            <div className="flex justify-center items-center min-h-[450px]">
                <Spin tip="Loading" size="large" />
            </div>
        );
    }

    const indexOfLastKoi = currentPage * koiPerPage;
    const indexOfFirstKoi = indexOfLastKoi - koiPerPage;
    const currentKoi = filteredKoi.slice(indexOfFirstKoi, indexOfLastKoi);

    const pageCount = Math.ceil(filteredKoi.length / koiPerPage);

    const handleAvailableKoiClick = (koi) => {
        if (selectedPond) {
            const updatedKoi = { ...koi, pondId: selectedPond.id };
            setAvailableSelectedKoi(prev => 
                prev.some(k => k.id === koi.id)
                    ? prev.filter(k => k.id !== koi.id)
                    : [...prev, updatedKoi]
            );
        } else {
            message.warning("Please select a destination pond first.");
        }
    };

    const handleSelectedPondKoiClick = (koi) => {
        setSelectedPondKoi(prev => 
            prev.some(k => k.id === koi.id)
                ? prev.filter(k => k.id !== koi.id)
                : [...prev, koi]
        );
    };

    const handlePondClick = (pond) => {
        setSelectedPond(prev => prev === pond ? null : pond);
        // Clear selected koi when changing ponds
        setAvailableSelectedKoi([]);
    };

    const handleDotClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleMoveKoi = async () => {
        if (!selectedPond) {
            message.error("Please select a destination pond.");
            return;
        }
        if (availableSelectedKoi.length === 0) {
            message.error("Please select at least one Koi to move.");
            return;
        }

        setIsMoving(true);
        try {
            for (const koi of availableSelectedKoi) {
                const formData = new FormData();
                formData.append("fish", JSON.stringify(koi));
                await manageKoiFishServices.updateKoi(koi.id, formData);
            }
            message.success(`Successfully moved ${availableSelectedKoi.length} Koi to ${selectedPond.name}.`);
            setAvailableSelectedKoi([]);
            setSelectedPond(null);
            
            // Refetch both koi and pond data
            await Promise.all([refetchKoi(), refetchPond()]);
            
            // Reset the current page to 1 after refetching
            setCurrentPage(1);
        } catch (error) {
            console.error("Error moving Koi:", error);
            message.error("Failed to move Koi. Please try again.");
        } finally {
            setIsMoving(false);
        }
    };

    const handleDeleteClick = () => {
        if (selectedPondKoi.length === 0) {
            message.error("Please select at least one Koi to delete.");
            return;
        }

        Modal.confirm({
            title: 'Delete Koi',
            content: `Are you sure you want to delete ${selectedPondKoi.length} koi?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteKoi();
            },
        });
    };

    const deleteKoi = async () => {
        setIsDeleting(true);
        try {
            for (const koi of selectedPondKoi) {
                await deleteKoiMutation.mutateAsync(koi.id);
            }
            toast.success(`Successfully deleted ${selectedPondKoi.length} Koi!`);
            setSelectedPondKoi([]);
            
            // Refetch koi data
            await refetchKoi();
            
        } catch (error) {
            console.error("Error deleting Koi:", error);
            toast.error(`Error deleting koi: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mb-16">
            <BreadcrumbComponent
                items={[{ name: "Home", path: "/" }, { name: "Move Koi" }]}
            />
            <Button onClick={() => navigate('/pond-management')} className="bg-gray-200 hover:bg-gray-300 mt-2 ">
                Return
            </Button>
            <div className="flex justify-center items-center text-bold text-3xl h-full mb-2">
                <strong>Move Koi</strong>
            </div>
            
            <div className="flex flex-row space-x-4">
                {/* First column: Pond list (previously third column) */}
                <div className="w-1/4 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">Pond List</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {lstPond && lstPond.map((pond, index) => (
                            <div 
                                key={index} 
                                className={`text-center cursor-pointer rounded-lg overflow-hidden ${
                                    selectedPond === pond ? 'bg-blue-100 border-2 border-blue-500' : ''
                                }`}
                                onClick={() => handlePondClick(pond)}
                            >
                                <img
                                    src={pond.imageUrl}
                                    alt={pond.name}
                                    className="w-full h-24 object-cover mb-2"
                                />
                                <p className="font-semibold">{pond.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second column: Selected Pond Information and Koi List (unchanged) */}
                <div className="w-1/2 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">Moving Control</h2>
                    {selectedPond ? (
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-row space-x-4">
                                {/* Left column: Image */}
                                <div className="w-1/2 flex justify-center items-center">
                                    <div className="w-40 h-32 overflow-hidden rounded-lg">
                                        <img
                                            src={selectedPond.imageUrl}
                                            alt={selectedPond.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                
                                {/* Right column: Pond information */}
                                <div className="w-1/2 flex max-w-xs justify-center">
                                    <div className="grid grid-cols-2 gap-2">
                                        <p className="font-semibold text-left">Name:</p>
                                        <p>{selectedPond.name}</p>

                                        <p className="font-semibold text-left">Width:</p>
                                        <p>{selectedPond.width} meters</p>

                                        <p className="font-semibold text-left">Length:</p>
                                        <p>{selectedPond.length} meters</p>

                                        <p className="font-semibold text-left">Depth:</p>
                                        <p>{selectedPond.depth} meters</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Koi list in the second row */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Koi in Pond</h3>
                                {koiInSelectedPond.length === 0 ? (
                                    <p className="text-center text-gray-500">No koi in this pond.</p>
                                ) : (
                                    <div className="grid grid-cols-6 gap-2">
                                        {koiInSelectedPond.map((koi, index) => (
                                            <div 
                                                key={index} 
                                                className={`text-center cursor-pointer rounded-lg overflow-hidden ${
                                                    selectedPondKoi.some(k => k.id === koi.id) ? 'bg-red-100 border-2 border-red-500' : ''
                                                }`}
                                                onClick={() => handleSelectedPondKoiClick(koi)}
                                            >
                                                <img
                                                    src={koi.imageUrl}
                                                    alt={koi.name}
                                                    className="w-full h-16 object-cover mb-1"
                                                />
                                                <p className="text-xs font-semibold truncate">{koi.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Select a pond</p>
                    )}
                </div>

                {/* Third column: Available Koi list (previously first column) */}
                <div className="w-1/4 bg-gray-100 p-4 rounded-lg flex flex-col justify-between" style={{ minHeight: '520px' }}>
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-center">
                            {selectedPond ? "Available Koi" : "All Koi"}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {currentKoi.map((koi, index) => (
                                <div 
                                    key={index} 
                                    className={`text-center cursor-pointer rounded-lg overflow-hidden ${
                                        availableSelectedKoi.some(k => k.id === koi.id) ? 'bg-blue-100 border-2 border-blue-500' : ''
                                    }`}
                                    onClick={() => handleAvailableKoiClick(koi)}
                                >
                                    <img
                                        src={koi.imageUrl}
                                        alt={koi.name}
                                        className="w-full h-24 object-cover mb-2"
                                    />
                                    <p className="font-semibold">{koi.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Dot pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: pageCount }, (_, i) => (
                            <button
                                key={i}
                                className={`h-2 w-2 rounded-full mx-1 ${
                                    currentPage === i + 1 ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                                onClick={() => handleDotClick(i + 1)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <Button
                    className="bg-black text-white hover:bg-gray-800 px-8 py-2 text-xl font-bold"
                    onClick={handleMoveKoi}
                    disabled={isMoving || !selectedPond || availableSelectedKoi.length === 0}
                    loading={isMoving}
                >
                    {isMoving ? "Moving..." : "Move Selected Koi"}
                </Button>
                <Button
                    className="bg-red-600 text-white hover:bg-red-700 px-8 py-2 text-xl font-bold"
                    onClick={handleDeleteClick}
                    disabled={isDeleting || selectedPondKoi.length === 0}
                    loading={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete Selected Koi"}
                </Button>
            </div>
        </div>
    );
};

export default KoiMove;
