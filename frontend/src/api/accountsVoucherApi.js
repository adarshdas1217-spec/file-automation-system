import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Approve
export const approveVoucher = (id) =>
  API.post(`/accounts/vouchers/${id}/approve`);

// Reject
export const rejectVoucher = (id) =>
  API.post(`/accounts/vouchers/${id}/reject`);

// Pay
export const payVoucher = (id) =>
  API.post(`/accounts/vouchers/${id}/pay`);

//print
export const printVoucher = async (id) => {
  const response = await API.get(
    `/accounts/vouchers/${id}/print`,
    {
      responseType: "blob", // 🔥 REQUIRED for PDF
    }
  );

  return response.data;
};

export default API;
