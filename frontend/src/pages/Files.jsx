import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../api/axios";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFiles();
  }, []);

  // ================= FETCH FILES =================
  const fetchFiles = async () => {
    try {
      const res = await axios.get("/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE FILE =================
  const createFile = async () => {
    if (!subject || !unit) {
      alert("Subject and unit are required");
      return;
    }

    try {
      await axios.post(
        "/files",
        { subject, unit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubject("");
      setUnit("");
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("File creation failed");
    }
  };

  if (loading) return <p>Loading files...</p>;

  return (
    <div>
      <h2>Files</h2>

      {/* ================= CREATE FILE FORM ================= */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Create File</h3>

        <input
          type="text"
          placeholder="File Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="text"
          placeholder="Unit (e.g. ESTT)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button onClick={createFile} style={{ marginLeft: "10px" }}>
          Create
        </button>
      </div>

      {/* ================= FILE LIST TABLE ================= */}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>File No</th>
            <th>Subject</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Current Holder</th>
          </tr>
        </thead>

        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No files found
              </td>
            </tr>
          ) : (
            files.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>

                {/* CLICKABLE FILE NO */}
                <td>
                  <NavLink
                    to={`/files/${file.id}`}
                    style={{
                      textDecoration: "underline",
                      color: "#003366",
                      fontWeight: "bold",
                    }}
                  >
                    {file.file_no}
                  </NavLink>
                </td>

                <td>{file.subject}</td>
                <td>{file.unit}</td>
                <td>{file.status}</td>
                <td>{file.current_holder}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
