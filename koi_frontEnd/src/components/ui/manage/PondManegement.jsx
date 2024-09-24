import React, { useState, useEffect } from 'react';
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";
import { useNavigate } from 'react-router-dom';
const PondManagement = () => {
    const { data: lstPond, error: pondError } = useGetAllPond();
    const { data: lstKoi, error: koiError } = useGetAllKoi();
    const [selectedPond, setSelectedPond] = useState(null);
    const [koiInPond, setKoiInPond] = useState([]);

    useEffect(() => {
        if (pondError) {
            console.error('Error fetching ponds:', pondError);
        }
        if (koiError) {
            console.error('Error fetching koi:', koiError);
        }
    }, [pondError, koiError]);

    const handleClick = (pond) => {
        setSelectedPond(pond);
        if (lstKoi) {
            const koiList = lstKoi.filter(koi => koi.pondId === pond.id);
            setKoiInPond(koiList);
        }
    };

    const navigate = useNavigate();

    const handleDetailClick = (pondId) => {
        navigate(`/pond-detail/${pondId}`);
    };

    const handleClose = () => {
        setSelectedPond(null);
        setKoiInPond([]);
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            handleClose();
        }
    };

    if (!lstPond || !lstKoi) {
        return <div>Loading...</div>;
    }

    return (
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
                        className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col "
                        style={{width: '80%', maxWidth: '500px', height: 'auto'}}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-4 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <div className="flex">
                                <img
                                    src={selectedPond.imageUrl}
                                    alt={selectedPond.name}
                                    className="w-48 h-48 object-cover mr-6  "
                                />

                            <div className="flex flex-col justify-center w-full">
                                <h3 className="text-xl font-bold mb-4 text-center">{selectedPond.name}</h3>
                                <div className="flex justify-between ">
                                    <strong>ID:</strong> <span className="text-right">{selectedPond.id}</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Width:</strong> <span
                                    className="text-right">{selectedPond.width} meters</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Length:</strong> <span
                                    className="text-right">{selectedPond.length} meters</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Depth:</strong> <span
                                    className="text-right">{selectedPond.depth} meters</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Fish Count:</strong> <span
                                    className="text-right">{koiInPond.length}</span>
                                </div>
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
                                                <li key={index} className="flex flex-col items-center mb-4">
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
    );
};

export default PondManagement;