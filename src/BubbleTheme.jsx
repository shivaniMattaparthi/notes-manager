import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css"; 
import ImageResize from "quill-image-resize-module-react";

import { AiFillEdit, AiFillDelete, AiOutlineClose } from "react-icons/ai";

const BubbleEditor = () => {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteColor, setNoteColor] = useState("#ffffff"); // Default color is white
  const [showColorPalette, setShowColorPalette] = useState(false); // Toggle color palette

  // Predefined color palette
  const colorPalette = [
    "#ffffff", // White
    "#f28b82", // Red
    "#fbbc04", // Orange
    "#fff475", // Yellow
    "#ccff90", // Green
    "#a7ffeb", // Teal
    "#cbf0f8", // Blue
    "#aecbfa", // Dark Blue
    "#d7aefb", // Purple
    "#fdcfe8", // Pink
  ];

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("savedNotes")) || [];
    setNotes(storedNotes);
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
    ],
    clipboard: { matchVisual: false },
    imageResize: {
      displaySize: true,
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };
  
  ReactQuill.Quill.register("modules/imageResize", ImageResize);
  

  const handleChange = (value) => {
    setContent(value);
  };


  const handleSave = () => {
    const newNote = {
      id: Date.now(),
      content,
      color: noteColor, 
    };
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    localStorage.setItem("savedNotes", JSON.stringify(newNotes));
    setContent("");
    setNoteColor("#ffffff"); // Reset color to default
  };

  const openNote = (note) => {
    setSelectedNote(note); // Set the selected note with its color
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
      {/* Rich Text Editor */}
      <ReactQuill
        theme="snow" // Use the snow theme for the toolbar
        value={content}
        onChange={handleChange}
        placeholder="Write your note..."
        style={styles.quill}
        modules={modules} // Add rich text editing modules
      />

      {/* Color Palette */}
      <div style={styles.colorPickerContainer}>
        <button
          onClick={() => setShowColorPalette(!showColorPalette)}
          style={styles.colorPickerButton}
        >
          🎨 
        </button>
        {showColorPalette && (
          <div style={styles.colorPalette}>
            {colorPalette.map((color) => (
              <div
                key={color}
                style={{
                  ...styles.colorOption,
                  backgroundColor: color,
                }}
                onClick={() => {
                  setNoteColor(color);
                  setShowColorPalette(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button onClick={handleSave} style={styles.saveButton}>
        Save Note
      </button>

      {/* Display Saved Notes */}
      {notes.length > 0 && (
        <div style={styles.savedContainer}>
          {notes.map((note) => (
            <div
              key={note.id}
              style={{ ...styles.previewBox, backgroundColor: note.color }}
              onClick={() => openNote(note)}
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          ))}
        </div>
      )}

      {/* Edit Note Modal */}
      {selectedNote && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.editHeadingContainer}>
              <div>
                <h3>📝 Edit Note</h3>
              </div>
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
              theme="snow"
              value={selectedNote.content}
              onChange={(value) =>
                setSelectedNote({ ...selectedNote, content: value })
              }
              style={{
                ...styles.quill,
                backgroundColor: selectedNote.color, // Apply the selected note's color
              }}
              modules={modules} // Add rich text editing modules
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
    height:"40%",
    margin: "auto",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  quill: {
    minHeight: "150px",
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
  savedContainer: {
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  previewBox: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "5px",
    width: "250px",
    height: "100px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    wordBreak: "break-word",
    lineHeight: "1.4em",
    cursor: "pointer",
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
  iconContainer: {},
  icon: {
    fontSize: "24px",
    cursor: "pointer",
  },
  editHeadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  colorPickerContainer: {
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  colorPickerButton: {
    padding: "10px 15px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  colorPalette: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  colorOption: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid #ddd",
  },
};

export default BubbleEditor;