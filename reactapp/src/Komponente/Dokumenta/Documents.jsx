import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Modal from 'react-modal';

import useDocuments from './useDocuments';

// Postavljanje osnovnog stila za modal (potrebno za pravilno funkcionisanje)
Modal.setAppElement('#root');

const Documents = () => {
  const [documents, setDocuments] = useDocuments('http://127.0.0.1:8000/api/documents');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));

  console.log(user.id)
  const handleDownload = async (filePath, fileName) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/download?file_path=${filePath}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Kreiranje linka za preuzimanje
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Postavljanje naziva fajla
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the document:', error);
    }
  };

  const handleDelete = async (documentId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Ažuriranje lokalne memorije
      setDocuments(documents.filter(doc => doc.id !== documentId));
      setSuccessMessage('Document deleted successfully!');
    } catch (error) {
      setErrorMessage('Error deleting document. Please try again.');
      console.error('There was an error deleting the document:', error);
    }
  };
  
  const columns = [
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <>
          <button onClick={() => handleDownload(row.file_path, row.title)}>
            {row.title}
          </button>
        </>
      ),
    },
    {
      name: 'Content',
      selector: (row) => row.content,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Updated At',
      selector: (row) => new Date(row.updated_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button onClick={() => handleDelete(row.id)} disabled={row.user.id !== user.id}>
        Delete
      </button>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('access_token');
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('file', formData.file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/documents', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Ažuriranje stanja nakon uspešnog dodavanja dokumenta
      setDocuments([...documents, response.data.data]);
      setSuccessMessage('Document added successfully!');
      setFormData({ title: '', content: '', file: null });
      setIsModalOpen(false); // Zatvaranje modala nakon uspešnog dodavanja
    } catch (error) {
      setErrorMessage('Error adding document. Please try again.');
      console.error('There was an error uploading the document:', error);
    }
  };

  return (
    <div>
      <h2>Documents</h2>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
      <DataTable
        columns={columns}
        data={documents}
        pagination
      />

      <button onClick={() => setIsModalOpen(true)}>Add New Document</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Document Modal"
      >
        <h3>Add New Document</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>File</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit">Add Document</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Documents;
