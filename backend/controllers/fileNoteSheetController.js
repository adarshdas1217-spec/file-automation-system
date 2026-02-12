const { FileNoteSheet, File, User} = require("../models");

/**
 * CREATE NOTE (append-only)
 */
exports.createNote = async (req, res) => {
  try {
    const { file_id, note_text } = req.body;
    const userId = req.user.id;

    if (!file_id || !note_text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔒 FETCH FILE
    const file = await File.findByPk(file_id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // 🚨 CRITICAL GOVT CHECK
    if (file.current_holder !== userId) {
      return res.status(403).json({
        message: "Only the current holder of the file can add notes"
      });
    }

    // ✅ APPEND NOTE
    await FileNoteSheet.create({
      file_id,
      note_text,
      created_by: userId
    });

    res.json({ message: "Note added successfully" });

  } catch (err) {
    console.error("CREATE NOTE ERROR:", err);
    res.status(500).json({ message: "Failed to add note" });
  }
};

/**
 * GET NOTESHEET FOR FILE (chronological)
 */
exports.getNotesByFile = async (req, res) => {
  try {
    const fileId = Number(req.params.fileId);

    if (!fileId) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    const notes = await FileNoteSheet.findAll({
      where: { file_id: fileId },
      include: [
        {
          model: User,
          as: "author", // 🔑 MUST match association alias
          attributes: ["id", "name", "role"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.json(notes);
  } catch (error) {
    console.error("FETCH NOTES ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
