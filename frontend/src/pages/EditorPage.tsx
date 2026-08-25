import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import html2pdf from 'html2pdf.js';
import { RotateCcw, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';

import { FontSize } from '../components/editor/extensions/FontSize.js';
import { LineHeight } from '../components/editor/extensions/LineHeight.js';
import { PageBreak } from '../components/editor/extensions/PageBreak.js';

import { EditorNavbar, SaveStatus } from '../components/editor/EditorNavbar.js';
import { EditorMenubar } from '../components/editor/EditorMenubar.js';
import { EditorToolbar } from '../components/editor/EditorToolbar.js';
import { PageCanvas } from '../components/editor/PageCanvas.js';
import { TableControls } from '../components/editor/TableControls.js';

import { PageSettingsModal } from '../components/editor/PageSettingsModal.js';
import { ImageModal } from '../components/editor/ImageModal.js';
import { LinkModal } from '../components/editor/LinkModal.js';
import { LetterheadDrawer } from '../components/editor/LetterheadDrawer.js';
import { VersionHistoryDrawer } from '../components/editor/VersionHistoryDrawer.js';
import {
  CompanyProfileModal,
  getActiveCompanyProfile,
  CompanyProfile,
} from '../components/dashboard/CompanyProfileModal.js';

import { documentApi } from '../api/documentApi.js';
import { versionApi } from '../api/versionApi.js';
import { useToast } from '../context/ToastContext.js';
import {
  DocFooter,
  DocHeader,
  DocMargins,
  DocumentItem,
  DocumentVersion,
  LetterpadConfig,
  PageOrientation,
  PageSize,
} from '../types/document.types.js';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error, info } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  // Active doc ID
  const [docId, setDocId] = useState<string | null>(id && id !== 'new' ? id : null);
  const [docData, setDocData] = useState<DocumentItem | null>(null);

  // Document fields
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('General');
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [margins, setMargins] = useState<DocMargins>({
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    unit: 'mm',
  });
  const [zoom, setZoom] = useState(100);
  const [header, setHeader] = useState<DocHeader>({ enabled: false, layout: 'aesthetic' });
  const [footer, setFooter] = useState<DocFooter>({ enabled: false, layout: 'aesthetic' });
  const [letterpadConfig, setLetterpadConfig] = useState<LetterpadConfig>({
    isLetterpadMode: false,
  });
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [currentProfileName, setCurrentProfileName] = useState<string>('');
  const [currentVersionNumber, setCurrentVersionNumber] = useState<string>('v1.0');
  const [loading, setLoading] = useState(true);

  // Version Preview Mode
  const [previewVersion, setPreviewVersion] = useState<DocumentVersion | null>(null);

  // Explicit Save Tracking
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modals & Drawers
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      FontSize,
      LineHeight,
      PageBreak,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Subscript,
      Superscript,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (!previewVersion) {
        setContent(editor.getHTML());
        setHasUnsavedChanges(true);
        setSaveStatus('unsaved');
      }
    },
  });

  // Load document or initialize draft
  useEffect(() => {
    const initEditor = async () => {
      // 1. New document / draft
      if (!id || id === 'new') {
        const draft = (location.state as any)?.draft;
        if (draft) {
          setTitle(draft.title || 'Untitled Document');
          setContent(draft.content || '<p></p>');
          if (draft.folder) setFolder(draft.folder);
          if (draft.pageSize) setPageSize(draft.pageSize);
          if (draft.orientation) setOrientation(draft.orientation);
          if (draft.margins) setMargins(draft.margins);
          if (draft.header) setHeader(draft.header);
          if (draft.footer) setFooter(draft.footer);
          if (draft.letterpadConfig) setLetterpadConfig(draft.letterpadConfig);

          if (editor) {
            editor.commands.setContent(draft.content || '<p></p>');
          }
        } else {
          setTitle('Untitled Document');
          setContent('<p></p>');
        }
        setCurrentVersionNumber('v1.0');
        setHasUnsavedChanges(true);
        setSaveStatus('unsaved');
        setLoading(false);
        return;
      }

      // 2. Existing document from database
      try {
        setLoading(true);
        const res = await documentApi.getDocumentById(id);
        if (res.success && res.data.document) {
          const doc = res.data.document;
          setDocId(doc._id);
          setDocData(doc);
          setTitle(doc.title);
          setContent(doc.content);
          setFolder(doc.folder || 'General');
          setPageSize(doc.pageSize || 'A4');
          setOrientation(doc.orientation || 'portrait');
          if (doc.margins) setMargins(doc.margins);
          if (doc.zoom) setZoom(doc.zoom);
          if (doc.header) setHeader(doc.header);
          if (doc.footer) setFooter(doc.footer);
          if (doc.letterpadConfig) setLetterpadConfig(doc.letterpadConfig);
          if (doc.currentVersion) setCurrentVersionNumber(doc.currentVersion);

          if (editor) {
            editor.commands.setContent(doc.content || '<p></p>');
          }
          setHasUnsavedChanges(false);
          setSaveStatus('saved');
        }
      } catch (err: any) {
        error(err.response?.data?.message || 'Failed to load document');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    initEditor();
  }, [id, editor, location.state, navigate, error]);

  // Handle Version Preview Mode toggling
  const handlePreviewVersion = (version: DocumentVersion | null) => {
    setPreviewVersion(version);
    if (editor) {
      if (version) {
        editor.setEditable(false);
        editor.commands.setContent(version.content || '<p></p>');
      } else {
        editor.setEditable(true);
        editor.commands.setContent(content || '<p></p>');
      }
    }
  };

  // Restore Version Handler (Non-destructive)
  const handleRestoreVersion = async (versionToRestore: DocumentVersion) => {
    if (!docId) return;

    try {
      setLoading(true);
      const res = await versionApi.restoreVersion(docId, versionToRestore._id);
      if (res.success && res.data.document) {
        const restoredDoc = res.data.document;
        setDocData(restoredDoc);
        setTitle(restoredDoc.title);
        setContent(restoredDoc.content);
        setFolder(restoredDoc.folder || 'General');
        setPageSize(restoredDoc.pageSize || 'A4');
        setOrientation(restoredDoc.orientation || 'portrait');
        if (restoredDoc.margins) setMargins(restoredDoc.margins);
        if (restoredDoc.zoom) setZoom(restoredDoc.zoom);
        if (restoredDoc.header) setHeader(restoredDoc.header);
        if (restoredDoc.footer) setFooter(restoredDoc.footer);
        if (restoredDoc.letterpadConfig) setLetterpadConfig(restoredDoc.letterpadConfig);
        if (restoredDoc.currentVersion) setCurrentVersionNumber(restoredDoc.currentVersion);

        // Exit preview mode and re-enable editor
        setPreviewVersion(null);
        if (editor) {
          editor.setEditable(true);
          editor.commands.setContent(restoredDoc.content || '<p></p>');
        }

        setHasUnsavedChanges(false);
        setSaveStatus('saved');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLetterheadActive = Boolean(
    (previewVersion ? previewVersion.header : header)?.enabled ||
    (previewVersion ? previewVersion.footer : footer)?.enabled
  );

  // Directly Apply Selected Header & Footer preset to Document (Aesthetic Arc Design)
  const handleSelectProfile = (profile: CompanyProfile) => {
    if (previewVersion) return;

    setCurrentProfileId(profile.id);
    setCurrentProfileName(profile.name || profile.companyName);

    setHeader({
      enabled: true,
      logo: profile.logo,
      companyName: profile.companyName || profile.name || 'Company Name',
      layout: 'aesthetic',
    });
    setFooter({
      enabled: true,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      address: profile.address,
      layout: 'aesthetic',
    });

    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
    success(`Applied "${profile.name || profile.companyName}" Letterhead!`);
  };

  const handleRemoveLetterhead = () => {
    if (previewVersion) return;

    setHeader((prev) => ({ ...prev, enabled: false }));
    setFooter((prev) => ({ ...prev, enabled: false }));
    setCurrentProfileId(null);
    setCurrentProfileName('');
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
    info('Letterhead removed from document');
  };

  const handleOpenAddModal = (profileIdToEdit?: string | null) => {
    setEditingProfileId(profileIdToEdit || null);
    setIsProfileModalOpen(true);
  };

  const handleProfileAdded = (newProfile: CompanyProfile) => {
    handleSelectProfile(newProfile);
  };

  // Handle Explicit Manual Save & Version Generation
  const handleSaveDocument = useCallback(async () => {
    if (previewVersion) return;

    try {
      setSaveStatus('saving');

      const payload = {
        title,
        content,
        folder,
        pageSize,
        orientation,
        margins,
        zoom,
        header,
        footer,
        letterpadConfig,
      };

      if (!docId) {
        // Create new document in MongoDB
        const res = await documentApi.createDocument(payload);
        if (res.success && res.data.document) {
          const newDoc = res.data.document;
          setDocId(newDoc._id);
          setDocData(newDoc);
          if (newDoc.currentVersion) setCurrentVersionNumber(newDoc.currentVersion);
          setHasUnsavedChanges(false);
          setSaveStatus('saved');
          window.history.replaceState(null, '', `/editor/${newDoc._id}`);
          success('Document saved & Version v1.0 created!');
        }
      } else {
        // Update existing document & snapshot version
        const res = await documentApi.updateDocument(docId, payload);
        if (res.success && res.data.document) {
          const updatedDoc = res.data.document;
          if (updatedDoc.currentVersion) setCurrentVersionNumber(updatedDoc.currentVersion);
          setHasUnsavedChanges(false);
          setSaveStatus('saved');
          success(`Saved successfully (${updatedDoc.currentVersion || 'Current'})!`);
        }
      }
    } catch (err: any) {
      setSaveStatus('failed');
      error(err.response?.data?.message || 'Failed to save document');
    }
  }, [
    docId,
    title,
    content,
    folder,
    pageSize,
    orientation,
    margins,
    zoom,
    header,
    footer,
    letterpadConfig,
    previewVersion,
    success,
    error,
  ]);

  // Global Keyboard Shortcuts (Ctrl+S, Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDocument();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveDocument]);

  const handleTitleChange = (newTitle: string) => {
    if (previewVersion) return;
    setTitle(newTitle);
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  };

  const handlePageSettingsSave = (settings: {
    pageSize: PageSize;
    orientation: PageOrientation;
    margins: DocMargins;
    zoom: number;
  }) => {
    if (previewVersion) return;
    setPageSize(settings.pageSize);
    setOrientation(settings.orientation);
    setMargins(settings.margins);
    setZoom(settings.zoom);
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      info('Generating high-fidelity PDF document...');
      const opt = {
        margin: 0,
        filename: `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: {
          unit: 'mm',
          format: pageSize === 'Letter' ? 'letter' : pageSize === 'Legal' ? 'legal' : 'a4',
          orientation: orientation,
        },
      };
      await (html2pdf as any)().set(opt).from(element).save();
      success('PDF downloaded successfully!');
    } catch (err) {
      error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="editor-loading-screen">
        <div className="loading-spinner" />
        <p>Loading document canvas...</p>
      </div>
    );
  }

  // Determine active view settings (preview version vs active document)
  const activeHeader = previewVersion ? previewVersion.header : header;
  const activeFooter = previewVersion ? previewVersion.footer : footer;
  const activeLetterpadConfig = previewVersion
    ? previewVersion.letterpadConfig
    : letterpadConfig;
  const activePageSize = previewVersion ? previewVersion.pageSize : pageSize;
  const activeOrientation = previewVersion ? previewVersion.orientation : orientation;
  const activeMargins = previewVersion ? previewVersion.margins : margins;
  const activeZoom = previewVersion ? previewVersion.zoom : zoom;

  return (
    <div className="editor-layout">
      {/* Top Navbar */}
      <EditorNavbar
        title={previewVersion ? `${previewVersion.title || title} (${previewVersion.versionNumber})` : title}
        onTitleChange={handleTitleChange}
        saveStatus={saveStatus}
        hasUnsavedChanges={hasUnsavedChanges}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onManualSave={handleSaveDocument}
        currentVersion={currentVersionNumber}
        onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        isPreviewingVersion={Boolean(previewVersion)}
      />

      {/* Menubar (File, Edit, Insert, Format) */}
      <EditorMenubar
        editor={editor}
        onPageSettings={() => setIsPageSettingsOpen(true)}
        onHeaderFooter={() => setIsDrawerOpen(true)}
        onImageModal={() => setIsImageModalOpen(true)}
        onLinkModal={() => setIsLinkModalOpen(true)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onDuplicate={handleSaveDocument}
        onVersionHistory={() => setIsVersionHistoryOpen(true)}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Formatting & Controls Toolbar Ribbon */}
      {!previewVersion && (
        <EditorToolbar
          editor={editor}
          onImageModal={() => setIsImageModalOpen(true)}
          onLinkModal={() => setIsLinkModalOpen(true)}
          onPageSettings={() => setIsPageSettingsOpen(true)}
          currentProfileId={currentProfileId}
          isLetterheadActive={isLetterheadActive}
          onSelectProfile={handleSelectProfile}
          onOpenAddModal={() => handleOpenAddModal(null)}
          onRemoveLetterhead={handleRemoveLetterhead}
          onPrint={handlePrint}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      )}

      {/* Historical Version Preview Alert Ribbon */}
      {previewVersion && (
        <div
          className="no-print"
          style={{
            background: 'linear-gradient(90deg, #faf4f8 0%, #fff7ed 100%)',
            borderBottom: '1px solid #f0dceb',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(117, 47, 102, 0.06)',
            zIndex: 100,
            animation: 'slideDown 0.2s ease-out',
          }}
        >
          {/* Left Side: Project Theme Badge & Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, #752f66 0%, #e47f25 100%)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 20,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(117, 47, 102, 0.2)',
              }}
            >
              <Eye size={12} />
              <span>Snapshot {previewVersion.versionNumber}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1c1e2d' }}>
                {previewVersion.changeSummary || 'Text updated'}
              </span>

              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#e47f25',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  padding: '1px 7px',
                  borderRadius: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Read-Only Preview
              </span>
            </div>
          </div>

          {/* Right Side: Project Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => handleRestoreVersion(previewVersion)}
              style={{
                background: 'linear-gradient(135deg, #752f66 0%, #e47f25 100%)',
                color: '#ffffff',
                borderColor: 'transparent',
                fontWeight: 600,
                fontSize: '0.78rem',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(117, 47, 102, 0.2)',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} /> Restore this Version
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handlePreviewVersion(null)}
              style={{
                background: '#ffffff',
                color: '#5d6785',
                borderColor: '#dbe2ea',
                fontSize: '0.78rem',
                fontWeight: 600,
                gap: 6,
                padding: '5px 12px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              <XCircle size={13} /> Exit Preview & Return to Current
            </button>
          </div>
        </div>
      )}

      {/* Document Workspace Canvas */}
      <main className="editor-workspace">
        <PageCanvas
          ref={printRef}
          editor={editor}
          pageSize={activePageSize}
          orientation={activeOrientation}
          margins={activeMargins}
          zoom={activeZoom}
          header={activeHeader}
          footer={activeFooter}
          letterpadConfig={activeLetterpadConfig}
          onEditHeader={() => !previewVersion && setIsDrawerOpen(true)}
          onEditFooter={() => !previewVersion && setIsDrawerOpen(true)}
          onEditLetterpad={() => { }}
        />

        {/* Floating contextual table toolbar */}
        {!previewVersion && <TableControls editor={editor} />}
      </main>

      {/* Page Setup Modal */}
      <PageSettingsModal
        isOpen={isPageSettingsOpen}
        onClose={() => setIsPageSettingsOpen(false)}
        pageSize={pageSize}
        orientation={orientation}
        margins={margins}
        zoom={zoom}
        onSave={handlePageSettingsSave}
      />

      {/* Insert Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={(url: string) => {
          if (editor && url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      />

      {/* Insert Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        initialUrl={editor?.getAttributes('link').href || ''}
        onSave={(url: string) => {
          if (editor) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        onRemove={() => {
          if (editor) {
            editor.chain().focus().unsetLink().run();
          }
        }}
      />

      {/* Slide-over Letterhead Presets Drawer */}
      <LetterheadDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentProfileId={currentProfileId}
        isLetterheadActive={isLetterheadActive}
        onSelectProfile={handleSelectProfile}
        onOpenAddModal={handleOpenAddModal}
        onRemoveLetterhead={handleRemoveLetterhead}
      />

      {/* Slide-over Version History Drawer */}
      <VersionHistoryDrawer
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        documentId={docId}
        currentVersionNumber={currentVersionNumber}
        previewVersionId={previewVersion?._id || null}
        onPreviewVersion={handlePreviewVersion}
        onRestoreVersion={handleRestoreVersion}
      />

      {/* Add / Edit Custom Header & Footer Modal */}
      <CompanyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        editingProfileId={editingProfileId}
        onProfileAdded={handleProfileAdded}
      />
    </div>
  );
};
