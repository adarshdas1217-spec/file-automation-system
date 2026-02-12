const { File, FileNote } = require("../models");

exports.addNote = async (req, res) => {
  try {
    const { file_id, note } = req.body;

    if (!file_id || !note) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const file = await File.findByPk(file_id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const fileNote = await FileNote.create({
      file_id,
      user_id: req.user.id,
      note
    });

    res.status(201).json({
      message: "Note added successfully",
      fileNote
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { fileId } = req.params;

    const notes = await FileNote.findAll({
      where: { file_id: fileId },
      order: [["createdAt", "ASC"]]
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
