import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit, X, ChevronDown, ChevronUp } from 'lucide-react';
import { projectsApi } from '../../services/adminApi';
import type { Project } from '../../types';

export default function AdminProjects() {
  const { isAuthenticated } = useAdmin();
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  if (!isAuthenticated) return null;

  useEffect(() => {
    loadProjects();
  }, []);

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

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Save all pending changes
      await Promise.all(
        projectsData.map(async (project) => {
          // For new projects (temp IDs), create them
          if (project.id.startsWith('p-') || project.id.startsWith('temp-')) {
            const { id, created_at, updated_at, ...rest } = project;
            const created = await projectsApi.create(rest);
            // Replace temp ID with real ID
            setProjectsData(prev => prev.map(p => p.id === project.id ? created : p));
          }
          // For existing projects, they are saved via saveEdit
        })
      );
      setMessage({ type: 'success', text: 'Projects saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({ ...project });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await projectsApi.update(editingId, editForm);
      setProjectsData(projectsData.map(p => p.id === editingId ? updated : p));
      setEditingId(null);
      setEditForm({});
      setMessage({ type: 'success', text: 'Project updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}` });
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
    setProjectsData([newProject, ...projectsData]);
    setEditingId(newProject.id);
    setEditForm({ ...newProject });
  };

  const removeProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      // If it's a temp ID, just remove locally
      if (id.startsWith('temp-')) {
        setProjectsData(projectsData.filter(p => p.id !== id));
      } else {
        await projectsApi.remove(id);
        setProjectsData(projectsData.filter(p => p.id !== id));
      }
      setMessage({ type: 'success', text: 'Project deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleTechChange = (id: string, tech: string) => {
    if (!editingId || editingId !== id) return;
    const project = projectsData.find(p => p.id === id);
    if (!project) return;
    const techs = project.technologies.includes(tech)
      ? project.technologies.filter(t => t !== tech)
      : [...project.technologies, tech];
    setEditForm({ ...editForm, technologies: techs });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects Management</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your portfolio projects</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your portfolio projects</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={addProject} className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`} role="alert">
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
          <span className="text-sm sm:text-base">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="p-3 sm:p-4 w-10">Select</th>
                <th className="p-3 sm:p-4">Title</th>
                <th className="p-3 sm:p-4 hidden md:table-cell">Category</th>
                <th className="p-3 sm:p-4 hidden lg:table-cell">Technologies</th>
                <th className="p-3 sm:p-4 w-16 text-center">Featured</th>
                <th className="p-3 sm:p-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projectsData.map((project) => {
                const isEditing = editingId === project.id;
                const isExpanded = expandedIds.has(project.id);
                return (
                  <tr key={project.id} className={isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="p-3 sm:p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3 sm:p-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900 truncate block">{project.title || '<Untitled>'}</span>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      {isEditing ? (
                        <select
                          value={editForm.category || project.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                        >
                          <option value="Full-Stack">Full-Stack</option>
                          <option value="Web App">Web App</option>
                          <option value="Frontend">Frontend</option>
                          <option value="Template">Template</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{project.category}</span>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell">
                      {isEditing ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Next.js', 'Python', 'Java', 'SQL', 'Docker', 'GraphQL'].map((tech) => (
                            <label key={tech} className="inline-flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(editForm.technologies || project.technologies).includes(tech)}
                                onChange={() => handleTechChange(project.id, tech)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-700">{tech}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{tech}</span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-gray-500">+{project.technologies.length - 4} more</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 text-center">
                      {isEditing ? (
                        <label className="inline-flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={editForm.featured || false}
                            onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      ) : (
                        <span className={project.featured ? 'text-amber-500' : 'text-gray-300'}>
                          {project.featured ? '★' : '☆'}
                        </span>
                      )}
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="p-2 text-green-600 hover:text-green-700"
                              title="Save"
                            >
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-gray-600 hover:text-gray-700"
                              title="Cancel"
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(project)}
                              className="p-2 text-blue-600 hover:text-blue-700"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => removeProject(project.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => toggleExpand(project.id)}
                              className="p-2 text-gray-600 hover:text-gray-700"
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Editing: {editForm.title || 'New Project'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editForm.short_description || ''}
                  onChange={(e) => setEditForm({ ...editForm, short_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editForm.image_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={editForm.github_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                <input
                  type="text"
                  value={editForm.live_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, live_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}