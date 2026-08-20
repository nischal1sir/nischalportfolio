import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { servicesApi } from '../../services/adminApi';
import type { Service } from '../../types';

const iconOptions = [
  'layout', 'briefcase', 'user', 'code', 'database', 'refresh-cw',
  'globe', 'mobile', 'monitor', 'server', 'cloud', 'cpu', 'hard-drive',
  'layers', 'box', 'archive', 'git-branch', 'terminal', 'zap', 'shield'
];

export default function AdminServices() {
  const { isAuthenticated } = useAdmin();
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadServices();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServicesData(data);
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
        servicesData.map(async (service) => {
          const { id, created_at, updated_at, ...rest } = service;
          if (id.startsWith('temp-')) {
            const created = await servicesApi.create(rest);
            setServicesData(prev => prev.map(s => s.id === service.id ? created : s));
          } else {
            await servicesApi.update(id, rest);
          }
        })
      );
      setMessage({ type: 'success', text: 'Services saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await servicesApi.update(editingId, editForm);
      setServicesData(servicesData.map(s => s.id === editingId ? updated : s));
      setEditingId(null);
      setEditForm({});
      setMessage({ type: 'success', text: 'Service updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const addService = () => {
    const newService: Service = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      icon: 'code',
      order_index: servicesData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setServicesData([newService, ...servicesData]);
    setEditingId(newService.id);
    setEditForm({ ...newService });
  };

  const removeService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      if (id.startsWith('temp-')) {
        setServicesData(servicesData.filter(s => s.id !== id));
      } else {
        await servicesApi.remove(id);
        setServicesData(servicesData.filter(s => s.id !== id));
      }
      setMessage({ type: 'success', text: 'Service deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-500 mt-1">Manage the services you offer</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-500 mt-1">Manage the services you offer</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addService} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add Service
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
        {servicesData.map((service) => {
          const isEditing = editingId === service.id;
          return (
            <div key={service.id} className={`bg-white rounded-xl border ${isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{isEditing ? (editForm.title || 'New Service') : service.title}</h3>
                      <p className="text-sm text-gray-500">{service.description?.slice(0, 60)}...</p>
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
                        <button onClick={() => startEdit(service)} className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => removeService(service.id)} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide name)</label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, icon })}
                          className={`px-3 py-2 rounded-lg border-2 text-sm font-mono transition-colors ${
                            (editForm.icon || service.icon) === icon ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Using Lucide icon names. Custom icons can be entered manually.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {servicesData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No services yet</p>
          <button onClick={addService} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add First Service
          </button>
        </div>
      )}
    </div>
  );
}