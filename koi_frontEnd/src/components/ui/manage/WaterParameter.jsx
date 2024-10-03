import React, { useState } from 'react';
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useGetWaterParameters } from "../../../hooks/koi/useGetWaterParameters.js"; 
import { useSelector } from 'react-redux';
import { Button } from "antd";

const WaterParameter = () => {
	const [selectedPond, setSelectedPond] = useState(null);
	const userLogin = useSelector((state) => state.manageUser.userLogin);
	const userId = userLogin?.id;

	const { data: lstPond } = useGetAllPond(userId);
	const { data: waterParameters, isLoading, refetch } = useGetWaterParameters(selectedPond?.id);

	const handleClick = (pond) => {
		setSelectedPond(pond);
	};

	const handleClose = () => {
		setSelectedPond(null);
	};

	const handleOutsideClick = (e) => {
		if (e.target.id === 'modal-overlay') {
			setSelectedPond(null);
		}
	};

	if (!lstPond) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="flex justify-center items-center text-bold text-3xl h-full m-8">
				<strong>Water Parameter</strong>
			</div>

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
			</div>

			{selectedPond && (
				<div
					id="modal-overlay"
					className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
					onClick={handleOutsideClick}
				>
					<div
						className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
						style={{width: '60%', maxWidth: '500px'}}
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
							</div>

							<div className="flex flex-col w-full">
								{isLoading ? (
									<p>Loading water parameters...</p>
								) : waterParameters ? (
									<div>
										<div className="flex justify-between m-1">
											<strong>pH:</strong>
											<span>{waterParameters.pH}</span>
										</div>
										<div className="flex justify-between m-1">
											<strong>Temperature:</strong>
											<span>{waterParameters.temperature}°C</span>
										</div>
										<div className="flex justify-between m-1">
											<strong>Ammonia:</strong>
											<span>{waterParameters.ammonia} ppm</span>
										</div>
										<div className="flex justify-between m-1">
											<strong>Nitrite:</strong>
											<span>{waterParameters.nitrite} ppm</span>
										</div>
										<div className="flex justify-between m-1">
											<strong>Nitrate:</strong>
											<span>{waterParameters.nitrate} ppm</span>
										</div>
										<div className="flex justify-between m-1">
											<strong>Dissolved Oxygen:</strong>
											<span>{waterParameters.dissolvedOxygen} mg/L</span>
										</div>
									</div>
								) : (
									<p>No water parameters available for this pond.</p>
								)}
							</div>
						</div>
						<Button
							type="primary"
							onClick={() => refetch()}
							className="mt-4"
							disabled={isLoading}
						>
							Refresh Data
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default WaterParameter;
