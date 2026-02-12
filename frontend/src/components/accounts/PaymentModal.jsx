import { useState } from "react";
import { createPayment } from "../../api/paymentApi";

const PaymentModal = ({ voucher, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    payment_mode: "NEFT",
    reference_no: "",
    bank_name: "",
    transaction_date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitPayment = async () => {
    try {
      await createPayment({
        voucher_id: voucher.id,
        amount: voucher.amount,
        ...form,
      });
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Make Payment</h2>

        <div className="form-group">
          <label>Payment Mode</label>
          <select
            name="payment_mode"
            value={form.payment_mode}
            onChange={handleChange}
          >
            <option>NEFT</option>
            <option>RTGS</option>
            <option>IMPS</option>
            <option>UPI</option>
            <option>CASH</option>
          </select>
        </div>

        <div className="form-group">
          <label>Reference No</label>
          <input
            type="text"
            name="reference_no"
            value={form.reference_no}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bank / UPI</label>
          <input
            type="text"
            name="bank_name"
            value={form.bank_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Transaction Date</label>
          <input
            type="date"
            name="transaction_date"
            value={form.transaction_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          <button className="btn pay" onClick={submitPayment}>
            Confirm Payment
          </button>
          <button className="btn reject" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
