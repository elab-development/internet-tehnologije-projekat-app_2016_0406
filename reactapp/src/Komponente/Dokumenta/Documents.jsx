import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import useDocuments from './useDocuments';

const Documents = () => {
  const [documents, setDocuments] = useDocuments('http://127.0.0.1:8000/api/documents');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const columns = [
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
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
    } catch (error) {
      setErrorMessage('Error adding document. Please try again.');
      console.error('There was an error uploading the document:', error);
    }
  };

  return (
    <div>
      <h2>Documents</h2>
      <DataTable
        columns={columns}
        data={documents}
        pagination
      />

      <h3>Add New Document</h3>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
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
      </form>
    </div>
  );
};

export default Documents;
