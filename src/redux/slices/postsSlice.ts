import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostsState } from "../../types/postTypes";

const initialState: PostsState = {
  posts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    likePost: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.likes += 1;
    },
    dislikePost: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.dislikes += 1;
    },
    deletePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    addComment: (state, action: PayloadAction<{ postId: number; comment: string }>) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) post.comments.push(action.payload.comment);
    },
    removeComment: (state, action: PayloadAction<{ postId: number; commentIndex: number }>) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) post.comments.splice(action.payload.commentIndex, 1);
    },
  },
});

export const { addPost, likePost, dislikePost, deletePost, addComment, removeComment } = postsSlice.actions;
export default postsSlice.reducer;
