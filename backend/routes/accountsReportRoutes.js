const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const reports = require("../controllers/accountsReportController");

router.get("/vouchers", auth, reports.voucherRegister);
router.get("/savings-summary", auth, reports.savingsSummary);
router.get("/deposits", auth, reports.depositRegister);
router.get("/cashflow", auth, reports.cashFlowSnapshot);

module.exports = router;
