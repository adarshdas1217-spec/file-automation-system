// import {
//   approveVoucher,
//   rejectVoucher,
//   payVoucher,
//   printVoucher,
// } from "../../api/accountsVoucherApi";

// const VoucherList = ({ vouchers = [], refreshVouchers }) => {
//   // 🔒 Safety guard
//   if (!Array.isArray(vouchers)) {
//     return <p>No voucher data available</p>;
//   }

//   const handlePrint = async (id) => {
//     try {
//       const pdfBlob = await printVoucher(id);
//       const url = window.URL.createObjectURL(
//         new Blob([pdfBlob], { type: "application/pdf" })
//       );
//       window.open(url, "_blank");
//     } catch (err) {
//       alert("Failed to print voucher");
//     }
//   };

//   return (
//     <div>
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
//           {vouchers.length === 0 && (
//             <tr>
//               <td colSpan="6" style={{ textAlign: "center" }}>
//                 No vouchers found
//               </td>
//             </tr>
//           )}

//           {vouchers.map((v) => {
//             // 🔑 Normalize status ONCE
//             const status = (v.status || "").toLowerCase().trim();

//             return (
//               <tr key={v.id}>
//                 <td>{v.voucher_no}</td>

//                 {/* ✅ Alias is File (capital F) */}
//                 <td>{v.File?.file_no || "-"}</td>

//                 <td>{v.voucher_type}</td>

//                 <td>
//                   ₹ {Number(v.amount).toLocaleString("en-IN")}
//                 </td>

//                 <td>
//                   <span className={`status ${status}`}>
//                     {status.toUpperCase()}
//                   </span>
//                 </td>

//                 <td>
//                   {/* 🔵 PENDING */}
//                   {status === "pending" && (
//                     <>
//                       <button
//                         className="btn approve"
//                         onClick={() =>
//                           approveVoucher(v.id).then(refreshVouchers)
//                         }
//                       >
//                         Approve
//                       </button>

//                       <button
//                         className="btn reject"
//                         onClick={() =>
//                           rejectVoucher(v.id).then(refreshVouchers)
//                         }
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}

//                   {/* 🟡 APPROVED */}
//                   {status === "approved" && (
//                     <button
//                       className="btn pay"
//                       onClick={() =>
//                         payVoucher(v.id).then(refreshVouchers)
//                       }
//                     >
//                       Pay
//                     </button>
//                   )}

//                   {/* 🟢 PAID */}
//                   {status === "paid" && (
//                     <>
//                       <button className="btn paid" disabled>
//                         Paid
//                       </button>

//                       <button
//                         className="btn print"
//                         onClick={() => handlePrint(v.id)}
//                       >
//                         Print
//                       </button>
//                     </>
//                   )}

//                   {/* 🔴 REJECTED */}
//                   {status === "rejected" && <span>—</span>}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default VoucherList;


import {
  approveVoucher,
  rejectVoucher,
  printVoucher,
} from "../../api/accountsVoucherApi";

const VoucherList = ({
  vouchers = [],
  refreshVouchers,
  onPay, // ✅ Payment modal trigger
}) => {
  if (!Array.isArray(vouchers)) {
    return <p>No voucher data available</p>;
  }

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
    <div>
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
          {vouchers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No vouchers found
              </td>
            </tr>
          )}

          {vouchers.map((v) => {
            const status = (v.status || "").toLowerCase().trim();

            return (
              <tr key={v.id}>
                <td>{v.voucher_no}</td>
                <td>{v.File?.file_no || "-"}</td>
                <td>{v.voucher_type}</td>
                <td>₹ {Number(v.amount).toLocaleString("en-IN")}</td>

                <td>
                  <span className={`status ${status}`}>
                    {status.toUpperCase()}
                  </span>
                </td>

                <td>
                  {/* 🟦 PENDING */}
                  {status === "pending" && (
                    <>
                      <button
                        className="btn approve"
                        onClick={() =>
                          approveVoucher(v.id).then(refreshVouchers)
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn reject"
                        onClick={() =>
                          rejectVoucher(v.id).then(refreshVouchers)
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* 🟨 APPROVED → OPEN PAYMENT MODAL */}
                  {status === "approved" && (
                    <button
                      className="btn pay"
                      onClick={() => onPay(v)}
                    >
                      Pay
                    </button>
                  )}

                  {/* 🟩 PAID */}
                  {status === "paid" && (
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

                  {/* 🔴 REJECTED */}
                  {status === "rejected" && <span>—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherList;
