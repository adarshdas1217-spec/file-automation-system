import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import "./FileDetails.css";
import FileNoteSheet from "../components/files/FileNoteSheet";
import SendFileSection from "../components/SendFile/SendFileSection";

export default function FileDetails() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in user (adjust if your app uses context instead)
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchFile();
  }, []);

  const fetchFile = async () => {
    try {
      const res = await axios.get(`/files/${id}`);
      setFile(res.data);
    } catch (err) {
      alert("Failed to load file details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading file...</p>;
  if (!file) return <p>File not found</p>;

  // 🔒 GOVT RULE: only current holder can act
  const isCurrentHolder = file.current_holder === currentUser?.id;

  return (
    <div className="file-details-page">
      {/* ================= FILE HEADER ================= */}
      <div className="file-header">
        <h2 className="file-title">FILE DETAILS</h2>

        <table className="file-details-table">
          <tbody>
            <tr>
              <td className="label">File No</td>
              <td>{file.file_no}</td>
            </tr>
            <tr>
              <td className="label">Subject</td>
              <td>{file.subject}</td>
            </tr>
            <tr>
              <td className="label">Unit</td>
              <td>{file.unit}</td>
            </tr>
            <tr>
              <td className="label">Status</td>
              <td>{file.status}</td>
            </tr>
            <tr>
              <td className="label">Current Holder</td>
              <td>{file.current_holder}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= NOTESHEET (ALWAYS VISIBLE) ================= */}
      <FileNoteSheet
        fileId={file.id}
        canAddNote={isCurrentHolder}   // 👈 pass permission
      />

      {/* ================= SEND FILE (ONLY CURRENT HOLDER) ================= */}
      {isCurrentHolder ? (
        <SendFileSection
          fileId={file.id}
          onSuccess={fetchFile}
        />
      ) : (
        <div className="govt-info-note">
          File is currently with another officer. Actions are disabled.
        </div>
      )}
    </div>
  );
}
