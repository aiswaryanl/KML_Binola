import React, { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
// import { Navbar } from '../../../organisms/Navbar/Navbar'; // Assuming you have a Navbar

// --- Interfaces ---
interface Batch { batch_id: string; }
interface User {
    id: number;
    first_name: string;
    attendances: { [day: number]: 'present' | 'absent' };
}
interface AttendanceDetailData {
    batch_id: string;
    next_training_day_to_mark: number | null; // Kept for compatibility, but not used for locking
    is_completed: boolean;
    users: User[];
}
interface Day {
    days_id: number;
    day: string;
    level: number;
}

const AttendancePage = () => {
    // --- State ---
    const [viewMode, setViewMode] = useState<'active' | 'past'>('active');
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string>('');

    const [users, setUsers] = useState<User[]>([]);
    const [isBatchCompleted, setIsBatchCompleted] = useState<boolean>(false);
    const [days, setDays] = useState<Day[]>([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Fetch Days on component mount ---
    useEffect(() => {
        const fetchDays = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/days/');
                if (!response.ok) throw new Error('Failed to fetch days.');
                const daysData: Day[] = await response.json();
                setDays(daysData.sort((a, b) => a.days_id - b.days_id)); // Ensure days are sorted
            } catch (err) {
                console.error('Error fetching days:', err);
                setError('Could not load training day configuration.');
            }
        };
        fetchDays();
    }, []);

    // --- Fetch Batches when viewMode changes ---
    useEffect(() => {
        const fetchBatches = async () => {
            setLoading(true);
            setError(null);
            setBatches([]);
            setSelectedBatch('');
            const endpoint = viewMode === 'active' ? 'active' : 'past';
            try {
                const response = await fetch(`http://127.0.0.1:8000/training-batches/${endpoint}/`);
                if (!response.ok) throw new Error('Failed to fetch batches.');
                const data: Batch[] = await response.json();
                setBatches(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, [viewMode]);

    // --- Fetch Batch Details when a batch is selected ---
    useEffect(() => {
        if (!selectedBatch) {
            setUsers([]);
            setIsBatchCompleted(false);
            return;
        }
        const fetchAttendanceDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://127.0.0.1:8000/attendance-detail/${selectedBatch}/`);
                if (!response.ok) throw new Error(`Failed to fetch details for batch ${selectedBatch}.`);
                const data: AttendanceDetailData = await response.json();
                // FIX: Set all relevant state from the API response
                setUsers(data.users);
                setIsBatchCompleted(data.is_completed);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttendanceDetails();
    }, [selectedBatch]);

    // --- Memoized Filtering ---
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    // --- Event Handlers ---
    const handleAttendanceChange = (userId: number, day: number, status: 'present' | 'absent') => {
        setUsers(currentUsers =>
            currentUsers.map(user => {
                if (user.id === userId) {
                    const newAttendances = { ...user.attendances };
                    if (newAttendances[day] === status) {
                        delete newAttendances[day]; // Toggle off by deleting the key
                    } else {
                        newAttendances[day] = status;
                    }
                    return { ...user, attendances: newAttendances };
                }
                return user;
            })
        );
    };

    // REVISED: Generic handleSubmit for all changes
    const handleSubmit = async () => {
        // Collect all attendance entries that have been set in the state
        const payload = users.flatMap((user) =>
            Object.entries(user.attendances).map(([day, status]) => ({
                user: user.id,
                batch: selectedBatch,
                day_number: parseInt(day, 10),
                status: status,
            }))
        );

        if (payload.length === 0) {
            alert("No changes to submit.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/attendances/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || "Failed to save attendance.");
            }

            alert(responseData.message || "Attendance records have been saved successfully!");

            // Backend now handles auto-completion. We just need to refresh the data.
            // A simple way is to re-select the batch, which triggers the fetch effect.
            // If the batch was completed, it will disappear from the 'active' list upon next refresh.
            const currentBatchSelection = selectedBatch;
            setSelectedBatch(''); // Clear selection
            setTimeout(() => {
                // If the batch might still be active, re-select it to refresh data.
                // Or simply switch to the main view to force a list refresh.
                if (viewMode === 'active') {
                    setViewMode('past'); // Toggle to force a re-render and list refresh
                    setViewMode('active');
                }
                // set selected batch again if you want to stay on the same page
                // setSelectedBatch(currentBatchSelection);
            }, 100);


        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* <Navbar /> */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Header and Batch Selection */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Training Attendance</h1>
                                <p className="mt-1 text-gray-600">Select a batch to manage attendance.</p>
                            </div>
                            <div className="flex p-1 bg-gray-200 rounded-lg">
                                <button onClick={() => setViewMode('active')} className={`px-4 py-1 rounded-md text-sm font-medium ${viewMode === 'active' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}>Active Batches</button>
                                <button onClick={() => setViewMode('past')} className={`px-4 py-1 rounded-md text-sm font-medium ${viewMode === 'past' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}>Past Batches</button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label htmlFor="batch-select" className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
                            <select id="batch-select" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="block w-full max-w-sm p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">{loading ? 'Loading...' : `-- Select a ${viewMode} batch --`}</option>
                                {batches.map((batch) => (<option key={batch.batch_id} value={batch.batch_id}>{batch.batch_id}</option>))}
                            </select>
                        </div>
                    </div>

                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert"><p>{error}</p></div>}

                    {selectedBatch && (
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative w-full md:w-1/3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="text" placeholder="Search employees..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 text-center font-medium text-gray-700">
                                {isBatchCompleted ? `Viewing completed attendance for ${selectedBatch}` : `Editing attendance for ${selectedBatch}`}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                            {days.map(day => (
                                                <th key={day.days_id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{day.day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr><td colSpan={days.length + 1} className="text-center py-8">Loading users...</td></tr>
                                        ) : filteredUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.first_name}</td>
                                                {days.map(day => {
                                                    const dayId = day.days_id;
                                                    const status = user.attendances[dayId];
                                                    // REVISED LOGIC: If batch is active and not completed, all cells are editable.
                                                    const isEditable = viewMode === 'active' && !isBatchCompleted;

                                                    return (
                                                        <td key={dayId} className="px-6 py-4 text-center">
                                                            {isEditable ? (
                                                                <div className="flex justify-center items-center space-x-2">
                                                                    <button onClick={() => handleAttendanceChange(user.id, dayId, 'present')} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${status === 'present' ? 'bg-green-500 text-white shadow' : 'bg-gray-200 hover:bg-green-200'}`}>P</button>
                                                                    <button onClick={() => handleAttendanceChange(user.id, dayId, 'absent')} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${status === 'absent' ? 'bg-red-500 text-white shadow' : 'bg-gray-200 hover:bg-red-200'}`}>A</button>
                                                                </div>
                                                            ) : status ? ( // For past/completed batches, show static icon
                                                                <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold text-white ${status === 'present' ? 'bg-green-400' : 'bg-red-400'}`}>
                                                                    {status === 'present' ? 'P' : 'A'}
                                                                </span>
                                                            ) : ( // For past batches where attendance was not marked
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {viewMode === 'active' && !isBatchCompleted && (
                                <div className="p-4 border-t border-gray-200 flex justify-end">
                                    <button onClick={handleSubmit} disabled={isSubmitting || users.length === 0} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:bg-gray-400">
                                        {isSubmitting ? 'Submitting...' : 'Save All Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AttendancePage;