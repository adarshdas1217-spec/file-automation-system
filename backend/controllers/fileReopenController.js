const { File, FileMovement, sequelize } = require("../models");

exports.reopenFile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { file_id, remark } = req.body;

    if (!file_id) {
      await t.rollback();
      return res.status(400).json({ message: "file_id required" });
    }

    // ADMIN only
    if (req.user.role !== "ADMIN") {
      await t.rollback();
      return res.status(403).json({
        message: "Only ADMIN can reopen files"
      });
    }

    const file = await File.findByPk(file_id, { transaction: t });
    if (!file) {
      await t.rollback();
      return res.status(404).json({ message: "File not found" });
    }

    if (file.status === "OPEN") {
      await t.rollback();
      return res.status(400).json({
        message: "File is already open"
      });
    }

    // Audit entry (reopen)
    await FileMovement.create(
      {
        file_id,
        from_user: req.user.id,
        to_user: req.user.id,
        remark: remark || "File reopened by ADMIN"
      },
      { transaction: t }
    );

    // Reopen + unarchive
    file.status = "OPEN";
    file.archived = false;
    await file.save({ transaction: t });

    await t.commit();

    res.json({
      message: "File reopened successfully"
    });

  } catch (error) {
    await t.rollback();
    console.error("FILE REOPEN ERROR:", error);
    res.status(500).json({ message: "Transaction failed, rolled back" });
  }
};
