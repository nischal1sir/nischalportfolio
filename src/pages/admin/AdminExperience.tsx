import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { experiencesApi } from '../../services/adminApi';
import type { Experience } from '../../types';

export default function AdminExperience() {
  const { isAuthenticated } = useAdmin();
  const [experiencesData, setExperiencesData] = useState<Experience[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Experience>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadExperiences();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadExperiences = async () => {
    try {
      const data = await experiencesApi.getAll();
      setExperiencesData(data);
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
        experiencesData.map(async (exp) => {
          const { id, created_at, updated_at, ...rest } = exp;
          if (id.startsWith('temp-')) {
            const created = await experiencesApi.create(rest);
            setExperiencesData(prev => prev.map(e => e.id === exp.id ? created : e));
          } else {
            await experiencesApi.update(id, rest);
          }
        })
      );
      setMessage({ type: 'success', text: 'Experience saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setEditForm({ ...exp, highlights: [...exp.highlights], technologies: [...exp.technologies] });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await experiencesApi.update(editingId, editForm);
      setExperiencesData(experiencesData.map(e => e.id === editingId ? updated : e));
      setEditingId(null);
      setEditForm({});
      setMessage({ type: 'success', text: 'Experience updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `temp-${Date.now()}`,
      type: 'freelance',
      role: '',
      company: '',
      company_url: null,
      period: '',
      location: '',
      description: '',
      highlights: [],
      technologies: [],
      order_index: experiencesData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setExperiencesData([newExp, ...experiencesData]);
    setEditingId(newExp.id);
    setEditForm({ ...newExp });
  };

  const removeExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      if (id.startsWith('temp-')) {
        setExperiencesData(experiencesData.filter(e => e.id !== id));
      } else {
        await experiencesApi.remove(id);
        setExperiencesData(experiencesData.filter(e => e.id !== id));
      }
      setMessage({ type: 'success', text: 'Experience deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleHighlightChange = (id: string, highlight: string, index: number) => {
    if (!editingId || editingId !== id) return;
    const exp = experiencesData.find(e => e.id === id);
    if (!exp) return;
    const newHighlights = [...exp.highlights];
    newHighlights[index] = highlight;
    setEditForm({ ...editForm, highlights: newHighlights });
  };

  const addHighlight = (id: string) => {
    if (!editingId || editingId !== id) return;
    const exp = experiencesData.find(e => e.id === id);
    if (!exp) return;
    setEditForm({ ...editForm, highlights: [...exp.highlights, ''] });
  };

  const removeHighlight = (id: string, index: number) => {
    if (!editingId || editingId !== id) return;
    const exp = experiencesData.find(e => e.id === id);
    if (!exp) return;
    const newHighlights = exp.highlights.filter((_, i) => i !== index);
    setEditForm({ ...editForm, highlights: newHighlights });
  };

  const handleTechChange = (id: string, tech: string) => {
    if (!editingId || editingId !== id) return;
    const exp = experiencesData.find(e => e.id === id);
    if (!exp) return;
    const techs = exp.technologies.includes(tech)
      ? exp.technologies.filter(t => t !== tech)
      : [...exp.technologies, tech];
    setEditForm({ ...editForm, technologies: techs });
  };

  const addTech = (id: string, newTech: string) => {
    if (!editingId || editingId !== id || !newTech.trim()) return;
    const exp = experiencesData.find(e => e.id === id);
    if (!exp) return;
    if (!exp.technologies.includes(newTech.trim())) {
      setEditForm({ ...editForm, technologies: [...exp.technologies, newTech.trim()] });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Experience Management</h1>
            <p className="text-gray-500 mt-1">Manage work experience, internships, and freelance work</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experience Management</h1>
          <p className="text-gray-500 mt-1">Manage work experience, internships, and freelance work</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addExperience} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add Experience
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
        {experiencesData.map((exp) => {
          const isEditing = editingId === exp.id;
          return (
            <div key={exp.id} className={`bg-white rounded-xl border ${isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{isEditing ? (editForm.role || 'New Experience') : exp.role}</h3>
                    <p className="text-sm text-gray-500">{exp.company} • {exp.period}</p>
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
                        <button onClick={() => startEdit(exp)} className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => removeExperience(exp.id)} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={editForm.type || exp.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Experience['type'] })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                        <option value="role">Full-time Role</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={editForm.role || ''}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={editForm.company || ''}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company URL</label>
                      <input
                        type="url"
                        value={editForm.company_url || ''}
                        onChange={(e) => setEditForm({ ...editForm, company_url: e.target.value })}
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
                        placeholder="e.g., Jul 2025 — Sep 2025"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Highlights</label>
                      <button
                        onClick={() => addHighlight(exp.id)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Highlight
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editForm.highlights || exp.highlights).map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => handleHighlightChange(exp.id, e.target.value, index)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeHighlight(exp.id, index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700"
                            disabled={(editForm.highlights || exp.highlights).length === 1}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Technologies</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add custom technology"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTech(exp.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS', 'Git', 'GitHub', 'MongoDB', 'SQL', 'Python', 'Java', 'Docker', 'AWS', 'Figma'].map((tech) => (
                        <label key={tech} className="inline-flex items-center gap-1 cursor-pointer px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                          <input
                            type="checkbox"
                            checked={(editForm.technologies || exp.technologies).includes(tech)}
                            onChange={() => handleTechChange(exp.id, tech)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{tech}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {experiencesData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No experience entries yet</p>
          <button onClick={addExperience} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add First Experience
          </button>
        </div>
      )}
    </div>
  );
}