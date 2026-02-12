import { useEffect, useState } from "react";
import api from "../../services/api";
import "./sendFile.css";

const SendFileSection = ({ fileId, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [toUserId, setToUserId] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  const handleSend = async () => {
    if (!toUserId) {
      alert("Please select officer to send file");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/files/${fileId}/send`, {
        toUserId,
        remark,
      });

      alert("File sent successfully");
      setToUserId("");
      setRemark("");
      onSuccess && onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-file-wrapper">
      <h3 className="send-file-title">SEND FILE</h3>

      <table className="send-file-table">
        <tbody>
          <tr>
            <td>Send File To</td>
            <td>
              <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
              >
                <option value="">-- Select Officer --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.designation || u.role})
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr>
            <td>Remarks</td>
            <td>
              <textarea
                rows="3"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Optional"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Sending..." : "Send File"}
      </button>
    </div>
  );
};

export default SendFileSection;
