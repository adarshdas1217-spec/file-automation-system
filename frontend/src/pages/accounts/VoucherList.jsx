import {
  approveVoucher,
  rejectVoucher,
  payVoucher,
  printVoucher
} from "../../api/accountsVoucherApi";

const VoucherList = ({ vouchers, refreshVouchers }) => {
  const handlePrint = async (id) => {
    try {
      const pdfBlob = await printVoucher(id);

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );

      window.open(url, "_blank");
    } catch (err) {
      alert("Failed to print voucher");
    }
  };

  return (
    <div className="voucher-page">
      <table className="voucher-table">
        <thead>
          <tr>
            <th>Voucher No</th>
            <th>File No</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vouchers.map((v) => (
            <tr key={v.id}>
              <td>{v.voucher_no}</td>
              <td>{v.file?.file_no || "-"}</td>
              <td>{v.voucher_type}</td>
              <td>₹ {v.amount}</td>

              <td>
                <span className={`status ${v.status}`}>
                  {v.status.toUpperCase()}
                </span>
              </td>

              <td>
                {/* PENDING */}
                {v.status === "pending" && (
                  <>
                    <button
                      className="btn approve"
                      onClick={() => approveVoucher(v.id).then(refreshVouchers)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn reject"
                      onClick={() => rejectVoucher(v.id).then(refreshVouchers)}
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* APPROVED */}
                {v.status === "approved" && (
                  <button
                    className="btn pay"
                    onClick={() => payVoucher(v.id).then(refreshVouchers)}
                  >
                    Pay
                  </button>
                )}

                {/* PAID */}
                {v.status === "paid" && (
                  <>
                    <button className="btn paid" disabled>
                      Paid
                    </button>
                    <button
                      className="btn print"
                      onClick={() => handlePrint(v.id)}
                    >
                      Print
                    </button>
                  </>
                )}

                {/* REJECTED */}
                {v.status === "rejected" && <span>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherList;














































// import {
//   approveVoucher,
//   rejectVoucher,
//   payVoucher,
// } from "../../api/accountsVoucherApi";

// import {
//   canApproveVoucher,
//   canPayVoucher,
// } from "../../utils/auth";

// const VoucherList = ({ vouchers, refreshVouchers }) => {
//   const handleApprove = async (id) => {
//     try {
//       await approveVoucher(id);
//       refreshVouchers();
//     } catch (err) {
//       alert(err?.response?.data?.message || "Approve failed");
//     }
//   };

//   const handleReject = async (id) => {
//     if (!window.confirm("Reject this voucher?")) return;
//     try {
//       await rejectVoucher(id);
//       refreshVouchers();
//     } catch (err) {
//       alert(err?.response?.data?.message || "Reject failed");
//     }
//   };

//   const handlePay = async (id) => {
//     if (!window.confirm("Mark voucher as PAID?")) return;
//     try {
//       await payVoucher(id);
//       refreshVouchers();
//     } catch (err) {
//       alert(err?.response?.data?.message || "Payment failed");
//     }
//   };

//   return (
//     <div className="voucher-page">
//       <table className="voucher-table">
//         <thead>
//           <tr>
//             <th>Voucher No</th>
//             <th>File No</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {vouchers.length === 0 ? (
//             <tr>
//               <td colSpan="6" style={{ textAlign: "center" }}>
//                 No vouchers found
//               </td>
//             </tr>
//           ) : (
//             vouchers.map((v) => {
//               // 🔥 Normalize status ONCE
//               const status = (v.status || "").toLowerCase().trim();

//               return (
//                 <tr key={v.id}>
//                   <td>{v.voucher_no}</td>
//                   <td>{v.File?.file_no || "-"}</td>
//                   <td>{v.voucher_type}</td>
//                   <td>₹ {Number(v.amount).toLocaleString("en-IN")}</td>

//                   {/* STATUS */}
//                   <td>
//                     <span className={`status ${status}`}>
//                       {status.toUpperCase()}
//                     </span>
//                   </td>

//                   {/* ACTIONS */}
//                   <td>
//                     {/* APPROVAL — Treasurer / Secretary */}
//                     {status === "pending" && canApproveVoucher() && (
//                       <>
//                         <button
//                           className="btn approve"
//                           onClick={() => handleApprove(v.id)}
//                         >
//                           Approve
//                         </button>

//                         <button
//                           className="btn reject"
//                           onClick={() => handleReject(v.id)}
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}

//                     {/* PAYMENT — Accounts */}
//                     {status === "approved" && canPayVoucher() && (
//                       <button
//                         className="btn pay"
//                         onClick={() => handlePay(v.id)}
//                       >
//                         Pay
//                       </button>
//                     )}

//                     {/* FINAL STATES */}
//                     {status === "paid" && (
//                       <button className="btn paid" disabled>
//                         Paid
//                       </button>
//                     )}

//                     {status === "rejected" && <span>—</span>}

//                     {/* VIEW ONLY */}
//                     {!canApproveVoucher() &&
//                       !canPayVoucher() &&
//                       status !== "paid" && (
//                         <span
//                           style={{
//                             color: "#6b7280",
//                             fontStyle: "italic",
//                           }}
//                         >
//                           View only
//                         </span>
//                       )}
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default VoucherList;
