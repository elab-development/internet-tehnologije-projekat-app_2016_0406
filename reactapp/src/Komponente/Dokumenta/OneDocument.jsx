import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Comment from './Comment'; // Import the reusable Comment component

const OneDocument = () => {
  const { id } = useParams(); // Get ID from URL
  const [document, setDocument] = useState(null);
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newComment, setNewComment] = useState(''); // State for new comment input

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await axios.get(`http://127.0.0.1:8000/api/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocument(response.data.data);

        // Fetch comments
        const commentsResponse = await axios.get(`http://127.0.0.1:8000/api/comments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(commentsResponse.data.data);
      } catch (error) {
        setErrorMessage('Error fetching document details or comments. Please try again.');
        console.error('Error fetching document or comments:', error);
      }
    };

    fetchDocument();
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/comments',
        {
          content: newComment,
          document_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update comments state with the newly added comment
      setComments([...comments, response.data.data]);
      setNewComment(''); // Clear the input field
    } catch (error) {
      setErrorMessage('Error creating comment. Please try again.');
      console.error('Error creating comment:', error);
    }
  };

  if (errorMessage) {
    return <p className="error-text">{errorMessage}</p>;
  }

  if (!document) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{document.title}</h2>
      <p><strong>Content:</strong> {document.content}</p>
      <p><strong>Tags:</strong> {document.tags.map(tag => tag.name).join(', ')}</p>
      <p><strong>Created At:</strong> {new Date(document.created_at).toLocaleDateString()}</p>
      <p><strong>Updated At:</strong> {new Date(document.updated_at).toLocaleDateString()}</p>
      <p><strong>User:</strong> {document.user.name} ({document.user.email})</p>

      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map(comment => <Comment key={comment.id} comment={comment} />)
      ) : (
        <p>No comments available.</p>
      )}

      <h3>Add a Comment</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          rows="4"
          cols="50"
          placeholder="Write your comment here..."
          required
        />
        <br />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default OneDocument;
