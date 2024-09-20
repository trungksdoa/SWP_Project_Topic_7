// import React, { useState } from "react";
// import { Radio, Tabs } from "antd";
// import { useSelector } from "react-redux";
// import KoiManegement from "../ui/manage/KoiManegement";
// import PondManegement from "../ui/manage/PondManegement";
// import { NavLink } from "react-router-dom";

// const ProfileTemplage = () => {
//   const { userLogin } = useSelector((state) => state.manageUser);

//   const [mode, setMode] = useState("top");
//   const handleModeChange = (e) => {
//     setMode(e.target.value);
//   };

//   const tabItems = [
//     {
//         label: 'Koi Management',
//         key: 'KoiManagement',
//         children: <KoiManegement />,
//     },
//     {
//         label: 'Pond Management',
//         key: 'PondManagement',
//         children: <PondManegement />,
//     },
// ]


//   return (
//     <div className="container">
//       <div className="mt-[20px]">
//         <Radio.Group
//           onChange={handleModeChange}
//           value={mode}
//           style={{
//             marginBottom: 8,
//           }}
//         >
//           <Radio.Button value="top">Horizontal</Radio.Button>
//           <Radio.Button value="left">Vertical</Radio.Button>
//         </Radio.Group>
//         <Tabs
//           defaultActiveKey="1"
//           tabPosition={mode}
//           style={{
//             margin: "0 auto",
//             width: "100%",
//           }}
//           items={tabItems}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfileTemplage;
