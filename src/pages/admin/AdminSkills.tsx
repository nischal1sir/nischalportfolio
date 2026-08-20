import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, GripVertical } from 'lucide-react';
import { skillsApi } from '../../services/adminApi';
import type { Skill, SoftSkill, SkillCategory } from '../../types';

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

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadData = async () => {
    try {
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
      setMessage({ type: 'error', text: `Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Save technical skills
      await Promise.all(
        skillsData.map(async (skill) => {
          const { id, created_at, updated_at, ...rest } = skill;
          if (id.startsWith('temp-')) {
            const created = await skillsApi.create(rest);
            setSkillsData(prev => prev.map(s => s.id === skill.id ? created : s));
          } else {
            await skillsApi.update(id, rest);
          }
        })
      );

      // Save soft skills
      await Promise.all(
        softSkillsData.map(async (skill) => {
          const { id, created_at, updated_at, ...rest } = skill;
          if (id.startsWith('temp-')) {
            const created = await skillsApi.createSoft(rest);
            setSoftSkillsData(prev => prev.map(s => s.id === skill.id ? created : s));
          } else {
            await skillsApi.updateSoft(id, rest);
          }
        })
      );

      // Save learning items
      for (let i = 0; i < learningData.length; i++) {
        const item = learningData[i];
        if (item.trim()) {
          const existing = skillsData.find(s => s.category === 'learning' && s.name === item);
          if (!existing) {
            await skillsApi.create({ name: item, category: 'learning', order_index: i });
          }
        }
      }

      // Save exploring items
      for (let i = 0; i < exploringData.length; i++) {
        const item = exploringData[i];
        if (item.trim()) {
          const existing = skillsData.find(s => s.category === 'exploring' && s.name === item);
          if (!existing) {
            await skillsApi.create({ name: item, category: 'exploring', order_index: i });
          }
        }
      }

      setMessage({ type: 'success', text: 'Skills saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: `temp-${Date.now()}`,
      name: '',
      category: 'language',
      order_index: skillsData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSkillsData([...skillsData, newSkill]);
  };

  const removeSkill = async (index: number) => {
    const skill = skillsData[index];
    if (skill.id.startsWith('temp-')) {
      setSkillsData(skillsData.filter((_, i) => i !== index));
    } else {
      try {
        await skillsApi.remove(skill.id);
        setSkillsData(skillsData.filter((_, i) => i !== index));
      } catch (err) {
        setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
      }
    }
  };

  const addLearning = () => {
    setLearningData([...learningData, '']);
  };

  const removeLearning = (index: number) => {
    setLearningData(learningData.filter((_, i) => i !== index));
  };

  const addExploring = () => {
    setExploringData([...exploringData, '']);
  };

  const removeExploring = (index: number) => {
    setExploringData(exploringData.filter((_, i) => i !== index));
  };

  const addSoftSkill = () => {
    const newSkill: SoftSkill = {
      id: `temp-${Date.now()}`,
      name: '',
      description: '',
      order_index: softSkillsData.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSoftSkillsData([...softSkillsData, newSkill]);
  };

  const removeSoftSkill = async (index: number) => {
    const skill = softSkillsData[index];
    if (skill.id.startsWith('temp-')) {
      setSoftSkillsData(softSkillsData.filter((_, i) => i !== index));
    } else {
      try {
        await skillsApi.removeSoft(skill.id);
        setSoftSkillsData(softSkillsData.filter((_, i) => i !== index));
      } catch (err) {
        setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
      }
    }
  };

  const skillCategories: { key: SkillCategory; label: string }[] = [
    { key: 'language', label: 'Languages' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'database', label: 'Database' },
    { key: 'tools', label: 'Tools' },
    { key: 'learning', label: 'Learning' },
    { key: 'exploring', label: 'Exploring' },
  ];

  const renderSkillsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Technical Skills</h3>
        <button onClick={addSkill} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-2 pr-4 w-8"></th>
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Category</th>
              <th className="pb-2 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {skillsData.map((skill, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 text-gray-400">
                  <GripVertical className="w-5 h-5 cursor-grab" />
                </td>
                <td className="py-3 pr-4">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = [...skillsData];
                      newSkills[index] = { ...skill, name: e.target.value };
                      setSkillsData(newSkills);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="py-3 pr-4">
                  <select
                    value={skill.category}
                    onChange={(e) => {
                      const newSkills = [...skillsData];
                      newSkills[index] = { ...skill, category: e.target.value as SkillCategory };
                      setSkillsData(newSkills);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {skillCategories.map((cat) => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                    aria-label="Remove skill"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500">
        {skillCategories.map((cat) => (
          <span key={cat.key} className="inline-block px-2 py-1 mr-2 mb-2 bg-gray-100 text-gray-700 rounded">
            {cat.label}: {skillsData.filter(s => s.category === cat.key).length}
          </span>
        ))}
      </div>
    </div>
  );

  const renderListTab = (items: string[], onChange: (items: string[]) => void, onAdd: () => void, onRemove: (index: number) => void, label: string) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{label}</h3>
        <button onClick={onAdd} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                onChange(newItems);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => onRemove(index)}
              className="px-3 py-2 text-red-600 hover:text-red-700"
              disabled={items.length === 1}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSoftSkillsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Soft Skills</h3>
        <button onClick={addSoftSkill} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Soft Skill
        </button>
      </div>
      <div className="space-y-4">
        {softSkillsData.map((skill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Soft Skill {index + 1}</span>
              <button
                onClick={() => removeSoftSkill(index)}
                className="text-red-600 hover:text-red-700 text-sm"
                disabled={softSkillsData.length === 1}
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const newItems = [...softSkillsData];
                    newItems[index] = { ...skill, name: e.target.value };
                    setSoftSkillsData(newItems);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={skill.description}
                  onChange={(e) => {
                    const newItems = [...softSkillsData];
                    newItems[index] = { ...skill, description: e.target.value };
                    setSoftSkillsData(newItems);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
            <p className="text-gray-500 mt-1">Manage technical skills, learning items, and soft skills</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
          <p className="text-gray-500 mt-1">Manage technical skills, learning items, and soft skills</p>
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

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 p-1" aria-label="Skills tabs">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'skills' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Technical Skills
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'learning' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Currently Learning
            </button>
            <button
              onClick={() => setActiveTab('exploring')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'exploring' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Exploring
            </button>
            <button
              onClick={() => setActiveTab('soft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'soft' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Soft Skills
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'skills' && renderSkillsTab()}
          {activeTab === 'learning' && renderListTab(learningData, setLearningData, addLearning, removeLearning, 'Currently Learning')}
          {activeTab === 'exploring' && renderListTab(exploringData, setExploringData, addExploring, removeExploring, 'Exploring')}
          {activeTab === 'soft' && renderSoftSkillsTab()}
        </div>
      </div>
    </div>
  );
}