import React from 'react';
import { Folder, Layers } from 'lucide-react';

interface FolderFilterProps {
  folders: string[];
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
}

export const FolderFilter: React.FC<FolderFilterProps> = ({
  folders,
  selectedFolder,
  onSelectFolder,
}) => {
  return (
    <div className="folder-filter-bar">
      <button
        className={`folder-pill ${selectedFolder === 'all' ? 'active' : ''}`}
        onClick={() => onSelectFolder('all')}
      >
        <Layers size={14} />
        <span>All Documents</span>
      </button>

      {folders.map((folder) => (
        <button
          key={folder}
          className={`folder-pill ${selectedFolder === folder ? 'active' : ''}`}
          onClick={() => onSelectFolder(folder)}
        >
          <Folder size={14} />
          <span>{folder}</span>
        </button>
      ))}
    </div>
  );
};
