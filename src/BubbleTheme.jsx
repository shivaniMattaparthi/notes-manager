import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { AiFillEdit, AiFillDelete, AiOutlineClose } from "react-icons/ai";

const BubbleEditor = () => {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("savedNotes")) || [];
    setNotes(storedNotes);
  }, []);
  console.log(notes, "notes");
  const handleChange = (value) => {
    setContent(value);
  };

  // Save new note
  const handleSave = () => {
    const newNotes = [...notes, { id: Date.now(), content }];
    setNotes(newNotes);
    localStorage.setItem("savedNotes", JSON.stringify(newNotes));
    setContent("");
  };

  const openNote = (note) => {
    setSelectedNote(note);
  };

  const handleUpdate = () => {
    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id
        ? { ...note, content: selectedNote.content }
        : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("savedNotes", JSON.stringify(updatedNotes));
    setSelectedNote(null);
  };

  const handleDelete = (id) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);
    localStorage.setItem("savedNotes", JSON.stringify(filteredNotes));
    setSelectedNote(null);
  };

  return (
    <div style={styles.container}>
      <ReactQuill
        theme="bubble"
        value={content}
        onChange={handleChange}
        placeholder="Write your note..."
        style={styles.quill}
      />

      <button onClick={handleSave} style={styles.saveButton}>
        Save Note
      </button>

      {notes.length > 0 && (
        <div style={styles.savedContainer}>
          {notes.map((note) => (
            <div
              key={note.id}
              style={styles.previewBox}
              onClick={() => openNote(note)}
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          ))}
        </div>
      )}

      {selectedNote && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div className={styles.editHeadingContainer}>
              <h3>📝 Edit Note</h3>
              <div style={styles.iconContainer}>
                <AiFillEdit onClick={handleUpdate} style={styles.icon} />
                <AiFillDelete
                  onClick={() => handleDelete(selectedNote.id)}
                  style={{ ...styles.icon, color: "red" }}
                />
                <AiOutlineClose
                  onClick={() => setSelectedNote(null)}
                  style={{ ...styles.icon, color: "gray" }}
                />
              </div>
            </div>
            <ReactQuill
              theme="bubble"
              value={selectedNote.content}
              onChange={(value) =>
                setSelectedNote({ ...selectedNote, content: value })
              }
              style={styles.quill}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "70%",
    margin: "auto",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#444",
  },
  quill: {
    minHeight: "20px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    fontSize: "16px",
    color: "#333",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  saveButton: {
    display: "block",
    margin: "10px auto",
    padding: "10px 15px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    display: "block",
    margin: "10px auto",
    padding: "10px 15px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    display: "block",
    margin: "10px auto",
    padding: "10px 15px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  savedContainer: {
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  previewTitle: {
    color: "#333",
  },
  previewBox: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "5px",
    width: "250px",
    height: "100px",
    background: "#f9f9f9",

    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    wordBreak: "break-word",
    lineHeight: "1.4em",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "60%",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "15px",
  },
  icon: {
    fontSize: "24px",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  editHeadingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent:
      "space-between" /* Pushes heading to the left and icons to the right */,
    marginBottom: "10px",
  },
};

export default BubbleEditor;