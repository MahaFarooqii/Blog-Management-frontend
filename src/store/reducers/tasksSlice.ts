import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import type { CreateTaskPayload, Task } from "../../types/tasks";

export const getTasks = createAsyncThunk<Task[]>(
    "tasks/getTasks",
    async () => {
        const response = await axiosInstance.get("/tasks");
        return response.data as Task[];
    }
);
export const addTasks = createAsyncThunk<Task, CreateTaskPayload>(
    "tasks/addTaskd",
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/tasks", taskData);
            return response.data as Task;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create task");
        }
    }
);
export const updateTaskStatus = createAsyncThunk<Task, { id: string; status: "open" | "in-progress" | "resolved" }>(
    "tasks/updateTaskStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/tasks/${id}`, { status });
            return response.data as Task;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update status");
        }
    }
);

interface TasksState {
    isLoading: boolean;
    error: string | null;
    tasks: Task[];
}

const initialState: TasksState = {
    isLoading: false,
    error: null,
    tasks: [],
};

const tasksSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        resetTasks(state) {
            state.tasks = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(addTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = [action.payload, ...state.tasks];
            })
            .addCase(addTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.tasks.findIndex((t) => t?._id === updated?._id);
                if (index !== -1) state.tasks[index] = updated;
            })

    },
});

export const { resetTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
