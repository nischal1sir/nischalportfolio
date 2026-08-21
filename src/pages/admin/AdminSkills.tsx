import { useState, useEffect, useMemo } from 'react';
import { useAdmin } from './AdminContext';
import {
  Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit2,
  Search, X
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-black">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-black rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-black rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-3 py-2 bg-white border border-black rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="home">Show on Home</option>
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
      <div className="bg-white rounded-xl border border-black overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[650px]">
            <thead className="bg-white border-b border-black text-black font-bold">
              <tr>
                <th className="py-3.5 px-4">Skill Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSkills.length === 0 ? (
                <tr>
                   <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">
                    No skills found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => {
                   return (
                     <tr
                        key={skill.id}
                        className="hover:bg-gray-50 transition-colors"
                     >
                       <td className="py-3 px-4 font-bold text-black">
                         {skill.name}
                       </td>

                       <td className="py-3 px-4">
                         <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white text-black border border-black">
                           {skill.category}
                         </span>
                       </td>

                       <td className="py-3 px-4 text-xs font-semibold text-black">
                         {skill.level || 'Intermediate'}
                       </td>

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-black">Soft Skills</h3>
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
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Soft Skill
          </button>
          <button
            onClick={handleSaveOtherTabs}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-semibold shadow-xs"
          >
            <Save className="w-4 h-4" />
            Save Soft Skills
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {softSkillsData.map((skill, index) => (
          <div key={skill.id || index} className="border border-black rounded-xl p-4 bg-white space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-black">
                Soft Skill #{index + 1}
              </span>
              <button
                onClick={async () => {
                  const target = softSkillsData[index];
                  setSoftSkillsData(softSkillsData.filter((_, i) => i !== index));
                  if (target && target.id && !target.id.startsWith('temp-')) {
                    try {
                      await skillsApi.removeSoft(target.id);
                      setMessage({ type: 'success', text: 'Soft skill removed successfully!' });
                    } catch (err) {
                      setMessage({ type: 'error', text: `Failed to delete soft skill: ${err instanceof Error ? err.message : 'Unknown error'}` });
                    }
                  }
                }}
                className="text-red-600 hover:text-red-700 text-xs font-semibold px-2 py-1 bg-red-50 rounded-md"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...softSkillsData];
                    updated[index] = { ...skill, name: e.target.value };
                    setSoftSkillsData(updated);
                  }}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Description</label>
                <input
                  type="text"
                  value={skill.description}
                  onChange={(e) => {
                    const updated = [...softSkillsData];
                    updated[index] = { ...skill, description: e.target.value };
                    setSoftSkillsData(updated);
                  }}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setItems([...items, ''])}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          <button
            onClick={handleSaveOtherTabs}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-semibold shadow-xs"
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
              className="flex-1 px-4 py-2 border border-black rounded-lg text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              placeholder="Enter item name..."
            />
            <button
              onClick={() => setItems(items.filter((_, i) => i !== index))}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove item"
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
        <div className="bg-white rounded-2xl border border-black p-12 text-center shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-3 text-sm text-gray-500">Loading skills data...</p>
        </div>
      </div>
    );
  }

  return (
<div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Skills Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Single source of truth for technical stack, soft skills, and learning items across the website.
          </p>
        </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
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
      <div className="bg-white rounded-2xl border border-black shadow-xs overflow-hidden">
        <div className="border-b border-black bg-white p-1.5 overflow-x-auto">
          <nav className="flex gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Technical Stack ({skillsData.length})
            </button>
            <button
              onClick={() => setActiveTab('soft')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'soft'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Soft Skills ({softSkillsData.length})
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'learning'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Currently Learning ({learningData.length})
            </button>
            <button
              onClick={() => setActiveTab('exploring')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'exploring'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
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
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-black shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-black">
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
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={editingSkill.name || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    placeholder="e.g. React, TypeScript, Python"
                    className="w-full px-3 py-2 border border-black rounded-lg text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black mb-1">
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
                      className="w-full px-3 py-2 border border-black rounded-lg text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm text-black bg-blue-50/30 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  Level (Optional)
                </label>
                <select
                  value={editingSkill.level || 'Intermediate'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {STANDARD_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.description || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  placeholder="Brief summary of how you use this skill..."
                  className="w-full px-3 py-2 border border-black rounded-lg text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder:text-gray-400"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-lg bg-white border border-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.is_active !== false}
                    onChange={(e) => setEditingSkill({ ...editingSkill, is_active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-black">Active</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg bg-white border border-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.show_on_home === true}
                    onChange={(e) => setEditingSkill({ ...editingSkill, show_on_home: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-black">Show on Home</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
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
                    show_on_home: editingSkill.show_on_home,
                    order_index: 0,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModalSkill}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs disabled:opacity-50"
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
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-black shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-black">Delete Skill?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-semibold text-black">"{deletingSkill.name}"</span>?
                This action will permanently remove it from the portfolio.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingSkill(null)}
                className="flex-1 py-2.5 border border-black text-black font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors"
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