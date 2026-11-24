import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  form: null,
  values: {},
  clientErrors: {},
  serverErrors: {},
  fetchStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  submitStatus: 'idle', // 'idle' | 'submitting' | 'succeeded' | 'failed'
  submissionReceipt: null,
  error: null,
};

export const fetchPublicForm = createAsyncThunk(
  'formRender/fetchPublicForm',
  async (formId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${formId}`);
      return response.data.form;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load form';
      return rejectWithValue({
        message: msg,
        status: err.response?.status,
        isDraft: err.response?.data?.isDraft,
      });
    }
  }
);

export const submitFormData = createAsyncThunk(
  'formRender/submitFormData',
  async ({ formId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/forms/${formId}/submissions`, data);
      return response.data;
    } catch (err) {
      if (err.response?.status === 422) {
        return rejectWithValue({
          type: 'validation',
          errors: err.response?.data?.errors || {},
          message: err.response?.data?.message || 'Validation failed on server',
        });
      }
      return rejectWithValue({
        type: 'general',
        message: err.response?.data?.message || 'Submission failed. Please try again.',
      });
    }
  }
);

const formRenderSlice = createSlice({
  name: 'formRender',
  initialState,
  reducers: {
    setFieldValue: (state, action) => {
      const { key, value } = action.payload;
      state.values[key] = value;
      // Clear error on user edit
      if (state.clientErrors[key]) {
        delete state.clientErrors[key];
      }
      if (state.serverErrors[key]) {
        delete state.serverErrors[key];
      }
    },
    setClientErrors: (state, action) => {
      state.clientErrors = action.payload;
    },
    clearErrors: (state) => {
      state.clientErrors = {};
      state.serverErrors = {};
      state.error = null;
    },
    resetSubmissionState: (state) => {
      state.submitStatus = 'idle';
      state.submissionReceipt = null;
      state.serverErrors = {};
      state.clientErrors = {};
      state.error = null;
    },
    resetFormValues: (state) => {
      const defaultVals = {};
      if (state.form?.fields && Array.isArray(state.form.fields)) {
        state.form.fields.forEach((f) => {
          if (f.defaultValue !== undefined && f.defaultValue !== '') {
            defaultVals[f.key] = f.defaultValue;
          } else if (f.type.toUpperCase() === 'CHECKBOX') {
            defaultVals[f.key] = Array.isArray(f.options) && f.options.length > 0 ? [] : false;
          } else {
            defaultVals[f.key] = '';
          }
        });
      }
      state.values = defaultVals;
      state.clientErrors = {};
      state.serverErrors = {};
    },
  },
  extraReducers: (builder) => {
    // fetchPublicForm
    builder
      .addCase(fetchPublicForm.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
        state.form = null;
        state.values = {};
      })
      .addCase(fetchPublicForm.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.form = action.payload;
        // Initialize default values from field definitions
        const initialValues = {};
        if (Array.isArray(action.payload.fields)) {
          action.payload.fields.forEach((f) => {
            if (f.defaultValue !== undefined && f.defaultValue !== '') {
              initialValues[f.key] = f.defaultValue;
            } else if (f.type.toUpperCase() === 'CHECKBOX') {
              initialValues[f.key] = Array.isArray(f.options) && f.options.length > 0 ? [] : false;
            } else {
              initialValues[f.key] = '';
            }
          });
        }
        state.values = initialValues;
        state.error = null;
      })
      .addCase(fetchPublicForm.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload;
      });

    // submitFormData
    builder
      .addCase(submitFormData.pending, (state) => {
        state.submitStatus = 'submitting';
        state.serverErrors = {};
        state.error = null;
      })
      .addCase(submitFormData.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.submissionReceipt = {
          submissionId: action.payload.submissionId,
          submittedAt: action.payload.submittedAt,
        };
        state.serverErrors = {};
        state.error = null;
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.submitStatus = 'failed';
        if (action.payload?.type === 'validation') {
          state.serverErrors = action.payload.errors;
          state.error = action.payload.message;
        } else {
          state.error = action.payload?.message || 'Submission failed';
        }
      });
  },
});

export const {
  setFieldValue,
  setClientErrors,
  clearErrors,
  resetSubmissionState,
  resetFormValues,
} = formRenderSlice.actions;

export default formRenderSlice.reducer;
