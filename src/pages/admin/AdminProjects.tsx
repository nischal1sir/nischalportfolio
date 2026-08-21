import { useState, useEffect, useRef } from 'react';
import { useAdmin } from './AdminContext';
import {
  Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit, X,
  ImageIcon, Upload, Link,
} from 'lucide-react';
import { projectsApi } from '../../services/adminApi';
import { supabase } from '../../lib/supabase';
import type { Project } from '../../types';

const PRESET_TECHS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Next.js',
  'Python', 'Java', 'MongoDB', 'MySQL', 'PostgreSQL', 'Supabase',
  'Tailwind CSS', 'HTML / CSS', 'Docker', 'GraphQL', 'Socket.io', 'Git',
  'Vite', 'Redux', 'Firebase', 'AWS',
];

const CATEGORIES = ['Full-Stack', 'Web App', 'Frontend', 'Backend', 'Template', 'Other'];
const BUCKET = 'project-images';

// ── Upload helper ─────────────────────────────────────────────────────────────
async function uploadProjectImage(file: File, projectId: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${projectId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export default function AdminProjects() {
  const { isAuthenticated } = useAdmin();
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [customTech, setCustomTech] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customTechRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) loadProjects();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadProjects = async () => {
    try {
      const data = await projectsApi.getAll();
      setProjectsData(data);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  // ── Edit helpers ──────────────────────────────────────────────────────────
  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({ ...project });
    setCustomTech('');
    setImageMode('upload');
  };

  const cancelEdit = () => {
    if (editingId?.startsWith('temp-')) {
      setProjectsData(prev => prev.filter(p => p.id !== editingId));
    }
    setEditingId(null);
    setEditForm({});
    setCustomTech('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setMessage(null);
    try {
      if (editingId.startsWith('temp-')) {
        const { id, created_at, updated_at, ...rest } = editForm as Project;
        const created = await projectsApi.create(rest);
        setProjectsData(prev => prev.map(p => p.id === editingId ? created : p));
      } else {
        const updated = await projectsApi.update(editingId, editForm);
        setProjectsData(prev => prev.map(p => p.id === editingId ? updated : p));
      }
      setEditingId(null);
      setEditForm({});
      setCustomTech('');
      setMessage({ type: 'success', text: 'Project saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    const newProject: Project = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      short_description: '',
      image_url: '',
      github_url: null,
      live_url: null,
      technologies: [],
      category: 'Web App',
      featured: false,
      order_index: projectsData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjectsData(prev => [newProject, ...prev]);
    setEditingId(newProject.id);
    setEditForm({ ...newProject });
    setCustomTech('');
    setImageMode('upload');
  };

  const removeProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      if (id.startsWith('temp-')) {
        setProjectsData(prev => prev.filter(p => p.id !== id));
      } else {
        await projectsApi.remove(id);
        setProjectsData(prev => prev.filter(p => p.id !== id));
      }
      if (editingId === id) { setEditingId(null); setEditForm({}); }
      setMessage({ type: 'success', text: 'Project deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be smaller than 5 MB.' });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const projectId = editingId ?? `temp-${Date.now()}`;
      const url = await uploadProjectImage(file, projectId);
      setEditForm(f => ({ ...f, image_url: url }));
      setMessage({ type: 'success', text: 'Image uploaded!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // ── Technology helpers ────────────────────────────────────────────────────
  const currentTechs: string[] = (editForm.technologies as string[]) ?? [];

  const toggleTech = (tech: string) => {
    const next = currentTechs.includes(tech)
      ? currentTechs.filter(t => t !== tech)
      : [...currentTechs, tech];
    setEditForm(f => ({ ...f, technologies: next }));
  };

  const addCustomTech = () => {
    const t = customTech.trim();
    if (!t || currentTechs.includes(t)) { setCustomTech(''); return; }
    setEditForm(f => ({ ...f, technologies: [...currentTechs, t] }));
    setCustomTech('');
    customTechRef.current?.focus();
  };

  const removeTech = (tech: string) => {
    setEditForm(f => ({ ...f, technologies: currentTechs.filter(t => t !== tech) }));
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-0 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects Management</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading projects…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-0 space-y-4 sm:space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your portfolio projects</p>
        </div>
        <button
          onClick={addProject}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* ── Message ── */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`} role="alert">
          {message.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Project list ── */}
      <div className="space-y-3">
        {projectsData.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
            No projects yet. Click <strong>Add Project</strong> to create one.
          </div>
        )}

        {projectsData.map((project) => {
          const isEditing = editingId === project.id;

          return (
            <div
              key={project.id}
              className={`bg-white rounded-xl border transition-all ${
                isEditing ? 'border-blue-400 shadow-md' : 'border-gray-200'
              }`}
            >
              {/* ── Row summary ── */}
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {project.title || <span className="text-gray-400 italic">Untitled</span>}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{project.category}</span>
                    {project.featured && (
                      <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">⭐ Featured</span>
                    )}
                    {project.technologies.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">{t}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-gray-400">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <button onClick={saveEdit} disabled={saving}
                        className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50" title="Save">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      </button>
                      <button onClick={cancelEdit} className="p-2 text-gray-500 hover:text-gray-700" title="Cancel">
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(project)} className="p-2 text-blue-600 hover:text-blue-700" title="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => removeProject(project.id)} className="p-2 text-red-500 hover:text-red-600" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ── Edit panel ── */}
              {isEditing && (
                <div className="border-t border-blue-100 bg-blue-50/30 p-4 sm:p-5 space-y-4">

                  {/* Title + Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={editForm.title ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="e.g. E-Commerce Storefront"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editForm.category ?? 'Web App'}
                        onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Short description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={editForm.short_description ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, short_description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="One-liner shown on the project card"
                    />
                  </div>

                  {/* Full description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description <span className="text-red-500">*</span></label>
                    <textarea
                      value={editForm.description ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                      placeholder="Detailed description shown on the project detail page"
                    />
                  </div>

                  {/* ── Image section ── */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Project Image</label>
                      {/* Toggle upload vs URL */}
                      <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => setImageMode('upload')}
                          className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${
                            imageMode === 'upload'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Upload className="w-3 h-3" /> Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode('url')}
                          className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${
                            imageMode === 'url'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Link className="w-3 h-3" /> URL
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        {imageMode === 'upload' ? (
                          /* ── Drag & drop zone ── */
                          <div
                            className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                              dragOver
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                            } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={onDrop}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={onFileInputChange}
                            />
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                              {uploading ? (
                                <>
                                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                                  <p className="text-sm text-blue-600 font-medium">Uploading…</p>
                                </>
                              ) : (
                                <>
                                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                                    <Upload className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {dragOver ? 'Drop image here' : 'Click or drag & drop image'}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP · max 5 MB</p>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* ── URL input ── */
                          <input
                            type="text"
                            value={editForm.image_url ?? ''}
                            onChange={e => setEditForm(f => ({ ...f, image_url: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="https://..."
                          />
                        )}
                      </div>

                      {/* Live preview */}
                      {editForm.image_url && (
                        <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative group">
                          <img
                            src={editForm.image_url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setEditForm(f => ({ ...f, image_url: '' }))}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GitHub + Live URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={editForm.github_url ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, github_url: e.target.value || null }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                      <input
                        type="text"
                        value={editForm.live_url ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, live_url: e.target.value || null }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technologies
                      <span className="ml-2 text-xs text-gray-400 font-normal">
                        Click to toggle · type a custom one below
                      </span>
                    </label>

                    {/* Selected chips */}
                    {currentTechs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {currentTechs.map(t => (
                          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {t}
                            <button type="button" onClick={() => removeTech(t)}
                              className="hover:text-blue-900 ml-0.5" aria-label={`Remove ${t}`}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Preset grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 p-3 bg-white border border-gray-200 rounded-lg">
                      {PRESET_TECHS.map(tech => {
                        const selected = currentTechs.includes(tech);
                        return (
                          <label key={tech} className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs select-none ${
                            selected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}>
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleTech(tech)}
                              className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            {tech}
                          </label>
                        );
                      })}
                    </div>

                    {/* Custom tech input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        ref={customTechRef}
                        type="text"
                        value={customTech}
                        onChange={e => setCustomTech(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTech(); } }}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Add custom technology…"
                      />
                      <button type="button" onClick={addCustomTech}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Featured + Order */}
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editForm.featured ?? false}
                        onChange={e => setEditForm(f => ({ ...f, featured: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured project</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Order</label>
                      <input
                        type="number"
                        value={editForm.order_index ?? 0}
                        onChange={e => setEditForm(f => ({ ...f, order_index: Number(e.target.value) }))}
                        className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Save / Cancel */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={saveEdit}
                      disabled={saving || uploading}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-sm"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving…' : 'Save Project'}
                    </button>
                    <button onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}