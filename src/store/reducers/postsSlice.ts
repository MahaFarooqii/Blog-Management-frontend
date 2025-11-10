import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    try {
        const response = await axiosInstance.get("/posts");
        return response.data;
    } catch (error: any) {
        return error.response?.data?.message

    }
});

export const fetchUserPosts = createAsyncThunk(
    "posts/fetchUserPosts",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/posts/${id}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update post"
            );
        }
    }
);
export const addPost = createAsyncThunk(
    "posts/addPost",
    async (newPost: { title: string; content: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/posts", newPost);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to add post");
        }
    }
);

interface UpdatePostPayload {
    id: string;
    data: {
        title?: string;
        content?: string;
    };
}

export const updatePost = createAsyncThunk(
    "posts/updatePost",
    async ({ id, data }: UpdatePostPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/posts/${id}`, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update post"
            );
        }
    }
);
export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/posts/${id}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete post"
            );
        }
    }
);
interface PostsState {
    isLoading: boolean;
    isUploading: boolean;
    isDeleting: boolean;
    error: string | null;
    posts: [] | any[],
}

const initialState: PostsState = {
    isLoading: false,
    isUploading: false,
    isDeleting: false,
    error: null,
    posts: [] as any[],
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        resetPosts(state) {
            state.posts = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUserPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.posts;
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(addPost.pending, (state) => {
                state.isUploading = true;
                state.error = null;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.isUploading = false;
                state.posts = [action.payload.post, ...state.posts];
            })
            .addCase(addPost.rejected, (state, action) => {
                state.isUploading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePost.pending, (state) => {
                state.isUploading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.isUploading = false;
                const updatedPost = action.payload.post;
                const index = state.posts.findIndex(
                    (post) => post?._id === updatedPost?._id
                );
                if (index !== -1) {
                    state.posts[index] = updatedPost;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isUploading = false;
                state.error = action.payload as string;
            })
            .addCase(deletePost.pending, (state) => {
                state.isDeleting = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isDeleting = false;
                const deletedPostId = action.payload?.post?._id;

                state.posts = state.posts.filter((post) => post._id !== deletedPostId);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
