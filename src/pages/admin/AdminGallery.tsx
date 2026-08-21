import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useAdmin } from './AdminContext';
import {
  Save, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit,
  Upload, Eye, EyeOff, LayoutGrid, Layers, Crop, MoveLeft, MoveRight,
  Maximize2, Minimize2, Images
} from 'lucide-react';
import { galleryApi } from '../../services/adminApi';
import type { GalleryImage, GalleryShape } from '../../types';

const SHAPE_PRESETS: { label: string; shape: GalleryShape; width: number; height: number }[] = [
  { label: 'Small Square', shape: 'small_square', width: 3, height: 2 },
  { label: 'Medium Square', shape: 'medium_square', width: 4, height: 3 },
  { label: 'Large Square', shape: 'large_square', width: 6, height: 4 },
  { label: 'Portrait', shape: 'portrait', width: 3, height: 4 },
  { label: 'Tall Portrait', shape: 'tall_portrait', width: 4, height: 6 },
  { label: 'Landscape', shape: 'landscape', width: 6, height: 3 },
  { label: 'Wide Landscape', shape: 'wide_landscape', width: 8, height: 3 },
  { label: 'Large Feature', shape: 'large_feature', width: 8, height: 5 },
];

export default function AdminGallery() {
  const { isAuthenticated } = useAdmin();
  const [activeTab, setActiveTab] = useState<'canvas' | 'about' | 'list'>('canvas');
  const [galleryData, setGalleryData] = useState<GalleryImage[]>([]);
  const [aboutPreviewIds, setAboutPreviewIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryImage>>({});
  const [selectedCanvasItem, setSelectedCanvasItem] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, previewIds] = await Promise.all([
        galleryApi.getAll(),
        galleryApi.getAboutPreviewItemIds(),
      ]);
      setGalleryData(data);
      if (previewIds && previewIds.length > 0) {
        setAboutPreviewIds(previewIds);
      } else {
        setAboutPreviewIds(data.slice(0, 3).map(g => g.id));
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to load gallery data: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // 1. Save all gallery layout & items
      const updatedItems = await galleryApi.saveAllLayout(galleryData);
      setGalleryData(updatedItems);

      // 2. Save About page 3-image preview selection
      await galleryApi.saveAboutPreviewItemIds(aboutPreviewIds);

      setMessage({ type: 'success', text: 'Gallery layout & About preview selection saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, targetItem?: GalleryImage) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const url = await galleryApi.uploadImage(file);
      if (targetItem) {
        updateItemProperty(targetItem.id, { image_url: url });
      } else {
        setEditForm(prev => ({ ...prev, image_url: url }));
      }
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setUploading(false);
    }
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      id: `temp-${Date.now()}`,
      title: 'New Gallery Item',
      description: 'Add description...',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      category: 'General',
      tags: ['portfolio'],
      featured: false,
      order_index: galleryData.length,
      shape: 'medium_square',
      width: 4,
      height: 3,
      position_x: null,
      position_y: null,
      z_index: 1,
      object_fit: 'cover',
      object_position: 'center',
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGalleryData([...galleryData, newImage]);
    setSelectedCanvasItem(newImage);
    setEditingId(newImage.id);
    setEditForm({ ...newImage });
  };

  const removeImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      if (!id.startsWith('temp-')) {
        await galleryApi.remove(id);
      }
      setGalleryData(prev => prev.filter(g => g.id !== id));
      setAboutPreviewIds(prev => prev.filter(prevId => prevId !== id));
      if (selectedCanvasItem?.id === id) setSelectedCanvasItem(null);
      if (editingId === id) setEditingId(null);
      setMessage({ type: 'success', text: 'Item deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const updateItemProperty = (id: string, updates: Partial<GalleryImage>) => {
    setGalleryData(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        if (selectedCanvasItem?.id === id) setSelectedCanvasItem(updated);
        return updated;
      }
      return item;
    }));
  };

  const moveItemInOrder = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= galleryData.length) return;
    const copy = [...galleryData];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    // update order_index
    const reordered = copy.map((item, idx) => ({ ...item, order_index: idx }));
    setGalleryData(reordered);
  };

  const toggleAboutPreviewSelection = (id: string) => {
    if (aboutPreviewIds.includes(id)) {
      setAboutPreviewIds(aboutPreviewIds.filter(i => i !== id));
    } else {
      if (aboutPreviewIds.length >= 3) {
        // replace the last one or alert
        setAboutPreviewIds([...aboutPreviewIds.slice(0, 2), id]);
      } else {
        setAboutPreviewIds([...aboutPreviewIds, id]);
      }
    }
  };

  const moveAboutPreviewItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= aboutPreviewIds.length) return;
    const copy = [...aboutPreviewIds];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setAboutPreviewIds(copy);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
        <p className="text-gray-500">Loading visual gallery builder...</p>
      </div>
    );
  }

  const selectedAboutItems = aboutPreviewIds
    .map(id => galleryData.find(g => g.id === id))
    .filter((item): item is GalleryImage => Boolean(item));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-blue-600" />
            Gallery Visual Builder
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Single source of truth gallery. Design the visual canvas and select 3 images for the About page preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addImage}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Gallery Layout'}
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'canvas' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Visual Canvas Builder
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'about' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Images className="w-4 h-4" />
          About Page Preview (Select 3)
          <span className="ml-1.5 px-2 py-0.5 text-xs bg-white/20 rounded-full">{aboutPreviewIds.length}/3</span>
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          List & Details View ({galleryData.length})
        </button>
      </div>

      {/* TAB 1: VISUAL CANVAS BUILDER */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 12-Column Grid Canvas */}
          <div className="lg:col-span-8 bg-gray-900 p-6 rounded-2xl border border-gray-800 text-white min-h-[600px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-blue-400" />
                  Visual Layout Grid (12-Column)
                </h2>
                <p className="text-xs text-gray-400">Click any box to inspect and customize shape, size, crop, or focus.</p>
              </div>
              <span className="text-xs font-mono bg-gray-800 px-3 py-1 rounded-md text-gray-300">
                {galleryData.filter(g => g.is_visible !== false).length} Visible Items
              </span>
            </div>

            {/* Grid Container */}
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-12 auto-rows-[100px] gap-3 min-w-[650px] lg:min-w-0">
              {galleryData.map((item, idx) => {
                const isSelected = selectedCanvasItem?.id === item.id;
                const colSpan = item.width ? Math.min(12, Math.max(1, item.width)) : 4;
                const rowSpan = item.height ? Math.min(6, Math.max(1, item.height)) : 3;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCanvasItem(item)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 flex flex-col justify-between p-2 ${
                      isSelected ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-xl' : 'border-gray-700 hover:border-gray-500'
                    } ${item.is_visible === false ? 'opacity-40 grayscale' : ''}`}
                    style={{
                      gridColumn: `span ${colSpan}`,
                      gridRow: `span ${rowSpan}`,
                      zIndex: item.z_index || 1,
                    }}
                  >
                    {/* Background Image */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{
                        objectFit: item.object_fit || 'cover',
                        objectPosition: item.object_position || 'center',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                    {/* Top Overlay Badge & Controls */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] font-mono text-white font-semibold">
                        #{String(idx + 1).padStart(2, '0')} • {colSpan}x{rowSpan}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveItemInOrder(idx, 'left'); }}
                          className="p-1 hover:bg-white/20 rounded text-white"
                          title="Move Left"
                        >
                          <MoveLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveItemInOrder(idx, 'right'); }}
                          className="p-1 hover:bg-white/20 rounded text-white"
                          title="Move Right"
                        >
                          <MoveRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateItemProperty(item.id, { is_visible: item.is_visible === false });
                          }}
                          className="p-1 hover:bg-white/20 rounded text-white"
                          title="Toggle Visibility"
                        >
                          {item.is_visible === false ? <EyeOff className="w-3 h-3 text-red-400" /> : <Eye className="w-3 h-3 text-green-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Title Label */}
                    <div className="relative z-10 bg-black/60 backdrop-blur-md p-1.5 rounded-lg">
                      <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-300 truncate">{item.category}</p>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
              <span>Tip: Click any box to tweak shape preset, column span, row span, crop & focus.</span>
              <button onClick={addImage} className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add New Box
              </button>
            </div>
          </div>

          {/* Right Inspector & Settings Panel */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            {selectedCanvasItem ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base">Box Properties Inspector</h3>
                  <button
                    onClick={() => removeImage(selectedCanvasItem.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Box
                  </button>
                </div>

                {/* Box Image Preview */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={selectedCanvasItem.image_url}
                    alt={selectedCanvasItem.title}
                    className="w-full h-full"
                    style={{
                      objectFit: selectedCanvasItem.object_fit || 'cover',
                      objectPosition: selectedCanvasItem.object_position || 'center',
                    }}
                  />
                  <div className="absolute bottom-2 right-2">
                    <label className="px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs rounded-lg cursor-pointer inline-flex items-center gap-1.5 font-medium backdrop-blur-md">
                      {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, selectedCanvasItem)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Shape Presets */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Shape Preset</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SHAPE_PRESETS.map((preset) => {
                      const isActive = selectedCanvasItem.shape === preset.shape;
                      return (
                        <button
                          key={preset.shape}
                          type="button"
                          onClick={() => {
                            updateItemProperty(selectedCanvasItem.id, {
                              shape: preset.shape,
                              width: preset.width,
                              height: preset.height,
                            });
                          }}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                            isActive
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {preset.label}
                          <span className="block text-[10px] text-gray-400 font-normal">{preset.width}x{preset.height} cols</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Width (Col Span) & Height (Row Span) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Grid Width (Cols 1-12)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateItemProperty(selectedCanvasItem.id, { width: Math.max(1, (selectedCanvasItem.width || 4) - 1) })}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Minimize2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center text-sm font-bold font-mono bg-gray-50 py-1.5 rounded-lg border border-gray-200">
                        {selectedCanvasItem.width || 4}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItemProperty(selectedCanvasItem.id, { width: Math.min(12, (selectedCanvasItem.width || 4) + 1) })}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Grid Height (Rows 1-6)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateItemProperty(selectedCanvasItem.id, { height: Math.max(1, (selectedCanvasItem.height || 3) - 1) })}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Minimize2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center text-sm font-bold font-mono bg-gray-50 py-1.5 rounded-lg border border-gray-200">
                        {selectedCanvasItem.height || 3}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItemProperty(selectedCanvasItem.id, { height: Math.min(6, (selectedCanvasItem.height || 3) + 1) })}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Object Fit & Position */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Crop className="w-3.5 h-3.5 text-gray-500" /> Image Fitting Mode
                    </label>
                    <div className="flex gap-2">
                      {(['cover', 'contain'] as const).map(fit => (
                        <button
                          key={fit}
                          type="button"
                          onClick={() => updateItemProperty(selectedCanvasItem.id, { object_fit: fit })}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-lg border capitalize ${
                            selectedCanvasItem.object_fit === fit
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Focal Alignment</label>
                    <select
                      value={selectedCanvasItem.object_position || 'center'}
                      onChange={(e) => updateItemProperty(selectedCanvasItem.id, { object_position: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="top left">Top Left</option>
                      <option value="top right">Top Right</option>
                      <option value="bottom left">Bottom Left</option>
                      <option value="bottom right">Bottom Right</option>
                    </select>
                  </div>
                </div>

                {/* Title & Description Quick Edit */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={selectedCanvasItem.title || ''}
                      onChange={(e) => updateItemProperty(selectedCanvasItem.id, { title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={selectedCanvasItem.category || ''}
                      onChange={(e) => updateItemProperty(selectedCanvasItem.id, { category: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <LayoutGrid className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-600">No Box Selected</p>
                <p className="text-xs text-gray-400 mt-1">Select any item from the left canvas grid to edit its size, shape, crop, and alignment.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT PAGE PREVIEW SELECTOR */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: All Available Gallery Items Selection */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Images className="w-4 h-4 text-blue-600" />
                Select 3 Images for About Page Preview
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Click items below to select exactly 3 images that will be highlighted on the About page.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {galleryData.map((item) => {
                const isSelected = aboutPreviewIds.includes(item.id);
                const orderIndex = aboutPreviewIds.indexOf(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAboutPreviewSelection(item.id)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="h-32 bg-gray-100 relative">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                          {orderIndex + 1}
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{item.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live About Preview Mockup & Reordering */}
          <div className="lg:col-span-5 bg-gray-900 p-6 rounded-2xl border border-gray-800 text-white space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-blue-400 font-bold">
                Live Preview Mockup
              </span>
              <h2 className="text-lg font-bold text-white mt-1">About Page 3-Image Card</h2>
              <p className="text-xs text-gray-400 mt-1">This is how your 3 selected gallery images will display on `/about`.</p>
            </div>

            {/* Mockup Preview Cards */}
            <div className="grid grid-cols-3 gap-2">
              {selectedAboutItems.map((item, idx) => (
                <div key={item.id} className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 h-40 group">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-between">
                    <span className="self-start px-1.5 py-0.5 bg-blue-600 text-white font-mono text-[9px] font-bold rounded">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[9px] text-gray-300 truncate">{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
              {selectedAboutItems.length < 3 && (
                <div className="h-40 rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-3 text-center text-gray-500">
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">Select {3 - selectedAboutItems.length} More</span>
                </div>
              )}
            </div>

            {/* Reordering Controls */}
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Reorder Preview Items</h3>
              <div className="space-y-2">
                {aboutPreviewIds.map((id, index) => {
                  const item = galleryData.find(g => g.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-2.5 bg-gray-800 rounded-xl border border-gray-700 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                          {index + 1}
                        </span>
                        <span className="font-medium text-white truncate max-w-[160px]">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveAboutPreviewItem(index, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded text-gray-200"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveAboutPreviewItem(index, 'down')}
                          disabled={index === aboutPreviewIds.length - 1}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded text-gray-200"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAboutPreviewSelection(id)}
                          className="px-2 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 rounded ml-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIST & DETAILS VIEW */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {galleryData.map((image) => {
            const isEditing = editingId === image.id;
            return (
              <div key={image.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img src={image.image_url} alt={image.title} className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{image.title}</h3>
                      <p className="text-xs text-gray-500">{image.category} • Shape: {image.shape || 'medium_square'} ({image.width || 4}x{image.height || 3})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            if (editingId) updateItemProperty(editingId, editForm);
                            setEditingId(null);
                          }}
                          className="px-3 py-1.5 text-xs bg-green-600 text-white font-medium rounded-lg"
                        >
                          Done
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs text-gray-600">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(image.id);
                            setEditForm({ ...image });
                          }}
                          className="px-3 py-1.5 text-xs text-blue-600 font-medium inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Metadata
                        </button>
                        <button
                          onClick={() => removeImage(image.id)}
                          className="px-3 py-1.5 text-xs text-red-600 font-medium inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="p-5 space-y-4 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={editForm.category || ''}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}