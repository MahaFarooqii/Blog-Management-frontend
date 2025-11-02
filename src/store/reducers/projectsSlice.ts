import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import type { Project } from "../../types/projects";

export const getProjects = createAsyncThunk<Project[]>(
    "projects/getProjects",
    async () => {
        const response = await axiosInstance.get("/projects");
        return response.data as Project[];
    }
);

interface ProjectsState {
    isLoading: boolean;
    error: string | null;
    projects: Project[];
}

const initialState: ProjectsState = {
    isLoading: false,
    error: null,
    projects: [],
};

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        resetProjects(state) {
            state.projects = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects = action.payload;
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
