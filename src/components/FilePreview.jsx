// src/components/FilePreview.jsx
import { FileIcon, CloseIcon } from "../assets/icons";

export default function FilePreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="file-preview">
      <div className="file-preview-icon"><FileIcon /></div>
      <div className="flex-1 min-w-0">
        <div className="file-preview-name">{file.name}</div>
        <div className="file-preview-meta">
          {file.size < 1048576
            ? (file.size / 1024).toFixed(1) + " KB"
            : (file.size / 1048576).toFixed(2) + " MB"} · PDF
        </div>
      </div>
      <button type="button" onClick={onRemove} className="file-preview-remove">
        <CloseIcon className="w-3.5 h-3.5" strokeWidth="2" />
      </button>
    </div>
  );
}