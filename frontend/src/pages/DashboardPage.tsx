import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/dashboard/Navbar.js';
import { DocumentCard } from '../components/dashboard/DocumentCard.js';
import { CreateDocModal } from '../components/dashboard/CreateDocModal.js';
import { Modal } from '../components/common/Modal.js';
import { Button } from '../components/common/Button.js';
import { Dropdown } from '../components/common/Dropdown.js';
import { useToast } from '../context/ToastContext.js';
import { documentApi } from '../api/documentApi.js';
import { DocumentItem, PageOrientation, PageSize } from '../types/document.types.js';
import { LayoutGrid, List, ArrowUpDown, Plus, FileQuestion, Clock, Calendar } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [renamingDoc, setRenamingDoc] = useState<DocumentItem | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [deletingDoc, setDeletingDoc] = useState<DocumentItem | null>(null);

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await documentApi.getDocuments({
        search: searchQuery || undefined,
        sort: sortBy,
      });
      if (res.success && res.data) {
        setDocuments(res.data.documents);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, error]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleCreateDocument = (data: {
    title: string;
    pageSize: PageSize;
    orientation: PageOrientation;
    folder: string;
    isLetterpadMode: boolean;
  }) => {
    navigate('/editor/new', {
      state: {
        draft: {
          title: data.title,
          pageSize: data.pageSize,
          orientation: data.orientation,
          folder: data.folder,
          letterpadConfig: {
            isLetterpadMode: data.isLetterpadMode,
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          },
        },
      },
    });
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingDoc || !newTitle.trim()) return;

    try {
      const res = await documentApi.renameDocument(renamingDoc._id, newTitle.trim());
      if (res.success) {
        success('Document renamed');
        setDocuments((prev) =>
          prev.map((d) => (d._id === renamingDoc._id ? { ...d, title: newTitle.trim() } : d))
        );
        setRenamingDoc(null);
        setNewTitle('');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to rename document');
    }
  };

  const handleDuplicate = async (doc: DocumentItem) => {
    try {
      const res = await documentApi.duplicateDocument(doc._id);
      if (res.success && res.data.document) {
        success('Document duplicated');
        fetchDocs();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to duplicate document');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDoc) return;
    try {
      const res = await documentApi.deleteDocument(deletingDoc._id);
      if (res.success) {
        success('Document deleted');
        setDocuments((prev) => prev.filter((d) => d._id !== deletingDoc._id));
        setDeletingDoc(null);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to delete document');
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Documents Section */}
      <main className="documents-main-section" style={{ paddingTop: 32 }}>
        <div className="section-container">
          <div className="docs-section-toolbar">
            <div className="docs-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 className="docs-section-title">Recent Documents</h2>
              {!loading && (
                <span className="docs-count-badge">
                  {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                </span>
              )}
            </div>

            <div className="docs-controls-row">
              {/* Sort selector */}
              <Dropdown
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                options={[
                  {
                    value: 'updatedAt',
                    label: 'Last modified',
                    icon: <Clock size={14} />,
                    description: 'Most recently edited first',
                  },
                  {
                    value: 'createdAt',
                    label: 'Date created',
                    icon: <Calendar size={14} />,
                    description: 'Recently created first',
                  },
                  {
                    value: 'title',
                    label: 'Title (A-Z)',
                    icon: <ArrowUpDown size={14} />,
                    description: 'Alphabetical ordering',
                  },
                ]}
                icon={<ArrowUpDown size={14} />}
                menuWidth="210px"
                align="right"
              />

              {/* View Toggle */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className={`btn btn-ghost btn-sm ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  className={`btn btn-ghost btn-sm ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                >
                  <List size={16} />
                </button>
              </div>

              {/* Create button */}
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={16} />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                New Document
              </Button>
            </div>
          </div>

          {/* Documents Grid / List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#64748b' }}>Loading your documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="empty-docs-state">
              <FileQuestion size={48} className="empty-icon" />
              <h3>No documents found</h3>
              <p>
                {searchQuery
                  ? `No documents matching "${searchQuery}"`
                  : 'Get started by creating a new document.'}
              </p>
              <Button
                variant="primary"
                size="md"
                style={{ marginTop: 16 }}
                icon={<Plus size={16} />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Document
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="docs-grid">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  viewMode="grid"
                  onRename={(d) => {
                    setRenamingDoc(d);
                    setNewTitle(d.title);
                  }}
                  onDuplicate={handleDuplicate}
                  onDelete={setDeletingDoc}
                />
              ))}
            </div>
          ) : (
            <div className="docs-list">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  viewMode="list"
                  onRename={(d) => {
                    setRenamingDoc(d);
                    setNewTitle(d.title);
                  }}
                  onDuplicate={handleDuplicate}
                  onDelete={setDeletingDoc}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <CreateDocModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDocument}
      />

      {/* Rename Modal */}
      <Modal
        isOpen={!!renamingDoc}
        onClose={() => setRenamingDoc(null)}
        title="Rename Document"
      >
        <form onSubmit={handleRenameSubmit}>
          <div className="form-group">
            <label>New Document Name</label>
            <input
              type="text"
              className="form-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <Button type="button" variant="secondary" onClick={() => setRenamingDoc(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        title="Delete Document?"
      >
        <p style={{ color: '#475569', marginBottom: 18 }}>
          Are you sure you want to delete <strong>"{deletingDoc?.title}"</strong>? This
          action cannot be undone.
        </p>
        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={() => setDeletingDoc(null)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleDeleteConfirm}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
