import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    status: 'all', // 'all' | 'published' | 'draft'
    search: '',
  },
};

export const fetchForms = createAsyncThunk(
  'forms/fetchForms',
  async ({ page = 1, limit = 10, status = 'all', search = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (status && status !== 'all') params.status = status;
      if (search && search.trim()) params.search = search.trim();

      const response = await api.get('/forms', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch forms');
    }
  }
);

export const deleteForm = createAsyncThunk(
  'forms/deleteForm',
  async (formId, { rejectWithValue }) => {
    try {
      await api.delete(`/forms/${formId}`);
      return formId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete form');
    }
  }
);

export const toggleFormStatus = createAsyncThunk(
  'forms/toggleFormStatus',
  async ({ formId, currentStatus }, { rejectWithValue }) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const response = await api.put(`/forms/${formId}`, { status: newStatus });
      return response.data.form;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update form status');
    }
  }
);

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to page 1 on filter change
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchForms
    builder
      .addCase(fetchForms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // deleteForm
    builder
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit) || 1;
      });

    // toggleFormStatus
    builder
      .addCase(toggleFormStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setFilters, setPage } = formsSlice.actions;
export default formsSlice.reducer;
