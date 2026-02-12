import { useEffect, useState } from "react";
import api from "../services/api";
import VoucherList from "../components/accounts/VoucherList";
import PaymentModal from "../components/accounts/PaymentModal";

export default function Accounts() {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVouchers = async () => {
    try {
      const res = await api.get("/accounts/vouchers");
      setVouchers(res.data);
    } catch (err) {
      console.error("Failed to load vouchers", err);
      setError("Failed to load vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  if (loading) return <p>Loading vouchers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Accounts – Vouchers</h2>

      <VoucherList
        vouchers={vouchers}
        refreshVouchers={fetchVouchers}
        onPay={(voucher) => {
        setSelectedVoucher(voucher);
        setShowPaymentModal(true);
      }}
      />

      {showPaymentModal && selectedVoucher && (
        <PaymentModal
          voucher={selectedVoucher}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedVoucher(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedVoucher(null);
            fetchVouchers();
          }}
        />
      )}
    </div>
  );
}
