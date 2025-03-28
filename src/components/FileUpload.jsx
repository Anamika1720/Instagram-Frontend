import { useState } from "react";
import styled from "styled-components";
import axios from "axios";

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
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Input = styled.input`
  background: white;
  color: black;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #1877f2;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
`;

const FileUploadModal = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username;
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Image is required.");
      return;
    }

    if (!username || !token) {
      setMessage("You must be logged in to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("username", username);
    formData.append("caption", caption);

    try {
      await axios.post("http://localhost:4004/posts/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Post uploaded successfully!");
      setCaption("");
      setImage(null);
      onClose();
    } catch (error) {
      setMessage("Error uploading post.");
      console.error("Upload error:", error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Upload Post</h2>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button onClick={handleUpload}>Upload</Button>
        {message && <p>{message}</p>}
      </ModalContent>
    </ModalOverlay>
  );
};

export default FileUploadModal;
