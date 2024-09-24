import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";
import { useGetPondById } from "../../../hooks/koi/useGetPondById.js"

const PondDetail = () => {
    const {pondId} = useParams();
    const pondIdNumber = Number(pondId);
    const {data: lstKoi, error: koiError} = useGetAllKoi();
    const [selectedKoi, setSelectedKoi] = useState(null);
    const {data: selectedPond, error: pondError, loading: pondLoading} = useGetPondById(pondIdNumber);

    useEffect(() => {
        if (selectedPond) {
            console.log('Pond data:', selectedPond);
        }
    }, [selectedPond]);

    if (koiError) {
        console.error('Error fetching koi:', koiError);
        return <div>Error loading koi.</div>;
    }

    if (pondError) {
        console.error('Error fetching pond:', pondError);
        return <div>Error loading pond details.</div>;
    }

    if (!lstKoi || pondLoading || !selectedPond) {
        return <div>Loading...</div>;
    }

    // Convert pondId from useParams to a number for comparison
    const koiInPond = lstKoi.filter(koi => koi.pondId === pondIdNumber);

    if (koiInPond.length === 0) {
        return <div>No koi found in this pond.</div>;
    }

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
<div>
        <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
            <strong>Koi in Pond ID {pondIdNumber}</strong>
        </div>
    {/*<div></div>*/
    }
    {/*<div className="flex mb-8">*/
    }
    {/*    <img*/
    }
    {/*        src={selectedPond.image}*/
    }
    {/*        alt={selectedPond.name}*/
    }
    {/*        className="w-48 h-48 object-cover"*/
    }
    {/*    />*/
    }
    {/*</div>*/
    }

    {/*<div className="flex flex-col h-48 mt-5">*/
    }
    {/*    <h3 className="text-xl font-bold mb-4 text-center">{selectedPond.name}</h3>*/
    }
    {/*    <div className="flex justify-between">*/
    }
    {/*        <strong>ID:</strong> <span className="text-right">{selectedPond.id}</span>*/
    }
    {/*    </div>*/
    }
    {/*    <div className="flex justify-between">*/
    }
    {/*        <strong>Width:</strong> <span className="text-right">{selectedPond.width} meters</span>*/
    }
    {/*    </div>*/
    }
    {/*    <div className="flex justify-between">*/
    }
    {/*        <strong>Length:</strong> <span className="text-right">{selectedPond.length} meters</span>*/
    }
    {/*    </div>*/
    }
    {/*    <div className="flex justify-between">*/
    }
    {/*        <strong>Depth:</strong> <span className="text-right">{selectedPond.depth} meters</span>*/
    }
    {/*    </div>*/
    }
    {/*    <div className="flex justify-between">*/
    }
    {/*        <strong>Fish Count:</strong> <span className="text-right">{koiInPond.length}</span>*/
    }
    {/*    </div>*/
    }
    {/*</div>*/
    }
    {/*<div></div>*/
    }
    <div className="container grid grid-cols-4 gap-6 my-16 mx-auto">
        <div className="col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {koiInPond.map((koi, index) => (
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
        </div>
        {selectedKoi && (
            <div
                id="modal-overlay"
                className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                onClick={handleOutsideClick}
            >
                <div
                    className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
                    style={{width: '80%', maxWidth: '500px'}}
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
                                <strong>Variety:</strong> <span
                                className="text-right">{selectedKoi.variety}</span>
                            </div>
                            <div className="flex justify-between ">
                                <strong>Sex:</strong> <span
                                className="text-right">{selectedKoi.sex ? 'Female' : 'Male'}</span>
                            </div>
                            <div className="flex justify-between ">
                                <strong>Purchase Price:</strong> <span
                                className="text-right">${selectedKoi.purchasePrice}</span>
                            </div>
                            <div className="flex justify-between ">
                                <strong>Breeder:</strong> <span
                                className="text-right">{selectedKoi.breeder}</span>
                            </div>
                            <div className="flex justify-between ">
                                <strong>Pond ID:</strong> <span
                                className="text-right">{selectedKoi.pondId}</span>
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
    </div>
);
}
export default PondDetail;