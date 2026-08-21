import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { socialsApi } from '../../services/adminApi';
import type { SocialLink } from '../../types';
import { DragDropList } from '../../components/admin/DragDropList';

const iconOptions = [
  'github', 'linkedin', 'x', 'twitter', 'instagram', 'facebook', 'youtube',
  'mail', 'phone', 'map-pin', 'globe', 'code', 'file-text', 'external-link'
];

export default function AdminSocials() {
  const { isAuthenticated } = useAdmin();
  const [socialsData, setSocialsData] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SocialLink>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadSocials();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadSocials = async () => {
    try {
      const data = await socialsApi.getAll();
      setSocialsData(data);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newItems: SocialLink[]) => {
    setSocialsData(newItems);
    try {
      await socialsApi.reorder(newItems.map((item, idx) => ({ id: item.id, order_index: idx })));
      setMessage({ type: 'success', text: 'Social links order updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save order: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await Promise.all(
        socialsData.map(async (social, index) => {
          const { id, created_at, updated_at, ...rest } = social as any;
          const payload = { ...rest, order_index: index };
          if (id.startsWith('temp-')) {
            const created = await socialsApi.create(payload);
            setSocialsData(prev => prev.map(s => s.id === social.id ? created : s));
          } else {
            await socialsApi.update(id, payload);
          }
        })
      );
      setMessage({ type: 'success', text: 'Social links saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (social: SocialLink) => {
    setEditingId(social.id);
    setEditForm({ ...social });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const { id, created_at, updated_at, ...rest } = editForm as any;
      if (editingId.startsWith('temp-')) {
        const created = await socialsApi.create(rest);
        setSocialsData(socialsData.map(s => s.id === editingId ? created : s));
      } else {
        const updated = await socialsApi.update(editingId, rest);
        setSocialsData(socialsData.map(s => s.id === editingId ? updated : s));
      }
      setEditingId(null);
      setEditForm({});
      setMessage({ type: 'success', text: 'Social link updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const addSocial = () => {
    const newSocial: SocialLink = {
      id: `temp-${Date.now()}`,
      label: '',
      href: '',
      icon: 'globe',
      order_index: socialsData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSocialsData([newSocial, ...socialsData]);
    setEditingId(newSocial.id);
    setEditForm({ ...newSocial });
  };

  const removeSocial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    try {
      if (id.startsWith('temp-')) {
        setSocialsData(socialsData.filter(s => s.id !== id));
      } else {
        await socialsApi.remove(id);
        setSocialsData(socialsData.filter(s => s.id !== id));
      }
      setMessage({ type: 'success', text: 'Social link deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Social Links Management</h1>
            <p className="text-gray-500 mt-1">Manage your social media and contact links</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading social links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Social Links Management</h1>
          <p className="text-gray-500 mt-1">Manage your social media and contact links</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={addSocial} className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" />
            <span>Add Social</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
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

      <DragDropList
        items={socialsData}
        onReorder={handleReorder}
        renderItem={(social) => {
          const isEditing = editingId === social.id;
          return (
            <div className={`bg-white rounded-xl border ${isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{social.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{isEditing ? (editForm.label || 'New Social Link') : social.label}</h3>
                      <p className="text-sm text-gray-500">{social.href}</p>
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
                        <button onClick={() => startEdit(social)} className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => removeSocial(social.id)} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                      <input
                        type="text"
                        value={editForm.label || ''}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., GitHub, LinkedIn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        value={editForm.href || ''}
                        onChange={(e) => setEditForm({ ...editForm, href: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide name)</label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, icon })}
                          className={`px-3 py-2 rounded-lg border-2 text-sm font-mono transition-colors ${
                            (editForm.icon || social.icon) === icon ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Using Lucide icon names. Common: github, linkedin, x, instagram, mail, globe</p>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />

      {socialsData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No social links yet</p>
          <button onClick={addSocial} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add First Social Link
          </button>
        </div>
      )}
    </div>
  );
}