import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Comment from './Comment';  
import './OneDocument.css';

const OneDocument = () => {
  const { id } = useParams(); // Get ID from URL
  const [document, setDocument] = useState(null);
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [userId, setUserId] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const userIdFromSession = JSON.parse(sessionStorage.getItem('user')).id;
        setUserId(userIdFromSession);

        const response = await axios.get(`http://127.0.0.1:8000/api/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocument(response.data.data);

        const commentsResponse = await axios.get(`http://127.0.0.1:8000/api/comments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(commentsResponse.data.data);

        const tagsResponse = await axios.get(`http://127.0.0.1:8000/api/documents/${id}/tags`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTags(tagsResponse.data.data);
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
      setComments([...comments, response.data.data]);
      setNewComment('');
    } catch (error) {
      setErrorMessage('Error creating comment. Please try again.');
      console.error('Error creating comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  const handleUpdateComment = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await axios.put(
        `http://127.0.0.1:8000/api/comments/${editingCommentId}`,
        {
          content: editedCommentContent,
          document_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.map(comment =>
        comment.id === editingCommentId ? response.data.data : comment
      ));
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (error) {
      setErrorMessage('Error updating comment. Please try again.');
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = sessionStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      setErrorMessage('Error deleting comment. Please try again.');
      console.error('Error deleting comment:', error);
    }
  };

  const handleTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await axios.post(
        `http://127.0.0.1:8000/api/documents/${id}/tags`,
        {
          name: newTag,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTags([...tags, response.data.data]);
      setNewTag('');
    } catch (error) {
      setErrorMessage('Error adding tag. Please try again.');
      console.error('Error adding tag:', error);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      const token = sessionStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/tags/${tagId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (error) {
      setErrorMessage('Error removing tag. Please try again.');
      console.error('Error removing tag:', error);
    }
  };

  if (errorMessage) {
    return <p className="error-text">{errorMessage}</p>;
  }

  if (!document) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="document-container">
      <h2 className="document-title">{document.title}</h2>
      <p className="document-user"><strong>User:</strong> {document.user.name} ({document.user.email})</p>
      <p className="document-content"><strong>Content:</strong> {document.content}</p>
      <div className="document-tags">
        <strong>Tags:</strong>
        {tags.map(tag => (
          <button
            key={tag.id}
            className="tag-button"
            onClick={() => handleRemoveTag(tag.id)}
          >
            {tag.name}
          </button>
        ))}
      </div>
      {document.user.id === userId && (
        <form className="add-tag-form" onSubmit={handleAddTag}>
          <input
            type="text"
            value={newTag}
            onChange={handleTagChange}
            placeholder="Add a new tag"
            required
            className="tag-input"
          />
          <button type="submit" className="add-tag-btn">Add Tag</button>
        </form>
      )}
      <p className="document-dates"><strong>Created At:</strong> {new Date(document.created_at).toLocaleDateString()}</p>
      <p className="document-dates"><strong>Updated At:</strong> {new Date(document.updated_at).toLocaleDateString()}</p>
    

      <h3 className="comments-heading">Comments</h3>
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <Comment comment={comment} />
            {comment.user.id === userId && (
              <div className="comment-actions">
                <button className="edit-comment-btn" onClick={() => handleEditComment(comment)}>Edit</button>
                <button className="delete-comment-btn" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              </div>
            )}
            {editingCommentId === comment.id && (
              <form className="edit-comment-form" onSubmit={handleUpdateComment}>
                <textarea
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                  rows="4"
                  cols="50"
                  required
                  className="edit-comment-textarea"
                />
                <br />
                <button type="submit" className="update-comment-btn">Update Comment</button>
              </form>
            )}
          </div>
        ))
      ) : (
        <p className="no-comments">No comments available.</p>
      )}

      <h3 className="add-comment-heading">Add a Comment</h3>
      <form className="add-comment-form" onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          rows="4"
          cols="50"
          placeholder="Write your comment here..."
          required
          className="new-comment-textarea"
        />
        <br />
        <button type="submit" className="submit-comment-btn">Submit Comment</button>
      </form>
    </div>
  );
};

export default OneDocument;
