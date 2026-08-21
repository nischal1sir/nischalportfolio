import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { galleryApi } from '../../services/adminApi';
import type { GalleryImage } from '../../types';

export default function AdminGallery() {
  const { isAuthenticated } = useAdmin();
  const [galleryData, setGalleryData] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryImage>>({});
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      loadGallery();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadGallery = async () => {
    try {
      const data = await galleryApi.getAll();
      setGalleryData(data);
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
        galleryData.map(async (image) => {
          const { id, created_at, updated_at, ...rest } = image;
          if (id.startsWith('temp-')) {
            const created = await galleryApi.create(rest);
            setGalleryData(prev => prev.map(g => g.id === image.id ? created : g));
          } else {
            await galleryApi.update(id, rest);
          }
        })
      );
      setMessage({ type: 'success', text: 'Gallery saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditForm({ ...image, tags: [...image.tags] });
    setPreviewUrl(image.image_url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setPreviewUrl('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await galleryApi.update(editingId, editForm);
      setGalleryData(galleryData.map(g => g.id === editingId ? updated : g));
      setEditingId(null);
      setEditForm({});
      setPreviewUrl('');
      setMessage({ type: 'success', text: 'Image updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      image_url: '',
      category: 'General',
      tags: [],
      featured: false,
      order_index: galleryData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGalleryData([newImage, ...galleryData]);
    setEditingId(newImage.id);
    setEditForm({ ...newImage });
  };

  const removeImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    try {
      if (id.startsWith('temp-')) {
        setGalleryData(galleryData.filter(g => g.id !== id));
      } else {
        await galleryApi.remove(id);
        setGalleryData(galleryData.filter(g => g.id !== id));
      }
      setMessage({ type: 'success', text: 'Image deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleTagChange = (id: string, tag: string) => {
    if (!editingId || editingId !== id) return;
    const img = galleryData.find(g => g.id === id);
    if (!img) return;
    const tags = img.tags.includes(tag)
      ? img.tags.filter(t => t !== tag)
      : [...img.tags, tag];
    setEditForm({ ...editForm, tags });
  };

  const addCustomTag = (id: string, newTag: string) => {
    if (!editingId || editingId !== id || !newTag.trim()) return;
    const img = galleryData.find(g => g.id === id);
    if (!img) return;
    if (!img.tags.includes(newTag.trim())) {
      setEditForm({ ...editForm, tags: [...img.tags, newTag.trim()] });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-500 mt-1">Manage gallery images for your portfolio</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Manage gallery images for your portfolio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={addImage} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add Image
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
        {galleryData.map((image) => {
          const isEditing = editingId === image.id;
          return (
            <div key={image.id} className={`bg-white rounded-xl border ${isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {image.image_url && (
                        <img
                          src={image.image_url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{isEditing ? (editForm.title || 'New Image') : image.title}</h3>
                      <p className="text-sm text-gray-500">{image.category} • Order: {image.order_index}</p>
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
                        <button onClick={() => startEdit(image)} className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => removeImage(image.id)} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={editForm.image_url || ''}
                        onChange={(e) => {
                          setEditForm({ ...editForm, image_url: e.target.value });
                          setPreviewUrl(e.target.value);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                      <input
                        type="number"
                        value={editForm.order_index || 0}
                        onChange={(e) => setEditForm({ ...editForm, order_index: parseInt(e.target.value) || 0 })}
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
                      <label className="block text-sm font-medium text-gray-700">Tags</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add custom tag"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomTag(image.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['workspace', 'code', 'planning', 'design', 'meeting', 'deploy', 'debug', 'review', 'setup', 'monitor'].map((tag) => (
                        <label key={tag} className="inline-flex items-center gap-1 cursor-pointer px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                          <input
                            type="checkbox"
                            checked={(editForm.tags || image.tags).includes(tag)}
                            onChange={() => handleTagChange(image.id, tag)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{tag}</span>
                        </label>
                      ))}
                      {(editForm.tags || image.tags).filter((t: string) => !['workspace', 'code', 'planning', 'design', 'meeting', 'deploy', 'debug', 'review', 'setup', 'monitor'].includes(t)).map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagChange(image.id, tag)}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.featured || false}
                        onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                    {previewUrl && (
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        Preview
                      </a>
                    )}
                  </div>

                  {previewUrl && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <img src={previewUrl} alt="Preview" className="max-h-48 w-auto mx-auto rounded" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {galleryData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No gallery images yet</p>
          <button onClick={addImage} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add First Image
          </button>
        </div>
      )}
    </div>
  );
}