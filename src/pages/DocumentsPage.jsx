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

// Aetherial Glass Design System + Documents UI
const DOC_CSS = `
/* ===== AETHERIAL GLASS DESIGN SYSTEM ===== */
:root {
  /* Primary Colors */
  --primary: #6366f1;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  
  /* Secondary Colors */
  --secondary: #8b5cf6;
  --secondary-light: #a78bfa;
  
  /* State Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #06b6d4;
  
  /* Background Colors */
  --dark: #0f172a;
  --dark-secondary: #1e293b;
  --dark-tertiary: #334155;
  
  /* Glass/Surface Colors */
  --glass-bg: rgba(15, 23, 42, 0.6);
  --glass-bg-light: rgba(30, 41, 59, 0.4);
  --glass-bg-lighter: rgba(51, 65, 85, 0.3);
  
  /* Text Colors */
  --text: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  /* Border & Effects */
  --border: rgba(148, 163, 184, 0.1);
  --glass-border: rgba(148, 163, 184, 0.15);
  --glass-border-hover: rgba(148, 163, 184, 0.3);
  
  /* Shadows */
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 40px rgba(99, 102, 241, 0.3);
  --shadow-glow-secondary: 0 0 40px rgba(139, 92, 246, 0.3);
  
  /* Animations */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Background Container */
.aetherial-background {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
  position: relative;
  overflow: hidden;
}

/* Animated Background Orbs */
.aetherial-background::before,
.aetherial-background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.aetherial-background::before {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  top: -200px;
  right: -200px;
  animation-delay: 0s;
}

.aetherial-background::after {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
  bottom: -150px;
  left: -150px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(15px) rotate(240deg); }
}

/* Main Content Container */
.aetherial-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Glass Cards */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  margin-bottom: 2rem;
  transition: var(--transition);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
  border-color: var(--glass-border-hover);
}

.glass-card-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--glass-border);
}

.glass-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.glass-card-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.glass-card-content {
  padding: 2rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--glass-bg-light);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Upload Area */
.upload-area {
  background: var(--glass-bg-lighter);
  border: 2px dashed var(--glass-border);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 2rem;
}

.upload-area:hover,
.upload-area--active {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.upload-area__content {
  display: grid;
  place-items: center;
  gap: 1rem;
}

.upload-area__icon .icon {
  color: var(--primary);
  font-size: 3rem;
}

.upload-area__text {
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
}

.upload-area__subtext {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Form Elements */
.upload-form {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-label {
  color: var(--text);
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text);
  font-size: 0.95rem;
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* Buttons */
.glass-button {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
}

.glass-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.glass-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.glass-button-secondary {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.glass-button-secondary:hover {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
}

/* Bulk Actions Bar */
.bulkbar {
  position: sticky;
  bottom: 2rem;
  z-index: 20;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.bulkbar__info {
  font-weight: 600;
  color: var(--text);
}

.bulkbar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Action Buttons */
.action-button {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.action-button--danger:hover {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

/* List Items */
.list-item {
  display: grid;
  grid-template-columns: 28px 50px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
  transition: var(--transition);
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background: var(--glass-bg-lighter);
}

.list-item__checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.document-icon {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  color: var(--primary);
}

.list-item__content {
  min-width: 0;
}

.list-item__title {
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.25rem;
}

.list-item__subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state__icon {
  margin-bottom: 1rem;
}

.empty-state__icon .icon {
  font-size: 4rem;
  color: var(--text-muted);
}

.empty-state h3 {
  color: var(--text);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.empty-state p {
  color: var(--text-secondary);
}

/* Loading State */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text);
  font-size: 1.1rem;
}

/* Icon Helpers */
.icon {
  display: inline-flex;
  line-height: 0;
  vertical-align: middle;
  color: currentColor;
}

.icon svg {
  display: block;
  width: 1em;
  height: 1em;
}

.icon--sm { font-size: 16px; }
.icon--md { font-size: 20px; }
.icon--lg { font-size: 28px; }
.icon--xl { font-size: 48px; }
.icon--primary { color: var(--primary); }
.icon--muted { color: var(--text-muted); }
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

  if (loading) {
    return (
      <div className="aetherial-background">
        <style>{DOC_CSS}</style>
        <div className="aetherial-content">
          <div className="loading">Loading documents…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="aetherial-background">
      {/* Inject Aetherial Glass CSS */}
      <style>{DOC_CSS}</style>
      
      <div className="aetherial-content">
        {/* KPIs Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{totalDocs}</span>
            <div className="stat-label">Total Documents ({branch})</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">{totalSize}</span>
            <div className="stat-label">Total Size (MB)</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">{Math.min(3, totalDocs)}</span>
            <div className="stat-label">Recent Uploads</div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="glass-card">
          <div className="glass-card-header">
            <h3 className="glass-card-title">Upload Document ({branch})</h3>
            <p className="glass-card-subtitle">
              Drag & drop or click to add files. Name-only upload is also supported.
            </p>
          </div>

          <div className="glass-card-content">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />

            {/* Dropzone */}
            <div
              className={`upload-area ${dragActive ? 'upload-area--active' : ''}`}
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
                  <Icon name="arrow-up-tray" className="icon icon--xl icon--primary" decorative />
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
              <div className="form-group">
                <label htmlFor="fileName" className="form-label">Document Name</label>
                <input
                  id="fileName"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="form-input"
                  placeholder="e.g., notes.pdf"
                />
              </div>
              <div className="quick-actions-grid">
                <button
                  onClick={handleUploadNameOnly}
                  className="glass-button"
                  disabled={!fileName.trim()}
                >
                  Upload Document
                </button>
                <button className="glass-button-secondary" onClick={() => exportCSV(false)}>
                  <Icon name="clipboard" className="icon icon--sm" decorative />
                  Export CSV (All)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedCount > 0 && (
          <div className="bulkbar">
            <div className="bulkbar__info">{selectedCount} selected</div>
            <div className="bulkbar__actions">
              <button
                className="action-button"
                onClick={selectAllVisible}
                title="Select all visible"
                aria-label="Select all visible"
              >
                <Icon name="users" className="icon icon--sm" decorative />
              </button>
              <button
                className="action-button"
                onClick={() => exportCSV(true)}
                title="Export selected"
                aria-label="Export selected"
              >
                <Icon name="clipboard" className="icon icon--sm" decorative />
              </button>
              <button
                className="action-button"
                onClick={downloadSelected}
                title="Download selected"
                aria-label="Download selected"
              >
                <Icon name="arrow-down-tray" className="icon icon--sm" decorative />
              </button>
              <button
                className="action-button action-button--danger"
                onClick={deleteSelected}
                title="Delete selected"
                aria-label="Delete selected"
              >
                <Icon name="trash" className="icon icon--sm" decorative />
              </button>
              <button
                className="action-button"
                onClick={clearSelection}
                title="Clear selection"
                aria-label="Clear selection"
              >
                <Icon name="x-mark" className="icon icon--sm" decorative />
              </button>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="glass-card">
          <div className="glass-card-header">
            <h3 className="glass-card-title">Your Documents — {branch}</h3>
            <p className="glass-card-subtitle">Manage and organize your files</p>
          </div>

          <div className="glass-card-content" style={{ padding: 0 }}>
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
                      {icon(d.type, { size: 'md', label: `${d.type || 'file'} icon` })}
                    </div>
                    <div className="list-item__content">
                      <div className="list-item__title">{d.name}</div>
                      <div className="list-item__subtitle">
                        {d.size} • Uploaded on {new Date(d.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="list-item__actions">
                      <button
                        className="action-button"
                        title="Download"
                        aria-label="Download"
                        onClick={() => handleDownload(d)}
                      >
                        <Icon name="arrow-down-tray" className="icon icon--sm" decorative />
                      </button>
                      <button
                        className="action-button"
                        title="Share"
                        aria-label="Share"
                        onClick={() => handleShare(d)}
                      >
                        <Icon name="share" className="icon icon--sm" decorative />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="action-button action-button--danger"
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
              <div className="empty-state">
                <div className="empty-state__icon">
                  <Icon name="folder" className="icon icon--xl icon--muted" decorative />
                </div>
                <h3>No documents yet</h3>
                <p>Upload your first document to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentsPage;