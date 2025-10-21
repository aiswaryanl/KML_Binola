// src/components/CriteriaManagement.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Plus, Trash2, Book, AlertTriangle } from 'lucide-react';
import axios from 'axios';

// ====================================================================================
// --- AXIOS API CONFIGURATION ---
// ====================================================================================
const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true, // IMPORTANT: This sends cookies (like the admin session) with requests
});

// ====================================================================================
// --- TYPE DEFINITIONS ---
// ====================================================================================
interface Level {
    level_id: number;
    level_name: string;
}

interface Criterion {
    id: number;
    level: number;
    criteria_text: string;
}

// ====================================================================================
// --- REACT COMPONENT ---
// ====================================================================================
function CriteriaManagement() {
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [newCriterionText, setNewCriterionText] = useState('');
    const [selectedLevelId, setSelectedLevelId] = useState<number | string>('');
    const [displayOrder, setDisplayOrder] = useState('0'); // Use string for input field
    const [isActive, setIsActive] = useState(true);

    // Fetch initial data (levels and existing criteria)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [criteriaRes, levelsRes] = await Promise.all([
                    api.get<Criterion[]>('criteria/'),
                    api.get<Level[]>('levels/')
                ]);
                setCriteria(criteriaRes.data);
                setLevels(levelsRes.data);
                if (levelsRes.data.length > 0) {
                    setSelectedLevelId(levelsRes.data[0].level_id);
                }
            } catch (err: any) {
                if (err.response?.status === 403) {
                    setError("Permission Denied. Please ensure you are logged in as a Django administrator.");
                } else {
                    setError("Failed to fetch data. The API might be down.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCriterionText || !selectedLevelId) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const payload = {
                criteria_text: newCriterionText,
                level: selectedLevelId,
                display_order: Number(displayOrder), // Convert string back to number
                is_active: isActive,
            };
            const response = await api.post<Criterion>('criteria/', payload);

            // Add new criterion to the list and resort it
            setCriteria(prev => [...prev, response.data].sort((a, b) => a.level - b.level));
            setNewCriterionText('');
            setDisplayOrder('0');
            setIsActive(true); // Clear form
        } catch (err: any) {
            alert(`Failed to add criterion: ${err.response?.data?.detail || err.message}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this criterion?')) {
            return;
        }
        try {
            await api.delete(`criteria/${id}/`);
            setCriteria(prev => prev.filter(c => c.id !== id));
        } catch (err: any) {
            alert(`Failed to delete criterion: ${err.response?.data?.detail || err.message}`);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3"><Book /> Criteria Management</h1>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold flex items-center gap-2"><AlertTriangle size={20} /> Error</p>
                    <p>{error}</p>
                </div>
            )}

            {/* --- Add New Criterion Form --- */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><Plus /> Add New Criterion</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    {/* MODIFIED: Changed grid layout to accommodate new fields */}
                    <div className="md:col-span-3">
                        <label htmlFor="criterionText" className="block text-sm font-medium text-gray-600 mb-1">Criterion Text</label>
                        <input
                            id="criterionText"
                            type="text"
                            value={newCriterionText}
                            onChange={(e) => setNewCriterionText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Awareness of the part produced..."
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-600 mb-1">Level</label>
                        <select
                            id="level"
                            value={selectedLevelId}
                            onChange={(e) => setSelectedLevelId(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>Select a Level</option>
                            {levels.map(level => (
                                <option key={level.level_id} value={level.level_id}>
                                    {level.level_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ADDED: Display Order Input */}
                    <div>
                        <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-600 mb-1">Order</label>
                        <input
                            id="displayOrder"
                            type="number"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* ADDED: Submit button and Is Active Checkbox */}
                    <div className="md:col-span-5 flex justify-between items-center mt-2">
                        <div className="flex items-center">
                            <input
                                id="isActive"
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Is Active
                            </label>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                            Add Criterion
                        </button>
                    </div>
                </form>
            </div>

            {/* --- Existing Criteria List --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><List /> Existing Criteria</h2>
                <div className="space-y-3">
                    {criteria.length > 0 ? criteria.map(crit => (
                        <div key={crit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                            <div>
                                <span className="font-bold text-blue-700 mr-2">
                                    {levels.find(l => l.level_id === crit.level)?.level_name || 'Unknown Level'}:
                                </span>
                                <span className="text-gray-800">{crit.criteria_text}</span>
                            </div>
                            <button onClick={() => handleDelete(crit.id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )) : <p className="text-gray-500">No criteria found.</p>}
                </div>
            </div>
        </div>
    );
}

export default CriteriaManagement;