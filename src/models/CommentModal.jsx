import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
`;

const CommentInput = styled.input`
  background: white;
  color: black;
  width: 90%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #1877f2;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
`;

const CommentModal = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // console.log("Fetching comments for postId:", postId);
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4004/posts/${postId}/comments`
        );
        setComments(response.data.comments);
      } catch (error) {
        // console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!token || !storedUser || !storedUser.username) {
        return;
      }

      const response = await axios.post(
        `http://localhost:4004/posts/${postId}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCommentObj = {
        text: newComment,
        username: storedUser.username,
      };

      setComments([...comments, newCommentObj]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username}:</strong>
            {comment.text}
          </p>
        ))}
        <CommentInput
          type="text"
          placeholder="Comment here"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleCommentSubmit}>Post</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CommentModal;
