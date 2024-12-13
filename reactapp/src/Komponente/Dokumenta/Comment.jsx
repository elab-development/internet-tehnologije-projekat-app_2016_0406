 

import React from 'react';
import './Comment.css';
const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <p><strong>User:</strong> {comment.user.name} ({comment.user.email})</p>
      <p><strong>Comment:</strong> {comment.content}</p>
      <p><strong>Posted At:</strong> {new Date(comment.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default Comment;
