import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Modal } from "antd";
import { BulbOutlined } from "@ant-design/icons";

const calculateFood = (koi, koiAge) => {
    if (!koi.weight || koi.weight <= 0) {
      toast.error("Please enter a valid weight for the koi");
      return;
    }

    // Get current season
    const getCurrentSeason = () => {
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) return "Spring";
      else if (month >= 5 && month <= 7) return "Summer";
      else if (month >= 8 && month <= 10) return "Fall";
      else return "Winter";
    };

    // Calculate season multiplier
    const season = getCurrentSeason();
    let seasonMultiplier = 1;
    let seasonDescription = "";
    switch (season) {
      case "Summer":
        seasonMultiplier = 1.2;
        seasonDescription = "Summer - Hot weather, fish eat more";
        break;
      case "Winter":
        seasonMultiplier = 0.8;
        seasonDescription = "Winter - Cold weather, fish eat less";
        break;
      case "Spring":
        seasonMultiplier = 1.1;
        seasonDescription = "Spring - Warming weather, fish start eating more";
        break;
      case "Fall":
        seasonMultiplier = 0.9;
        seasonDescription = "Fall - Cool weather, fish eat moderately";
        break;
      default:
        seasonMultiplier = 1;
        seasonDescription = "Unknown season";
    }

    // Calculate status multiplier
    let statusMultiplier = 1;
    let statusDescription = "";
    switch (koi.status) {
      case 1:
        statusMultiplier = 0.9;
        statusDescription = "Abnormal development - Reduce food amount";
        break;
      case 2:
        statusMultiplier = 1.1;
        statusDescription = "Slow development - Increase food amount";
        break;
      case 3:
        statusMultiplier = 0.9;
        statusDescription = "Fast development - Reduce food amount";
        break;
      case 4:
        statusMultiplier = 1;
        statusDescription = "Normal development - Standard food amount";
        break;
      default:
        statusMultiplier = 1;
        statusDescription = "Unknown status";
    }

    // Calculate base food amounts with multipliers
    const adjustedWeight = koi.weight * statusMultiplier;
    const minFoodAmount = adjustedWeight * 10 * seasonMultiplier;
    const maxFoodAmount = adjustedWeight * 30 * seasonMultiplier;

    // Calculate meals per day based on age and season
    let mealsPerDay = 3;
    let mealSchedule = "";

    if (koiAge < 6) {
      mealsPerDay = season === "Summer" ? 5 : 4;
      mealSchedule = season === "Summer" 
        ? "5 meals: 7am, 10am, 1pm, 4pm, 7pm"
        : "4 meals: 8am, 11am, 2pm, 5pm";
    } else if (koiAge > 24) {
      mealsPerDay = season === "Winter" ? 1 : 2;
      mealSchedule = season === "Winter"
        ? "1 meal: 12pm"
        : "2 meals: 9am, 3pm";
    } else {
      mealsPerDay = season === "Summer" ? 4 : 3;
      mealSchedule = season === "Summer"
        ? "4 meals: 8am, 11am, 2pm, 5pm"
        : "3 meals: 9am, 1pm, 5pm";
    }

    Modal.info({
      title: "Food Calculator Result (Koi: " + koi.name + ")",
      content: (
        <div>
          <p>Based on the koi&apos;s weight of {koi.weight}kg:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Daily food amount: {minFoodAmount.toFixed(1)} - {maxFoodAmount.toFixed(1)} grams</li>
            <li>Recommended meals per day: {mealsPerDay}</li>
            <li>Amount per meal: {(minFoodAmount/mealsPerDay).toFixed(1)} - {(maxFoodAmount/mealsPerDay).toFixed(1)} grams</li>
            <li>Suggested feeding schedule: {mealSchedule}</li>
          </ul>
          <div className="mt-3">
            <p className="font-semibold">Current Conditions:</p>
            <ul className="list-none">
              <li><span className="font-medium">Season: </span>{seasonDescription}</li>
              <li><span className="font-medium">Status: </span>{statusDescription}</li>
            </ul>
          </div>
          <p className="mt-3 text-gray-500">
            Note: This is a general recommendation. Adjust based on water temperature, season, and koi behavior.
          </p>
        </div>
      ),
      centered: true,
      icon: <BulbOutlined className="text-blue-500" />,
      okText: "Got it",
    });
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
  const waterTemperature = waterData?.temperature;

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
            <li><span className="font-medium">Season: </span>{seasonDescription}</li>
            <li><span className="font-medium">Temperature: </span>{tempDescription}</li>
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
}

export  {calculateFood, calculateFoodByPond};
