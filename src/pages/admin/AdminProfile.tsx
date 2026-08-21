import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { profileApi } from '../../services/adminApi';
import type { Profile, PhilosophyItem, ProgressionItem } from '../../types';

export default function AdminProfile() {
  const { isAuthenticated } = useAdmin();
  const [data, setData] = useState<Partial<Profile>>({});
  const [philosophyItems, setPhilosophyItems] = useState<PhilosophyItem[]>([]);
  const [progressionItems, setProgressionItems] = useState<ProgressionItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadData = async () => {
    try {
      const [profile, philosophy, progression] = await Promise.all([
        profileApi.get(),
        profileApi.getPhilosophy(),
        profileApi.getProgression(),
      ]);
      setData(profile);
      setPhilosophyItems(philosophy);
      setProgressionItems(progression);
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
      // Update profile
      const updatedProfile = await profileApi.update(data);
      setData(updatedProfile);

      // Save philosophy items
      await Promise.all(
        philosophyItems.map(async (item) => {
          const { id, created_at, updated_at, ...rest } = item;
          if (id.startsWith('temp-')) {
            const created = await profileApi.addPhilosophy(rest);
            setPhilosophyItems(prev => prev.map(i => i.id === item.id ? created : i));
          } else {
            await profileApi.updatePhilosophy(id, rest);
          }
        })
      );

      // Save progression items
      await Promise.all(
        progressionItems.map(async (item) => {
          const { id, created_at, updated_at, ...rest } = item;
          if (id.startsWith('temp-')) {
            const created = await profileApi.addProgression(rest);
            setProgressionItems(prev => prev.map(i => i.id === item.id ? created : i));
          } else {
            await profileApi.updateProgression(id, rest);
          }
        })
      );

      setMessage({ type: 'success', text: 'Profile saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const addPhilosophyItem = () => {
    const newItem: PhilosophyItem = {
      id: `temp-${Date.now()}`,
      profile_id: '1',
      title: '',
      description: '',
      icon: 'book-open',
      order_index: philosophyItems.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPhilosophyItems([...philosophyItems, newItem]);
  };

  const removePhilosophyItem = async (index: number) => {
    const item = philosophyItems[index];
    if (item.id.startsWith('temp-')) {
      setPhilosophyItems(philosophyItems.filter((_, i) => i !== index));
    } else {
      try {
        await profileApi.deletePhilosophy(item.id);
        setPhilosophyItems(philosophyItems.filter((_, i) => i !== index));
      } catch (err) {
        setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
      }
    }
  };

  const addProgressionItem = () => {
    const newItem: ProgressionItem = {
      id: `temp-${Date.now()}`,
      profile_id: '1',
      step: '',
      order_index: progressionItems.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProgressionItems([...progressionItems, newItem]);
  };

  const removeProgressionItem = async (index: number) => {
    const item = progressionItems[index];
    if (item.id.startsWith('temp-')) {
      setProgressionItems(progressionItems.filter((_, i) => i !== index));
    } else {
      try {
        await profileApi.deleteProgression(item.id);
        setProgressionItems(progressionItems.filter((_, i) => i !== index));
      } catch (err) {
        setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-500 mt-1">Manage your profile information, philosophy, and progression</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your profile information, philosophy, and progression</p>
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

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="name"
                type="text"
                value={data.name || ''}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                id="role"
                type="text"
                value={data.role || ''}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={data.email || ''}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                id="location"
                type="text"
                value={data.location || ''}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input
                id="headline"
                type="text"
                value={data.headline || ''}
                onChange={(e) => setData({ ...data, headline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
              <input
                id="resumeUrl"
                type="text"
                value={data.resume_url || ''}
                onChange={(e) => setData({ ...data, resume_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Taglines</h2>
          <div className="space-y-3">
            {(data.taglines || []).map((tagline, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => {
                    const newTaglines = [...(data.taglines || [])];
                    newTaglines[index] = e.target.value;
                    setData({ ...data, taglines: newTaglines });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, taglines: (data.taglines || []).filter((_, i) => i !== index) })}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setData({ ...data, taglines: [...(data.taglines || []), ''] })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              + Add Tagline
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Intro & About</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="intro" className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
              <textarea
                id="intro"
                value={data.intro || ''}
                onChange={(e) => setData({ ...data, intro: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About</label>
              <textarea
                id="about"
                value={data.about || ''}
                onChange={(e) => setData({ ...data, about: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Philosophy</h2>
          <div className="space-y-4">
            {philosophyItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Philosophy Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removePhilosophyItem(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                    disabled={philosophyItems.length === 1}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...philosophyItems];
                        newItems[index] = { ...item, title: e.target.value };
                        setPhilosophyItems(newItems);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (lucide name)</label>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => {
                        const newItems = [...philosophyItems];
                        newItems[index] = { ...item, icon: e.target.value };
                        setPhilosophyItems(newItems);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...philosophyItems];
                        newItems[index] = { ...item, description: e.target.value };
                        setPhilosophyItems(newItems);
                      }}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addPhilosophyItem}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              + Add Philosophy Item
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression Steps</h2>
          <div className="space-y-3">
            {progressionItems.map((item, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={item.step}
                  onChange={(e) => {
                    const newItems = [...progressionItems];
                    newItems[index] = { ...item, step: e.target.value };
                    setProgressionItems(newItems);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeProgressionItem(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                  disabled={progressionItems.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addProgressionItem}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              + Add Step
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}