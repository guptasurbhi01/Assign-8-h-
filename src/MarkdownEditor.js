import React, { useState, useRef, useEffect } from "react";
import MarkdownIt from "markdown-it";
import "./MarkdownEditor.css";

const md = new MarkdownIt();

const MarkdownEditor = () => {
  const [notes, setNotes] = useState([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [currentNote, setCurrentNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);// Track whether the note is being edited
  const [previewMode, setPreviewMode] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (currentNoteIndex !== -1 && !isEditing) {
      const updatedNotes = [...notes];
      updatedNotes[currentNoteIndex] = currentNote;
      setNotes(updatedNotes);
    }
  }, [currentNote, currentNoteIndex, isEditing, notes]);

  useEffect(() => {
    if (currentNoteIndex !== -1) {
      setCurrentNote(notes[currentNoteIndex]);
    }
  }, [currentNoteIndex, notes]);

  const handleChange = (e) => {
    setIsEditing(true); 
    setCurrentNoteIndex(-1); 
    setCurrentNote(e.target.value);
  };

  const handleAddNote = () => {
    if (currentNote.trim() !== "") {
      setNotes([...notes, currentNote]);
      setCurrentNoteIndex(notes.length);
      setCurrentNote("");
    }
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    setCurrentNoteIndex(-1);
    setCurrentNote("");
  };

  const handleNoteSelect = (index) => {
    setCurrentNoteIndex(index);
    setPreviewMode(false); 
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleExport = () => {
    const content = notes.join("\n\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const insertText = (text) => {
    const textarea = textareaRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentText = textarea.value;

    const newText =
      currentText.substring(0, startPos) +
      text +
      currentText.substring(endPos, currentText.length);

    setCurrentNoteIndex(-1); 
    setIsEditing(true); 
    setCurrentNote(newText);
    textarea.focus();
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
  };

  const handleInsertList = (type) => {
    const listType = type === "ordered" ? "1. " : "- ";
    insertText(`${listType}\n`);
  };

  return (
    <div className="markdown-editor">
      <div className="sidebar">
        <h2>Notes</h2>
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <span onClick={() => handleNoteSelect(index)}>
                Note {index + 1}
              </span>
              <button onClick={() => handleDeleteNote(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="toolbar">
        <button onClick={() => insertText("**")}>Bold</button>
        <button onClick={() => insertText("*")}>Italic</button>
        <button onClick={() => insertText("~~")}>Strikethrough</button>
        <button onClick={() => insertText("`")}>Code</button>
        <button onClick={() => insertText("> ")}>Quote</button>
        <button onClick={() => insertText("![alt text](image-url)")}>
          Image
        </button>
        <button onClick={() => handleInsertList("ordered")}>
          Ordered List
        </button>
        <button onClick={() => handleInsertList("unordered")}>
          Unordered List
        </button>
      </div>
      <div className="editor">
        <textarea
          ref={textareaRef}
          value={currentNote}
          onChange={handleChange}
          placeholder="Write your Markdown here... e.g., **bold**, *italic*, # Heading"
        ></textarea>
        <div>
          <button onClick={handleAddNote}>Add Note</button>
          <button onClick={togglePreview}>
            {previewMode ? "Edit" : "Preview"}
          </button>
        </div>
      </div>
      <div className="preview">
        {previewMode && currentNoteIndex !== -1 ? (
          <div className="note">
            <div
              dangerouslySetInnerHTML={{ __html: md.render(currentNote) }}
            ></div>
          </div>
        ) : (
          <div className="preview-placeholder">Preview will be shown here</div>
        )}
        {notes.length > 0 && (
          <div className="export">
            <button onClick={handleExport}>Export Notes</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
