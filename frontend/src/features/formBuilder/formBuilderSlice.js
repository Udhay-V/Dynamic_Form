import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const defaultFormState = {
  id: null,
  name: '',
  mail: '',
  gender: '',
  mobile: '',
  description: '',
  department: '',
  designation: '',
  role: '',
  status: 'draft',
  fields: [],
};

const initialState = {
  form: defaultFormState,
  activeFieldId: null,
  isDirty: false,
  saveStatus: 'idle', // 'idle' | 'saving' | 'saved' | 'failed'
  fetchStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchFormForEdit = createAsyncThunk(
  'formBuilder/fetchFormForEdit',
  async (formId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${formId}`);
      return response.data.form;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load form');
    }
  }
);

export const saveForm = createAsyncThunk(
  'formBuilder/saveForm',
  async ({ statusOverride } = {}, { getState, rejectWithValue }) => {
    try {
      const { form } = getState().formBuilder;
      const payload = {
        name: form.name,
        mail: form.mail || null,
        gender: form.gender || null,
        mobile: form.mobile || null,
        description: form.description || null,
        department: form.department || null,
        designation: form.designation || null,
        role: form.role || null,
        status: statusOverride || form.status,
        fields: form.fields,
      };

      let response;
      if (form.id) {
        response = await api.put(`/forms/${form.id}`, payload);
      } else {
        response = await api.post('/forms', payload);
      }
      return response.data.form;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to save form';
      return rejectWithValue(msg);
    }
  }
);

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    resetBuilder: (state) => {
      state.form = { ...defaultFormState, fields: [] };
      state.activeFieldId = null;
      state.isDirty = false;
      state.saveStatus = 'idle';
      state.fetchStatus = 'idle';
      state.error = null;
    },
    setFormMetadata: (state, action) => {
      state.form = { ...state.form, ...action.payload };
      state.isDirty = true;
    },
    addField: (state, action) => {
      const type = action.payload.type.toUpperCase();
      const count = state.form.fields.filter((f) => f.type.toUpperCase() === type).length + 1;
      const baseKey = `${type.toLowerCase()}_${count}`;

      // Default options for option-based fields
      let defaultOptions = [];
      if (['SELECT', 'RADIO', 'CHECKBOX'].includes(type)) {
        defaultOptions = ['Option 1', 'Option 2', 'Option 3'];
      }

      const newField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        key: baseKey,
        label: action.payload.label || `${type.charAt(0) + type.slice(1).toLowerCase()} Field`,
        type,
        placeholder: '',
        defaultValue: '',
        required: false,
        options: defaultOptions,
        validation: {},
        ...action.payload,
      };

      state.form.fields.push(newField);
      state.activeFieldId = newField.id;
      state.isDirty = true;
    },
    updateField: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.form.fields.findIndex((f) => f.id === id);
      if (index !== -1) {
        state.form.fields[index] = { ...state.form.fields[index], ...updates };
        state.isDirty = true;
      }
    },
    deleteField: (state, action) => {
      state.form.fields = state.form.fields.filter((f) => f.id !== action.payload);
      if (state.activeFieldId === action.payload) {
        state.activeFieldId = null;
      }
      state.isDirty = true;
    },
    moveFieldUp: (state, action) => {
      const index = action.payload;
      if (index > 0 && index < state.form.fields.length) {
        const item = state.form.fields[index];
        state.form.fields.splice(index, 1);
        state.form.fields.splice(index - 1, 0, item);
        state.isDirty = true;
      }
    },
    moveFieldDown: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.form.fields.length - 1) {
        const item = state.form.fields[index];
        state.form.fields.splice(index, 1);
        state.form.fields.splice(index + 1, 0, item);
        state.isDirty = true;
      }
    },
    setActiveField: (state, action) => {
      state.activeFieldId = action.payload;
    },
    clearBuilderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchFormForEdit
    builder
      .addCase(fetchFormForEdit.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchFormForEdit.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.form = {
          ...action.payload,
          fields: Array.isArray(action.payload.fields) ? action.payload.fields : [],
        };
        state.isDirty = false;
        state.error = null;
      })
      .addCase(fetchFormForEdit.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload;
      });

    // saveForm
    builder
      .addCase(saveForm.pending, (state) => {
        state.saveStatus = 'saving';
        state.error = null;
      })
      .addCase(saveForm.fulfilled, (state, action) => {
        state.saveStatus = 'saved';
        state.form = {
          ...action.payload,
          fields: Array.isArray(action.payload.fields) ? action.payload.fields : [],
        };
        state.isDirty = false;
        state.error = null;
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  resetBuilder,
  setFormMetadata,
  addField,
  updateField,
  deleteField,
  moveFieldUp,
  moveFieldDown,
  setActiveField,
  clearBuilderError,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
