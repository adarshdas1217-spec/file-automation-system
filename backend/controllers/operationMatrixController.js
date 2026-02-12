const { OperationMatrix, sequelize } = require("../models");

exports.getUnits = async (req, res) => {
  try {
    const units = await OperationMatrix.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("unit")), "unit"]
      ],
      order: [["unit", "ASC"]],
    });

    res.json(units.map(u => u.unit));
  } catch (err) {
    console.error("FETCH UNITS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch units" });
  }
};

exports.addUnit = async (req, res) => {
  try {
    const { unit, year, file_prefix } = req.body;

    if (!unit || !year || !file_prefix) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await OperationMatrix.findOne({
      where: { unit, year },
    });

    if (exists) {
      return res.status(400).json({
        message: "Unit already exists for this year",
      });
    }

    const record = await OperationMatrix.create({
      unit,
      year,
      file_prefix,
      current_counter: 0,
    });

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add unit" });
  }
};