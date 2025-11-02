import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const fetchAnalyticsByRole = createAsyncThunk(
    "analytics/fetchByRole",
    async ({ role }: { role: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/analytics/overview?role=${role}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch analytics"
            );
        }
    }
);

interface AnalyticsState {
    isLoading: boolean;
    error: string | null;
    overview: any | null;
}

const initialState: AnalyticsState = {
    isLoading: false,
    error: null,
    overview: null,
};

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {
        resetAnalytics(state) {
            state.overview = null;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticsByRole.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAnalyticsByRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.overview = action.payload;
            })
            .addCase(fetchAnalyticsByRole.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
