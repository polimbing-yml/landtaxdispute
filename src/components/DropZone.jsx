// src/components/Dropzone.jsx
import { UploadIcon } from "../assets/icons";

export default function Dropzone({ dragOver, setDragOver, handleFileSelect }) {
  return (
    <div
      className={`dropzone${dragOver ? " dropzone--active" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
      }}
      onClick={() => document.getElementById("fileInput").click()}
    >
      <input
        id="fileInput"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) handleFileSelect(e.target.files[0]);
        }}
      />
      <div className={`dropzone-icon-wrap${dragOver ? " dropzone-icon-wrap--active" : ""}`}>
        <UploadIcon />
      </div>
      <div className="dropzone-title">Upload Land Tax Bill</div>
      <div className="dropzone-hint">Drag & drop your PDF here, or click to browse</div>
      <span className="dropzone-badge">PDF only · file saved to Downloads on select</span>
    </div>
  );
}