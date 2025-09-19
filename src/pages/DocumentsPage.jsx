// src/pages/DocumentsPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@components/AuthContext.jsx';
import { api } from '@/lib/api.js';

import formStyles from '@styles/Forms.module.css';
import buttonStyles from '@styles/Buttons.module.css';
import cardStyles from '@styles/Cards.module.css';
import layoutStyles from '@styles/Layout.module.css';
import inboxStyles from '@styles/InboxLists.module.css';

import Icon from '@components/Icon.jsx';
import '@styles/icons.css';

const MAX_INLINE_BYTES = 512 * 1024; // 512KB

// Inline CSS for Documents UI
const DOC_CSS = `
/* -- Upload area content -- */
.upload-area__content {
  display: grid;
  place-items: center;
  gap: var(--space-2, 8px);
  text-align: center;
  padding: var(--space-6, 24px);
}
.upload-area__icon .icon { color: var(--color-primary, #2563eb); }
.upload-area__text { color: var(--color-text, #111827); font-size: 0.95rem; }
.upload-area__subtext { color: var(--color-text-muted, #6b7280); font-size: 0.85rem; }

/* -- Name-only upload form layout -- */
.upload-form {
  margin-top: var(--space-4, 16px);
  display: grid;
  gap: var(--space-3, 12px);
}

/* -- Bulk action bar -- */
.bulkbar {
  position: sticky;
  bottom: 0;
  z-index: var(--z-sticky, 20);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3, 12px);
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.05));
  padding: var(--space-3, 12px) var(--space-4, 16px);
  margin: var(--space-4, 16px) 0;
}
.bulkbar__info { font-weight: 600; color: var(--color-text, #111827); }
.bulkbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2, 8px);
}

/* -- List items -- */
.list-item {
  display: grid;
  grid-template-columns: 28px 40px 1fr auto;
  gap: var(--space-3, 12px);
  align-items: center;
  padding: var(--space-3, 12px) var(--space-3, 12px);
  border-top: 1px solid var(--color-border, #e5e7eb);
}
.list-item:first-child { border-top: none; }
.list-item__checkbox { width: 16px; height: 16px; }

.document-icon {
  display: grid;
  place-items: center;
  width: 40px; height: 40px;
  border-radius: var(--radius-md, 8px);
  background: var(--color-bg, #f9fafb);
  color: var(--color-text-muted, #6b7280);
}

.list-item__content { min-width: 0; }
.list-item__title {
  font-weight: 600;
  color: var(--color-text, #111827);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.list-item__subtitle {
  font-size: 0.85rem;
  color: var(--color-text-muted, #6b7280);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.list-item__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2, 8px);
}

/* -- Icon helpers (in case icons.css is missing) -- */
.icon {
  display: inline-flex;
  line-height: 0;
  vertical-align: middle;
  color: currentColor;
}
.icon svg { display: block; width: 1em; height: 1em; }
.icon--sm { font-size: 16px; }
.icon--md { font-size: 20px; }
.icon--lg { font-size: 28px; }
.icon--primary { color: var(--color-primary, #2563eb); }
.icon--muted { color: var(--color-text-muted, #6b7280); }

/* -- Quick actions button (fallback) -- */
.quick-action {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  background: var(--color-surface, #fff);
  color: var(--color-text, #111827);
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease;
}
.quick-action:hover {
  background: var(--color-surface-hover, #f3f4f6);
  border-color: var(--color-text-muted, #6b7280);
}
`;

export const icon = (type, { size = 'sm', className = '', label } = {}) => {
  const ext = String(type || '').toLowerCase();
  const MAP = {
    pdf: 'document-text', doc: 'document-text', docx: 'document-text',
    xls: 'table-cells', xlsx: 'table-cells',
    ppt: 'chart', pptx: 'chart',
    jpg: 'photo', jpeg: 'photo', png: 'photo', gif: 'photo',
  };
  const name = MAP[ext] || 'document';
  const cls = `icon icon--${size} ${className}`.trim();
  return <Icon name={name} className={cls} ext={ext} decorative={!label} label={label} />;
};

export const iconNameForExt = (type) => {
  const ext = String(type || '').toLowerCase();
  const MAP = {
    pdf: 'document-text', doc: 'document-text', docx: 'document-text',
    xls: 'table-cells', xlsx: 'table-cells',
    ppt: 'chart', pptx: 'chart',
    jpg: 'photo', jpeg: 'photo', png: 'photo', gif: 'photo',
  };
  return MAP[ext] || 'document';
};

function DocumentsPage() {
  const { branch } = useAuth();
  const [allDocs, setAllDocs] = useState([]);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true);
      try {
        const data = await api.documents.list();
        setAllDocs(data);
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDocs();
  }, []);

  const readAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });

  const addDocs = async (files = []) => {
    if (!files.length) return;
    for (const f of files) {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(2) + ' MB';
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      let dataUrl = null;
      if (f.size <= MAX_INLINE_BYTES) {
        try { dataUrl = await readAsDataUrl(f); } catch {}
      }
      const payload = {
        name: f.name,
        size: sizeMB,
        type: ext || (f.type || 'file'),
        branch,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };
      const created = await api.documents.create(payload);
      setAllDocs((prev) => [created, ...prev]);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileInput = async (e) => {
    const files = e.target.files;
    if (files && files.length) {
      await addDocs(files);
      e.target.value = '';
    }
  };

  const handleUploadNameOnly = async () => {
    if (!fileName.trim()) return;
    const ext = (fileName.split('.').pop() || 'unknown').toLowerCase();
    const newDoc = {
      name: fileName.trim(),
      size: '0.50 MB',
      type: ext,
      branch,
      dataUrl: null,
      uploadedAt: new Date().toISOString(),
    };
    const created = await api.documents.create(newDoc);
    setAllDocs((prev) => [created, ...prev]);
    setFileName('');
  };

  const handleDelete = async (id) => {
    await api.documents.remove(id);
    setAllDocs((prev) => prev.filter((d) => d.id !== id));
    setSelected((s) => { const ns = new Set(s); ns.delete(id); return ns; });
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      await addDocs(e.dataTransfer.files);
    }
  };

  const docs = allDocs.filter((d) => d.branch === branch);
  const totalDocs = docs.length;
  const totalSize = docs
    .reduce((sum, d) => sum + parseFloat(String(d.size).replace(/[^\d.]/g, '')), 0)
    .toFixed(1);

  const exportCSV = (onlySelected = false) => {
    const header = ['id', 'name', 'size', 'type', 'branch', 'uploadedAt', 'hasInlineData'];
    const source = onlySelected ? docs.filter((d) => selected.has(d.id)) : docs;
    if (onlySelected && source.length === 0) return alert('No selected documents to export.');
    const rows = source.map((d) => [
      d.id, d.name, d.size, d.type, d.branch, d.uploadedAt, d.dataUrl ? 'yes' : 'no'
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `documents_${branch}${onlySelected ? '_selected' : ''}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleDownload = (doc) => {
    if (doc.dataUrl) {
      const a = document.createElement('a');
      a.href = doc.dataUrl;
      a.download = doc.name;
      a.click();
      return;
    }
    const info = `This document was saved as metadata only.
Name: ${doc.name}
Size: ${doc.size}
Type: ${doc.type}
Branch: ${doc.branch}
Uploaded: ${doc.uploadedAt}
`;
    const blob = new Blob([info], { type: 'text/plain;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${doc.name}.info.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleShare = async (doc) => {
    const text = `Document: ${doc.name} • ${doc.size} • ${doc.type} • Branch: ${doc.branch}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied document info to clipboard!');
    } catch {
      alert(text);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const ns = new Set(prev);
      ns.has(id) ? ns.delete(id) : ns.add(id);
      return ns;
    });
  };
  const selectAllVisible = () => setSelected(new Set(docs.map((d) => d.id)));
  const clearSelection = () => setSelected(new Set());
  const selectedCount = [...selected].filter((id) => docs.some((d) => d.id === id)).length;

  const deleteSelected = async () => {
    if (selectedCount === 0) return;
    const ids = [...selected];
    await Promise.all(ids.map((id) => api.documents.remove(id)));
    setAllDocs((prev) => prev.filter((d) => !ids.includes(d.id)));
    clearSelection();
  };

  const downloadSelected = () => {
    const chosen = docs.filter((d) => selected.has(d.id));
    if (chosen.length === 0) return alert('No selected documents to download.');
    const downloadable = chosen.filter((d) => !!d.dataUrl);
    const missing = chosen.length - downloadable.length;
    if (downloadable.length === 0) return alert('Selected documents have no downloadable data. (They were saved as metadata only.)');
    downloadable.forEach((d) => {
      const a = document.createElement('a');
      a.href = d.dataUrl;
      a.download = d.name;
      a.click();
    });
    if (missing > 0) alert(`${missing} selected item(s) had no downloadable data and were skipped.`);
  };

  if (loading) return <div className={inboxStyles['loading']}>Loading documents…</div>;

  return (
    <div>
      {/* Inject inline CSS once per render tree */}
      <style>{DOC_CSS}</style>

      {/* KPIs */}
      {/* KPIs */}
<div className={layoutStyles['stats-grid']} style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <div className={cardStyles['stat-card']}>
          <span className={cardStyles['stat-card__number']}>{totalDocs}</span>
          <div className={cardStyles['stat-card__label']}>Total Documents ({branch})</div>
        </div>
        <div className={cardStyles['stat-card']}>
          <span className={cardStyles['stat-card__number']}>{totalSize}</span>
          <div className={cardStyles['stat-card__label']}>Total Size (MB)</div>
        </div>
        <div className={cardStyles['stat-card']}>
          <span className={cardStyles['stat-card__number']}>{Math.min(3, totalDocs)}</span>
          <div className={cardStyles['stat-card__label']}>Recent Uploads</div>
        </div>
      </div>

      {/* Upload Card */}
      <div className={cardStyles['form-card']}style={{ padding: '1.5rem' }}> 
        <div className={cardStyles['card__header']}>
          <h3 className={cardStyles['card__title']}>Upload Document ({branch})</h3>
          <p className={cardStyles['card__subtitle']}>
            Drag & drop or click to add files. Name-only upload is also supported.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />

        {/* Dropzone */}
        <div
          className={`${formStyles['upload-area']} ${dragActive ? formStyles['upload-area--active'] : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleUploadClick()}
        >
          <div className="upload-area__content">
            <div className="upload-area__icon">
              <Icon name="arrow-up-tray" className="icon icon--lg icon--primary" decorative />
            </div>
            <div className="upload-area__text">
              <strong>Click to upload</strong> or drag and drop
            </div>
            <div className="upload-area__subtext">
              Small files (≤512KB) are fully downloadable later
            </div>
          </div>
        </div>

        {/* Name-only form */}
        <div className="upload-form">
          <div className={formStyles['form-group']}>
            <label htmlFor="fileName" className={formStyles['form-label']}>Document Name</label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className={formStyles['form-input']}
              placeholder="e.g., notes.pdf"
            />
          </div>
          <div className={cardStyles['quick-actions__grid']}>
            <button
              onClick={handleUploadNameOnly}
              className={buttonStyles['form-button']}
              disabled={!fileName.trim()}
            >
              Upload Document
            </button>
            <button className="quick-action" onClick={() => exportCSV(false)}>
              <Icon name="clipboard" className="icon icon--sm" decorative />
              Export CSV (All)
            </button>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedCount > 0 && (
        <div className="bulkbar">
          <div className="bulkbar__info">{selectedCount} selected</div>
          <div className="bulkbar__actions">
            <button
              className={buttonStyles['action-button']}
              onClick={selectAllVisible}
              title="Select all visible"
              aria-label="Select all visible"
            >
              <Icon name="users" className="icon icon--sm" decorative />
            </button>
            <button
              className={buttonStyles['action-button']}
              onClick={() => exportCSV(true)}
              title="Export selected"
              aria-label="Export selected"
            >
              <Icon name="clipboard" className="icon icon--sm" decorative />
            </button>
            <button
              className={buttonStyles['action-button']}
              onClick={downloadSelected}
              title="Download selected"
              aria-label="Download selected"
            >
              <Icon name="arrow-down-tray" className="icon icon--sm" decorative />
            </button>
            <button
              className={`${buttonStyles['action-button']} ${buttonStyles['action-button--danger']}`}
              onClick={deleteSelected}
              title="Delete selected"
              aria-label="Delete selected"
            >
              <Icon name="trash" className="icon icon--sm" decorative />
            </button>
            <button
              className={buttonStyles['action-button']}
              onClick={clearSelection}
              title="Clear selection"
              aria-label="Clear selection"
            >
              <Icon name="x-mark" className="icon icon--sm" decorative />
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className={cardStyles['list-card']}>
        <div className={cardStyles['card__header']}>
          <h3 className={cardStyles['card__title']}>Your Documents — {branch}</h3>
          <p className={cardStyles['card__subtitle']}>Manage and organize your files</p>
        </div>

        {docs.length ? (
          docs.map((d) => {
            const isChecked = selected.has(d.id);
            return (
              <div key={d.id} className="list-item">
                <input
                  type="checkbox"
                  className="list-item__checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelect(d.id)}
                  aria-label={`Select ${d.name}`}
                />
                <div className="document-icon">
                  {icon(d.type, { size: 'sm', label: `${d.type || 'file'} icon` })}
                </div>
                <div className="list-item__content">
                  <div className="list-item__title">{d.name}</div>
                  <div className="list-item__subtitle">
                    {d.size} • Uploaded on {new Date(d.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="list-item__actions">
                  <button
                    className={buttonStyles['action-button']}
                    title="Download"
                    aria-label="Download"
                    onClick={() => handleDownload(d)}
                  >
                    <Icon name="arrow-down-tray" className="icon icon--sm" decorative />
                  </button>
                  <button
                    className={buttonStyles['action-button']}
                    title="Share"
                    aria-label="Share"
                    onClick={() => handleShare(d)}
                  >
                    <Icon name="share" className="icon icon--sm" decorative />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className={`${buttonStyles['action-button']} ${buttonStyles['action-button--danger']}`}
                    title="Delete"
                    aria-label="Delete"
                  >
                    <Icon name="trash" className="icon icon--sm" decorative />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className={inboxStyles['empty-state']}>
            <div className={inboxStyles['empty-state__icon']}>
              <Icon name="folder" className="icon icon--lg icon--muted" decorative />
            </div>
            <h3>No documents yet</h3>
            <p>Upload your first document to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsPage;
