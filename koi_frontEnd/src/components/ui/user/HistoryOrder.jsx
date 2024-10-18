import React, { useState, useEffect } from "react";
import { useGetOrder } from "../../../hooks/order/useGetOrder";
import { useSelector } from "react-redux";
import { Radio, Tabs } from "antd";
import OrderPaid from "../order/OrderPaid";
import OrderPending from "../order/OrderPending";
import OrderCancel from "../order/OrderCancel";
import OrderDelivered from "../order/OrderDelivered";
import OrderDelivering from "../order/OrderDelivering";
import OrderCompleted from "../order/OrderCompleted";

const HistoryOrder = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: lstOrder, refetch, isFetching } = useGetOrder(userLogin?.id);
  const [mode, setMode] = useState("top");

  const [lstPaid, setLstPaid] = useState([]);
  const [lstPending, setLstPending] = useState([]);
  const [lstCancel, setLstCancel] = useState([]);
  const [lstDelivered, setLstDelivered] = useState([]);
  const [lstDelivering, setLstDelivering] = useState([]);
  const [lstCompleted, setLstCompleted] = useState([]);
  useEffect(() => {
    const paidOrders =
      lstOrder?.filter((order) => order?.status === "SUCCESS") || [];
    const pendingOrders =
      lstOrder?.filter((order) => order?.status === "PENDING") || [];
    const cancelledOrders =
      lstOrder?.filter((order) => order?.status === "CANCELLED") || [];
    const deliveredOrders =
      lstOrder?.filter((order) => order?.status === "DELIVERED") || [];
     const deliveringOrders =
       lstOrder?.filter((order) => order?.status === "SHIPPING") || [];
    const completedOrders =
      lstOrder?.filter((order) => order?.status === "COMPLETED") || [];

    setLstPaid(paidOrders);
    setLstPending(pendingOrders);
    setLstCancel(cancelledOrders);
    setLstDelivered(deliveredOrders);
    setLstDelivering(deliveringOrders);
    setLstCompleted(completedOrders);
  }, [lstOrder]); 

  useEffect(() => {
    refetch();
  }, []);

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const [activeKey, setActiveKey] = useState("paid"); 

  const switchToCancelledTab = () => {
    setActiveKey("cancel");
  };
  const switchToCompleteTab = () => {
    setActiveKey("completed");
  };


  return (
    <div>
      <div className="flex justify-center items-center text-bold text-3xl m-2 mb-2">
        <strong>History Order</strong>
      </div>      
      <div>
        <Radio.Group
          onChange={handleModeChange}
          value={mode}
          style={{
            marginBottom: 8,
          }}
        >
          <Radio.Button value="top">Horizontal</Radio.Button>
          <Radio.Button value="left">Vertical</Radio.Button>
        </Radio.Group>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey} 
          defaultActiveKey="1"
          tabPosition={mode}
          style={{}}
          items={[
            {
              label: "Pending Orders",
              key: "pending",
              children: <OrderPending lstPending={lstPending} isFetching={isFetching} refetch={refetch} switchToCancelledTab={switchToCancelledTab} />,
            },
            {
              label: "Paid Orders",
              key: "paid",
              children: <OrderPaid lstPaid={lstPaid} isFetching={isFetching} />,
            },
            {
              label: "Delivering Orders",
              key: "delivering",
              children: <OrderDelivering lstDelivering={lstDelivering} isFetching={isFetching} />,
            },
            {
              label: "Delivered Orders",
              key: "delivered",
              children: <OrderDelivered lstDelivered={lstDelivered} isFetching={isFetching} refetch={refetch} switchToCompleteTab={switchToCompleteTab} />,
            },
            {
              label: "Completed Orders",
              key: "completed",
              children: <OrderCompleted lstCompleted={lstCompleted} isFetching={isFetching} />,
            },
            {
              label: "Cancelled Orders",
              key: "cancel",
              children: <OrderCancel lstCancel={lstCancel} isFetching={isFetching} />,
            }
          ]}
        />
      </div>
    </div>
  );
};

export default HistoryOrder;
