import { useEffect, useState } from "react";
import api from "../../services/api";
import "./fileNoteSheet.css";

const AddNoteForm = ({ fileId, onSuccess }) => {
  const draftKey = `draft_note_file_${fileId}`;
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  // Load draft on open
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setNoteText(savedDraft);
    }
  }, [fileId]);

  const saveDraft = () => {
    localStorage.setItem(draftKey, noteText);
    alert("Draft saved");
  };

  const finaliseNote = async () => {
    if (!noteText.trim()) {
      alert("Note text is required");
      return;
    }

    try {
      setSaving(true);

      await api.post("/file-notes", {
        file_id: fileId,
        note_text: noteText,
      });

      localStorage.removeItem(draftKey);
      setNoteText("");
      onSuccess && onSuccess();
      alert("Note finalised and added to notesheet");
    } catch (err) {
      alert("Failed to finalise note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-note-form">
      <h3>Add Note</h3>

      <textarea
        rows="5"
        placeholder="Draft your note here..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />

      {/* ACTION BUTTONS */}
      <div className="note-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={saveDraft}
        >
          Save Draft
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={finaliseNote}
          disabled={saving}
        >
          {saving ? "Finalising..." : "Finalise & Add"}
        </button>
      </div>
    </div>
  );
};

export default AddNoteForm;
