const { File, FileMovement, User, sequelize,OperationMatrix } = require("../models");

exports.createFile = async (req, res) => {
  try {
    

    const { subject, unit } = req.body;

    if (!subject || !unit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const year = new Date().getFullYear();
    console.log("YEAR USED:", year);

    console.log("LOOKUP PARAMS:", {
      unit,
      year,
      db: process.env.DB_NAME
    });

    const allMatrices = await OperationMatrix.findAll();
      console.log("ALL MATRICES:", allMatrices.map(m => m.toJSON()));

      const matrix = await OperationMatrix.findOne({
        where: { unit, year }
    });

    if (!matrix) {
      return res.status(400).json({
        message: "No operation matrix defined for this unit/year"
      });
    }

    matrix.current_counter += 1;
    await matrix.save();

    const file_no = `${matrix.file_prefix}/${matrix.current_counter}/${year}`;

    const file = await File.create({
      file_no,
      subject,
      unit,
      created_by: req.user.id,
      current_holder: req.user.id
    });

    res.status(201).json({
      message: "File created successfully",
      file
    });
  } catch (err) {
    console.error("CREATE FILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("FILE DETAILS ERROR:", error);
    res.status(500).json({ message: "Failed to load file details" });
  }
};
exports.sendFile = async (req, res) => {
  const fileId = req.params.id;
  const { to_user_id, to_role, remarks } = req.body;
  const fromUserId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const file = await File.findByPk(fileId, { transaction });

    if (!file) {
      await transaction.rollback();
      return res.status(404).json({ message: "File not found" });
    }

    // Only current holder can send
    if (file.current_holder !== fromUserId) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ message: "You are not the current holder of this file" });
    }

    const toUser = await User.findByPk(to_user_id, { transaction });
    if (!toUser) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid recipient" });
    }

    // 1️⃣ Record movement
    await FileMovement.create(
      {
        file_id: fileId,
        from_user_id: fromUserId,
        to_user_id: to_user_id,
        remarks: remarks || "File sent",
      },
      { transaction }
    );

    // 2️⃣ Update file holder
    await file.update(
      { current_holder: to_user_id },
      { transaction }
    );

    // 3️⃣ AUTO NOTESHEET ENTRY (MANDATORY)
    await sequelize.models.FileNoteSheet.create(
      {
        file_id: fileId,
        note_text: `The file is forwarded to ${to_role} for necessary action.`,
        created_by: fromUserId,
      },
      { transaction }
    );

    await transaction.commit();

    res.json({ message: "File sent successfully" });

  } catch (err) {
    await transaction.rollback();
    console.error("SEND FILE ERROR:", err);
    res.status(500).json({ message: "Failed to send file" });
  }
};


