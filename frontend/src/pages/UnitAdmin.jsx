import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UnitAdmin() {
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [prefix, setPrefix] = useState("");

  const token = localStorage.getItem("token");

  const fetchUnits = async () => {
    const res = await api.get("/operation-matrix/units", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUnits(res.data);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const addUnit = async () => {
    if (!unit || !prefix) {
      alert("All fields required");
      return;
    }

    await api.post(
      "/operation-matrix/units",
      { unit, year, file_prefix: prefix },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUnit("");
    setPrefix("");
    fetchUnits();
  };

  return (
    <div>
      <h2>Unit Master</h2>

      <h3>Add Unit</h3>
      <input
        placeholder="Unit (e.g. ACCOUNTS)"
        value={unit}
        onChange={(e) => setUnit(e.target.value.toUpperCase())}
      />
      <input
        placeholder="File Prefix (e.g. RC/ACCOUNTS)"
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
        style={{ marginLeft: 10 }}
      />
      <button onClick={addUnit} style={{ marginLeft: 10 }}>
        Add
      </button>

      <h3 style={{ marginTop: 30 }}>Existing Units</h3>
      <ul>
        {units.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>
    </div>
  );
}
