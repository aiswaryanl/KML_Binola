import React, { useEffect, useState } from 'react';
import { Building, Target, Users, Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

// Mock API functions for demo purposes
const fetchLevels = async () => [
  { id: 1, name: 'Beginner', level_name: 'Level 1' },
  { id: 2, name: 'Intermediate', level_name: 'Level 2' },
  { id: 3, name: 'Advanced', level_name: 'Level 3' },
  { id: 4, name: 'Expert', level_name: 'Level 4' }
];

const fetchStations = async () => [
  { id: 1, name: 'Assembly Station A', station_name: 'Station A' },
  { id: 2, name: 'Quality Control', station_name: 'QC Station' },
  { id: 3, name: 'Packaging Unit', station_name: 'Package Station' },
  { id: 4, name: 'Testing Department', station_name: 'Test Station' }
];

const createStationRequirement = async (payload: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Station requirement created:', payload);
};

const StationRequirementPage: React.FC = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);

  const [stationId, setStationId] = useState<number | ''>('');
  const [levelId, setLevelId] = useState<number | ''>('');
  const [minOperators, setMinOperators] = useState<number | ''>('');

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [st, lv] = await Promise.all([fetchStations(), fetchLevels()]);
        setStations(st || []);
        setLevels(lv || []);
      } catch {
        setError('Failed to load dropdown data');
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setStationId('');
    setLevelId('');
    setMinOperators('');
    setMessage(null);
    setError(null);
  };

  const onSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!stationId || !minOperators) {
      setError('Please select a station and enter minimum operators');
      return;
    }

    const payload: any = {
      station: Number(stationId),
      minimum_operators_required: Number(minOperators),
    };
    if (levelId) payload.minimum_level_required = Number(levelId);

    try {
      setSubmitting(true);
      await createStationRequirement(payload);
      setMessage('Station requirement saved successfully');
      resetForm();
    } catch (e: any) {
      setError(e?.message || 'Failed to save station requirement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Station Requirements Management</h1>
          <p className="text-lg text-gray-600">Configure minimum staffing requirements for operational efficiency</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <Building className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Create Station Requirement</h2>
          </div>

          <div className="space-y-6">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Station Selection */}
              <div className="space-y-2">
                <label htmlFor="station" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  Station
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="station"
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a station</option>
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.station_name || `Station ${s.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Selection */}
              <div className="space-y-2">
                <label htmlFor="level" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Target className="h-4 w-4 mr-2 text-gray-500" />
                  Minimum Level Required
                </label>
                <select
                  id="level"
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Any level (Optional)</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name || l.level_name || `Level ${l.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operators Input */}
              <div className="space-y-2">
                <label htmlFor="operators" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  Minimum Operators
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="operators"
                  type="number"
                  min={1}
                  value={minOperators}
                  onChange={(e) => setMinOperators(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter minimum operators required"
                  required
                />
              </div>
            </div>

            {/* Status Messages */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">{message}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <RotateCcw className="inline h-5 w-5 mr-2" />
                Reset Form
              </button>
              
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="inline h-5 w-5 mr-2" />
                    Save Requirement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationRequirementPage;