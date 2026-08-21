import { useState, useEffect, useMemo } from 'react';
import { useAdmin } from './AdminContext';
import {
  Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit2,
  Search, ArrowUp, ArrowDown, Eye, EyeOff, Home as HomeIcon, Star, X
} from 'lucide-react';
import { skillsApi } from '../../services/adminApi';
import type { Skill, SoftSkill } from '../../types';
import { SkillCard } from '../../components/ui/SkillCard';

const STANDARD_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'Database',
  'Tools',
  'DevOps',
  'Design',
  'Other',
];

const STANDARD_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function AdminSkills() {
  const { isAuthenticated } = useAdmin();
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [learningData, setLearningData] = useState<string[]>([]);
  const [exploringData, setExploringData] = useState<string[]>([]);
  const [softSkillsData, setSoftSkillsData] = useState<SoftSkill[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'skills' | 'learning' | 'exploring' | 'soft'>('skills');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Delete Modal state
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadData = async () => {
    try {
      setLoading(true);
      const [skills, softSkills, learning, exploring] = await Promise.all([
        skillsApi.getAll(),
        skillsApi.getSoft(),
        skillsApi.getLearning(),
        skillsApi.getExploring(),
      ]);
      setSkillsData(skills);
      setSoftSkillsData(softSkills);
      setLearningData(learning);
      setExploringData(exploring);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to load skills: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  // Derive all unique categories dynamically
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    skillsData.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [skillsData]);

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategoryFilter === 'All' || skill.category === selectedCategoryFilter;

      let matchesStatus = true;
      if (selectedStatusFilter === 'active') matchesStatus = skill.is_active !== false;
      if (selectedStatusFilter === 'inactive') matchesStatus = skill.is_active === false;
      if (selectedStatusFilter === 'home') matchesStatus = skill.show_on_home === true;
      if (selectedStatusFilter === 'featured') matchesStatus = skill.is_featured === true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [skillsData, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  const openAddModal = () => {
    setEditingSkill({
      name: '',
      description: '',
      category: 'Languages',
      level: 'Intermediate',
      is_active: true,
      is_featured: false,
      show_on_home: true,
      order_index: skillsData.length,
    });
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill({ ...skill });
    if (!STANDARD_CATEGORIES.includes(skill.category)) {
      setIsCustomCategory(true);
      setCustomCategoryInput(skill.category);
    } else {
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    }
    setIsModalOpen(true);
  };

  const handleSaveModalSkill = async () => {
    if (!editingSkill || !editingSkill.name?.trim()) {
      setMessage({ type: 'error', text: 'Skill name is required.' });
      return;
    }

    const finalCategory = isCustomCategory
      ? customCategoryInput.trim() || 'Other'
      : editingSkill.category || 'Languages';

    const skillPayload: Partial<Skill> = {
      ...editingSkill,
      name: editingSkill.name.trim(),
      category: finalCategory,
    };

    setSaving(true);
    setMessage(null);
    try {
      if (skillPayload.id && !skillPayload.id.startsWith('temp-')) {
        const updated = await skillsApi.update(skillPayload.id, skillPayload);
        setSkillsData((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setMessage({ type: 'success', text: `Skill "${updated.name}" updated successfully!` });
      } else {
        const created = await skillsApi.create(skillPayload);
        setSkillsData((prev) => [...prev, created]);
        setMessage({ type: 'success', text: `Skill "${created.name}" created successfully!` });
      }
      setIsModalOpen(false);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save skill: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSwitch = async (id: string, field: 'is_active' | 'is_featured' | 'show_on_home', value: boolean) => {
    setSkillsData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    try {
      await skillsApi.update(id, { [field]: value });
    } catch (err) {
      // Revert on error
      setSkillsData((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: !value } : s))
      );
      setMessage({ type: 'error', text: `Failed to update switch: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleDeleteSkill = async () => {
    if (!deletingSkill) return;
    setSaving(true);
    try {
      await skillsApi.remove(deletingSkill.id);
      setSkillsData((prev) => prev.filter((s) => s.id !== deletingSkill.id));
      setMessage({ type: 'success', text: `Skill "${deletingSkill.name}" deleted successfully!` });
      setDeletingSkill(null);
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete skill: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const handleMoveSkill = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skillsData.length) return;

    const newSkills = [...skillsData];
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;

    // Update order indices
    const updatedSkills = newSkills.map((s, idx) => ({ ...s, order_index: idx }));
    setSkillsData(updatedSkills);

    try {
      await skillsApi.reorder(updatedSkills.map((s) => ({ id: s.id, order_index: s.order_index })));
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to reorder: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleSaveOtherTabs = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Save soft skills
      await Promise.all(
        softSkillsData.map(async (skill) => {
          const { id, created_at, updated_at, ...rest } = skill;
          if (id.startsWith('temp-')) {
            const created = await skillsApi.createSoft(rest);
            setSoftSkillsData((prev) => prev.map((s) => (s.id === skill.id ? created : s)));
          } else {
            await skillsApi.updateSoft(id, rest);
          }
        })
      );

      // Save learning items
      for (let i = 0; i < learningData.length; i++) {
        const item = learningData[i];
        if (item.trim()) {
          const existing = skillsData.find((s) => s.category === 'learning' && s.name === item);
          if (!existing) {
            await skillsApi.create({ name: item, category: 'learning', order_index: i });
          }
        }
      }

      // Save exploring items
      for (let i = 0; i < exploringData.length; i++) {
        const item = exploringData[i];
        if (item.trim()) {
          const existing = skillsData.find((s) => s.category === 'exploring' && s.name === item);
          if (!existing) {
            await skillsApi.create({ name: item, category: 'exploring', order_index: i });
          }
        }
      }

      setMessage({ type: 'success', text: 'Lists saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const renderTechnicalSkillsTab = () => (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-200/80 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="home">Show on Home</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Skill
        </button>
      </div>

      {/* Skills Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[650px]">
            <thead className="bg-gray-50 dark:bg-neutral-800/80 border-b border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Order</th>
                <th className="py-3.5 px-4">Skill Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Home</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    No skills found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => {
                  const globalIdx = skillsData.findIndex((s) => s.id === skill.id);
                  return (
                    <tr
                      key={skill.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Reorder actions */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveSkill(globalIdx, 'up')}
                            disabled={globalIdx === 0}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveSkill(globalIdx, 'down')}
                            disabled={globalIdx === skillsData.length - 1}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                          {skill.category}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {skill.level || 'Intermediate'}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleSwitch(skill.id, 'is_active', !(skill.is_active !== false))}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            skill.is_active !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {skill.is_active !== false ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* Home Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleSwitch(skill.id, 'show_on_home', !skill.show_on_home)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            skill.show_on_home
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}
                          title={skill.show_on_home ? 'Showing on Home' : 'Hidden from Home'}
                        >
                          <HomeIcon className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleSwitch(skill.id, 'is_featured', !skill.is_featured)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            skill.is_featured
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}
                          title={skill.is_featured ? 'Featured Skill' : 'Normal Skill'}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Skill"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingSkill(skill)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSoftSkillsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Soft Skills</h3>
          <p className="text-sm text-gray-500">Non-technical skills displayed on the skills page.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setSoftSkillsData([
                ...softSkillsData,
                {
                  id: `temp-${Date.now()}`,
                  name: '',
                  description: '',
                  order_index: softSkillsData.length,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ])
            }
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Soft Skill
          </button>
          <button
            onClick={handleSaveOtherTabs}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save Soft Skills
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {softSkillsData.map((skill, index) => (
          <div key={skill.id || index} className="border border-gray-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                Soft Skill #{index + 1}
              </span>
              <button
                onClick={() => setSoftSkillsData(softSkillsData.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-700 text-xs font-medium"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...softSkillsData];
                    updated[index] = { ...skill, name: e.target.value };
                    setSoftSkillsData(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={skill.description}
                  onChange={(e) => {
                    const updated = [...softSkillsData];
                    updated[index] = { ...skill, description: e.target.value };
                    setSoftSkillsData(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSimpleListTab = (
    items: string[],
    setItems: (items: string[]) => void,
    title: string,
    description: string
  ) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setItems([...items, ''])}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          <button
            onClick={handleSaveOtherTabs}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save List
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = e.target.value;
                setItems(updated);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name..."
            />
            <button
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-3 text-sm text-gray-500">Loading skills data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Skills Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Single source of truth for technical stack, soft skills, and learning items across the website.
          </p>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="flex-1 font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/30 p-1.5 overflow-x-auto">
          <nav className="flex gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              Technical Stack ({skillsData.length})
            </button>
            <button
              onClick={() => setActiveTab('soft')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'soft'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              Soft Skills ({softSkillsData.length})
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'learning'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              Currently Learning ({learningData.length})
            </button>
            <button
              onClick={() => setActiveTab('exploring')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'exploring'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              Also Exploring ({exploringData.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'skills' && renderTechnicalSkillsTab()}
          {activeTab === 'soft' && renderSoftSkillsTab()}
          {activeTab === 'learning' &&
            renderSimpleListTab(
              learningData,
              setLearningData,
              'Currently Learning Items',
              'Technologies you are actively studying.'
            )}
          {activeTab === 'exploring' &&
            renderSimpleListTab(
              exploringData,
              setExploringData,
              'Also Exploring Items',
              'Secondary technologies or tools you are experimenting with.'
            )}
        </div>
      </div>

      {/* Add / Edit Skill Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={editingSkill.name || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    placeholder="e.g. React, TypeScript, Python"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <div className="space-y-2">
                    <select
                      value={isCustomCategory ? 'CUSTOM' : editingSkill.category || 'Languages'}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM') {
                          setIsCustomCategory(true);
                        } else {
                          setIsCustomCategory(false);
                          setEditingSkill({ ...editingSkill, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {STANDARD_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="CUSTOM">+ Custom Category...</option>
                    </select>

                    {isCustomCategory && (
                      <input
                        type="text"
                        placeholder="Enter custom category..."
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm bg-blue-50/30 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Level (Optional)
                </label>
                <select
                  value={editingSkill.level || 'Intermediate'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {STANDARD_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.description || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  placeholder="Brief summary of how you use this skill..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Switches */}
              <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.is_active !== false}
                    onChange={(e) => setEditingSkill({ ...editingSkill, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-900 dark:text-white">Active</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.show_on_home === true}
                    onChange={(e) => setEditingSkill({ ...editingSkill, show_on_home: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-900 dark:text-white">Show Home</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.is_featured === true}
                    onChange={(e) => setEditingSkill({ ...editingSkill, is_featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-900 dark:text-white">Featured</span>
                </label>
              </div>

              {/* Live Preview Card */}
              <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Live Card Preview
                </p>
                <SkillCard
                  skill={{
                    id: 'preview',
                    name: editingSkill.name || 'Skill Name',
                    description: editingSkill.description || '',
                    category: isCustomCategory
                      ? customCategoryInput || 'Category'
                      : editingSkill.category || 'Category',
                    level: editingSkill.level || 'Intermediate',
                    is_active: editingSkill.is_active,
                    is_featured: editingSkill.is_featured,
                    show_on_home: editingSkill.show_on_home,
                    order_index: 0,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/40">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModalSkill}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Skill
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Skill?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{deletingSkill.name}"</span>?
                This action will permanently remove it from the portfolio.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingSkill(null)}
                className="flex-1 py-2.5 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-medium text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSkill}
                disabled={saving}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}