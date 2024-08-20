import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';  
import './Documents.css';
import useDocuments from './useDocuments';

Modal.setAppElement('#root');

const Documents = () => {
  const [documents, setDocuments] = useDocuments('http://127.0.0.1:8000/api/documents');
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null,
    tags: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [synonyms, setSynonyms] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'));

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    handleSearch();
  }, [documents, searchQuery]);

  useEffect(() => {
    if (formData.tags) {
      fetchSynonyms(formData.tags);
    }
  }, [formData.tags]);

  const handleDownload = async (filePath, fileName) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/download?file_path=${filePath}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
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
      
      setDocuments(documents.filter(doc => doc.id !== documentId));
      setSuccessMessage('Document deleted successfully!');
    } catch (error) {
      setErrorMessage('Error deleting document. Please try again.');
      console.error('There was an error deleting the document:', error);
    }
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = documents.filter(doc => {
      return (
        doc.title.toLowerCase().includes(lowercasedQuery) ||
        doc.content.toLowerCase().includes(lowercasedQuery) ||
        doc.tags.some(tag => tag.name.toLowerCase().includes(lowercasedQuery))
      );
    });
    setFilteredDocuments(filtered);
  };

  const fetchSynonyms = async (tags) => {
    const tagArray = tags.split(',').map(tag => tag.trim());
    const synonymsData = [];
    const apiKey = 'jcWCqSr114CjwUWVpd58L3vDj1sKV6bcdHWVk8pS'; // Replace with your Thesaurus API key

    for (const tag of tagArray) {
      try {
        const response = await axios.get(`https://api.api-ninjas.com/v1/thesaurus?word=${tag}`, {
          headers: {
            'X-Api-Key': apiKey
          }
        });
        synonymsData.push({
          word: tag,
          synonyms: response.data.synonyms || [],
          antonyms: response.data.antonyms || []
        });
      } catch (error) {
        console.error('Error fetching synonyms:', error);
      }
    }

    setSynonyms(synonymsData);
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
      name: 'Tags',
      selector: (row) => row.tags.map(tag => tag.name).join(', '),
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
        <>
          <button onClick={() => handleDelete(row.id)} disabled={row.user.id !== user.id}>
            Delete
          </button>
          <button onClick={() => navigate(`/documents/${row.id}`)}>
            Detalji
          </button>
        </>
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
    
    const tagsArray = formData.tags.split(',').map(tag => tag.trim());
    tagsArray.forEach(tag => {
      formDataToSend.append('tags[]', tag);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/documents', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments([...documents, response.data.data]);
      setSuccessMessage('Document added successfully!');
      setFormData({ title: '', content: '', file: null, tags: '' });
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage('Error adding document. Please try again.');
      console.error('There was an error uploading the document:', error);
    }
  };

  return (
    <div>
      <h2>Documents</h2>
      <input 
        type="text" 
        placeholder="Search by title, content, or tags" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
      <DataTable
        columns={columns}
        data={filteredDocuments}
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
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., tag1, tag2"
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        
        {synonyms.length > 0 && (
          <div>
            <h4>Synonyms:</h4>
            <ul>
              {synonyms.map((synonym) => (
                <li key={synonym.word}>
                  <strong>{synonym.word}</strong>: {synonym.synonyms.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Documents;
