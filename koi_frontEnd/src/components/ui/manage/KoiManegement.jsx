import React, { useState } from 'react';

const KoiManagement = ({ lstKoi }) => {
    const [selectedKoi, setSelectedKoi] = useState(null);

    const handleClick = (koi) => {
        setSelectedKoi(koi);
    };

    const handleClose = () => {
        setSelectedKoi(null);
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            setSelectedKoi(null);
        }
    };

    return (
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
                        className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
                        style={{ width: '80%', maxWidth: '500px' }}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-4 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <div className="flex flex-row">
                            <img
                                src={selectedKoi.imageUrl}
                                alt={selectedKoi.name}
                                className="w-48 h-48 object-cover mr-6"
                            />
                            <div className="flex flex-col justify-center w-full">
                                <h3 className="text-xl font-bold mb-4 text-center">{selectedKoi.name}</h3>
                                <div className="flex justify-between ">
                                    <strong>Variety:</strong> <span className="text-right">{selectedKoi.variety}</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Sex:</strong> <span className="text-right">{selectedKoi.sex ? 'Female' : 'Male'}</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Purchase Price:</strong> <span className="text-right">${selectedKoi.purchasePrice}</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Breeder:</strong> <span className="text-right">{selectedKoi.breeder}</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong>Pond ID:</strong> <span className="text-right">{selectedKoi.pondId}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <button className="bg-black text-white px-4 py-2 rounded mr-2">View Chart</button>
                            <button className="border border-black text-black px-4 py-2 rounded">Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KoiManagement;