import React, { useState, useEffect } from 'react';
import { Settings, Palette, Grid, PieChart as PieChartIcon, Save, RotateCcw, X, Eye } from 'lucide-react';

interface SkillMatrixSettings {
  displayType: 'piechart' | 'levelblock';
  colors: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
}

const defaultSettings: SkillMatrixSettings = {
  displayType: 'piechart',
  colors: {
    level1: '#ef4444', // red
    level2: '#f59e0b', // amber
    level3: '#3b82f6', // blue
    level4: '#10b981'  // emerald
  }
};

// Fixed grey colors for preview module
const previewColors = {
  level1: '#6b7280', // grey
  level2: '#6b7280', // grey
  level3: '#6b7280', // grey
  level4: '#6b7280'  // grey
};

// API configuration - update with your actual API base URL
const API_BASE_URL = 'http://127.0.0.1:8000'; // Update this URL

// API service functions
const apiService = {
  fetchLevelColors: async () => {
    const response = await fetch(`${API_BASE_URL}/levelcolours/`);
    if (!response.ok) throw new Error('Failed to fetch colors');
    return await response.json();
  },

  saveLevelColors: async (colors: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}/levelcolours/bulk_update/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colors }),
    });
    if (!response.ok) throw new Error('Failed to save colors');
    return await response.json();
  },

  resetToDefaults: async () => {
    const response = await fetch(`${API_BASE_URL}/levelcolours/reset_to_defaults/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to reset colors');
    return await response.json();
  },

  fetchDisplayShape: async (): Promise<{ display_shape: string }> => {
    const response = await fetch(`${API_BASE_URL}/displaysetting/`);
    if (!response.ok) throw new Error('Failed to fetch display shape');
    return await response.json();
  },

  saveDisplayShape: async (shape: string) => {
    const response = await fetch(`${API_BASE_URL}/displaysetting/1/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_shape: shape }),
    });
    if (!response.ok) throw new Error('Failed to save display shape');
    return await response.json();
  },
};

// PieChart component for rendering pie chart display
const PieChart = ({ level, color, size = 32 }: { level: number; color: string; size?: number }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Draw base circle
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#f3f4f6';
    ctx.fill();
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw skill level pie segment
    if (level > 0) {
      const fillPercent = level / 4;
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2);
      ctx.arc(size / 2, size / 2, size / 2 - 2, -Math.PI / 2, Math.PI * 2 * fillPercent - Math.PI / 2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  }, [level, color, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

// LevelBlock component for rendering level block display
const LevelBlock: React.FC<{
  level: number;
  color: string;
}> = ({ level, color }) => {
  const labels = [1, 2, 4, 3];
  return (
    <div className="w-fit border">
      <div className="grid grid-cols-2 border border-black text-[10px] font-semibold">
        {labels.map((label) => (
          <div
            key={label}
            className="w-6 h-6 flex items-center justify-center border border-black"
            style={{
              backgroundColor: label <= level ? color : 'white',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillMatrixSettings: React.FC = () => {
  const [settings, setSettings] = useState<SkillMatrixSettings>(defaultSettings);
  const [shape, setShape] = useState<'piechart' | 'levelblock'>(defaultSettings.displayType);
  const [pendingShape, setPendingShape] = useState<'piechart' | 'levelblock'>(defaultSettings.displayType); // New state for pending shape
  const [activeTab, setActiveTab] = useState<'preview' | 'display' | 'colors'>('preview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Load colors
        const colorsResponse = await apiService.fetchLevelColors();
        if (colorsResponse && Array.isArray(colorsResponse)) {
          const colorsFromBackend: any = {};
          colorsResponse.forEach((item: any) => {
            if (item.level_number) {
              colorsFromBackend[`level${item.level_number}`] = item.colour_code;
            }
          });
          setSettings(prev => ({
            ...prev,
            colors: { ...prev.colors, ...colorsFromBackend }
          }));
        }

        // Load shape
        const shapeResponse = await apiService.fetchDisplayShape();
        if (shapeResponse && (shapeResponse.display_shape === 'piechart' || shapeResponse.display_shape === 'levelblock')) {
          setShape(shapeResponse.display_shape);
          setPendingShape(shapeResponse.display_shape); // Initialize pending shape
          setSettings(prev => ({ ...prev, displayType: shapeResponse.display_shape }));
        }
      } catch (err) {
        setError('Failed to load settings from server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save colors
  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiService.saveLevelColors(settings.colors);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save display shape - only saves when button is clicked
  const handleSaveDisplaySettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiService.saveDisplayShape(pendingShape);
      setShape(pendingShape);
      setSettings(prev => ({ ...prev, displayType: pendingShape }));
      setSuccess('Display shape saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save display shape');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset colors to default including resetting display shape to default to piechart
  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all colors to default values?')) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resetColorsResponse = await apiService.resetToDefaults();
      if (resetColorsResponse && Array.isArray(resetColorsResponse)) {
        const colorsFromBackend: any = {};
        resetColorsResponse.forEach((item: any) => {
          if (item.level_number) {
            colorsFromBackend[`level${item.level_number}`] = item.colour_code;
          }
        });
        setSettings(prev => ({
          ...prev,
          colors: { ...defaultSettings.colors, ...colorsFromBackend }
        }));

        // Also reset display shape to default 'piechart' both state and backend
        setShape('piechart');
        setPendingShape('piechart');
        setSettings(prev => ({ ...prev, displayType: 'piechart' }));
        await apiService.saveDisplayShape('piechart');

        setSuccess('Colors and display shape reset to default values!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to reset colors. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle color input change
  const handleColorChange = (level: keyof SkillMatrixSettings['colors'], color: string) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [level]: color,
      }
    }));
  };

  // Change display type - only updates pending state, doesn't save
  const changeDisplayType = (newType: 'piechart' | 'levelblock') => {
    setPendingShape(newType);
  };

  // Preview Skill display component with fixed grey colors
  const PreviewSkillDisplay = ({ level }: { level: number }) => {
    const color = previewColors[`level${level}` as keyof typeof previewColors];
    
    if (settings.displayType === 'levelblock') {
      return <LevelBlock level={level} color={color} />;
    }
    return <PieChart level={level} color={color} />;
  };

  // Skill display component with dynamic colors and shape
  const SkillDisplay = ({ level }: { level: number }) => {
    const color = settings.colors[`level${level}` as keyof typeof settings.colors];
    
    if (settings.displayType === 'levelblock') {
      return <LevelBlock level={level} color={color} />;
    }
    return <PieChart level={level} color={color} />;
  };

  const tabs = [
    { id: 'preview', name: 'Preview', icon: Eye },
    { id: 'display', name: 'Display Settings', icon: Grid },
    { id: 'colors', name: 'Color Settings', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skill Matrix Display System</h1>
          <p className="text-lg text-gray-600">Visualize and customize employee skill levels with our intuitive display system</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex">
              <X className="w-5 h-5 mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            <div className="flex">
              <Save className="w-5 h-5 mr-2 mt-0.5" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Processing...</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center space-x-2`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}

        {/* Preview Tab - Uses grey colors */}
        {activeTab === 'preview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Current Display</h2>
                <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {settings.displayType === 'piechart' ? 'Pie Chart' : 'Level Blocks'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(level => (
                  <div key={level} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-center mb-4">
                      <PreviewSkillDisplay level={level} />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">Level {level}</div>
                    <div className="text-sm text-gray-600">
                      {level === 1 && 'Learner'}
                      {level === 2 && 'Practitioner'}
                      {level === 3 && 'Expert'}
                      {level === 4 && 'Master'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Display Settings Tab */}
        {activeTab === 'display' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Grid className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Display Settings</h2>
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-xl border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div
                className={`p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  pendingShape === 'piechart'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => changeDisplayType('piechart')}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <PieChartIcon className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-center text-xl text-gray-900 mb-2">Pie Chart</h3>
                <p className="text-gray-600 text-center mb-6">Circular progress display with visual fill</p>
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className="text-center">
                      <PieChart 
                        level={level} 
                        color={settings.colors[`level${level}` as keyof typeof settings.colors]} 
                      />
                      <div className="text-xs text-gray-500 mt-1">L{level}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  pendingShape === 'levelblock'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => changeDisplayType('levelblock')}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <Grid className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-center text-xl text-gray-900 mb-2">Level Blocks</h3>
                <p className="text-gray-600 text-center mb-6">2x2 grid display with numbered blocks</p>
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className="text-center">
                      <LevelBlock 
                        level={level} 
                        color={settings.colors[`level${level}` as keyof typeof settings.colors]} 
                      />
                      <div className="text-xs text-gray-500 mt-1">L{level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleSaveDisplaySettings}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Save className="w-5 h-5" />
                <span>Save Display Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Color Settings Tab */}
        {activeTab === 'colors' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Palette className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Color Settings</h2>
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-xl border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="bg-white p-3 rounded-xl shadow-sm border">
                        <div className="text-lg font-bold text-gray-900">Level {level}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {level === 1 && 'Learner'}
                          {level === 2 && 'Practitioner'} 
                          {level === 3 && 'Expert'}
                          {level === 4 && 'Master'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {level === 1 && 'Under training and guidance'}
                          {level === 2 && 'Works independently per SOP'}
                          {level === 3 && 'Works independently with expertise'}
                          {level === 4 && 'Can train and mentor others'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        {/* Preview */}
                        <div className="bg-white p-3 rounded-xl shadow-sm border">
                          {settings.displayType === 'piechart' ? (
                            <PieChart 
                              level={level} 
                              color={settings.colors[`level${level}` as keyof typeof settings.colors]} 
                            />
                          ) : (
                            <LevelBlock 
                              level={level} 
                              color={settings.colors[`level${level}` as keyof typeof settings.colors]} 
                            />
                          )}
                        </div>
                        {/* Color input */}
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={settings.colors[`level${level}` as keyof typeof settings.colors]}
                            onChange={(e) => handleColorChange(`level${level}` as keyof typeof settings.colors, e.target.value)}
                            className="w-12 h-10 rounded-xl border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                          />
                          <div className="text-sm">
                            <div className="font-mono text-gray-700">
                              {settings.colors[`level${level}` as keyof typeof settings.colors]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Color Settings</span>
                </button>
                </div>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default SkillMatrixSettings;