import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { faqsApi } from '../../services/adminApi';
import type { Faq } from '../../types';

export default function AdminFAQs() {
  const { isAuthenticated } = useAdmin();
  const [faqsData, setFaqsData] = useState<Faq[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Faq>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadFaqs();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadFaqs = async () => {
    try {
      const data = await faqsApi.getAll();
      setFaqsData(data);
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
        faqsData.map(async (faq) => {
          const { id, created_at, updated_at, ...rest } = faq;
          if (id.startsWith('temp-')) {
            const created = await faqsApi.create(rest);
            setFaqsData(prev => prev.map(f => f.id === faq.id ? created : f));
          } else {
            await faqsApi.update(id, rest);
          }
        })
      );
      setMessage({ type: 'success', text: 'FAQs saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setEditForm({ ...faq });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await faqsApi.update(editingId, editForm);
      setFaqsData(faqsData.map(f => f.id === editingId ? updated : f));
      setEditingId(null);
      setEditForm({});
      setMessage({ type: 'success', text: 'FAQ updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const addFaq = () => {
    const newFaq: Faq = {
      id: `temp-${Date.now()}`,
      question: '',
      answer: '',
      order_index: faqsData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setFaqsData([newFaq, ...faqsData]);
    setEditingId(newFaq.id);
    setEditForm({ ...newFaq });
  };

  const removeFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      if (id.startsWith('temp-')) {
        setFaqsData(faqsData.filter(f => f.id !== id));
      } else {
        await faqsApi.remove(id);
        setFaqsData(faqsData.filter(f => f.id !== id));
      }
      setMessage({ type: 'success', text: 'FAQ deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">FAQs Management</h1>
            <p className="text-gray-500 mt-1">Manage frequently asked questions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs Management</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addFaq} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add FAQ
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
        {faqsData.map((faq) => {
          const isEditing = editingId === faq.id;
          return (
            <div key={faq.id} className={`bg-white rounded-xl border ${isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{isEditing ? (editForm.question || 'New FAQ') : faq.question}</h3>
                    <p className="text-sm text-gray-500">{faq.answer.slice(0, 80)}...</p>
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
                        <button onClick={() => startEdit(faq)} className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => removeFaq(faq.id)} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <input
                      type="text"
                      value={editForm.question || ''}
                      onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                    <textarea
                      value={editForm.answer || ''}
                      onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {faqsData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No FAQs yet</p>
          <button onClick={addFaq} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add First FAQ
          </button>
        </div>
      )}
    </div>
  );
}