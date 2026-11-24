import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import formsReducer from '../features/forms/formsSlice';
import formBuilderReducer from '../features/formBuilder/formBuilderSlice';
import formRenderReducer from '../features/formRender/formRenderSlice';
import submissionsReducer from '../features/submissions/submissionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
    formBuilder: formBuilderReducer,
    formRender: formRenderReducer,
    submissions: submissionsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
