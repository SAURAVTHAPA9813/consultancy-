import React, { useState } from 'react';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleUpload = () => {
    if (fileName) setDocuments([...documents, { id: Date.now(), name: fileName }]);
    setFileName('');
  };

  return (
    <div>
      <h2>Documents Management</h2>
      <div>
        <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter document name" />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <h3>Uploaded Documents:</h3>
      <ul>
        {documents.map(doc => <li key={doc.id}>{doc.name}</li>)}
      </ul>
    </div>
  );
}

export default DocumentsPage;