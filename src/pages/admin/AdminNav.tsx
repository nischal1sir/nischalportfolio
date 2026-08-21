import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit, GripVertical } from 'lucide-react';
import { navApi } from '../../services/adminApi';
import type { NavLink } from '../../types';

const iconOptions = [
  'home', 'user', 'code', 'folder', 'briefcase', 'mail', 'book-open',
  'award', 'graduation-cap', 'settings', 'layout', 'globe', 'file-text',
  'image', 'video', 'music', 'heart', 'star', 'zap', 'rocket'
];

export default function AdminNav() {
  const { isAuthenticated } = useAdmin();
  const [navLinksData, setNavLinksData] = useState<NavLink[]>([]);
  const [contactNavData, setContactNavData] = useState<NavLink | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NavLink>>({});
  const [editingContact, setEditingContact] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadNavLinks();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadNavLinks = async () => {
    try {
      const [navLinks, allLinks] = await Promise.all([
        navApi.getAll(),
        navApi.getAll(), // We'll filter for contact
      ]);
      setNavLinksData(navLinks.filter(l => !l.is_contact));
      const contact = allLinks.find(l => l.is_contact);
      if (contact) setContactNavData(contact);
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
      // Save main nav links
      await Promise.all(
        navLinksData.map(async (link) => {
          const { id, created_at, updated_at, ...rest } = link;
          if (id.startsWith('temp-')) {
            const created = await navApi.create(rest);
            setNavLinksData(prev => prev.map(l => l.id === link.id ? created : l));
          } else {
            await navApi.update(id, rest);
          }
        })
      );

      // Save contact nav
      if (contactNavData) {
        const { id, created_at, updated_at, ...rest } = contactNavData;
        await navApi.update(id, rest);
      }

      setMessage({ type: 'success', text: 'Navigation saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (link: NavLink) => {
    setEditingId(link.id);
    setEditForm({ ...link });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditingContact(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const { id, created_at, updated_at, ...rest } = editForm as any;
      if (editingId.startsWith('temp-')) {
        const created = await navApi.create(rest);
        setNavLinksData(navLinksData.map(l => l.id === editingId ? created : l));
      } else {
        const updated = await navApi.update(editingId, rest);
        setNavLinksData(navLinksData.map(l => l.id === editingId ? updated : l));
      }
      setEditingId(null);
      setEditForm({});
      setMessage({ type: 'success', text: 'Link updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const saveContactEdit = async () => {
    if (!contactNavData) return;
    try {
      const { id, created_at, updated_at, ...rest } = editForm as any;
      const updated = await navApi.update(contactNavData.id, rest);
      setContactNavData(updated);
      setEditingContact(false);
      setEditForm({});
      setMessage({ type: 'success', text: 'Contact link updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const addNavLink = () => {
    const newLink: NavLink = {
      id: `temp-${Date.now()}`,
      label: '',
      to: '',
      icon: 'layout',
      is_contact: false,
      order_index: navLinksData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setNavLinksData([...navLinksData, newLink]);
    setEditingId(newLink.id);
    setEditForm({ ...newLink });
  };

  const removeNavLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation link?')) return;
    try {
      if (id.startsWith('temp-')) {
        setNavLinksData(navLinksData.filter(l => l.id !== id));
      } else {
        await navApi.remove(id);
        setNavLinksData(navLinksData.filter(l => l.id !== id));
      }
      setMessage({ type: 'success', text: 'Link deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const editContact = () => {
    if (!contactNavData) return;
    setEditingContact(true);
    setEditForm({ ...contactNavData });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Navigation Management</h1>
            <p className="text-gray-500 mt-1">Manage main navigation and contact link</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading navigation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Navigation Management</h1>
          <p className="text-gray-500 mt-1">Manage main navigation and contact link</p>
        </div>
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

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`} role="alert">
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Contact Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✉</span>
              </span>
              Contact Navigation Link
            </h2>
            {editingContact ? (
              <button onClick={saveContactEdit} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Save
              </button>
            ) : (
              <button onClick={editContact} className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
                <Edit className="w-4 h-4 inline mr-1" /> Edit
              </button>
            )}
          </div>
        </div>

        {editingContact && contactNavData && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={editForm.label || ''}
                  onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Path</label>
                <input
                  type="text"
                  value={editForm.to || ''}
                  onChange={(e) => setEditForm({ ...editForm, to: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/contact"
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
                      (editForm.icon || contactNavData.icon) === icon ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📋</span>
            </span>
            Main Navigation Links
          </h2>
          <button onClick={addNavLink} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {navLinksData.map((link) => {
            const isEditing = editingId === link.id;
            return (
              <div key={link.id} className={`p-4 ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab flex-shrink-0" />
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{link.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editForm.label || ''}
                          onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium mb-2"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editForm.to || ''}
                            onChange={(e) => setEditForm({ ...editForm, to: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="/path"
                          />
                          <select
                            value={editForm.icon || link.icon}
                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-mono"
                          >
                            {iconOptions.map((icon) => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-900">{link.label}</p>
                        <p className="text-sm text-gray-500 font-mono">{link.to}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button onClick={saveEdit} className="p-2 text-green-600 hover:text-green-700" title="Save">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEdit} className="p-2 text-gray-600 hover:text-gray-700" title="Cancel">
                          <Edit className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(link)} className="p-2 text-blue-600 hover:text-blue-700" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => removeNavLink(link.id)} className="p-2 text-red-600 hover:text-red-700" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {navLinksData.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No navigation links yet</p>
            <button onClick={addNavLink} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              Add First Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}