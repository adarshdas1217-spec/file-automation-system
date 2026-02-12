exports.voucherTemplate = ({
  logo,
  fileNo,
  voucherNo,
  date,
  particulars,
  amount,
  amountWords,
  preparedBy,
  approvedBy,
  paidBy,          // ✅ added
  paidDate,        // ✅ added
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Times New Roman", serif;
      font-size: 14px;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    td, th {
      border: 1px solid #000;
      padding: 6px;
    }
    .no-border td {
      border: none;
    }
    .right { text-align: right; }
  </style>
</head>

<body>
  
  <div class="center bold">
    <img src="${logo}" alt="Logo" style="width: 100px; height: auto;" />
    <h2>Indian Red Cross Society</h2>
    <p>Odisha State Branch, Bhubaneswar – 751022</p>
    <h3>DEBIT VOUCHER</h3>
  </div>

  <table class="no-border">
    <tr>
      <td><b>File No:</b> ${fileNo}</td>
      <td><b>Voucher No:</b> ${voucherNo}</td>
      <td><b>Date:</b> ${date}</td>
    </tr>
  </table>

  <table>
    <tr>
      <th>Particulars</th>
      <th>Amount</th>
    </tr>
    <tr>
      <td>${particulars}</td>
      <td class="right">${amount}</td>
    </tr>
    <tr>
      <td class="right bold">Total</td>
      <td class="right bold">${amount}</td>
    </tr>
  </table>

  <p><b>Passed for payment of Rs.</b> ${amount}
     (<b>${amountWords}</b>) Only.
  </p>

  <table class="no-border">
    <tr>
      <td>
        Prepared By<br/>
        ${preparedBy}
      </td>

      <td>
        Approved By<br/>
        ${approvedBy}
      </td>

      <td>
        Paid By<br/>
        ${paidBy}<br/>
        <small>Date: ${paidDate}</small>
      </td>
    </tr>
  </table>

  <p class="center">
    <i>This is a computer generated voucher. No signature is required.</i>
  </p>
</body>
</html>
`;
};
