const { File, FileMovement, sequelize } = require("../models");

exports.closeFile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { file_id, remark } = req.body;

    if (!file_id) {
      await t.rollback();
      return res.status(400).json({ message: "file_id required" });
    }

    const file = await File.findByPk(file_id, { transaction: t });
    if (!file) {
      await t.rollback();
      return res.status(404).json({ message: "File not found" });
    }

    // Only current holder OR ADMIN can close
    if (file.current_holder !== req.user.id && req.user.role !== "ADMIN") {
      await t.rollback();
      return res.status(403).json({
        message: "Not authorized to close this file"
      });
    }

    if (file.status === "CLOSED") {
      await t.rollback();
      return res.status(400).json({
        message: "File already closed"
      });
    }

    // Audit entry (closure)
    await FileMovement.create(
      {
        file_id,
        from_user: req.user.id,
        to_user: req.user.id,
        remark: remark || "File closed"
      },
      { transaction: t }
    );

    // Close + archive
    file.status = "CLOSED";
    file.archived = true;
    await file.save({ transaction: t });

    await t.commit();

    res.json({
      message: "File closed and archived successfully"
    });

  } catch (error) {
    await t.rollback();
    console.error("FILE CLOSE ERROR:", error);
    res.status(500).json({ message: "Transaction failed, rolled back" });
  }
};
