import React, { useState, useEffect } from "react";
import { useGetOrder } from "../../../hooks/order/useGetOrder";
import { useSelector } from "react-redux";
import { Button, Radio, Tabs } from "antd";
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
    const paidOrdds =
      lstOrder?.filter((ord) => ord?.status === "SUCCESS_PAYMENT") || [];
    const pendingOrdds =
      lstOrder?.filter((ord) => ord?.status === "PENDING") || [];
    const cancelledOrdds =
      lstOrder?.filter((ord) => ord?.status === "CANCELLED") || [];
    const deliveredOrdds =
      lstOrder?.filter((ord) => ord?.status === "DELIVERED") || [];
    const deliveringOrdds =
      lstOrder?.filter((ord) => ord?.status === "SHIPPING") || [];
    const completedOrdds =
      lstOrder?.filter((ord) => ord?.status === "COMPLETED") || [];

    setLstPaid(paidOrdds);
    setLstPending(pendingOrdds);
    setLstCancel(cancelledOrdds);
    setLstDelivered(deliveredOrdds);
    setLstDelivering(deliveringOrdds);
    setLstCompleted(completedOrdds);
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
      <div className="flex flex-col justify-center items-center text-bold text-3xl m-2 mb-2">
        <h2 className="font-semibold mb-[15px]">History Order</h2>
        <Button
          className="mb-[15px] bg-blue-600 text-white hover:!bg-blue-500 hover:!text-white transition-all duration-300 ease-in-out"
          onClick={() => refetch()}
        >
          Refresh Data
        </Button>
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
              children: (
                <OrderPending
                  lstPending={lstPending}
                  isFetching={isFetching}
                  refetch={refetch}
                  switchToCancelledTab={switchToCancelledTab}
                />
              ),
            },
            {
              label: "Processing Orders",
              key: "paid",
              children: <OrderPaid lstPaid={lstPaid} isFetching={isFetching} />,
            },
            {
              label: "Delivering Orders",
              key: "delivering",
              children: (
                <OrderDelivering
                  lstDelivering={lstDelivering}
                  isFetching={isFetching}
                />
              ),
            },
            {
              label: "Delivered Orders",
              key: "delivered",
              children: (
                <OrderDelivered
                  lstDelivered={lstDelivered}
                  isFetching={isFetching}
                  refetch={refetch}
                  switchToCompleteTab={switchToCompleteTab}
                />
              ),
            },
            {
              label: "Completed Orders",
              key: "completed",
              children: (
                <OrderCompleted
                  lstCompleted={lstCompleted}
                  isFetching={isFetching}
                />
              ),
            },
            {
              label: "Cancelled Orders",
              key: "cancel",
              children: (
                <OrderCancel lstCancel={lstCancel} isFetching={isFetching} />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default HistoryOrder;
