const { File } = require("../models");

exports.closeFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findByPk(fileId);

    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.current_holder !== req.user.id) {
      return res.status(403).json({ message: "Not file holder" });
    }

    file.status = "CLOSED";
    await file.save();

    res.json({ message: "File closed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.reopenFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findByPk(fileId);

    if (!file) return res.status(404).json({ message: "File not found" });

    file.status = "OPEN";
    await file.save();

    res.json({ message: "File reopened successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.archiveFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findByPk(fileId);

    if (!file) return res.status(404).json({ message: "File not found" });

    file.status = "ARCHIVED";
    await file.save();

    res.json({ message: "File archived successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
