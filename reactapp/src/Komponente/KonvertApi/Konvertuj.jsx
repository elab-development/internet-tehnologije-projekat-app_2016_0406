import React, { useState } from 'react';
import axios from 'axios';
import './Konvertuj.css';

const Konvertuj = () => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);

  const convertFile = async () => {
    if (!file) {
      setErrorMessage('Please upload a .docx file.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setDownloadLink(null);

    try {
      const formData = new FormData();
      formData.append('File', file);

      const response = await axios.post(
        'https://v2.convertapi.com/convert/docx/to/pdf',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            Secret: 'secret_kYrQYS4gjBB80lv1',
          },
        }
      );

      const result = response.data;

      if (result && result.Files && result.Files.length > 0) {
        const fileData = result.Files[0].FileData;
        const byteCharacters = atob(fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadLink(url);
      } else {
        setErrorMessage('Failed to convert the file.');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setErrorMessage('An error occurred during the conversion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="convert-container">
      <h2>Convert DOCX to PDF</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <button onClick={convertFile} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>

      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {downloadLink && (
        <p>
          Conversion successful! <a href={downloadLink} download="converted.pdf">Download PDF</a>
        </p>
      )}
    </div>
  );
};

export default Konvertuj;
