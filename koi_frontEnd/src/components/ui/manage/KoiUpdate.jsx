import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Spin,
  Typography,
} from "antd";
import { useGetPondById } from "../../../hooks/koi/useGetPondById";
import { useGetKoiByKoiId } from "../../../hooks/koi/useGetKoiByKoiId";
import { useGetGrowth } from "../../../hooks/koi/useGetGrowth";
import FormKoiUpdate from "./KoiComponent/FormUpdatekoi";
import KoiGrowthChart from "./Chart";
import AddGrowthModal from "./KoiComponent/AddGrowthModal";
import GrowthListModal from "./KoiComponent/GrowthListModal";

import {
  LineChartOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const KoiUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;


  const {
    data: koi,
    isLoading: isLoadingKoi,
    refetch: refetchKoi,
  } = useGetKoiByKoiId(id);

  const {
    data: pond,
    isLoading: isLoadingPond,
    refetch: refetchPond,
  } = useGetPondById(koi?.data?.pondId);

  const {
    data: growthData,
    refetch: refetchGrowthData,
    isLoading,
    isError,
    error,
  } = useGetGrowth(id);

  const [koiAge, setKoiAge] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddGrowthModalVisible, setIsAddGrowthModalVisible] = useState(false);
  const [isGrowthListVisible, setIsGrowthListVisible] = useState(false);

  const [onUpdated, setOnUpdated] = useState(false);

  useEffect(() => {
    if (onUpdated) {
      refetchKoi();
      refetchGrowthData();
      refetchPond();
    }
  }, [onUpdated]);

  if (isLoadingKoi || isLoadingPond) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }



  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={() => navigate("/koi-management")}
          icon={<ArrowLeftOutlined />}
          className="flex items-center"
        >
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsModalVisible(true)}
            icon={<LineChartOutlined />}
            type="primary"
          >
            Growth Chart
          </Button>
          <Button
            onClick={() => setIsGrowthListVisible(true)}
            icon={<HistoryOutlined />}
            type="primary"
          >
            Growth History
          </Button>
        </div>
      </div>

      <Title level={2} className="text-center mb-8">
        Koi Information
      </Title>

      <FormKoiUpdate
        koi={koi}
        pond={pond}
        refetchKoi={refetchKoi}
        refetchGrowthData={refetchGrowthData}
        refetchPond={refetchPond}
        dispatch={dispatch}
        userId={userId}
        addKoiAge={setKoiAge}
        onUpdated={setOnUpdated}
        id={id}
      />

      <KoiGrowthChart
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        growthData={growthData}
        isLoading={isLoading}
        isError={isError}
        error={error}
        koiAge={koiAge}

      />

      <GrowthListModal
        growthData={growthData}
        isGrowthListVisible={isGrowthListVisible}
        hideGrowthList={() => setIsGrowthListVisible(false)}
        isOpenAddGrowthModal={(status) => setIsAddGrowthModalVisible(status)}
        refetchGrowthData={refetchGrowthData}
        isLoading={isLoading}
        isError={isError}
      />

      <AddGrowthModal
        isVisible={isAddGrowthModalVisible}
        onClose={() => setIsAddGrowthModalVisible(false)}
        selectedPond={koi?.pondId}
        refetchGrowthData={refetchGrowthData}
        fishId={id}
      />
    </div>
  );
};

export default KoiUpdate;
