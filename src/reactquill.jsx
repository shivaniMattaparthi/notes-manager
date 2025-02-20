import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

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

function ReactQui() {
  const [value, setValue] = useState("");
  const [savedContent, setSavedContent] = useState(null);

  // Save content to local storage
  const handleSave = () => {
    if(value === ""){
      alert("write Something")
    }else{

        localStorage.setItem("editorContent", value);
        alert("Content saved successfully!");    }
  
  };

  // Load content from local storage
  const handleShowContent = () => {
    const storedContent = localStorage.getItem("editorContent");
    if (storedContent) {
      setSavedContent(storedContent);
    }
  };
  const clearContent = ()=>{

    localStorage.removeItem("editorContent")
    alert("content cleared sucessfully from local storage")
  }

  return (
    <div className="container">
      <div className="row">
        <div className="editor">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            className="editor-input"
            modules={modules}
          />
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={handleShowContent} className="show-button">Show Content</button>
          <button onClick={clearContent} className="clear">Clear Content</button>
        </div>
        
        {savedContent && (
          <div className="preview">
            <h3>Preview :-</h3>
            <div dangerouslySetInnerHTML={{ __html: savedContent }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReactQui;
