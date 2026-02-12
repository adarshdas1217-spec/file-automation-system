
const { File, FileMovement, User, MovementRule, sequelize } = require("../models");


exports.moveFile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { file_id, to_user, remark } = req.body;

    if (!file_id || !to_user) {
      await t.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    const file = await File.findByPk(file_id, { transaction: t });
    if (!file) {
      await t.rollback();
      return res.status(404).json({ message: "File not found" });
    }

    // Only current holder can move
    if (file.current_holder !== req.user.id) {
      await t.rollback();
      return res.status(403).json({
        message: "You are not the current holder of this file"
      });
    }

    // File must be OPEN
    if (file.status !== "OPEN") {
      await t.rollback();
      return res.status(400).json({
        message: "File is not open for movement"
      });
    }

    const fromUser = await User.findByPk(file.current_holder, { transaction: t });
    const toUser = await User.findByPk(to_user, { transaction: t });

    if (!toUser) {
      await t.rollback();
      return res.status(404).json({ message: "Target user not found" });
    }

    // 🔐 RULE VALIDATION
    const rule = await MovementRule.findOne({
      where: {
        from_role: fromUser.role,
        to_role: toUser.role,
        unit: file.unit,
        allowed: true
      },
      transaction: t
    });

    if (!rule) {
      await t.rollback();
      return res.status(403).json({
        message: "Movement not allowed by rules engine"
      });
    }

    // 🧾 AUDIT LOG (MANDATORY)
    await FileMovement.create(
      {
        file_id,
        from_user: file.current_holder,
        to_user,
        remark
      },
      { transaction: t }
    );

    // 🔄 UPDATE HOLDER
    file.current_holder = to_user;
    await file.save({ transaction: t });

    // ✅ COMMIT
    await t.commit();

    res.json({
      message: "File moved successfully (audit-safe)"
    });

  } catch (error) {
    await t.rollback();
    console.error("MOVE FILE TRANSACTION FAILED:", error);
    res.status(500).json({ message: "Transaction failed, rolled back" });
  }
};


exports.getFileHistory = async (req, res) => {
  try {
    const { fileId } = req.params;

    const history = await FileMovement.findAll({
      where: { file_id: fileId },
      order: [["createdAt", "ASC"]]
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
