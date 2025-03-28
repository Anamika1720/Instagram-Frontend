import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import CommentModal from "../models/CommentModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #c9d1d9;
`;

const Post = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const Caption = styled.p`
  font-size: 16px;
  color: #333;
  margin: 10px 0;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${(props) => (props.$isLiked ? "red" : "black")};
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #777;
  margin: 10px 0;
`;

const PostsPage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const [showModal, setShowModal] = useState(null);

  const fetchPosts = async (page) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:4004/posts?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userId = JSON.parse(localStorage.getItem("user"))._id;

      const newPosts = response.data.posts.map((post) => ({
        ...post,
        isLiked: post.likes.some((like) => like.userId === userId),
        likesCount: post.likes.length,
        commentCount: post.comments.length,
      }));

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(response.data.posts.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const likePost = async (postId, isLiked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.patch(
        `http://localhost:4004/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLiked: !isLiked,
                  likesCount: response.data.likes.length,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <Container>
      {posts.map((post, index) => (
        <Post
          key={post._id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostImage src={post.imageUrl} alt={post.caption} />
          <Caption>{post.caption}</Caption>

          <LikeButton onClick={() => likePost(post._id)}>
            {post.likesCount} Likes
          </LikeButton>

          <button onClick={() => setShowModal(post._id)}>
            {post.commentCount} Comments
          </button>

          {showModal === post._id && (
            <CommentModal
              postId={post._id}
              onClose={() => setShowModal(null)}
            />
          )}
        </Post>
      ))}
      {loading && <LoadingText>Loading...</LoadingText>}
    </Container>
  );
};

export default PostsPage;
