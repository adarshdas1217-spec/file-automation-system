import { useEffect, useState } from "react";
import api from "../../services/api";
import AddNoteForm from "./AddNoteForm";
import "./fileNoteSheet.css";

const FileNoteSheet = ({ fileId, canAddNote }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/file-notes/${fileId}`);
      setNotes(res.data || []);
    } catch (err) {
      alert("Failed to load note sheet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) fetchNotes();
  }, [fileId]);

  if (loading) return <p>Loading note sheet…</p>;

  return (
    <div className="note-sheet-wrapper">
      <h2 className="note-sheet-title">NOTESHEET</h2>

      <div className="note-sheet-paper">
        {notes.length === 0 && (
          <p className="empty-note">No notes recorded yet.</p>
        )}

        {notes.map((note) => (
          <div key={note.id} className="note-row">
            {/* LEFT MARGIN NOTE NUMBER */}
            <div className="note-number">
              {note.note_no}.
            </div>

            {/* NOTE BODY */}
            <div className="note-content">
              <div className="note-text">
                {note.note_text}
              </div>

              {/* SIGNATURE BLOCK */}
              <div className="note-sign">
                <div>Sd/-</div>
                <div>{note.author?.name}</div>
                <div>{note.author?.designation || note.author?.role}</div>
                <div>
                  {new Date(note.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NOTE — ONLY CURRENT HOLDER */}
      {canAddNote ? (
        <AddNoteForm fileId={fileId} onSuccess={fetchNotes} />
      ) : (
        <div className="govt-info-note">
          Notesheet is read-only as the file is currently with another officer.
        </div>
      )}
    </div>
  );
};

export default FileNoteSheet;
