import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Modal, Select } from "antd";
import { BulbOutlined } from "@ant-design/icons";

const calculateFood = (koi, koiAge) => {

  if (!koi.weight || koi.weight <= 0) {
    toast.error("Please enter a valid weight for the koi");
    return;
  }

  const koiWeight = koi.weight;
  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "Spring";
    else if (month >= 5 && month <= 7) return "Summer";
    else if (month >= 8 && month <= 10) return "Fall";
    else return "Winter";
  };

  let currentModal = null;

  const showChoiceModal = () => {
    try {
      // Close any existing modal first
      if (currentModal?.destroy) {
        currentModal.destroy();
      }

      currentModal = Modal.confirm({
        title: "Choose Calculation Method",
        content: "Please select a calculation method:",
        okText: "Use Current Data", 
        cancelText: "Cancel",
        okButtonProps: {
          style: { backgroundColor: '#1890ff', borderColor: '#1890ff' }
        },
        cancelButtonProps: {
          style: { marginRight: '10px' }
        },
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <button
              onClick={() => {
                if (currentModal?.destroy) {
                  currentModal.destroy();
                }
                calculateWithCustomData();
              }}
              className="ant-btn ant-btn-default"
              style={{ }}
            >
              Enter Custom Data
            </button>
            <OkBtn />
            <CancelBtn />
          </>
        ),
        onOk() {
          if (currentModal?.destroy) {
            currentModal.destroy();
          }
          calculateWithCurrentData();
        },
        afterClose() {
          currentModal = null;
        }
      });
    } catch (error) {
      console.error("Error showing choice modal:", error);
    }
  };

  // Show initial choice modal
  showChoiceModal();

  const calculateWithCurrentData = () => {
    const season = getCurrentSeason();
    calculateFoodAmount(season, koiWeight);
  };

  const calculateWithCustomData = () => {
    let selectedSeason = "Summer";
    let customWeight = koi.weight;

    try {
      if (currentModal?.destroy) {
        currentModal.destroy();
      }

      currentModal = Modal.confirm({
        title: "Enter Custom Data",
        content: (
          <div>
            <p>Select season:</p>
            <Select
              defaultValue="Summer"
              style={{
                width: "100%",
                marginBottom: "15px",
                borderRadius: "6px"
              }}
              onChange={(value) => (selectedSeason = value)}
            >
              <Select.Option value="Spring">Spring</Select.Option>
              <Select.Option value="Summer">Summer</Select.Option>
              <Select.Option value="Fall">Fall</Select.Option>
              <Select.Option value="Winter">Winter</Select.Option>
            </Select>
            <p className="mb-2">Enter koi weight (kg):</p>
            <input
              type="number"
              defaultValue={customWeight}
              onChange={(e) => {
                customWeight = parseFloat(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d9d9d9",
                marginBottom: "10px"
              }}
              min="0"
              step="0.1"
            />
          </div>
        ),
        okText: "Calculate",
        cancelText: "Cancel",
        onOk() {
          if (!customWeight || customWeight <= 0) {
            toast.error("Please enter a valid weight");
            return;
          }
          if (currentModal?.destroy) {
            currentModal.destroy();
          }
          calculateFoodAmount(selectedSeason, customWeight);
        },
        afterClose() {
          currentModal = null;
        }
      });
    } catch (error) {
      console.error("Error showing custom data modal:", error);
    }
  };

  const calculateFoodAmount = (season, weight) => {
    // Calculate season multiplier based on research
    let seasonMultiplier = 1;
    let seasonDescription = "";
    switch (season) {
      case "Summer":
        seasonMultiplier = 1.5; // Increased to 1.5x in summer due to higher metabolism
        seasonDescription = "Summer - Peak metabolism, maximum feeding";
        break;
      case "Winter":
        seasonMultiplier = 0.3; // Reduced to 0.3x in winter as metabolism slows significantly
        seasonDescription = "Winter - Minimal feeding needed";
        break;
      case "Spring":
        seasonMultiplier = 1.2; // 1.2x as metabolism increases
        seasonDescription = "Spring - Increasing metabolism";
        break;
      case "Fall":
        seasonMultiplier = 0.7; // 0.7x as metabolism begins to slow
        seasonDescription = "Fall - Decreasing metabolism";
        break;
      default:
        seasonMultiplier = 1;
        seasonDescription = "Unknown season";
    }

    // Calculate status multiplier based on koi health condition
    let statusMultiplier = 1;
    let statusDescription = "";
    switch (koi.status) {
      case 1: // Weak/sick
        statusMultiplier = 0.7;
        statusDescription = "Weak condition - Reduced feeding recommended";
        break;
      case 2: // Underweight
        statusMultiplier = 1.3;
        statusDescription = "Underweight - Increased feeding needed";
        break;
      case 3: // Growing fast
        statusMultiplier = 1.2;
        statusDescription = "Fast growth - Higher protein needs";
        break;
      case 4: // Normal
        statusMultiplier = 1;
        statusDescription = "Normal condition - Standard feeding";
        break;
      case 5: // Premium condition
        statusMultiplier = 1.1;
        statusDescription = "Excellent condition - Optimal feeding";
        break;
      default:
        statusMultiplier = 1;
        statusDescription = "Unknown status";
    }

    // Calculate base food amounts (1-3% of body weight per day)
    const adjustedWeight = weight * statusMultiplier;
    const minFoodAmount = adjustedWeight * 10 * seasonMultiplier; // 1% minimum
    const maxFoodAmount = adjustedWeight * 30 * seasonMultiplier; // 3% maximum

    // Calculate optimal meals per day based on age and season
    let mealsPerDay = 3;
    let mealSchedule = "";

    if (koiAge < 6) {
      // Young koi need more frequent feeding
      mealsPerDay = season === "Summer" ? 6 : 4; // 4-6 times daily
      mealSchedule =
        season === "Summer"
          ? "6 meals: 6am, 9am, 12pm, 3pm, 6pm, 9pm"
          : "4 meals: 8am, 11am, 2pm, 5pm";
    } else if (koiAge > 24) {
      // Older koi need less frequent feeding
      mealsPerDay = season === "Winter" ? 1 : 2; // 1-2 times daily
      mealSchedule = season === "Winter" ? "1 meal: 12pm" : "2 meals: 9am, 3pm";
    } else {
      // Adult koi
      mealsPerDay = season === "Summer" ? 4 : 3; // 3-4 times daily
      mealSchedule =
        season === "Summer"
          ? "4 meals: 7am, 11am, 3pm, 7pm"
          : "3 meals: 8am, 1pm, 6pm";
    }

    try {
      if (currentModal?.destroy) {
        currentModal.destroy();
      }

      currentModal = Modal.info({
        title: "Food Calculator Result (Koi: " + koi.name + ")",
        content: (
          <div>
            <p>Based on the koi&apos;s weight of {weight}kg:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Daily food amount: {minFoodAmount.toFixed(1)} -{" "}
                {maxFoodAmount.toFixed(1)} grams
              </li>
              <li>Recommended meals per day: {mealsPerDay}</li>
              <li>
                Amount per meal: {(minFoodAmount / mealsPerDay).toFixed(1)} -{" "}
                {(maxFoodAmount / mealsPerDay).toFixed(1)} grams
              </li>
              <li>Suggested feeding schedule: {mealSchedule}</li>
            </ul>
            <div className="mt-3">
              <p className="font-semibold">Current Conditions:</p>
              <ul className="list-none">
                <li>
                  <span className="font-medium">Season: </span>
                  {seasonDescription}
                </li>
                <li>
                  <span className="font-medium">Status: </span>
                  {statusDescription}
                </li>
              </ul>
            </div>
            <p className="mt-3 text-gray-500">
              Note: Adjust feeding based on water temperature, appetite, and
              behavior. In temperatures below 10°C, reduce feeding significantly.
              Above 28°C, monitor closely for signs of stress.
            </p>
          </div>
        ),
        centered: true,
        icon: <BulbOutlined className="text-blue-500" />,
        okText: "Back",
        onOk() {
          if (currentModal?.destroy) {
            currentModal.destroy();
          }
          showChoiceModal();
        },
        cancelText: "Close",
        okCancel: true,
        afterClose() {
          currentModal = null;
        }
      });
    } catch (error) {
      console.error("Error showing results modal:", error);
    }
  };
};

const calculateFoodByPond = (lstKoi, waterData) => {
  // Kiểm tra xem có danh sách cá koi không
  if (!lstKoi?.length) {
    return (
      <Modal title="Error" open={true} footer={null} closable={false} centered>
        <div style={{ textAlign: "center", padding: "10px" }}>
          <BulbOutlined
            style={{ fontSize: "24px", color: "#faad14", marginBottom: "10px" }}
          />
          <p style={{ margin: 0, color: "#666" }}>
            No koi in pond to calculate
          </p>
        </div>
      </Modal>
    );
  }

  // Lấy nhiệt độ nước từ dữ liệu đầu vào
  const waterTemperature = waterData?.temperature || 0;

  // Hàm lấy mùa hiện tại dựa vào tháng trong năm
  const getCurrentSeason = () => {
    // Lấy tháng hiện tại (0 = tháng 1, 11 = tháng 12)
    const month = new Date().getMonth();

    // Trả về mùa tương ứng với tháng
    if (month >= 2 && month <= 4) {
      return "Spring"; // Tháng 3 đến tháng 5 là mùa xuân
    } else if (month >= 5 && month <= 7) {
      return "Summer"; // Tháng 6 đến tháng 8 là mùa hè
    } else if (month >= 8 && month <= 10) {
      return "Fall"; // Tháng 9 đến tháng 11 là mùa thu
    } else {
      return "Winter"; // Tháng 12 đến tháng 2 là mùa đông
    }
  };

  // Khởi tạo các biến tính toán
  let totalWeight = 0; // Tổng trọng lượng cá
  let youngKoi = 0; // Số lượng cá con
  let adultKoi = 0; // Số lượng cá trưởng thành
  let oldKoi = 0; // Số lượng cá già

  // Tính hệ số điều chỉnh theo mùa
  const season = getCurrentSeason();
  let seasonMultiplier = 1; // Hệ số mùa mặc định
  let seasonDescription = ""; // Mô tả về mùa
  switch (season) {
    case "Summer":
      seasonMultiplier = 1.2; // Tăng 20% vào mùa hè
      seasonDescription = "Summer - Hot weather, fish eat more";
      break;
    case "Winter":
      seasonMultiplier = 0.8; // Giảm 20% vào mùa đông
      seasonDescription = "Winter - Cold weather, fish eat less";
      break;
    case "Spring":
      seasonMultiplier = 1.1; // Tăng 10% vào mùa xuân
      seasonDescription = "Spring - Warming weather, fish start eating more";
      break;
    case "Fall":
      seasonMultiplier = 0.9; // Giảm 10% vào mùa thu
      seasonDescription = "Fall - Cool weather, fish eat moderately";
      break;
    default:
      seasonMultiplier = 1;
      seasonDescription = "Unknown season";
  }

  // Tính hệ số điều chỉnh theo nhiệt độ nước
  let tempMultiplier = 1; // Hệ số nhiệt độ mặc định
  let tempDescription = ""; // Mô tả về nhiệt độ
  if (waterTemperature) {
    if (waterTemperature < 15) {
      tempMultiplier = 0.7; // Giảm 30% khi nhiệt độ thấp
      tempDescription = "Low temperature - Fish eat less";
    } else if (waterTemperature > 28) {
      tempMultiplier = 0.8; // Giảm 20% khi nhiệt độ cao
      tempDescription = "High temperature - Fish reduce eating";
    } else if (waterTemperature >= 20 && waterTemperature <= 25) {
      tempMultiplier = 1.1; // Tăng 10% khi nhiệt độ lý tưởng
      tempDescription = "Ideal temperature - Fish eat well";
    } else {
      tempDescription = "Normal temperature";
    }
  } else {
    tempDescription = "No temperature data";
  }

  // Duyệt qua từng con cá để tính toán
  lstKoi.forEach((koi) => {
    const weight = parseFloat(koi.weight);
    if (weight > 0) {
      // Điều chỉnh dựa trên trạng thái phát triển của cá
      let statusMultiplier = 1; // Hệ số trạng thái mặc định
      let statusDescription = ""; // Mô tả trạng thái
      switch (koi.status) {
        case 1: // Phát triển không bình thường
          statusMultiplier = 0.9; // Giảm 10% lượng thức ăn
          statusDescription = "Abnormal development - Reduce food amount";
          break;
        case 2: // Phát triển chậm
          statusMultiplier = 1.1; // Tăng 10% lượng thức ăn
          statusDescription = "Slow development - Increase food amount";
          break;
        case 3: // Phát triển nhanh
          statusMultiplier = 0.9; // Giảm 10% lượng thức ăn
          statusDescription = "Fast development - Reduce food amount";
          break;
        case 4: // Phát triển bình thường
          statusMultiplier = 1; // Giữ nguyên lượng thức ăn
          statusDescription = "Normal development - Standard food amount";
          break;
        default:
          statusMultiplier = 1;
          statusDescription = "Unknown status";
      }

      // Cộng dồn trọng lượng cá sau khi điều chỉnh theo trạng thái
      totalWeight += weight * statusMultiplier;

      // Phân loại cá theo độ tuổi
      if (koi.dateOfBirth) {
        // Tính tuổi cá theo tháng
        const ageInMonths = dayjs().diff(dayjs(koi.dateOfBirth), "month");
        // Phân loại theo độ tuổi
        if (ageInMonths < 6) youngKoi++; // Cá dưới 6 tháng tuổi
        else if (ageInMonths > 24) oldKoi++; // Cá trên 2 năm tuổi
        else adultKoi++; // Cá từ 6 tháng đến 2 năm tuổi
      } else {
        adultKoi++; // Nếu không có ngày sinh, xếp vào nhóm trưởng thành
      }
    }
  });

  // Kiểm tra tổng trọng lượng có hợp lệ không
  if (totalWeight <= 0) {
    toast.error("No valid weights found for any koi");
    return;
  }

  // Tính lượng thức ăn cơ bản và điều chỉnh theo các hệ số
  const minFoodAmount = totalWeight * 10 * seasonMultiplier * tempMultiplier;
  const maxFoodAmount = totalWeight * 30 * seasonMultiplier * tempMultiplier;

  // Khởi tạo các biến cho lịch cho ăn
  let mealsPerDay = 3; // Số bữa ăn mặc định mỗi ngày
  let mealSchedule = ""; // Lịch cho ăn chi tiết

  // Điều chỉnh số bữa ăn dựa trên độ tuổi và mùa
  if (youngKoi > adultKoi + oldKoi) {
    // Nếu số cá con nhiều hơn tổng số cá trưởng thành và cá già
    mealsPerDay = season === "Summer" ? 5 : 4;
    mealSchedule =
      season === "Summer"
        ? "5 meals: 7am, 10am, 1pm, 4pm, 7pm"
        : "4 meals: 8am, 11am, 2pm, 5pm";
  } else if (oldKoi > youngKoi + adultKoi) {
    // Nếu số cá già nhiều hơn tổng số cá con và cá trưởng thành
    mealsPerDay = season === "Winter" ? 1 : 2;
    mealSchedule = season === "Winter" ? "1 meal: 12pm" : "2 meals: 9am, 3pm";
  } else {
    // Trường hợp còn lại - chủ yếu là cá trưởng thành
    mealsPerDay = season === "Summer" ? 4 : 3;
    mealSchedule =
      season === "Summer"
        ? "4 meals: 8am, 11am, 2pm, 5pm"
        : "3 meals: 9am, 1pm, 5pm";
  }

  Modal.info({
    title: "Food Calculator Result For Pond",
    content: (
      <div>
        <p>
          Based on total weight of {totalWeight.toFixed(1)}kg for{" "}
          {lstKoi.length} koi:
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li>
            Total daily food: {minFoodAmount.toFixed(1)} -{" "}
            {maxFoodAmount.toFixed(1)} grams
          </li>
          <li>Recommended meals per day: {mealsPerDay}</li>
          <li>
            Amount per meal: {(minFoodAmount / mealsPerDay).toFixed(1)} -{" "}
            {(maxFoodAmount / mealsPerDay).toFixed(1)} grams
          </li>
          <li>Suggested feeding schedule: {mealSchedule}</li>
        </ul>
        <div className="mt-3">
          <p className="font-semibold">Current Conditions:</p>
          <ul className="list-none">
            <li>
              <span className="font-medium">Season: </span>
              {seasonDescription}
            </li>
            <li>
              <span className="font-medium">Temperature: </span>
              {tempDescription}
            </li>
          </ul>
        </div>
        <div className="mt-3">
          <p className="font-semibold">Age Distribution:</p>
          <ul className="list-none">
            <li>Young Koi (0-6 months): {youngKoi}</li>
            <li>Adult Koi (6-24 months): {adultKoi}</li>
            <li>Old Koi (24+ months): {oldKoi}</li>
          </ul>
        </div>
        <p className="mt-3 text-gray-500">
          Note: This is a general recommendation. Adjust based on water
          temperature, season, and koi behavior.
        </p>
      </div>
    ),
    centered: true,
    icon: <BulbOutlined className="text-blue-500" />,
    okText: "Got it",
  });
};

export { calculateFood, calculateFoodByPond };
