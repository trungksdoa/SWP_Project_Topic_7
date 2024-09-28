import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllKoi } from '../../../hooks/koi/useGetAllKoi';

const KoiManagement = () => {
    const [selectedKoi, setSelectedKoi] = useState(null);
    const userLogin = useSelector((state) => state.manageUser.userLogin)
    const userId = userLogin?.id
    const [isUpdated, setIsUpdated] = useState(false);

    const {data: lstKoi} = useGetAllKoi(userId)

    const handleClick = (koi) => {
        setSelectedKoi(koi);
    };

    const handleClose = () => {
        setSelectedKoi(null);
        setIsUpdated(false);

    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            setSelectedKoi(null);
            setIsUpdated(false);

        }
    };
    
    const handleUpdateClick = () => {
        setIsUpdated(prevState => !prevState);
    };

    
    if (!lstKoi) {
        return <div>Loading...</div>;
    }


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
                            className="absolute -top-1 right-2 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <div className="flex flex-row">
                            <img
                                src={selectedKoi.imageUrl}
                                alt={selectedKoi.name}
                                className="w-48 h-50 object-cover mr-6"
                            />
                            <div className="flex flex-col justify-center w-full">
                                <div className="flex justify-between m-1">
                                    <strong>Name:</strong> <span
                                    className={`text-right ${isUpdated ? 'border-2 border-black rounded w-1/2 pr-2' : 'pr-2'}`}>{selectedKoi.name}</span>
                                </div>
                                <div className="flex justify-between m-1">
                                    <strong>Variety:</strong> <span
                                    className={`text-right ${isUpdated ? 'border-2 border-black rounded w-1/2 pr-2' : 'pr-2'}`}>{selectedKoi.variety}</span>
                                </div>
                                <div className="flex justify-between m-1">
                                    <strong>Sex:</strong> <span
                                    className={`text-right ${isUpdated ? 'border-2 border-black rounded w-1/2 pr-2' : 'pr-2'}`}>{selectedKoi.sex ? 'Female' : 'Male'}</span>
                                </div>
                                <div className="flex justify-between m-1">
                                    <strong>Purchase Price:</strong> <span
                                    className={`text-right ${isUpdated ? 'border-2 border-black rounded w-1/2 pr-2' : 'pr-2'}`}>${selectedKoi.purchasePrice}</span>
                                </div>
                                <div className="flex justify-between m-1">
                                    <strong>Fish ID:</strong> <span
                                    className={`text-right ${isUpdated ? 'border-2 border-black rounded w-1/2 pr-2' : 'pr-2'}`}>{selectedKoi.id}</span>
                                </div>
                                <div className="flex justify-between m-1">
                                    <strong>Pond ID:</strong> <span
                                    className={`text-right ${isUpdated ? 'border-2 border-black rounded w-1/2 pr-2' : 'pr-2'}`}>{selectedKoi.pondId}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <button className="bg-black text-white px-4 py-2 rounded mr-2">View Chart</button>
                            <button className="border border-black text-black px-4 py-2 rounded" onClick={handleUpdateClick}>Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KoiManagement;