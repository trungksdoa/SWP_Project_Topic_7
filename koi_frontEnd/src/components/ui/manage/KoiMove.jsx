import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { Spin, message, Button } from "antd";
import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";
import { manageKoiFishServices } from "../../../services/koifish/manageKoiFishServices";

const KoiMove = () => {
    const userLogin = useSelector((state) => state.manageUser.userLogin);
    const userId = userLogin?.id;
    const { data: lstKoi, isFetching: koiLoading, refetch: refetchKoi } = useGetAllKoi(userId);
    const { data: lstPond, isFetching: pondLoading, refetch: refetchPond } = useGetAllPond(userId);

    const [selectedKoi, setSelectedKoi] = useState([]);
    const [selectedPond, setSelectedPond] = useState(null);
    const [koiInSelectedPond, setKoiInSelectedPond] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const koiPerPage = 6;

    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        if (selectedPond && lstKoi) {
            const filteredKoi = lstKoi.filter(koi => koi.pondId === selectedPond.id);
            setKoiInSelectedPond(filteredKoi);
        } else {
            setKoiInSelectedPond([]);
        }
    }, [selectedPond, lstKoi]);

    if (koiLoading || pondLoading) {
        return (
            <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
                <Spin tip="Loading" size="large" />
            </div>
        );
    }

    const indexOfLastKoi = currentPage * koiPerPage;
    const indexOfFirstKoi = indexOfLastKoi - koiPerPage;
    const currentKoi = lstKoi ? lstKoi.slice(indexOfFirstKoi, indexOfLastKoi) : [];

    const pageCount = Math.ceil((lstKoi?.length || 0) / koiPerPage);

    const handleKoiClick = (koi) => {
        if (selectedPond) {
            // Update the koi's pondId to the selected pond's id
            const updatedKoi = { ...koi, pondId: selectedPond.id };
            setSelectedKoi(prev => 
                prev.includes(koi) 
                    ? prev.filter(k => k !== koi) 
                    : [...prev, updatedKoi]
            );
        } else {
            message.warning("Please select a destination pond first.");
        }
    };

    const handlePondClick = (pond) => {
        setSelectedPond(prev => prev === pond ? null : pond);
        // Clear selected koi when changing ponds
        setSelectedKoi([]);
    };

    const handleDotClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleMoveKoi = async () => {
        if (!selectedPond) {
            message.error("Please select a destination pond.");
            return;
        }
        if (selectedKoi.length === 0) {
            message.error("Please select at least one Koi to move.");
            return;
        }

        setIsMoving(true);
        try {
            for (const koi of selectedKoi) {
                const formData = new FormData();
                const updatedKoi = {
                    ...koi,
                    pondId: selectedPond.id
                };
                formData.append("fish", JSON.stringify(updatedKoi));
                await manageKoiFishServices.updateKoi(koi.id, formData);
            }
            message.success(`Successfully moved ${selectedKoi.length} Koi to ${selectedPond.name}.`);
            setSelectedKoi([]);
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

    return (
        <div className="mb-16">
            <BreadcrumbComponent
                items={[{ name: "Home", path: "/" }, { name: "Move Koi" }]}
            />
            <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
                <strong>Move Koi</strong>
            </div>
            <div className="flex flex-row space-x-4">
                {/* First column: Koi list */}
                <div className="w-1/4 bg-gray-100 p-4 rounded-lg flex flex-col justify-between" style={{ minHeight: '520px' }}>
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-center">Koi List</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {currentKoi && currentKoi.map((koi, index) => (
                                <div 
                                    key={index} 
                                    className={`text-center cursor-pointer ${
                                        selectedKoi.some(k => k.id === koi.id) ? 'border-4 border-blue-500' : ''
                                    }`}
                                    onClick={() => handleKoiClick(koi)}
                                >
                                    <img
                                        src={koi.imageUrl}
                                        alt={koi.name}
                                        className="w-full h-24 object-cover rounded-lg mb-2"
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

                {/* Second column: Selected Pond Information and Koi List */}
                <div className="w-1/2 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">Selected Pond Information</h2>
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
                                            <div key={index} className="text-center">
                                                <img
                                                    src={koi.imageUrl}
                                                    alt={koi.name}
                                                    className="w-full h-16 object-cover rounded-lg mb-1"
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

                {/* Third column: Pond list */}
                <div className="w-1/4 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">Pond List</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {lstPond && lstPond.map((pond, index) => (
                            <div 
                                key={index} 
                                className={`text-center cursor-pointer ${selectedPond === pond ? 'border-4 border-blue-500' : ''}`}
                                onClick={() => handlePondClick(pond)}
                            >
                                <img
                                    src={pond.imageUrl}
                                    alt={pond.name}
                                    className="w-full h-24 object-cover rounded-lg mb-2"
                                />
                                <p className="font-semibold">{pond.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add a new row for the "Move" button */}
                
            </div>
            <div className="flex justify-center mt-4">
                    <Button
                    className="bg-black text-white hover:bg-gray-800 px-8 py-2 text-xl font-bold"
                    onClick={handleMoveKoi}
                    disabled={isMoving || !selectedPond || selectedKoi.length === 0}
                    loading={isMoving}
                    >
                        {isMoving ? "Moving..." : "Move Selected Koi"}
                    </Button>
                </div>
        </div>
    );
};

export default KoiMove;
