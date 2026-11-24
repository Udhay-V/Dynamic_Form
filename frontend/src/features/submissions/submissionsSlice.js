import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  form: null,
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  selectedSubmission: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  deleteStatus: 'idle',
  error: null,
};

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async ({ formId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${formId}/submissions`, {
        params: { page, limit },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

export const fetchSingleSubmission = createAsyncThunk(
  'submissions/fetchSingleSubmission',
  async ({ formId, submissionId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${formId}/submissions/${submissionId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch submission detail');
    }
  }
);

export const deleteSubmissionItem = createAsyncThunk(
  'submissions/deleteSubmissionItem',
  async ({ formId, submissionId }, { rejectWithValue }) => {
    try {
      await api.delete(`/forms/${formId}/submissions/${submissionId}`);
      return submissionId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete submission');
    }
  }
);

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    setSelectedSubmission: (state, action) => {
      state.selectedSubmission = action.payload;
    },
    clearSelectedSubmission: (state) => {
      state.selectedSubmission = null;
    },
    setSubmissionsPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchSubmissions
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.form = action.payload.form;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // fetchSingleSubmission
    builder
      .addCase(fetchSingleSubmission.fulfilled, (state, action) => {
        state.selectedSubmission = action.payload;
      });

    // deleteSubmissionItem
    builder
      .addCase(deleteSubmissionItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit) || 1;
        if (state.selectedSubmission?.id === action.payload) {
          state.selectedSubmission = null;
        }
      });
  },
});

export const {
  setSelectedSubmission,
  clearSelectedSubmission,
  setSubmissionsPage,
} = submissionsSlice.actions;

export default submissionsSlice.reducer;
