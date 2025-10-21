
// import React, { useEffect, useState } from 'react';
// import { ChevronDown, Users, Trophy, TrendingUp, Clock, Award, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

// interface Entry {
//   employee_id: string;
//   name: string;
//   section: string;
//   skill: string;
//   department: string;
//   marks: number;
//   percentage: number;
//   level_name?: string;
//   passed: boolean;
// }

// // Constants for table fields
// const TABLE_FIELDS = {
//   RANK: 'Rank',
//   EMPLOYEE: 'Employee',
//   DEPARTMENT: 'Department',
//   SKILL: 'Skill/Station',
//   SCORE: 'Score',
//   PERCENTAGE: 'Percentage',
//   RESULT: 'Result'
// };

// // Filter options
// const FILTER_OPTIONS = {
//   ALL: 'all',
//   PASSED: 'passed',
//   FAILED: 'failed'
// };

// // API Configuration - Update this with your backend URL
// const API_BASE_URL = 'http://localhost:8000';

// const QuizResults: React.FC = () => {
//   const [sessions, setSessions] = useState<string[]>([]);
//   const [selectedSession, setSelectedSession] = useState<string>('');
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loadingSessions, setLoadingSessions] = useState(true);
//   const [loadingScores, setLoadingScores] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [resultFilter, setResultFilter] = useState<string>(FILTER_OPTIONS.ALL);

//   // Fetch available test sessions
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         setLoadingSessions(true);
//         setError(null);
        
//         const response = await fetch(`${API_BASE_URL}/api/past-sessions/`);
        
//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error('Sessions endpoint not found');
//           } else if (response.status === 500) {
//             throw new Error('Server error while fetching sessions');
//           }
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('Sessions data received:', data);
        
//         if (Array.isArray(data) && data.length > 0) {
//           setSessions(data);
//           setSelectedSession(data[0]);
//           setError(null);
//         } else {
//           setError('No test sessions found. Please create some test sessions first.');
//           setSessions([]);
//         }
//       } catch (err) {
//         console.error('Error fetching sessions:', err);
//         setError(`Failed to load sessions: ${err instanceof Error ? err.message : 'Unknown error'}`);
//         setSessions([]);
//       } finally {
//         setLoadingSessions(false);
//       }
//     };

//     fetchSessions();
//   }, []);

//   // Fetch scores for selected session
//   useEffect(() => {
//     if (!selectedSession) return;
    
//     const fetchScores = async () => {
//       try {
//         setLoadingScores(true);
//         setError(null);
        
//         const encodedSessionName = encodeURIComponent(selectedSession);
//         const response = await fetch(`${API_BASE_URL}/api/scores-by-session/${encodedSessionName}/`);
        
//         if (!response.ok) {
//           if (response.status === 404) {
//             throw new Error('No scores found for this session');
//           } else if (response.status === 500) {
//             throw new Error('Server error while fetching scores');
//           }
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('Scores data received:', data);
        
//         if (data.error) {
//           throw new Error(data.error);
//         }
        
//         if (Array.isArray(data)) {
//           const sortedEntries = data
//             .map((item: any) => ({
//               employee_id: String(item.employee_id || ''),
//               name: item.name || 'Unknown',
//               section: item.section || 'N/A',
//               skill: item.skill || 'N/A',
//               department: item.department || 'N/A',
//               marks: item.marks || 0,
//               percentage: parseFloat(item.percentage) || 0,
//               level_name: item.level_name || '',
//               passed: Boolean(item.passed)
//             }))
//             .sort((a, b) => b.percentage - a.percentage);
          
//           setEntries(sortedEntries);
//           setError(null);
//         } else {
//           setEntries([]);
//           setError('Invalid data format received from server');
//         }
//       } catch (err) {
//         console.error('Error fetching scores:', err);
//         setError(`Failed to load scores: ${err instanceof Error ? err.message : 'Unknown error'}`);
//         setEntries([]);
//       } finally {
//         setLoadingScores(false);
//       }
//     };

//     fetchScores();
//   }, [selectedSession]);

//   // Calculate stats using the passed field from backend
//   const totalParticipants = entries.length;
//   const passedCount = entries.filter(e => e.passed).length;
//   const averageMarks = entries.length > 0 ? (entries.reduce((sum, e) => sum + e.marks, 0) / entries.length) : 0;
//   const topPerformer = entries.length > 0 ? entries[0] : null;

//   // Filter entries based on search term and result filter
//   const filteredEntries = entries.filter(e => {
//     const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          e.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          e.skill.toLowerCase().includes(searchTerm.toLowerCase());
    
//     if (resultFilter === FILTER_OPTIONS.ALL) return matchesSearch;
//     if (resultFilter === FILTER_OPTIONS.PASSED) return matchesSearch && e.passed;
//     if (resultFilter === FILTER_OPTIONS.FAILED) return matchesSearch && !e.passed;
    
//     return matchesSearch;
//   });

//   if (loadingSessions) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4">
//           <div className="flex flex-col items-center space-y-6">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
//               <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-blue-400"></div>
//             </div>
//             <div className="text-center">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Sessions</h3>
//               <p className="text-gray-600">Please wait while we fetch your data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white shadow-lg border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
//                 <Trophy className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                   Quiz Results Dashboard
//                 </h1>
//                 <p className="text-gray-600 mt-1">Track performance and analyze results</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Session Selection */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
//             <div className="flex items-center space-x-3">
//               <Clock className="w-6 h-6 text-blue-600" />
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">Session Selection</h3>
//                 <p className="text-sm text-gray-600">Choose a quiz session to view results</p>
//               </div>
//             </div>
//             <div className="relative min-w-[250px]">
//               <select
//                 className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-6 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:shadow-lg transition-all cursor-pointer"
//                 value={selectedSession}
//                 onChange={e => setSelectedSession(e.target.value)}
//                 disabled={sessions.length === 0}
//               >
//                 {sessions.length === 0 ? (
//                   <option value="">No sessions available</option>
//                 ) : (
//                   sessions.map(session => (
//                     <option key={session} value={session}>{session}</option>
//                   ))
//                 )}
//               </select>
//               <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                 <ChevronDown className="w-5 h-5 text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         {entries.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Participants</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">{totalParticipants}</p>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-xl">
//                   <Users className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pass Rate</p>
//                   <p className="text-3xl font-bold text-green-600 mt-1">
//                     {totalParticipants > 0 ? ((passedCount / totalParticipants) * 100).toFixed(1) : '0.0'}%
//                   </p>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-xl">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Average Score</p>
//                   <p className="text-3xl font-bold text-purple-600 mt-1">{averageMarks.toFixed(1)}</p>
//                 </div>
//                 <div className="bg-purple-100 p-3 rounded-xl">
//                   <TrendingUp className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Top Score</p>
//                   <p className="text-3xl font-bold text-yellow-600 mt-1">{topPerformer?.marks || 0}</p>
//                 </div>
//                 <div className="bg-yellow-100 p-3 rounded-xl">
//                   <Award className="w-6 h-6 text-yellow-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results Section */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
//           <div className="px-8 py-6 border-b border-gray-200">
//             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
//                   <Trophy className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     Results for <span className="text-blue-600">{selectedSession || 'No Session'}</span>
//                   </h2>
//                   <p className="text-gray-600 mt-1">Detailed performance breakdown</p>
//                 </div>
//               </div>
//               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//                 {/* Result Filter */}
//                 <div className="relative min-w-[140px]">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
//                     <Filter className="w-4 h-4 text-gray-400" />
//                   </div>
//                   <select
//                     className="w-full appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
//                     value={resultFilter}
//                     onChange={e => setResultFilter(e.target.value)}
//                   >
//                     <option value={FILTER_OPTIONS.ALL}>All Results</option>
//                     <option value={FILTER_OPTIONS.PASSED}>Passed Only</option>
//                     <option value={FILTER_OPTIONS.FAILED}>Failed Only</option>
//                   </select>
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                     <ChevronDown className="w-4 h-4 text-gray-400" />
//                   </div>
//                 </div>
                
//                 {/* Search Bar */}
//                 <div className="relative min-w-[250px]">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                     <Search className="w-4 h-4 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search by name, ID, department, or skill..."
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="p-8">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
//                 <div className="flex items-center space-x-3">
//                   <XCircle className="w-6 h-6 text-red-500" />
//                   <div>
//                     <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
//                     <p className="text-red-600 mt-1">{error}</p>
//                     {error.includes('No test sessions found') && (
//                       <div className="mt-3 text-sm text-red-600">
//                         <p>Possible solutions:</p>
//                         <ul className="list-disc list-inside mt-2">
//                           <li>Create some test sessions first</li>
//                           <li>Check if the API endpoint is working: {API_BASE_URL}/api/past-sessions/</li>
//                           <li>Verify your database has Score records with test relationships</li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {loadingScores ? (
//               <div className="flex items-center justify-center py-16">
//                 <div className="flex flex-col items-center space-y-4">
//                   <div className="relative">
//                     <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
//                   </div>
//                   <p className="text-gray-600 font-medium">Loading scores...</p>
//                 </div>
//               </div>
//             ) : entries.length === 0 && !error ? (
//               <div className="text-center py-16">
//                 <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
//                 <p className="text-gray-600">No entries available for the selected session.</p>
//               </div>
//             ) : filteredEntries.length === 0 && entries.length > 0 ? (
//               <div className="text-center py-16">
//                 <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
//                   <Search className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
//                 <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
//               </div>
//             ) : (
//               <div className="overflow-hidden rounded-xl border border-gray-200">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full">
//                     <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           {TABLE_FIELDS.RANK}
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           {TABLE_FIELDS.EMPLOYEE}
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           {TABLE_FIELDS.DEPARTMENT}
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           {TABLE_FIELDS.SKILL}
//                         </th>
//                         <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           {TABLE_FIELDS.SCORE}
//                         </th>
//                         <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           {TABLE_FIELDS.PERCENTAGE}
//                         </th>
//                         <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                           {TABLE_FIELDS.RESULT}
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {filteredEntries.map((e, i) => {
//                         const passed = e.passed;
//                         const isTopPerformer = i === 0;
//                         const isTop3 = i < 3;

//                         return (
//                           <tr key={`${e.employee_id}-${i}`} className={`hover:bg-blue-50 transition-all duration-200 ${isTopPerformer ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center space-x-2">
//                                 {isTop3 && (
//                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-yellow-600'}`}>
//                                     {i + 1}
//                                   </div>
//                                 )}
//                                 {!isTop3 && (
//                                   <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
//                                     {i + 1}
//                                   </div>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center space-x-3">
//                                 <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                                   {e.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
//                                 </div>
//                                 <div>
//                                   <div className="text-sm font-semibold text-gray-900">{e.name}</div>
//                                   <div className="text-sm text-gray-500">ID: {e.employee_id}</div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                 {e.department}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                                 {e.skill}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                               <div className="text-lg font-bold text-gray-900">{e.marks}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                               <div className="flex items-center justify-center">
//                                 <div className="text-lg font-bold text-gray-900">{e.percentage.toFixed(1)}%</div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                               <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${passed ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
//                                 {passed ? (
//                                   <>
//                                     <CheckCircle className="w-4 h-4 mr-1" />
//                                     Pass
//                                   </>
//                                 ) : (
//                                   <>
//                                     <XCircle className="w-4 h-4 mr-1" />
//                                     Fail
//                                   </>
//                                 )}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizResults;


import React, { useEffect, useState } from 'react';
import { ChevronDown, Users, Trophy, TrendingUp, Clock, Award, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

// Interface for a single result entry
interface Entry {
  employee_id: string;
  name: string;
  section: string; // Retained for type consistency, but department is used for display
  department: string;
  skill: string;
  marks: number;
  percentage: number;
  level_name?: string;
  passed: boolean;
}

// Constants for table header fields
const TABLE_FIELDS = {
  RANK: 'Rank',
  EMPLOYEE: 'Employee',
  DEPARTMENT: 'Department',
  SKILL: 'Skill/Station',
  SCORE: 'Score',
  PERCENTAGE: 'Percentage',
  RESULT: 'Result'
};

// Constants for result filter options
const FILTER_OPTIONS = {
  ALL: 'all',
  PASSED: 'passed',
  FAILED: 'failed'
};

// API Configuration - Update this with your backend URL
const API_BASE_URL = 'http://localhost:8000';

const QuizResults: React.FC = () => {
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingScores, setLoadingScores] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<string>(FILTER_OPTIONS.ALL);

  // Effect to fetch available test sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoadingSessions(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/past-sessions/`);
        
        if (!response.ok) {
          if (response.status === 404) throw new Error('Sessions endpoint not found');
          if (response.status === 500) throw new Error('Server error while fetching sessions');
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setSessions(data);
          setSelectedSession(data[0]); // Default to the first session
          setError(null);
        } else {
          setError('No test sessions found. Please create test sessions in the admin panel.');
          setSessions([]);
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError(`Failed to load sessions: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  // Effect to fetch scores when a session is selected
  useEffect(() => {
    if (!selectedSession) return;
    
    const fetchScores = async () => {
      try {
        setLoadingScores(true);
        setError(null);
        
        const encodedSessionName = encodeURIComponent(selectedSession);
        const response = await fetch(`${API_BASE_URL}/api/scores-by-session/${encodedSessionName}/`);
        
        if (!response.ok) {
          if (response.status === 404) throw new Error('No scores found for this session');
          if (response.status === 500) throw new Error('Server error while fetching scores');
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        if (Array.isArray(data)) {
          // Map and sort data from the API
          const sortedEntries = data
            .map((item: any): Entry => ({
              employee_id: String(item.employee_id || ''),
              name: item.name || 'Unknown',
              section: item.section || 'N/A', // Keeping for compatibility if needed elsewhere
              department: item.department || 'N/A',
              skill: item.skill || 'N/A',
              marks: item.marks || 0,
              percentage: parseFloat(item.percentage) || 0,
              level_name: item.level_name || '',
              passed: Boolean(item.passed)
            }))
            .sort((a, b) => b.percentage - a.percentage); // Rank by percentage desc
          
          setEntries(sortedEntries);
          setError(null);
        } else {
          setEntries([]);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching scores:', err);
        setError(`Failed to load scores: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setEntries([]);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchScores();
  }, [selectedSession]);

  // Derived stats from the entries
  const totalParticipants = entries.length;
  const passedCount = entries.filter(e => e.passed).length;
  const averageMarks = totalParticipants > 0 ? (entries.reduce((sum, e) => sum + e.marks, 0) / totalParticipants) : 0;
  const topPerformer = entries.length > 0 ? entries[0] : null;

  // Filter entries based on search term and result filter
  const filteredEntries = entries.filter(e => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = e.name.toLowerCase().includes(searchTermLower) ||
                         e.employee_id.toLowerCase().includes(searchTermLower) ||
                         e.department.toLowerCase().includes(searchTermLower) ||
                         e.skill.toLowerCase().includes(searchTermLower);
    
    if (resultFilter === FILTER_OPTIONS.ALL) return matchesSearch;
    if (resultFilter === FILTER_OPTIONS.PASSED) return matchesSearch && e.passed;
    if (resultFilter === FILTER_OPTIONS.FAILED) return matchesSearch && !e.passed;
    
    return matchesSearch;
  });

  // Loading state for initial session fetch
  if (loadingSessions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-blue-400"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Sessions</h3>
              <p className="text-gray-600">Please wait while we fetch your data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Quiz Results Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Track performance and analyze results</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Session Selection Card */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Session Selection</h3>
                <p className="text-sm text-gray-600">Choose a quiz session to view results</p>
              </div>
            </div>
            <div className="relative min-w-[250px]">
              <select
                className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-6 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:shadow-lg transition-all cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedSession}
                onChange={e => setSelectedSession(e.target.value)}
                disabled={sessions.length === 0}
              >
                {sessions.length === 0 ? (
                  <option value="">No sessions available</option>
                ) : (
                  sessions.map(session => (
                    <option key={session} value={session}>{session}</option>
                  ))
                )}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        {entries.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalParticipants}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl"><Users className="w-6 h-6 text-blue-600" /></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{totalParticipants > 0 ? ((passedCount / totalParticipants) * 100).toFixed(1) : '0.0'}%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl"><CheckCircle className="w-6 h-6 text-green-600" /></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{averageMarks.toFixed(1)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl"><TrendingUp className="w-6 h-6 text-purple-600" /></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Score</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{topPerformer?.percentage.toFixed(1) || 0}%</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl"><Award className="w-6 h-6 text-yellow-600" /></div>
              </div>
            </div>
          </section>
        )}

        {/* Results Table Section */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg"><Trophy className="w-5 h-5 text-white" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Results for <span className="text-blue-600">{selectedSession || 'No Session Selected'}</span></h2>
                  <p className="text-gray-600 mt-1">Detailed performance breakdown</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative min-w-[140px]">
                  <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10" />
                  <select
                    className="w-full appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    value={resultFilter}
                    onChange={e => setResultFilter(e.target.value)}
                  >
                    <option value={FILTER_OPTIONS.ALL}>All Results</option>
                    <option value={FILTER_OPTIONS.PASSED}>Passed Only</option>
                    <option value={FILTER_OPTIONS.FAILED}>Failed Only</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative min-w-[250px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, department..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                    {error.includes('No test sessions found') && (
                      <div className="mt-3 text-sm text-red-700">
                        <p className='font-semibold'>Possible solutions:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Ensure the backend server is running at <code className="bg-red-100 px-1 rounded">{API_BASE_URL}</code>.</li>
                          <li>Check if the API endpoint is correct: <code className="bg-red-100 px-1 rounded">/api/past-sessions/</code>.</li>
                          <li>Verify your database has `Score` records with associated `Test` sessions.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {loadingScores ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative w-12 h-12"><div className="w-full h-full border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div></div>
                <p className="text-gray-600 font-medium">Loading scores...</p>
              </div>
            ) : !error && entries.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"><Users className="w-10 h-10 text-gray-400" /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-600">No entries are available for the selected session.</p>
              </div>
            ) : !error && filteredEntries.length === 0 && entries.length > 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"><Search className="w-10 h-10 text-gray-400" /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : !error && filteredEntries.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        {Object.values(TABLE_FIELDS).map((field, idx) => (
                           <th key={field} scope="col" className={`px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider ${idx > 3 ? 'text-center' : 'text-left'}`}>
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEntries.map((e, i) => {
                        const isTop3 = i < 3;
                        const rankColors = ['bg-yellow-500', 'bg-gray-400', 'bg-yellow-600'];
                        return (
                          <tr key={`${e.employee_id}-${i}`} className={`hover:bg-blue-50 transition-colors duration-200 ${i === 0 ? 'bg-gradient-to-r from-yellow-50/50 to-orange-50/50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isTop3 ? `text-white ${rankColors[i]}` : 'bg-gray-100 text-gray-600'}`}>
                                {i + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {e.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{e.name}</div>
                                  <div className="text-sm text-gray-500">ID: {e.employee_id}</div>
                                </div>
                              </div>
                            </td>
                            {/* THIS IS THE UPDATED CELL FOR DEPARTMENT */}
                            <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{e.department}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{e.skill}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-center"><div className="text-lg font-bold text-gray-900">{e.marks}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap text-center"><div className="text-lg font-bold text-gray-900">{e.percentage.toFixed(1)}%</div></td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${e.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {e.passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {e.passed ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default QuizResults;