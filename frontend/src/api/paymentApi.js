import api from "../services/api";

export const createPayment = (data) =>
  api.post("/payments", data);
