
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Loader2, UploadCloud, File, X, ClipboardList, Type,
  Eye, Edit, Trash2, Plus, Search, RefreshCw,
  Building2, Factory, Gauge, MapPin, Trophy,
  Calendar, Clock, FileText, Sparkles
} from 'lucide-react';

// ==================================================================================
// API SERVICE (No changes here)
// ==================================================================================
const API_BASE_URL = 'http://localhost:8000/';

const apiService = {
  async apiCall(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = new Headers({ 'Content-Type': 'application/json', ...options.headers });
    if (token) headers.append('Authorization', `Bearer ${token}`);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      const errorMessage = Object.values(errorData).flat().join(' ') || `API Error: ${res.status}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    if (res.status === 204) return null;
    return res.json();
  },

  async formCall(endpoint: string, method: 'POST' | 'PUT', formData: FormData) {
    const token = localStorage.getItem('accessToken');
    const headers = new Headers();
    if (token) headers.append('Authorization', `Bearer ${token}`);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, { method, body: formData, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      const errorMessage = Object.values(errorData).flat().join(' ') || `API Error: ${res.status}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    return res.json();
  },

  fetchDepartments: () => apiService.apiCall('departments/'),
  fetchLines: () => apiService.apiCall('lines/'),
  fetchSublines: () => apiService.apiCall('sublines/'),
  fetchStations: () => apiService.apiCall('stations/'),
  fetchLevels: () => apiService.apiCall('levels/'),

  fetchQuestionPapers: () => apiService.apiCall('questionpapers/'),
  createQuestionPaper: (form: FormData) => apiService.formCall('questionpapers/', 'POST', form),
  updateQuestionPaper: (id: number, form: FormData) => apiService.formCall(`questionpapers/${id}/`, 'PUT', form),
  deleteQuestionPaper: (id: number) => apiService.apiCall(`questionpapers/${id}/`, { method: 'DELETE' }),
};

// ==================================================================================
// TYPES (No changes here)
// ==================================================================================
interface SelectOption { id: number; name: string; }
interface FormOptions {
  departments: SelectOption[];
  lines: SelectOption[];
  sublines: SelectOption[];
  stations: SelectOption[];
  levels: SelectOption[];
}
interface QuestionPaperFormData {
  question_paper_name: string;
  department: string;
  line: string;
  subline: string;
  station: string;
  level: string;
  file: File | null;
}
interface QuestionPaper {
  question_paper_id: number;
  question_paper_name: string;
  department: SelectOption;
  line: SelectOption;
  subline: SelectOption;
  station: SelectOption;
  level: SelectOption;
  file: string | null;
  created_at: string;
  updated_at: string;
}
interface RawQuestionPaper {
  question_paper_id: number;
  question_paper_name: string;
  department: number;
  line: number;
  subline: number;
  station: number;
  level: number;
  file: string | null;
  created_at: string;
  updated_at: string;
}

// ==================================================================================
// UI HELPERS (Enhanced styling)
// ==================================================================================
const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  return <Loader2 className={`animate-spin text-indigo-600 ${sizeClasses[size]}`} />;
};

const TextInputWithIcon = ({
  id, name, placeholder, value, onChange, icon: Icon,
}: {
  id: string; name: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
}) => (
  <div className="group">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
      {name.replace(/_/g, ' ')}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
      </div>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 pl-10 border-2 rounded-lg shadow-sm transition-all duration-200 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 hover:border-gray-300"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const CustomSelectInput = ({
  name, label, value, options, onChange, loading, icon: Icon, disabled = false,
}: {
  name: string; label: string; value: string; options: SelectOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loading: boolean; icon?: React.ElementType; disabled?: boolean;
}) => (
  <div className="group">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={loading || disabled}
        className={`w-full p-3 ${Icon ? 'pl-10' : ''} border-2 rounded-lg shadow-sm transition-all duration-200 appearance-none cursor-pointer
          ${loading || disabled 
            ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' 
            : 'bg-white border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
          }`}
      >
        <option value="" disabled>{`Select a ${label}`}</option>
        {options.map((option) => (
          <option key={`opt-${name}-${option.id}`} value={String(option.id)}>
            {option.name}
          </option>
        ))}
      </select>
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  </div>
);

// ==================================================================================
// QuestionPaperCard (Enhanced styling)
// ==================================================================================
const QuestionPaperCard = ({ 
  paper, 
  onEdit, 
  onDelete, 
}: { 
  paper: QuestionPaper; 
  onEdit: (p: QuestionPaper) => void; 
  onDelete: (id: number) => void; 
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden group">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 truncate flex-1 group-hover:text-indigo-600 transition-colors">
          {paper.question_paper_name}
        </h3>
        <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(paper)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(paper.question_paper_id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium">{paper.department?.name || 'N/A'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-1.5 bg-purple-50 rounded-lg">
            <Factory className="h-4 w-4 text-purple-600" />
          </div>
          <span className="font-medium">{paper.line?.name || 'N/A'} / {paper.subline?.name || 'N/A'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-1.5 bg-green-50 rounded-lg">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <span className="font-medium">{paper.station?.name || 'N/A'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-1.5 bg-amber-50 rounded-lg">
            <Trophy className="h-4 w-4 text-amber-600" />
          </div>
          <span className="font-medium">{paper.level?.name || 'N/A'}</span>
        </div>

        {paper.file && (
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
            <a
              href={API_BASE_URL + paper.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline truncate"
            >
              View attached file
            </a>
          </div>
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
        <Calendar className="h-3.5 w-3.5" />
        <span>Created: {new Date(paper.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

// ==================================================================================
// HOOKS (No changes)
// ==================================================================================
const useFormOptions = () => { const [options, setOptions] = useState<FormOptions>({ departments: [], lines: [], sublines: [], stations: [], levels: [], }); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); useEffect(() => { const fetchAll = async () => { try { const [departments, lines, sublines, stations, levels] = await Promise.all([ apiService.fetchDepartments(), apiService.fetchLines(), apiService.fetchSublines(), apiService.fetchStations(), apiService.fetchLevels(), ]); setOptions({ departments: (departments || []).map((d: any) => ({ id: d.department_id, name: d.department_name })), lines: (lines || []).map((l: any) => ({ id: l.line_id, name: l.line_name })), sublines: (sublines || []).map((s: any) => ({ id: s.subline_id, name: s.subline_name })), stations: (stations || []).map((s: any) => ({ id: s.station_id, name: s.station_name })), levels: (levels || []).map((lv: any) => ({ id: lv.level_id, name: lv.level_name })), }); } catch (e) { setError('Failed to load dropdown options.'); } finally { setLoading(false); } }; fetchAll(); }, []); return { options, loading, error }; };
const useQuestionPapers = (options: FormOptions, optionsLoading: boolean) => { const [papers, setPapers] = useState<QuestionPaper[]>([]); const [rawPapers, setRawPapers] = useState<RawQuestionPaper[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const fetchPapers = async () => { setLoading(true); try { const data = await apiService.fetchQuestionPapers(); const results = Array.isArray(data) ? data : data?.results || []; setRawPapers(results); } catch (e) { setError('Failed to load question papers.'); } }; const deletePaper = async (id: number) => { try { await apiService.deleteQuestionPaper(id); await fetchPapers(); toast.success('Question paper deleted successfully'); } catch (e) { /* error handled in apiService */ } }; useEffect(() => { if (optionsLoading || rawPapers.length === 0) { if (rawPapers.length > 0) setLoading(true); return; } const deptMap = new Map(options.departments.map(o => [o.id, o])); const lineMap = new Map(options.lines.map(o => [o.id, o])); const subMap = new Map(options.sublines.map(o => [o.id, o])); const stationMap = new Map(options.stations.map(o => [o.id, o])); const levelMap = new Map(options.levels.map(o => [o.id, o])); // ... continuing from where it was cut off ...

const hydrated = rawPapers.map((r) => ({ ...r, department: deptMap.get(r.department) || { id: r.department, name: 'N/A' }, line: lineMap.get(r.line) || { id: r.line, name: 'N/A' }, subline: subMap.get(r.subline) || { id: r.subline, name: 'N/A' }, station: stationMap.get(r.station) || { id: r.station, name: 'N/A' }, level: levelMap.get(r.level) || { id: r.level, name: 'N/A' }, })) as QuestionPaper[]; setPapers(hydrated); setLoading(false); }, [rawPapers, options, optionsLoading]); useEffect(() => { fetchPapers(); }, []); return { papers, loading, error, refetch: fetchPapers, deletePaper }; };

// ==================================================================================
// MAIN COMPONENT (Enhanced styling)
// ==================================================================================
const QuestionPaperManager: React.FC = () => {
  const { options, loading: optionsLoading, error: optionsError } = useFormOptions();
  const { papers, loading: papersLoading, refetch, deletePaper } = useQuestionPapers(options, optionsLoading);

  const [activeTab, setActiveTab] = useState<'create' | 'list'>('list');
  const [editingPaper, setEditingPaper] = useState<QuestionPaper | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const initialFormData: QuestionPaperFormData = {
    question_paper_name: '',
    department: '',
    line: '',
    subline: '',
    station: '',
    level: '',
    file: null,
  };
  const [formData, setFormData] = useState<QuestionPaperFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (optionsError) toast.error(optionsError);
  }, [optionsError]);

  // ---------- SIMPLE handleChange: no special-case for any level ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const removeFile = () => setFormData(prev => ({ ...prev, file: null }));

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPaper(null);
  };

  // ---------- ALWAYS include location fields (no Level-1 conditional) ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const form = new FormData();
    
    form.append('question_paper_name', formData.question_paper_name);
    form.append('level', formData.level);

    // Always include location fields
    form.append('department', formData.department);
    form.append('line', formData.line);
    form.append('subline', formData.subline);
    form.append('station', formData.station);
    
    if (formData.file) form.append('file', formData.file);

    try {
      if (editingPaper) {
        if (!formData.file) form.delete('file');
        await apiService.updateQuestionPaper(editingPaper.question_paper_id, form);
        toast.success('Question paper updated successfully!');
      } else {
        await apiService.createQuestionPaper(form);
        toast.success('Question paper created successfully!');
      }
      resetForm();
      await refetch();
      setActiveTab('list');
    } catch (err) {
      // toasts already shown via apiService
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (paper: QuestionPaper) => {
    setFormData({
      question_paper_name: paper.question_paper_name,
      department: String(paper.department.id),
      line: String(paper.line.id),
      subline: String(paper.subline.id),
      station: String(paper.station.id),
      level: String(paper.level.id),
      file: null,
    });
    setEditingPaper(paper);
    setActiveTab('create');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question paper?')) {
      deletePaper(id);
    }
  };

  const filteredPapers = papers.filter((p: QuestionPaper) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.question_paper_name.toLowerCase().includes(q) ||
      p.department?.name.toLowerCase().includes(q);
    const matchesDept = !filterDepartment || String(p.department?.id) === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const isListLoading = papersLoading || optionsLoading;

  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Question Paper Manager
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Create, view, and manage question papers efficiently
                </p>
              </div>
            </div>
            <div className="flex bg-white rounded-xl p-1.5 shadow-lg border border-gray-100">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'list'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4" />
                View Papers
              </button>
              <button
                onClick={() => {
                  setActiveTab('create');
                  resetForm();
                }}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Plus className="h-4 w-4" />
                {editingPaper ? 'Edit Paper' : 'Create Paper'}
              </button>
            </div>
          </div>

          {activeTab === 'list' ? (
            <div className="space-y-6">
              {/* Enhanced Search Bar */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:flex-1 relative group">
                    <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search papers, departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                  <div className="w-full sm:w-64">
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">All Departments</option>
                      {options.departments.map((dept) => (
                        <option key={`filter-dept-${dept.id}`} value={String(dept.id)}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={refetch}
                    className="p-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                    title="Refresh"
                  >
                    <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </div>
              </div>

              {/* Enhanced Content Area */}
              {isListLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <Spinner size="lg" />
                  <p className="mt-4 text-gray-600 font-medium">Loading question papers...</p>
                </div>
              ) : filteredPapers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Question Papers Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchTerm || filterDepartment
                      ? 'Try adjusting your search or filters'
                      : 'Create your first question paper to get started'}
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('create');
                      resetForm();
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Paper
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPapers.map((paper) => (
                    <QuestionPaperCard
                      key={`paper-${paper.question_paper_id}`}
                      paper={paper}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {editingPaper ? 'Edit Question Paper' : 'Create New Question Paper'}
                  </h2>
                  <p className="text-indigo-100">
                    {editingPaper ? `Editing: ${editingPaper.question_paper_name}` : 'Fill out the details below to create a new question paper'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <TextInputWithIcon
                        id="question_paper_name"
                        name="question_paper_name"
                        value={formData.question_paper_name}
                        onChange={handleChange}
                        placeholder="e.g., Safety Assessment - Level 2"
                        icon={Type}
                      />
                    </div>

                    <CustomSelectInput
                      label="Level"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      options={options.levels}
                      loading={optionsLoading}
                      icon={Trophy}
                    />

                    <CustomSelectInput
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      options={options.departments}
                      loading={optionsLoading}
                      icon={Building2}
                    />

                    <CustomSelectInput
                      label="Line"
                      name="line"
                      value={formData.line}
                      onChange={handleChange}
                      options={options.lines}
                      loading={optionsLoading}
                      icon={Factory}
                    />

                    <CustomSelectInput
                      label="Subline"
                      name="subline"
                      value={formData.subline}
                      onChange={handleChange}
                      options={options.sublines}
                      loading={optionsLoading}
                      icon={Gauge}
                    />

                    <CustomSelectInput
                      label="Station"
                      name="station"
                      value={formData.station}
                      onChange={handleChange}
                      options={options.stations}
                      loading={optionsLoading}
                      icon={MapPin}
                    />

                    {/* Enhanced File Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload File (Optional)
                      </label>
                      {formData.file ? (
                        <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-xl bg-green-50 group hover:border-green-300 transition-all duration-200">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <File className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700 truncate">
                                {formData.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-2 rounded-lg hover:bg-red-100 transition-all duration-200 group-hover:scale-110"
                          >
                            <X className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-400 transition-all duration-200 bg-gray-50 hover:bg-indigo-50 group cursor-pointer">
                          <div className="space-y-2 text-center">
                            <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <UploadCloud className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOCX, XLSX up to 10MB</p>
                          </div>
                        </div>
                      )}
                      {editingPaper && !formData.file && editingPaper.file && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            Current file:{' '}
                            <a
                              href={API_BASE_URL + editingPaper.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                              {editingPaper.file.split('/').pop()}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Form Actions */}
                  <div className="flex items-center justify-between gap-4 mt-10 pt-8 border-t-2 border-gray-100">
                    <div className="text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        Select level and location as needed
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className="py-3 px-6 text-sm font-semibold text-gray-700 bg-white rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || optionsLoading}
                        className="inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:scale-105 disabled:transform-none"
                      >
                        {isSubmitting && <Spinner size="sm" />}
                        <span className={isSubmitting ? 'ml-2' : ''}>
                          {isSubmitting
                            ? (editingPaper ? 'Updating...' : 'Creating...')
                            : (editingPaper ? 'Update Paper' : 'Create Paper')}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionPaperManager;
