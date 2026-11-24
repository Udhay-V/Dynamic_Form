import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFormForEdit,
  resetBuilder,
  setFormMetadata,
  addField,
  updateField,
  deleteField,
  moveFieldUp,
  moveFieldDown,
  saveForm,
  clearBuilderError,
} from '../features/formBuilder/formBuilderSlice';
import FieldPalette from '../components/builder/FieldPalette';
import FieldCard from '../components/builder/FieldCard';
import FieldConfigModal from '../components/builder/FieldConfigModal';
import FormMetadataEditor from '../components/builder/FormMetadataEditor';
import FormLivePreview from '../components/builder/FormLivePreview';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import {
  Save,
  CheckCircle,
  Eye,
  Sliders,
  Layers,
  ArrowLeft,
  ExternalLink,
  Plus,
} from 'lucide-react';

const FormBuilderPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { form, isDirty, saveStatus, fetchStatus, error } = useSelector(
    (state) => state.formBuilder
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' | 'metadata' | 'preview'
  const [editingField, setEditingField] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (formId) {
      dispatch(fetchFormForEdit(formId));
    } else {
      dispatch(resetBuilder());
    }

    return () => {
      dispatch(clearBuilderError());
    };
  }, [dispatch, formId, isAuthenticated, navigate]);

  const handleAddField = (type, label) => {
    dispatch(addField({ type, label }));
  };

  const handleOpenConfig = (field) => {
    setEditingField(field);
    setIsConfigOpen(true);
  };

  const handleSaveFieldConfig = (id, updates) => {
    dispatch(updateField({ id, updates }));
  };

  const handleDeleteField = (id) => {
    if (window.confirm('Are you sure you want to remove this field?')) {
      dispatch(deleteField(id));
    }
  };

  const handleMoveUp = (index) => {
    dispatch(moveFieldUp(index));
  };

  const handleMoveDown = (index) => {
    dispatch(moveFieldDown(index));
  };

  const handleSave = async (statusOverride) => {
    if (!form.name || !form.name.trim()) {
      alert('Form Name is required. Please provide a name in Form Settings.');
      setActiveTab('metadata');
      return;
    }

    const action = await dispatch(saveForm({ statusOverride }));
    if (saveForm.fulfilled.match(action)) {
      const savedId = action.payload.id;
      if (!formId) {
        navigate(`/admin/forms/${savedId}/edit`, { replace: true });
      }
    }
  };

  if (fetchStatus === 'loading') {
    return <LoadingSpinner label="Loading form for editing..." />;
  }

  const fields = Array.isArray(form.fields) ? form.fields : [];
  const isPublished = form.status === 'published';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/forms"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {form.name || 'Untitled Form'}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isPublished
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {form.status}
              </span>
              {isDirty && (
                <span className="text-[10px] text-amber-600 font-medium italic">
                  (unsaved changes)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {formId ? `Form ID: ${formId}` : 'Creating new dynamic form template'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {form.id && isPublished && (
            <Link
              to={`/forms/${form.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>View Live Form</span>
            </Link>
          )}

          <button
            type="button"
            disabled={saveStatus === 'saving'}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 active:scale-98 text-xs font-semibold text-slate-800 shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={saveStatus === 'saving'}
            onClick={() => handleSave('published')}
            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Publish Form'}</span>
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => dispatch(clearBuilderError())} />}
      {saveStatus === 'saved' && (
        <Alert
          type="success"
          title="Saved Successfully"
          message={`Form was successfully saved as ${form.status}.`}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`py-3 px-1 border-b-2 font-bold text-xs flex items-center gap-2 transition-colors ${
              activeTab === 'canvas'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Canvas & Fields ({fields.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metadata')}
            className={`py-3 px-1 border-b-2 font-bold text-xs flex items-center gap-2 transition-colors ${
              activeTab === 'metadata'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Form Settings & Metadata</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-1 border-b-2 font-bold text-xs flex items-center gap-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Interactive Live Preview</span>
          </button>
        </nav>
      </div>

      {/* Tab 1: Canvas & Field Management */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: Palette */}
          <div className="lg:col-span-1">
            <FieldPalette onAddField={handleAddField} />
          </div>

          {/* Right Columns: Canvas Area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Canvas Fields ({fields.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Use arrows to reorder • click gear to edit settings
              </span>
            </div>

            {fields.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Your canvas is empty</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Click any field type on the left palette (Text, Email, Dropdown, Radio, etc.) to start building your form.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <FieldCard
                    key={field.id || field.key}
                    field={field}
                    index={idx}
                    totalFields={fields.length}
                    onEdit={handleOpenConfig}
                    onDelete={handleDeleteField}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Metadata */}
      {activeTab === 'metadata' && (
        <div className="max-w-3xl">
          <FormMetadataEditor
            form={form}
            onChange={(updates) => dispatch(setFormMetadata(updates))}
          />
        </div>
      )}

      {/* Tab 3: Interactive Live Preview */}
      {activeTab === 'preview' && (
        <div className="max-w-3xl">
          <FormLivePreview form={form} />
        </div>
      )}

      {/* Field Configuration Modal */}
      <FieldConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        field={editingField}
        onSave={handleSaveFieldConfig}
      />
    </div>
  );
};

export default FormBuilderPage;
