// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useFormik } from "formik";
// import {
//   Button,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   DatePicker,
//   Modal,
//   Spin,
// } from "antd";
// import { toast } from "react-toastify";
// import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi";
// import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
// import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
// import { manageKoiActions } from "../../../store/manageKoi/slice";
// import dayjs from "dayjs";
// import { useGetKoiByKoiId } from "../../../hooks/koi/useGetKoiByKoiId";
// import { useGetGrowth } from "../../../hooks/koi/useGetGrowth";

// import KoiGrowthChart from "./Chart";
// import AddGrowthModal from "./AddGrowthModal";
// import GrowthListModal from "./GrowthListModal";

// import {
//   DeleteOutlined,
//   LineChartOutlined,
//   HistoryOutlined,
//   EditOutlined,
// } from "@ant-design/icons";

// const KoiUpdate = () => {
//   // Router hooks
//   const { id } = useParams();
//   const navigate = useNavigate();
//   // const location = useLocation();
//   // Redux hooks
//   const dispatch = useDispatch();
//   const userLogin = useSelector((state) => state.manageUser.userLogin);
//   const userId = userLogin?.id;

//   // API Query hooks
//   const {
//     data: koi,
//     isLoading: isLoadingKoi,
//     refetch: refetchKoi,
//   } = useGetKoiByKoiId(id);

//   const { data: lstPond } = useGetAllPond(userId);

//   const {
//     data: growthData,
//     refetch: refetchGrowthData,
//     isLoading,
//     isError,
//     error,
//   } = useGetGrowth(id);

//   const formik = useFormik({
//     initialValues: {
//       name: koi?.name || "",
//       variety: koi?.variety || "",
//       sex: koi?.sex ? "true" : "false",
//       purchasePrice: koi?.purchasePrice || 0,
//       weight: koi?.weight || 0,
//       length: koi?.length || 0,
//       pondId: koi?.pondId || null,
//       dateOfBirth: koi?.dateOfBirth ? dayjs(koi.dateOfBirth) : null,
//       date: koi?.date ? dayjs(koi.date) : dayjs(),
//       imageUrl: koi?.imageUrl || "",
//     },
//     onSubmit: async (values) => {
//       Modal.confirm({
//         title: "Update Koi",
//         content: "Are you sure you want to update this koi?",
//         onOk: async () => {
//           const formData = new FormData();
//           const updatedKoi = {
//             name: values.name || "",
//             variety: values.variety || "",
//             sex: values.sex === "true",
//             purchasePrice: parseFloat(values.purchasePrice) || 0,
//             weight: parseFloat(values.weight) || 0,
//             length: parseFloat(values.length) || 0,
//             pondId: parseInt(values.pondId) || null,
//             dateOfBirth: values.dateOfBirth
//               ? values.dateOfBirth.format("YYYY-MM-DD")
//               : null,
//             userId: userId,
//             date: values.date
//               ? values.date.format("YYYY-MM-DD")
//               : dayjs().format("YYYY-MM-DD"),
//           };
//           formData.append("fish", JSON.stringify(updatedKoi));
//           formData.append("isNew", "true");
//           if (values.image) {
//             formData.append("image", values.image);
//           }

//           try {
//             await updateKoiMutation.mutateAsync(
//               { id: id, payload: formData },
//               {
//                 onSuccess: (updatedKoi) => {
//                   dispatch(manageKoiActions.updateKoi(updatedKoi));
//                   toast.success("Koi updated successfully");
//                   refetchGrowthData();
//                 },
//               }
//             );
//           } catch (error) {
//             console.error("Error updating koi:", error);
//             toast.error(`Error updating koi: ${error.message}`);
//           }
//         },
//       });
//     },
//   });

//   // UI State
//   const [imgSrc, setImgSrc] = useState("");
//   const [selectedPond, setSelectedPond] = useState(null);
//   const [koiAge, setKoiAge] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAddGrowthModalVisible, setIsAddGrowthModalVisible] = useState(false);
//   const [isGrowthListVisible, setIsGrowthListVisible] = useState(false);

//   // Pond related state
//   const [showPondInfo, setShowPondInfo] = useState(false);
//   const [selectedPondInfo, setSelectedPondInfo] = useState(null);

//   // Loading states
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Mutation hooks
//   const updateKoiMutation = useUpdateKoi();
//   const deleteKoiMutation = useDeleteKoi();


//   useEffect(() => {
//     if (koi) {
//       formik.setValues({
//         name: koi.data.name || "",
//         variety: koi.data.variety || "",
//         sex: koi.data.sex ? "true" : "false",
//         purchasePrice: koi.data.purchasePrice || 0,
//         weight: koi.data.weight || 0,
//         length: koi.data.length || 0,
//         pondId: koi.data.pondId || null,
//         dateOfBirth: koi.data.dateOfBirth ? dayjs(koi.data.dateOfBirth) : null,
//         image: null,
//         date: koi.data.date ? dayjs(koi.data.date) : dayjs(),
//         imageUrl: koi.data.imageUrl || ""
//       });

//       console.log(formik.values)
//       setImgSrc(koi.data.imageUrl);
//       setSelectedPond(koi.data.pondId);
//       calculateAge(koi.data.dateOfBirth);
//     }
//   }, [koi]);

//   if (isLoadingKoi) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   const handleAddGrowth = (status) => {
//     setIsAddGrowthModalVisible(status);
//   };
//   const calculateAge = (birthDate) => {
//     if (birthDate) {
//       const today = dayjs();
//       const birthDyjs = dayjs(birthDate);
//       const ageInMonths = today.diff(birthDyjs, "month");
//       setKoiAge(ageInMonths);
//     } else {
//       setKoiAge(null);
//     }
//   };

//   const handleViewChart = () => setIsModalVisible(true);

//   const handleModalClose = () => setIsModalVisible(false);

//   const formatAge = (ageInMonths) => {
//     if (ageInMonths === null) return "Unknown";
//     const years = Math.floor(ageInMonths / 12);
//     const months = ageInMonths % 12;

//     const parts = [];
//     if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
//     if (months > 0 || parts.length === 0)
//       parts.push(`${months} month${months !== 1 ? "s" : ""}`);

//     return parts.join(", ");
//   };

//   const handleChangeFile = (e) => {
//     const file = e.target.files?.[0];
//     if (
//       file &&
//       [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/gif",
//         "image/webp",
//       ].includes(file.type)
//     ) {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (e) => setImgSrc(e.target?.result);
//       formik.setFieldValue("image", file);
//     }
//   };

//   const handleReturn = () => navigate("/koi-management");

//   const handleDeleteClick = (koiId) => {
//     Modal.confirm({
//       title: "Delete Koi",
//       content: "Are you sure you want to delete this koi?",
//       okText: "Yes",
//       okType: "danger",
//       cancelText: "No",
//       onOk() {
//         deleteKoi(koiId);
//       },
//     });
//   };

//   const deleteKoi = async (koiId) => {
//     setIsDeleting(true);
//     try {
//       await deleteKoiMutation.mutateAsync(koiId);
//       toast.success("Koi deleted successfully!");
//       navigate("/koi-management");
//     } catch (error) {
//       toast.error(`Error deleting koi: ${error.message}`);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handlePondClick = (pond) => {
//     if (pond.id === selectedPond) {
//       setSelectedPondInfo(pond);
//       setShowPondInfo(true);
//     } else {
//       formik.setFieldValue("pondId", pond.id);
//       setSelectedPond(pond.id);
//     }
//   };

//   const showGrowthList = async () => {
//     if (!growthData || growthData.length === 0) {
//       toast.info("No growth data available. Please add growth history first.");
//     } else {
//       setIsGrowthListVisible(true);
//     }
//   };

//   const hideGrowthList = () => setIsGrowthListVisible(false);

//   return (
//     <div>
//       <div className="flex justify-between items-center">
//         <Button
//           onClick={handleReturn}
//           className="bg-gray-200 hover:bg-gray-300 m-4"
//         >
//           Return
//         </Button>
//         <div className="flex gap-2">
//           <Button
//             className="m-4 flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
//             onClick={handleViewChart}
//             icon={<LineChartOutlined />}
//           >
//             View Chart
//           </Button>
//           <Button
//             className="m-4 flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
//             onClick={showGrowthList}
//             icon={<HistoryOutlined />}
//           >
//             Growth List
//           </Button>
//         </div>
//       </div>
//       <div className="flex justify-center items-center text-bold text-3xl">
//         <strong>Koi Information</strong>
//       </div>

//       <Form onFinish={formik.handleSubmit} layout="vertical">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-8">
//           <div className="flex justify-center items-center">
//             <img
//               src={imgSrc || koi?.imageUrl}
//               alt={koi?.name || "Koi preview"}
//               className="w-80 h-80 object-cover rounded-xl mb-4 mr-4"
//             />
//           </div>
//           <div>
//             <Form.Item label="Name" className="mb-2">
//               <Input
//                 name="name"
//                 value={formik.values.name}
//                 onChange={formik.handleChange}
//                 className="w-full"
//               />
//             </Form.Item>
//             <Form.Item label="Variety" className="mb-2">
//               <Input
//                 name="variety"
//                 value={formik.values.variety}
//                 onChange={formik.handleChange}
//                 className="w-full"
//               />
//             </Form.Item>
//             <Form.Item label="Sex" className="mb-2">
//               <Select
//                 name="sex"
//                 value={formik.values.sex}
//                 onChange={(value) => formik.setFieldValue("sex", value)}
//                 className="w-full"
//               >
//                 <Select.Option value="true">Female</Select.Option>
//                 <Select.Option value="false">Male</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label="Purchase Price (VND)" className="mb-2">
//               <InputNumber
//                 name="purchasePrice"
//                 min={0}
//                 value={formik.values.purchasePrice}
//                 onChange={(value) =>
//                   formik.setFieldValue("purchasePrice", value)
//                 }
//                 className="w-full"
//               />
//             </Form.Item>
//             <Form.Item label="Weight (kg)" className="mb-2">
//               <InputNumber
//                 name="weight"
//                 min={0}
//                 value={formik.values.weight}
//                 onChange={(value) => formik.setFieldValue("weight", value)}
//                 className="w-full"
//               />
//             </Form.Item>
//           </div>
//           <div>
//             <Form.Item label="Length (cm)" className="mb-2">
//               <InputNumber
//                 name="length"
//                 min={0}
//                 value={formik.values.length}
//                 onChange={(value) => formik.setFieldValue("length", value)}
//                 className="w-full"
//               />
//             </Form.Item>
//             <Form.Item label="Date of Birth" className="mb-2">
//               <DatePicker
//                 name="dateOfBirth"
//                 value={formik.values.dateOfBirth}
//                 onChange={(date) => {
//                   formik.setFieldValue("dateOfBirth", date);
//                   calculateAge(date);
//                 }}
//                 className="w-full"
//                 disabledDate={(current) =>
//                   current && current > dayjs().endOf("day")
//                 }
//               />
//             </Form.Item>
//             <Form.Item label="Date" className="mb-2">
//               <DatePicker
//                 name="date"
//                 value={formik.values.date}
//                 onChange={(date) => {
//                   formik.setFieldValue("date", date || dayjs());
//                 }}
//                 className="w-full"
//                 disabledDate={(current) =>
//                   current && current > dayjs().endOf("day")
//                 }
//               />
//             </Form.Item>
//             <Form.Item label="Age" className="mb-2">
//               <Input
//                 value={formatAge(koiAge)}
//                 readOnly
//                 className="w-full bg-gray-100"
//               />
//             </Form.Item>
//             <Form.Item label="Image">
//               <input
//                 type="file"
//                 accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
//                 onChange={handleChangeFile}
//               />
//             </Form.Item>
//           </div>
//         </div>
//         <div className="flex justify-center items-center mx-4 my-6">
//           <Form.Item className="flex justify-center">
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="w-auto h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold mr-2 text-xl"
//               loading={updateKoiMutation.isLoading}
//             >
//               <EditOutlined /> Update
//             </Button>
//             <Button
//               onClick={() => {
//                 Modal.confirm({
//                   title: "Update without history",
//                   content:
//                     "Are you sure you want to update without update history?",
//                   onOk: () => {
//                     const formData = new FormData();
//                     const updatedKoi = {
//                       name: formik.values.name || "",
//                       variety: formik.values.variety || "",
//                       sex: formik.values.sex === "true",
//                       purchasePrice:
//                         parseFloat(formik.values.purchasePrice) || 0,
//                       weight: parseFloat(formik.values.weight) || 0,
//                       length: parseFloat(formik.values.length) || 0,
//                       pondId: parseInt(formik.values.pondId) || null,
//                       dateOfBirth: formik.values.dateOfBirth
//                         ? formik.values.dateOfBirth.format("YYYY-MM-DD")
//                         : null,
//                       userId: userId,
//                       date: formik.values.date
//                         ? formik.values.date.format("YYYY-MM-DD")
//                         : dayjs().format("YYYY-MM-DD"),
//                     };
//                     formData.append("fish", JSON.stringify(updatedKoi));
//                     formData.append("isNew", "false");
//                     if (formik.values.image) {
//                       formData.append("image", formik.values.image);
//                     }
//                     updateKoiMutation.mutate(
//                       { id: id, payload: formData },
//                       {
//                         onSuccess: (updatedKoi) => {
//                           dispatch(manageKoiActions.updateKoi(updatedKoi));
//                           toast.success("Koi updated successfully");
//                           refetchGrowthData();
//                         },
//                       }
//                     );
//                   },
//                 });
//               }}
//               className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-green-500 text-white rounded-full font-bold text-xl mx-2"
//             >
//               <EditOutlined /> Modified
//             </Button>
//             <Button
//               onClick={() => handleDeleteClick(id)}
//               className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white rounded-full font-bold text-xl mx-2"
//               loading={isDeleting}
//             >
//               <DeleteOutlined /> Delete
//             </Button>
//           </Form.Item>
//         </div>
//         <div className="items-center space-x-4 mb-4 ml-8">
//           <div className="flex items-center space-x-4 mb-4 ml-8 font-bold text-xl">
//             Pond
//           </div>
//           <div className="flex items-center gap-8 mb-8 ml-8 overflow-x-auto">
//             {lstPond?.map((pond) => (
//               <div
//                 key={pond.id}
//                 className={`flex-shrink-0 w-48 text-center cursor-pointer rounded-xl transition-all duration-300 ${
//                   pond.id === selectedPond
//                     ? "order-first bg-blue-100 border-2 border-blue-500"
//                     : "filter grayscale hover:grayscale-0"
//                 }`}
//                 onClick={() => handlePondClick(pond)}
//               >
//                 <img
//                   src={pond.imageUrl}
//                   alt={pond.name}
//                   className="w-full h-28 object-cover rounded-t-xl"
//                 />
//                 <p className="mt-1 text-sm p-2">{pond.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Form>

//       <KoiGrowthChart
//         isVisible={isModalVisible}
//         onClose={handleModalClose}
//         growthData={growthData}
//         isLoading={isLoading}
//         isError={isError}
//         error={error}
//         koiAge={koiAge}
//       />

//       <Modal
//         title="Pond Information"
//         open={showPondInfo}
//         onCancel={() => setShowPondInfo(false)}
//         footer={null}
//       >
//         {selectedPondInfo && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
//             <div className="flex justify-center items-center">
//               <img
//                 src={selectedPondInfo.imageUrl}
//                 alt={selectedPondInfo.name}
//                 className="w-full h-auto object-cover rounded mb-4"
//               />
//             </div>
//             <div className="grid grid-cols-2 mb-2 items-center">
//               <p className="font-bold text-left">Name:</p>
//               <p className="text-right">{selectedPondInfo.name}</p>

//               <p className="font-bold text-left">Length:</p>
//               <p className="text-right">{selectedPondInfo.length} meters</p>

//               <p className="font-bold text-left">Width:</p>
//               <p className="text-right">{selectedPondInfo.width} meters</p>

//               <p className="font-bold text-left">Depth:</p>
//               <p className="text-right">{selectedPondInfo.depth} meters</p>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Growth List Modal */}
//       <GrowthListModal
//         growthData={growthData}
//         isGrowthListVisible={isGrowthListVisible}
//         hideGrowthList={hideGrowthList}
//         isOpenAddGrowthModal={handleAddGrowth}
//         isLoading={isLoading}
//         isError={isError}
//       />

//       {/* Add Growth Modal */}

//       <AddGrowthModal
//         isVisible={isAddGrowthModalVisible}
//         onClose={() => setIsAddGrowthModalVisible(false)}
//         selectedPond={selectedPond}
//         lstPond={lstPond}
//         refetchGrowthData={refetchGrowthData}
//         fishId={id}
//       />
//     </div>
//   );
// };

// export default KoiUpdate;










// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useFormik } from "formik";
// import {
//   Button,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   DatePicker,
//   Modal,
//   Spin,
//   Card,
//   Typography,
//   Divider,
// } from "antd";
// import { toast } from "react-toastify";
// import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi";
// import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
// import { useGetPondById } from "../../../hooks/koi/useGetPondById";
// import { manageKoiActions } from "../../../store/manageKoi/slice";
// import dayjs from "dayjs";
// import { useGetKoiByKoiId } from "../../../hooks/koi/useGetKoiByKoiId";
// import { useGetGrowth } from "../../../hooks/koi/useGetGrowth";

// import KoiGrowthChart from "./Chart";
// import AddGrowthModal from "./AddGrowthModal";
// import GrowthListModal from "./GrowthListModal";

// import {
//   DeleteOutlined,
//   LineChartOutlined,
//   HistoryOutlined,
//   EditOutlined,
//   ArrowLeftOutlined,
// } from "@ant-design/icons";

// const { Title, Text } = Typography;

// const KoiUpdate = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const userLogin = useSelector((state) => state.manageUser.userLogin);
//   const userId = userLogin?.id;

//   const {
//     data: koi,
//     isLoading: isLoadingKoi,
//     refetch: refetchKoi,
//   } = useGetKoiByKoiId(id);

//   const {
//     data: pond,
//     isLoading: isLoadingPond,
//     refetch: refetchPond,
//   } = useGetPondById(koi?.data?.pondId);

//   const {
//     data: growthData,
//     refetch: refetchGrowthData,
//     isLoading,
//     isError,
//     error,
//   } = useGetGrowth(id);

//   const formik = useFormik({
//     initialValues: {
//       name: koi?.name || "",
//       variety: koi?.variety || "",
//       sex: koi?.sex ? "true" : "false",
//       purchasePrice: koi?.purchasePrice || 0,
//       weight: koi?.weight || 0,
//       length: koi?.length || 0,
//       pondId: koi?.pondId || null,
//       dateOfBirth: koi?.dateOfBirth ? dayjs(koi.dateOfBirth) : null,
//       date: koi?.date ? dayjs(koi.date) : dayjs(),
//       imageUrl: koi?.imageUrl || "",
//     },
//     onSubmit: async (values) => {
//       Modal.confirm({
//         title: "Update Koi",
//         content: "Are you sure you want to update this koi?",
//         onOk: async () => {
//           const formData = new FormData();
//           const updatedKoi = {
//             name: values.name || "",
//             variety: values.variety || "",
//             sex: values.sex === "true",
//             purchasePrice: parseFloat(values.purchasePrice) || 0,
//             weight: parseFloat(values.weight) || 0,
//             length: parseFloat(values.length) || 0,
//             pondId: parseInt(values.pondId) || null,
//             dateOfBirth: values.dateOfBirth
//               ? values.dateOfBirth.format("YYYY-MM-DD")
//               : null,
//             userId: userId,
//             date: values.date
//               ? values.date.format("YYYY-MM-DD")
//               : dayjs().format("YYYY-MM-DD"),
//           };
//           formData.append("fish", JSON.stringify(updatedKoi));
//           formData.append("isNew", "true");
//           if (values.image) {
//             formData.append("image", values.image);
//           }

//           try {
//             await updateKoiMutation.mutateAsync(
//               { id: id, payload: formData },
//               {
//                 onSuccess: (updatedKoi) => {
//                   dispatch(manageKoiActions.updateKoi(updatedKoi));
//                   toast.success("Koi updated successfully");
//                   refetchKoi();
//                   refetchGrowthData();
//                   refetchPond();
//                 },
//               }
//             );
//           } catch (error) {
//             console.error("Error updating koi:", error);
//             toast.error(`Error updating koi: ${error.message}`);
//           }
//         },
//       });
//     },
//   });

//   const [imgSrc, setImgSrc] = useState("");
//   const [koiAge, setKoiAge] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAddGrowthModalVisible, setIsAddGrowthModalVisible] = useState(false);
//   const [isGrowthListVisible, setIsGrowthListVisible] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const updateKoiMutation = useUpdateKoi();
//   const deleteKoiMutation = useDeleteKoi();

//   useEffect(() => {
//     if (koi) {
//       formik.setValues({
//         name: koi.data.name || "",
//         variety: koi.data.variety || "",
//         sex: koi.data.sex ? "true" : "false",
//         purchasePrice: koi.data.purchasePrice || 0,
//         weight: koi.data.weight || 0,
//         length: koi.data.length || 0,
//         pondId: koi.data.pondId || null,
//         dateOfBirth: koi.data.dateOfBirth ? dayjs(koi.data.dateOfBirth) : null,
//         image: null,
//         date: koi.data.date ? dayjs(koi.data.date) : dayjs(),
//         imageUrl: koi.data.imageUrl || "",
//       });

//       setImgSrc(koi.data.imageUrl);
//       calculateAge(koi.data.dateOfBirth);
//     }
//   }, [koi]);

//   if (isLoadingKoi || isLoadingPond) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   const calculateAge = (birthDate) => {
//     if (birthDate) {
//       const today = dayjs();
//       const birthDyjs = dayjs(birthDate);
//       const ageInMonths = today.diff(birthDyjs, "month");
//       setKoiAge(ageInMonths);
//     } else {
//       setKoiAge(null);
//     }
//   };

//   const formatAge = (ageInMonths) => {
//     if (ageInMonths === null) return "Unknown";
//     const years = Math.floor(ageInMonths / 12);
//     const months = ageInMonths % 12;

//     const parts = [];
//     if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
//     if (months > 0 || parts.length === 0)
//       parts.push(`${months} month${months !== 1 ? "s" : ""}`);

//     return parts.join(", ");
//   };

//   const handleChangeFile = (e) => {
//     const file = e.target.files?.[0];
//     if (
//       file &&
//       [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/gif",
//         "image/webp",
//       ].includes(file.type)
//     ) {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (e) => setImgSrc(e.target?.result);
//       formik.setFieldValue("image", file);
//     }
//   };

//   const handleDeleteClick = () => {
//     Modal.confirm({
//       title: "Delete Koi",
//       content: "Are you sure you want to delete this koi?",
//       okText: "Yes",
//       okType: "danger",
//       cancelText: "No",
//       onOk: async () => {
//         setIsDeleting(true);
//         try {
//           await deleteKoiMutation.mutateAsync(id);
//           toast.success("Koi deleted successfully!");
//           navigate("/koi-management");
//         } catch (error) {
//           toast.error(`Error deleting koi: ${error.message}`);
//         } finally {
//           setIsDeleting(false);
//         }
//       },
//     });
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <Button
//           onClick={() => navigate("/koi-management")}
//           icon={<ArrowLeftOutlined />}
//           className="flex items-center"
//         >
//           Back
//         </Button>
//         <div className="flex gap-2">
//           <Button
//             onClick={() => setIsModalVisible(true)}
//             icon={<LineChartOutlined />}
//             type="primary"
//           >
//             Growth Chart
//           </Button>
//           <Button
//             onClick={() => setIsGrowthListVisible(true)}
//             icon={<HistoryOutlined />}
//             type="primary"
//           >
//             Growth History
//           </Button>
//         </div>
//       </div>

//       <Title level={2} className="text-center mb-8">
//         Koi Information
//       </Title>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <Card className="shadow-lg">
//           <div className="flex justify-center mb-6">
//             <img
//               src={imgSrc || koi?.imageUrl}
//               alt={koi?.name || "Koi"}
//               className="w-full max-w-md h-auto rounded-lg object-cover"
//             />
//           </div>
//           <input
//             type="file"
//             accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
//             onChange={handleChangeFile}
//             className="mb-4"
//           />
//         </Card>

//         <Card className="shadow-lg">
//           <Form layout="vertical" onFinish={formik.handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Form.Item label="Name">
//                 <Input
//                   name="name"
//                   value={formik.values.name}
//                   onChange={formik.handleChange}
//                 />
//               </Form.Item>

//               <Form.Item label="Variety">
//                 <Input
//                   name="variety"
//                   value={formik.values.variety}
//                   onChange={formik.handleChange}
//                 />
//               </Form.Item>

//               <Form.Item label="Sex">
//                 <Select
//                   value={formik.values.sex}
//                   onChange={(value) => formik.setFieldValue("sex", value)}
//                 >
//                   <Select.Option value="true">Female</Select.Option>
//                   <Select.Option value="false">Male</Select.Option>
//                 </Select>
//               </Form.Item>

//               <Form.Item label="Purchase Price (VND)">
//                 <InputNumber
//                   name="purchasePrice"
//                   min={0}
//                   value={formik.values.purchasePrice}
//                   onChange={(value) =>
//                     formik.setFieldValue("purchasePrice", value)
//                   }
//                   className="w-full"
//                 />
//               </Form.Item>

//               <Form.Item label="Weight (kg)">
//                 <InputNumber
//                   name="weight"
//                   min={0}
//                   value={formik.values.weight}
//                   onChange={(value) => formik.setFieldValue("weight", value)}
//                   className="w-full"
//                 />
//               </Form.Item>

//               <Form.Item label="Length (cm)">
//                 <InputNumber
//                   name="length"
//                   min={0}
//                   value={formik.values.length}
//                   onChange={(value) => formik.setFieldValue("length", value)}
//                   className="w-full"
//                 />
//               </Form.Item>

//               <Form.Item label="Date of Birth">
//                 <DatePicker
//                   value={formik.values.dateOfBirth}
//                   onChange={(date) => {
//                     formik.setFieldValue("dateOfBirth", date);
//                     calculateAge(date);
//                   }}
//                   className="w-full"
//                 />
//               </Form.Item>

//               <Form.Item label="Age">
//                 <Input
//                   value={formatAge(koiAge)}
//                   readOnly
//                   className="bg-gray-50"
//                 />
//               </Form.Item>
//             </div>

//             <Divider />

//             {pond && (
//               <div className="mb-6">
//                 <Title level={4}>Current Pond</Title>
//                 <Card size="small" className="bg-gray-50">
//                   <div className="flex items-center gap-4">
//                     <img
//                       src={pond.imageUrl}
//                       alt={pond.name}
//                       className="w-24 h-24 object-cover rounded"
//                     />
//                     <div>
//                       <Text strong>{pond.name}</Text>
//                       <div className="grid grid-cols-2 gap-2 mt-2">
//                         <Text>Length: {pond.length}m</Text>
//                         <Text>Width: {pond.width}m</Text>
//                         <Text>Depth: {pond.depth}m</Text>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             )}

//             <div className="flex justify-center gap-4">
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 icon={<EditOutlined />}
//                 loading={updateKoiMutation.isLoading}
//                 className="min-w-[120px]"
//               >
//                 Update
//               </Button>
//               <Button
//                 onClick={() => {
//                   Modal.confirm({
//                     title: "Update without history",
//                     content: "Are you sure you want to update without update history?",
//                     onOk: () => {
//                       const formData = new FormData();
//                       const updatedKoi = {
//                         name: formik.values.name || "",
//                         variety: formik.values.variety || "",
//                         sex: formik.values.sex === "true",
//                         purchasePrice: parseFloat(formik.values.purchasePrice) || 0,
//                         weight: parseFloat(formik.values.weight) || 0,
//                         length: parseFloat(formik.values.length) || 0,
//                         pondId: parseInt(formik.values.pondId) || null,
//                         dateOfBirth: formik.values.dateOfBirth
//                           ? formik.values.dateOfBirth.format("YYYY-MM-DD")
//                           : null,
//                         userId: userId,
//                         date: formik.values.date
//                           ? formik.values.date.format("YYYY-MM-DD")
//                           : dayjs().format("YYYY-MM-DD"),
//                       };
//                       formData.append("fish", JSON.stringify(updatedKoi));
//                       formData.append("isNew", "false");
//                       if (formik.values.image) {
//                         formData.append("image", formik.values.image);
//                       }
//                       updateKoiMutation.mutate(
//                         { id: id, payload: formData },
//                         {
//                           onSuccess: (updatedKoi) => {
//                             dispatch(manageKoiActions.updateKoi(updatedKoi));
//                             toast.success("Koi updated successfully");
//                             refetchGrowthData();
//                           },
//                         }
//                       );
//                     },
//                   });
//                 }}
//                 icon={<EditOutlined />}
//                 className="min-w-[120px] bg-green-500 text-white hover:bg-green-600"
//               >
//                 Modified
//               </Button>
//               <Button
//                 danger
//                 icon={<DeleteOutlined />}
//                 onClick={handleDeleteClick}
//                 loading={isDeleting}
//                 className="min-w-[120px]"
//               >
//                 Delete
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       </div>

//       <KoiGrowthChart
//         isVisible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         growthData={growthData}
//         isLoading={isLoading}
//         isError={isError}
//         error={error}
//         koiAge={koiAge}
//       />

//       <GrowthListModal
//         growthData={growthData}
//         isGrowthListVisible={isGrowthListVisible}
//         hideGrowthList={() => setIsGrowthListVisible(false)}
//         isOpenAddGrowthModal={(status) => setIsAddGrowthModalVisible(status)}
//         isLoading={isLoading}
//         isError={isError}
//       />

//       <AddGrowthModal
//         isVisible={isAddGrowthModalVisible}
//         onClose={() => setIsAddGrowthModalVisible(false)}
//         selectedPond={koi?.pondId}
//         refetchGrowthData={refetchGrowthData}
//         fishId={id}
//       />
//     </div>
//   );
// };

// export default KoiUpdate;


import { useEffect, useState } from "react";

import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Card,
  Divider,
  Typography,
  InputNumber,
  DatePicker,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  ArrowsAltOutlined,
  ColumnWidthOutlined,
  VerticalAlignBottomOutlined,
  AreaChartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
import PropTypes from "prop-types";
import { manageKoiActions } from "../../../../store/manageKoi/slice";
import { useUpdateKoi } from "../../../../hooks/koi/useUpdateKoi";
import { useDeleteKoi } from "../../../../hooks/koi/useDeleteKoi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import dayjs from "dayjs";
const FormKoiUpdate = ({
  koi,
  pond,
  refetchGrowthData,
  dispatch,
  userId,
  id,
  addKoiAge,
  onUpdated,
}) => {
  const formik = useFormik({
    initialValues: {
      name: koi?.data?.name || "",
      variety: koi?.data?.variety || "",
      sex: koi?.data?.sex ? "true" : "false",
      purchasePrice: koi?.data?.purchasePrice || 0,
      weight: koi?.data?.weight || 0,
      length: koi?.data?.length || 0,
      pondId: koi?.data?.pondId || null,
      dateOfBirth: koi?.data?.dateOfBirth ? dayjs(koi.data.dateOfBirth) : null,
      date: koi?.data?.date ? dayjs(koi.data.date) : dayjs(),
      imageUrl: koi?.data?.imageUrl || "",
    },
    onSubmit: async (values) => {
      Modal.confirm({
        title: "Update Koi",
        content: "Are you sure you want to update this koi?",
        onOk: async () => {
          const formData = new FormData();
          const updatedKoi = {
            name: values.name || "",
            variety: values.variety || "",
            sex: values.sex === "true",
            purchasePrice: parseFloat(values.purchasePrice) || 0,
            weight: parseFloat(values.weight) || 0,
            length: parseFloat(values.length) || 0,
            pondId: parseInt(values.pondId) || null,
            dateOfBirth: values.dateOfBirth
              ? values.dateOfBirth.format("YYYY-MM-DD")
              : null,
            userId: userId,
            date: values.date
              ? values.date.format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD"),
          };
          formData.append("fish", JSON.stringify(updatedKoi));
          formData.append("isNew", "true");
          if (values.image) {
            formData.append("image", values.image);
          }

          try {
            await updateKoiMutation.mutateAsync(
              { id: id, payload: formData },
              {
                onSuccess: (updatedKoi) => {
                  dispatch(manageKoiActions.updateKoi(updatedKoi));
                  toast.success("Koi updated successfully");
                  onUpdated(true);
                },
              }
            );
          } catch (error) {
            console.error("Error updating koi:", error);
            toast.error(`Error updating koi: ${error.message}`);
          }
        },
      });
    },
  });
  // State
  const [imgSrc, setImgSrc] = useState("");
  const [koiAge, setKoiAge] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Effect
  useEffect(() => {
    formik.setValues({
      name: koi.data.name || "",
      variety: koi.data.variety || "",
      sex: koi.data.sex ? "true" : "false",
      purchasePrice: koi.data.purchasePrice || 0,
      weight: koi.data.weight || 0,
      length: koi.data.length || 0,
      pondId: koi.data.pondId || null,
      dateOfBirth: koi.data.dateOfBirth ? dayjs(koi.data.dateOfBirth) : null,
      image: null,
      date: koi.data.date ? dayjs(koi.data.date) : dayjs(),
      imageUrl: koi.data.imageUrl || "",
    });

    setImgSrc(koi.data.imageUrl);
    calculateAge(koi.data.dateOfBirth);
  }, [koi]);

  // Hook
  const updateKoiMutation = useUpdateKoi();
  const deleteKoiMutation = useDeleteKoi();

  // Calculate age
  const calculateAge = (birthDate) => {
    if (birthDate) {
      const today = dayjs();
      const birthDyjs = dayjs(birthDate);
      const ageInMonths = today.diff(birthDyjs, "month");
      setKoiAge(ageInMonths);
      addKoiAge(ageInMonths);
    } else {
      setKoiAge(null);
    }
  };

  const formatAge = (ageInMonths) => {
    if (ageInMonths === null) return "Unknown";
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (months > 0 || parts.length === 0)
      parts.push(`${months} month${months !== 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  // Handle delete

  const handleDeleteClick = () => {
    Modal.confirm({
      title: "Delete Koi",
      content: "Are you sure you want to delete this koi?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setIsDeleting(true);
        try {
          await deleteKoiMutation.mutateAsync(id);
          toast.success("Koi deleted successfully!");
          navigate("/koi-management");
        } catch (error) {
          toast.error(`Error deleting koi: ${error.message}`);
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  //Handle image

  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => setImgSrc(e.target?.result);
      formik.setFieldValue("image", file);
    }
  };

  console.log(updateKoiMutation.isPending);
  return (
    <Spin spinning={updateKoiMutation.isPending || isDeleting}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <div className="flex justify-center mb-6 ">
            <img
              src={imgSrc || koi?.imageUrl}
              alt={koi?.name || "Koi"}
              className="w-full max-w-md h-auto rounded-lg object-cover "
            />
          </div>
          {/* Upload Button */}
          <div className="w-full">
            <label
              htmlFor="koi-image"
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
            >
              <UploadOutlined className="text-lg" />
              <span>Click or drag image to upload</span>
              <input
                id="koi-image"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                onChange={handleChangeFile}
                className="hidden"
              />
            </label>
            <Text className="mt-2 text-gray-500 text-sm text-center block">
              Supported formats: PNG, JPG, JPEG, GIF, WEBP
            </Text>
          </div>
        </Card>

        <Card className="shadow-lg">
          <Form layout="vertical" onFinish={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Name">
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Form.Item>

              <Form.Item label="Variety">
                <Input
                  name="variety"
                  value={formik.values.variety}
                  onChange={formik.handleChange}
                />
              </Form.Item>

              <Form.Item label="Sex">
                <Select
                  value={formik.values.sex}
                  onChange={(value) => formik.setFieldValue("sex", value)}
                >
                  <Select.Option value="true">Female</Select.Option>
                  <Select.Option value="false">Male</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Purchase Price (VND)">
                <InputNumber
                  name="purchasePrice"
                  min={0}
                  value={formik.values.purchasePrice}
                  onChange={(value) =>
                    formik.setFieldValue("purchasePrice", value)
                  }
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Weight (kg)">
                <InputNumber
                  name="weight"
                  min={0}
                  value={formik.values.weight}
                  onChange={(value) => formik.setFieldValue("weight", value)}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Length (cm)">
                <InputNumber
                  name="length"
                  min={0}
                  value={formik.values.length}
                  onChange={(value) => formik.setFieldValue("length", value)}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Date of Birth">
                <DatePicker
                  value={formik.values.dateOfBirth}
                  onChange={(date) => {
                    formik.setFieldValue("dateOfBirth", date);
                    calculateAge(date);
                  }}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Age">
                <Input
                  value={formatAge(koiAge)}
                  readOnly
                  className="bg-gray-50"
                />
              </Form.Item>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                type="primary"
                htmlType="submit"
                icon={<EditOutlined />}
                loading={updateKoiMutation.isLoading}
                className="min-w-[120px]"
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: "Update without history",
                    content:
                      "Are you sure you want to update without update history?",
                    onOk: () => {
                      const formData = new FormData();
                      const updatedKoi = {
                        name: formik.values.name || "",
                        variety: formik.values.variety || "",
                        sex: formik.values.sex === "true",
                        purchasePrice:
                          parseFloat(formik.values.purchasePrice) || 0,
                        weight: parseFloat(formik.values.weight) || 0,
                        length: parseFloat(formik.values.length) || 0,
                        pondId: parseInt(formik.values.pondId) || null,
                        dateOfBirth: formik.values.dateOfBirth
                          ? formik.values.dateOfBirth.format("YYYY-MM-DD")
                          : null,
                        userId: userId,
                        date: formik.values.date
                          ? formik.values.date.format("YYYY-MM-DD")
                          : dayjs().format("YYYY-MM-DD"),
                      };
                      formData.append("fish", JSON.stringify(updatedKoi));
                      formData.append("isNew", "false");
                      if (formik.values.image) {
                        formData.append("image", formik.values.image);
                      }
                      updateKoiMutation.mutate(
                        { id: id, payload: formData },
                        {
                          onSuccess: (updatedKoi) => {
                            dispatch(manageKoiActions.updateKoi(updatedKoi));
                            toast.success("Koi updated successfully");
                            refetchGrowthData();
                          },
                        }
                      );
                    },
                  });
                }}
                icon={<EditOutlined />}
                loading={updateKoiMutation.isLoading}
                className="min-w-[120px] bg-green-500 text-white hover:bg-green-600"
              >
                Modified
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                loading={isDeleting}
                className="min-w-[120px]"
              >
                Delete
              </Button>
            </div>

            <Divider />

            {pond && (
              <div className="mb-6">
                <Title level={4}>Current Pond</Title>
                <Card
                  size="small"
                  className="bg-gray-50 border-b-2 border-blue-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative overflow-hidden rounded-lg border-2 border-blue-500 shadow-md hover:border-blue-600 transition-all duration-300">
                      {pond.imageUrl ? (
                        <img
                          src={pond.imageUrl}
                          alt={pond.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <PictureOutlined className="text-gray-400 text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Title level={4} className="pond-name mb-3 text-xl">
                        {pond.name}
                      </Title>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="flex items-center gap-2">
                          <ArrowsAltOutlined className="text-lg text-gray-600" />
                          <Text className="text-base">
                            Length:{" "}
                            <span className="font-semibold">
                              {pond.length}m
                            </span>
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <ColumnWidthOutlined className="text-lg text-gray-600" />
                          <Text className="text-base">
                            Width:{" "}
                            <span className="font-semibold">{pond.width}m</span>
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <VerticalAlignBottomOutlined className="text-lg text-gray-600" />
                          <Text className="text-base">
                            Depth:{" "}
                            <span className="font-semibold">{pond.depth}m</span>
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <AreaChartOutlined className="text-lg text-gray-600" />
                          <Text className="text-base">
                            Volume:{" "}
                            <span className="font-semibold">
                              {pond.length * pond.width * pond.depth}m³
                            </span>
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

FormKoiUpdate.propTypes = {
  koi: PropTypes.object.isRequired,
  pond: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  refetchKoi: PropTypes.func.isRequired,
  refetchGrowthData: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired,
  refetchPond: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  addKoiAge: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

export default FormKoiUpdate;
