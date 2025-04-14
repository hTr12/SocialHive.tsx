import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { likePost, dislikePost, deletePost, addComment, removeComment } from "../redux/slices/postsSlice";
import { addNotification } from "../redux/slices/notificationsSlice";
import { Post as PostType } from "../types/postTypes";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const handleLike = () => {
    dispatch(likePost(post.id));
    dispatch(addNotification({ message: 'You liked a post!', type: 'info' }));
  };

  const handleDislike = () => {
    dispatch(dislikePost(post.id));
    dispatch(addNotification({ message: 'You disliked a post', type: 'info' }));
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id));
    dispatch(addNotification({ message: 'Post deleted', type: 'warning' }));
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      dispatch(addComment({ postId: post.id, comment }));
      dispatch(addNotification({ message: 'Comment added', type: 'success' }));
      setComment("");
    }
  };

  const handleRemoveComment = (index: number) => {
    dispatch(removeComment({ postId: post.id, commentIndex: index }));
    dispatch(addNotification({ message: 'Comment removed', type: 'error' }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border">
      {post.image && <img src={post.image} alt="Post" className="w-full h-64 object-cover rounded-md" />}
      {post.video && <video src={post.video} controls className="w-full h-64 rounded-md" />}
      <div className="flex justify-between items-center mt-3">
        <button onClick={handleLike} className="text-green-500 text-lg">👍 {post.likes}</button>
        <button onClick={handleDislike} className="text-red-500 text-lg">👎 {post.dislikes}</button>
        <button onClick={handleDelete} className="text-gray-600 hover:text-red-600">🗑️ Delete</button>
      </div>
      <div className="mt-4">
        <input 
          type="text" 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="Add a comment..." 
          className="w-full border rounded-md p-2 mt-2"
        />
        <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-1 rounded-md mt-2">Comment</button>
      </div>
      <div className="mt-3">
        {post.comments.map((c, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-md mt-2 flex justify-between items-center">
            <p>{c}</p>
            <button onClick={() => handleRemoveComment(index)} className="text-red-500 hover:text-red-700">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;