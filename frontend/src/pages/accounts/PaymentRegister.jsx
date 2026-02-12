import { useEffect, useState } from "react";
import api from "../../services/api";

const PaymentRegister = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 token for export (window.open cannot send headers)
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRegister();
  }, []);

  const fetchRegister = async () => {
    try {
      const res = await api.get("/accounts/payment-register");
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("PAYMENT REGISTER LOAD ERROR:", err);
      alert("Failed to load payment register");
    } finally {
      setLoading(false);
    }
  };

  // 📄 EXPORT PDF
  const exportPDF = () => {
    if (!token) {
      alert("Authentication token missing. Please login again.");
      return;
    }

    window.open(
      `http://localhost:5000/api/accounts/payment-register/export/pdf?token=${token}`,
      "_blank"
    );
  };

  // 📊 EXPORT EXCEL
  const exportExcel = () => {
    if (!token) {
      alert("Authentication token missing. Please login again.");
      return;
    }

    window.open(
      `http://localhost:5000/api/accounts/payment-register/export/excel?token=${token}`,
      "_blank"
    );
  };

  if (loading) return <p>Loading payment register...</p>;

  return (
    <div>
      <h2>Payment Register</h2>

      {/* EXPORT ACTIONS */}
      <div style={{ marginBottom: "12px" }}>
        <button className="btn print" onClick={exportPDF}>
          Export PDF
        </button>

        
      </div>

      {/* REGISTER TABLE */}
      <table className="voucher-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Date</th>
            <th>Voucher No</th>
            <th>File No</th>
            <th>Purpose</th>
            <th>Amount</th>
            <th>Mode</th>
            <th>Ref / Cheque</th>
            <th>Bank</th>
            <th>Paid By</th>
          </tr>
        </thead>

        <tbody>
          {payments.length === 0 && (
            <tr>
              <td colSpan="10" align="center">
                No payments found
              </td>
            </tr>
          )}

          {payments.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>

              <td>
                {p.transaction_date
                  ? new Date(p.transaction_date).toLocaleDateString("en-GB")
                  : "-"}
              </td>

              <td>{p.voucher?.voucher_no || "-"}</td>

              <td>{p.voucher?.File?.file_no || "-"}</td>

              <td>{p.voucher?.voucher_type || "-"}</td>

              <td>
                ₹ {Number(p.amount || 0).toLocaleString("en-IN")}
              </td>

              <td>{p.payment_mode || "-"}</td>

              <td>{p.reference_no || "-"}</td>

              <td>{p.bank_name || "-"}</td>

              <td>{p.payer?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentRegister;
