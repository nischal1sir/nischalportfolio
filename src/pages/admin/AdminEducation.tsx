import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { educationApi } from '../../services/adminApi';
import type { Education } from '../../types';
import { GraduationCap, School, BookOpen, Award, Medal } from 'lucide-react';

const iconOptions = [
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'School', component: School },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Award', component: Award },
  { name: 'Medal', component: Medal },
];

export default function AdminEducation() {
  const { isAuthenticated } = useAdmin();
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Education>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadEducation();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadEducation = async () => {
    try {
      const data = await educationApi.getAll();
      setEducationData(data);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await Promise.all(
        educationData.map(async (edu) => {
          const { id, created_at, updated_at, ...rest } = edu;
          if (id.startsWith('temp-')) {
            const created = await educationApi.create(rest);
            setEducationData(prev => prev.map(e => e.id === edu.id ? created : e));
          } else {
            await educationApi.update(id, rest);
          }
        })
      );
      setMessage({ type: 'success', text: 'Education saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (edu: Education) => {
    setEditingId(edu.id);
    setEditForm({ 
      ...edu, 
      highlights: [...edu.highlights], 
      subjects: edu.subjects ? [...edu.subjects] : [],
      icon: edu.icon 
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await educationApi.update(editingId, editForm);
      setEducationData(educationData.map(e => e.id === editingId ? updated : e));
      setEditingId(null);
      setEditForm({});
      setMessage({ type: 'success', text: 'Education updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `temp-${Date.now()}`,
      institution: '',
      degree: '',
      period: '',
      location: '',
      faculty: null,
      status: null,
      highlights: [],
      subjects: null,
      icon: 'GraduationCap',
      order_index: educationData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEducationData([newEdu, ...educationData]);
    setEditingId(newEdu.id);
    setEditForm({ ...newEdu });
  };

  const removeEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      if (id.startsWith('temp-')) {
        setEducationData(educationData.filter(e => e.id !== id));
      } else {
        await educationApi.remove(id);
        setEducationData(educationData.filter(e => e.id !== id));
      }
      setMessage({ type: 'success', text: 'Education deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleHighlightChange = (id: string, highlight: string, index: number) => {
    if (!editingId || editingId !== id) return;
    const edu = educationData.find(e => e.id === id);
    if (!edu) return;
    const newHighlights = [...edu.highlights];
    newHighlights[index] = highlight;
    setEditForm({ ...editForm, highlights: newHighlights });
  };

  const addHighlight = (id: string) => {
    if (!editingId || editingId !== id) return;
    const edu = educationData.find(e => e.id === id);
    if (!edu) return;
    setEditForm({ ...editForm, highlights: [...edu.highlights, ''] });
  };

  const removeHighlight = (id: string, index: number) => {
    if (!editingId || editingId !== id) return;
    const edu = educationData.find(e => e.id === id);
    if (!edu) return;
    const newHighlights = edu.highlights.filter((_, i) => i !== index);
    setEditForm({ ...editForm, highlights: newHighlights });
  };

  const handleSubjectChange = (id: string, subject: string, index: number) => {
    if (!editingId || editingId !== id) return;
    const edu = educationData.find(e => e.id === id);
    if (!edu) return;
    const subjects = edu.subjects || [];
    const newSubjects = [...subjects];
    newSubjects[index] = subject;
    setEditForm({ ...editForm, subjects: newSubjects });
  };

  const addSubject = (id: string) => {
    if (!editingId || editingId !== id) return;
    const edu = educationData.find(e => e.id === id);
    if (!edu) return;
    const subjects = edu.subjects || [];
    setEditForm({ ...editForm, subjects: [...subjects, ''] });
  };

  const removeSubject = (id: string, index: number) => {
    if (!editingId || editingId !== id) return;
    const edu = educationData.find(e => e.id === id);
    if (!edu) return;
    const subjects = edu.subjects || [];
    const newSubjects = subjects.filter((_, i) => i !== index);
    setEditForm({ ...editForm, subjects: newSubjects });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Education Management</h1>
            <p className="text-gray-500 mt-1">Manage your educational background</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading education...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Education Management</h1>
          <p className="text-gray-500 mt-1">Manage your educational background</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addEducation} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add Education
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`} role="alert">
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-4">
        {educationData.map((edu) => {
          const isEditing = editingId === edu.id;
          return (
            <div key={edu.id} className={`bg-white rounded-xl border ${isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      {(() => {
                        const iconObj = iconOptions.find(i => i.name === (editForm.icon || edu.icon));
                        const IconComp = iconObj ? iconObj.component : GraduationCap;
                        return <IconComp className="w-6 h-6 text-blue-600" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{isEditing ? (editForm.institution || 'New Education') : edu.institution}</h3>
                      <p className="text-sm text-gray-500">{edu.degree} • {edu.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button onClick={saveEdit} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(edu)} className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => removeEducation(edu.id)} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={editForm.institution || ''}
                        onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={editForm.degree || ''}
                        onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                      <input
                        type="text"
                        value={editForm.period || ''}
                        onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2024 — Present"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                      <input
                        type="text"
                        value={editForm.faculty || ''}
                        onChange={(e) => setEditForm({ ...editForm, faculty: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <input
                        type="text"
                        value={editForm.status || ''}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Pursuing, Completed 2023"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <div className="flex flex-wrap gap-3">
                      {iconOptions.map((icon) => {
                        const IconComp = icon.component;
                        const isSelected = (editForm.icon || edu.icon) === icon.name;
                        return (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, icon: icon.name })}
                            className={`p-3 rounded-lg border-2 transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <IconComp className="w-6 h-6 text-gray-600" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Highlights</label>
                      <button onClick={() => addHighlight(edu.id)} className="text-sm text-blue-600 hover:text-blue-700">
                        + Add Highlight
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editForm.highlights || edu.highlights).map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => handleHighlightChange(edu.id, e.target.value, index)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeHighlight(edu.id, index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                            disabled={(editForm.highlights || edu.highlights).length === 1}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Subjects</label>
                      <button onClick={() => addSubject(edu.id)} className="text-sm text-blue-600 hover:text-blue-700">
                        + Add Subject
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editForm.subjects || edu.subjects || []).map((subject, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={subject}
                            onChange={(e) => handleSubjectChange(edu.id, e.target.value, index)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeSubject(edu.id, index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                            disabled={(editForm.subjects || edu.subjects || []).length === 1}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {educationData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No education entries yet</p>
          <button onClick={addEducation} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add First Education
          </button>
        </div>
      )}
    </div>
  );
}