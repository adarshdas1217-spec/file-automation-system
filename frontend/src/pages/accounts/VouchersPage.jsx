
<h1 style={{ color: "red" }}>
  THIS COMPONENT IS RENDERING
</h1>

import { useEffect, useState } from "react";
import API from "../../api/accountsVoucherApi";
import VoucherList from "./VoucherList";

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);

  const fetchVouchers = async () => {
    const res = await API.get("/accounts/vouchers");
    setVouchers(res.data);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <>
      <h2>Accounts Vouchers</h2>
      <VoucherList
        vouchers={vouchers}
        refreshVouchers={fetchVouchers}
      />
    </>
  );
};

export default VouchersPage;
