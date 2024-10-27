import axios from "axios";

const API_URL = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api";

export const addPackage = async (packageData) => {
  const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
  const response = await axios.post(`${API_URL}/package`, packageData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "accept": "application/hal+json"
    }
  });
  return response.data;
};
