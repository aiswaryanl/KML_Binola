
// import React, { useEffect, useState, useMemo, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// interface Employee {
//   id: string;
//   name: string;
//   pay_code: string;
//   section: string;
// }

// interface Station {
//   station_id: number;
//   station_name: string;
//   subline: number;
// }

// interface QuestionPaper {
//   id: number;
//   name: string;
//   station_id?: number;
//   level_id?: number;
// }

// interface AssignmentDetails {
//   employee_id: string | null;
//   searchQuery?: string;
// }

// interface LocationState {
//   questionPaperId?: number;
//   skillId?: number;
//   levelId?: number;
//   skillName?: string;
//   levelName?: string;
//   fromNavigation?: boolean;
//   examMode?: 'remote' | 'computer' | 'tablet';
//   lineName?: string;
//   prevpage?: string;
//   sectionTitle?: string;
//   Level?: any;
//   departmentId?: number;
//   lineId?: number;
//   sublineId?: number;
//   stationId?: number;
//   stationName?: string;
// }

// const AssignEmployees: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const locationState = useMemo(() => location.state as LocationState | undefined, [location.state]);
//   const CurrentLevel = locationState?.Level ?? locationState?.levelId ?? 2;
//   const examMode = locationState?.examMode ?? 'computer';
//   const stationId = locationState?.stationId ?? 1; // Fixed station ID

//   console.log('Current Level:', CurrentLevel);
//   console.log('Exam Mode:', examMode);
//   console.log('Location State:', locationState);

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [skills, setSkills] = useState<Station[]>([]);
//   const [selectedSkill] = useState<number>(stationId); // Fixed to stationId (1)
//   const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
//   const [filteredQuestionPapers, setFilteredQuestionPapers] = useState<QuestionPaper[]>([]);
//   const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
//   const [assignments, setAssignments] = useState<Record<string, AssignmentDetails>>({});
//   const [remoteInputs, setRemoteInputs] = useState<string[]>([]);
//   const [newRemote, setNewRemote] = useState('');
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [message, setMessage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Track initial fetch to prevent multiple runs
//   const hasFetched = useRef(false);

//   const now = new Date();
//   const formattedDate = now.toLocaleString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false,
//   }).replace(',', '');

//   const selectedPaperName = filteredQuestionPapers.find(p => p.id === selectedPaperId)?.name ?? 'Test';
//   const testName = `${selectedPaperName} ${formattedDate}`;

//   // Fallback data for question papers
//   const fallbackQuestionPapers: QuestionPaper[] = [
//     { id: 6, name: 'cutting', station_id: 1, level_id: 2 },
//     { id: 5, name: 'painting', station_id: 2, level_id: 1 },
//     { id: 4, name: 'forging', station_id: 1, level_id: 1 },
//     { id: 3, name: 'rolling', station_id: 1, level_id: 1 },
//     { id: 2, name: 'welding exam', station_id: 1, level_id: 1 },
//     { id: 1, name: 'hnm loading', station_id: 1, level_id: 1 },
//   ];

//   // Filter question papers based on fixed selectedSkill and CurrentLevel
//   useEffect(() => {
//     const filtered = questionPapers.filter(
//       paper => paper.station_id === selectedSkill && paper.level_id === CurrentLevel
//     );
//     setFilteredQuestionPapers(filtered);
//     // Reset selectedPaperId if it doesn't match the filtered papers
//     if (selectedPaperId && !filtered.some(paper => paper.id === selectedPaperId)) {
//       setSelectedPaperId(null);
//       setMessage('Selected paper is not valid for the current station and level. Please choose another.');
//     }
//     if (filtered.length === 0) {
//       setMessage('No question papers found for the selected station and level.');
//     } else {
//       setMessage(null);
//     }
//   }, [questionPapers, selectedSkill, CurrentLevel, selectedPaperId]);

//   // Retry logic for API calls
//   const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<any> => {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const res = await fetch(url);
//         if (!res.ok) {
//           const errorData = await res.json().catch(() => ({}));
//           throw new Error(`HTTP error! Status: ${res.status}, Message: ${JSON.stringify(errorData)}`);
//         }
//         return await res.json();
//       } catch (error) {
//         if (i < retries - 1) {
//           console.log(`Retry ${i + 1}/${retries} for ${url}`);
//           await new Promise(resolve => setTimeout(resolve, delay));
//           continue;
//         }
//         throw error;
//       }
//     }
//   };

//   useEffect(() => {
//     if (hasFetched.current) return;
//     hasFetched.current = true;

//     // Fetch employees
//     fetchWithRetry('http://127.0.0.1:8000/mastertable/')
//       .then(data => {
//         console.log('Employees fetched:', data);
//         if (Array.isArray(data)) {
//           const mappedEmployees = data.map(item => ({
//             id: item.id || item.emp_id || 'N/A',
//             name: item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Unknown',
//             pay_code: item.pay_code || item.emp_id || 'N/A',
//             section: item.section || item.department?.department_name || 'N/A',
//           }));
//           setEmployees(mappedEmployees);
//           console.log('Mapped employees:', mappedEmployees);
//         } else {
//           throw new Error('Invalid employee data format');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching employees:', error);
//         setMessage('Failed to load employees: ' + error.message);
//       });

//     // Fetch stations
//     fetchWithRetry('http://127.0.0.1:8000/stations/')
//       .then(data => {
//         console.log('Stations fetched:', data);
//         if (Array.isArray(data)) {
//           setSkills(data);
//         } else {
//           throw new Error('Invalid station data format');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching stations:', error);
//         setMessage('Failed to load skills: ' + error.message);
//       });

//     // Fetch question papers with fallback
//     const params = new URLSearchParams();
//     if (locationState?.departmentId) params.append('department__id', locationState.departmentId.toString());
//     if (locationState?.lineId) params.append('line__id', locationState.lineId.toString());
//     if (locationState?.sublineId) params.append('subline__id', locationState.sublineId.toString());
//     params.append('station__id', stationId.toString());
//     params.append('level__id', CurrentLevel.toString());

//     const altParams = new URLSearchParams(params);
//     altParams.delete('station__id');
//     altParams.delete('level__id');
//     altParams.append('station', stationId.toString());
//     altParams.append('level', CurrentLevel.toString());

//     const fetchQuestionPapers = async () => {
//       try {
//         let data = await fetchWithRetry(`http://127.0.0.1:8000/questionpapers/?${params.toString()}`);
//         if (!Array.isArray(data) || data.length === 0) {
//           console.log('Trying alternative query parameters:', altParams.toString());
//           data = await fetchWithRetry(`http://127.0.0.1:8000/questionpapers/?${altParams.toString()}`);
//         }
//         console.log('Question papers fetched:', data);
//         if (Array.isArray(data)) {
//           const mappedPapers = data.map(item => ({
//             id: item.question_paper_id || item.id || item.pk,
//             name: item.question_paper_name || item.name || 'Unknown',
//             station_id: item.station_id || (item.station && typeof item.station === 'object' ? item.station.id : item.station) || null,
//             level_id: item.level_id || (item.level && typeof item.level === 'object' ? item.level.id : item.level) || null,
//           }));
//           setQuestionPapers(mappedPapers);
//           console.log('Mapped question papers:', mappedPapers);
//         } else {
//           throw new Error('Invalid question paper data format');
//         }
//       } catch (error) {
//         console.error('Error fetching question papers:', error);
//         console.warn('API failed, using fallback question papers');
//         setQuestionPapers(fallbackQuestionPapers);
//       }
//     };

//     fetchQuestionPapers();
//   }, [locationState, stationId, CurrentLevel]);

//   const handleAddRemote = () => {
//     const trimmed = newRemote.trim();
//     if (trimmed && !remoteInputs.includes(trimmed)) {
//       setRemoteInputs(prev => [...prev, trimmed]);
//       setNewRemote('');
//     }
//   };

//   const handleRemoveRemote = (remoteId: string) => {
//     setRemoteInputs(prev => prev.filter(id => id !== remoteId));
//     setAssignments(prev => {
//       const newAssignments = { ...prev };
//       delete newAssignments[remoteId];
//       return newAssignments;
//     });
//   };

//   const handleAssignmentChange = (
//     key_id: string,
//     field: keyof AssignmentDetails,
//     value: string | null
//   ) => {
//     setAssignments(prev => ({
//       ...prev,
//       [key_id]: {
//         ...prev[key_id],
//         [field]: value,
//       },
//     }));
//   };

//   const handleEmployeeSelect = (employee: Employee) => {
//     setSelectedEmployee(employee);
//     setAssignments({
//       local: {
//         employee_id: employee.id,
//         searchQuery: '',
//       },
//     });
//   };

//   const handleStartTest = async () => {
//     if (!testName.trim()) {
//       setMessage('Please enter a test name.');
//       return;
//     }

//     if (!selectedPaperId) {
//       setMessage('Please select a question paper.');
//       return;
//     }

//     if (examMode === 'remote') {
//       for (const key_id of Object.keys(assignments)) {
//         const a = assignments[key_id];
//         if (!a.employee_id) {
//           setMessage(`Please assign an employee for remote ${key_id}.`);
//           return;
//         }
//       }
//     } else {
//       if (!selectedEmployee) {
//         setMessage('Please select an employee.');
//         return;
//       }
//     }

//     try {
//       setIsLoading(true);
//       setMessage(null);

//       if (examMode === 'remote') {
//         const payload = {
//           test_name: testName.trim(),
//           question_paper_id: selectedPaperId,
//           level: CurrentLevel,
//           skill: selectedSkill,
//           assignments: Object.entries(assignments).map(([key_id, details]) => ({
//             key_id,
//             employee_id: details.employee_id,
//           })),
//         };

//         const res = await fetch('http://127.0.0.1:8000/start-test/', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         if (!res.ok) {
//           const errorData = await res.json().catch(() => ({}));
//           setMessage(`Failed to start test: ${JSON.stringify(errorData)}`);
//           return;
//         }
//       }

//       navigate('/quiz-instructions', {
//         state: {
//           paperId: selectedPaperId,
//           skillId: selectedSkill,
//           levelId: CurrentLevel,
//           examMode,
//           employee: examMode !== 'remote' ? selectedEmployee : null,
//           employeeId: examMode !== 'remote' ? selectedEmployee?.id : null,
//           ...locationState,
//         },
//       });
//     } catch (error) {
//       console.error('Error starting test:', error);
//       setMessage(`Failed to start test: ${(error as Error).message}. Please try again or contact the administrator.`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = examMode === 'remote'
//     ? testName.trim() && selectedPaperId && Object.keys(assignments).length > 0
//     : testName.trim() && selectedPaperId && selectedEmployee !== null;

//   const filteredEmployees = employees.filter(emp => {
//     const q = searchQuery.toLowerCase();
//     return (
//       (emp.name?.toLowerCase()?.includes(q) || false) ||
//       (emp.pay_code?.toLowerCase()?.includes(q) || false)
//     );
//   });

//   const stationDisplayName =
//     locationState?.stationName ?? skills.find(s => s.station_id === selectedSkill)?.station_name ?? 'station 1';

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//           .glass-card {
//             background: rgba(255, 255, 255, 0.95);
//             backdrop-filter: blur(20px);
//             border: 1px solid rgba(255, 255, 255, 0.3);
//             box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
//           }
//           .glass-input {
//             background: rgba(255, 255, 255, 0.8);
//             backdrop-filter: blur(10px);
//             border: 2px solid rgba(255, 255, 255, 0.3);
//             transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           }
//           .glass-input:focus {
//             background: rgba(255, 255, 255, 0.9);
//             border-color: #3b82f6;
//             box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
//           }
//           .remote-card {
//             background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
//             backdrop-filter: blur(15px);
//             border: 1px solid rgba(255, 255, 255, 0.4);
//             transition: all 0.3s ease;
//           }
//           .remote-card:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
//           }
//           .animate-fade-in {
//             animation: fadeIn 0.6s ease-out;
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(30px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//           .animate-slide-in {
//             animation: slideIn 0.5s ease-out;
//           }
//           @keyframes slideIn {
//             from { opacity: 0; transform: translateX(-20px); }
//             to { opacity: 1; transform: translateX(0); }
//           }
//           .gradient-text {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//             background-clip: text;
//           }
//           .icon-glow {
//             filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
//           }
//           .floating-shapes {
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             overflow: hidden;
//             z-index: 0;
//           }
//           .shape {
//             position: absolute;
//             border-radius: 50%;
//             background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
//             animation: float 20s infinite ease-in-out;
//           }
//           .shape:nth-child(1) {
//             width: 300px;
//             height: 300px;
//             top: 10%;
//             left: 10%;
//             animation-delay: -2s;
//           }
//           .shape:nth-child(2) {
//             width: 200px;
//             height: 200px;
//             top: 60%;
//             right: 10%;
//             animation-delay: -8s;
//           }
//           .shape:nth-child(3) {
//             width: 150px;
//             height: 150px;
//             bottom: 20%;
//             left: 50%;
//             animation-delay: -15s;
//           }
//           @keyframes float {
//             0%, 100% { transform: translateY(0px) rotate(0deg); }
//             33% { transform: translateY(-20px) rotate(120deg); }
//             66% { transform: translateY(20px) rotate(240deg); }
//           }
//           .progress-bar {
//             width: 100%;
//             height: 6px;
//             background: rgba(255, 255, 255, 0.3);
//             border-radius: 3px;
//             overflow: hidden;
//           }
//           .progress-fill {
//             height: 100%;
//             background: linear-gradient(90deg, #3b82f6, #8b5cf6);
//             border-radius: 3px;
//             transition: width 0.3s ease;
//           }
//         `,
//         }}
//       />

//       <div className="floating-shapes">
//         <div className="shape"></div>
//         <div className="shape"></div>
//         <div className="shape"></div>
//       </div>

//       <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto">
//           {/* Debug Section */}
//           {/* <div className="mb-4 p-4 bg-gray-100 rounded">
//             <h3 className="font-semibold">Debug Info</h3>
//             <p>Employees: {JSON.stringify(employees)}</p>
//             <p>Question Papers: {JSON.stringify(filteredQuestionPapers)}</p>
//             <p>Skills: {JSON.stringify(skills)}</p>
//             <p>Selected Skill: {selectedSkill}</p>
//             <p>Selected Paper ID: {selectedPaperId}</p>
//             <p>Station Display Name: {stationDisplayName}</p>
//           </div> */}

//           <div className="text-center mb-12 animate-fade-in">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 icon-glow">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                 />
//               </svg>
//             </div>
//             <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
//               {examMode === 'remote' ? 'Test Assignment Portal' : 'Employee Assignment'}
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               {examMode === 'remote'
//                 ? 'Configure and assign employees to remote testing stations'
//                 : 'Select an employee to start the test'}
//             </p>
//             <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
//               <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//               <span className="text-sm font-medium text-blue-800 capitalize">{examMode} Mode</span>
//             </div>
//           </div>

//           <div className="mb-8">
//             <div className="glass-card rounded-xl p-6">
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-sm font-medium text-gray-700">Setup Progress</span>
//                 <span className="text-sm font-medium text-blue-600">
//                   {[testName.trim(), selectedPaperId, examMode === 'remote' ? Object.keys(assignments).length > 0 : selectedEmployee]
//                     .filter(Boolean)
//                     .length / (examMode === 'remote' ? 3 : 3)} Complete
//                 </span>
//               </div>
//               <div className="progress-bar">
//                 <div
//                   className="progress-fill"
//                   style={{
//                     width: `${
//                       ([testName.trim(), selectedPaperId, examMode === 'remote' ? Object.keys(assignments).length > 0 : selectedEmployee]
//                         .filter(Boolean)
//                         .length /
//                         (examMode === 'remote' ? 3 : 3)) *
//                       100
//                     }%`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           <div className="glass-card rounded-2xl p-8 animate-slide-in">
//             <div className="space-y-8">
//               <div className="border-b border-gray-200 pb-8">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                   <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
//                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                       />
//                     </svg>
//                   </div>
//                   Test Configuration
//                 </h2>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Test Name *</label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium bg-gray-100 cursor-not-allowed"
//                       value={testName}
//                       readOnly
//                     />
//                     <p className="text-sm font-medium text-blue-600 mt-1">Test Name: {testName}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Question Paper</label>
//                     <select
//                       className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-800 font-medium"
//                       value={selectedPaperId ?? ''}
//                       onChange={e => setSelectedPaperId(e.target.value ? Number(e.target.value) : null)}
//                     >
//                       {/* <option value="">Select Question Paper</option> */}
//                       <option value="">Select Question Paper</option>
//                       {filteredQuestionPapers.length === 0 ? (
//                         <option value="" disabled>
//                           No question papers available
//                         </option>
//                       ) : (
//                         filteredQuestionPapers.map(paper => (
//                           <option key={paper.id} value={paper.id}>
//                             {paper.name}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                     <input type="hidden" name="question_paper_id" value={selectedPaperId ?? ''} />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Skill Station</label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium bg-gray-100 cursor-not-allowed"
//                       value={stationDisplayName}
//                       readOnly
//                     />
//                     <input type="hidden" name="skill_station_id" value={selectedSkill} />
//                   </div>
//                 </div>
//               </div>

//               {examMode === 'remote' ? (
//                 <div className="border-b border-gray-200 pb-8">
//                   <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                     <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
//                         />
//                       </svg>
//                     </div>
//                     Remote Stations
//                   </h2>

//                   <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Add Remote Station</label>
//                       <input
//                         type="text"
//                         className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium placeholder-gray-500 focus:outline-none"
//                         placeholder="Enter Remote ID or Scan QR"
//                         value={newRemote}
//                         onChange={e => setNewRemote(e.target.value)}
//                         onKeyPress={e => e.key === 'Enter' && handleAddRemote()}
//                       />
//                     </div>
//                     <div className="flex items-end">
//                       <button
//                         onClick={handleAddRemote}
//                         disabled={!newRemote.trim()}
//                         className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         <span>Add Remote</span>
//                       </button>
//                     </div>
//                   </div>

//                   {remoteInputs.length === 0 ? (
//                     <div className="text-center py-12">
//                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
//                           />
//                         </svg>
//                       </div>
//                       <p className="text-gray-500 text-lg">No remote stations added yet</p>
//                       <p className="text-gray-400 text-sm mt-1">Add remote stations to assign employees</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {remoteInputs.map((key_id, index) => {
//                         const assign = assignments[key_id] || { employee_id: null };
//                         const selectedEmployee = employees.find(e => e.id === assign.employee_id);

//                         return (
//                           <div
//                             key={key_id}
//                             className="remote-card rounded-xl p-6 animate-fade-in"
//                             style={{ animationDelay: `${index * 0.1}s` }}
//                           >
//                             <div className="flex items-center justify-between mb-4">
//                               <div className="flex items-center space-x-3">
//                                 <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
//                                   <span className="text-white font-bold text-sm">{key_id}</span>
//                                 </div>
//                                 <div>
//                                   <h3 className="font-semibold text-gray-800">Remote {key_id}</h3>
//                                   {selectedEmployee && <p className="text-sm text-gray-500">{selectedEmployee.section}</p>}
//                                 </div>
//                               </div>
//                               <button
//                                 onClick={() => handleRemoveRemote(key_id)}
//                                 className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
//                               >
//                                 <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                               </button>
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employee</label>
//                               <div className="relative">
//                                 <input
//                                   type="text"
//                                   placeholder="Search employee by name or pay code"
//                                   className="w-full px-3 py-2 glass-input rounded-lg text-gray-800 font-medium focus:outline-none"
//                                   value={
//                                     assign.employee_id
//                                       ? employees.find(e => e.id === assign.employee_id)?.pay_code ?? ''
//                                       : assign.searchQuery ?? ''
//                                   }
//                                   onChange={e => {
//                                     const input = e.target.value;
//                                     handleAssignmentChange(key_id, 'employee_id', null);
//                                     handleAssignmentChange(key_id, 'searchQuery', input);
//                                   }}
//                                 />
//                                 {assign.searchQuery?.trim() && (
//                                   <ul className="absolute left-0 right-0 bg-white shadow-xl rounded-lg mt-1 z-50 max-h-60 overflow-y-auto border border-gray-200">
//                                     {employees
//                                       .filter(emp => {
//                                         const q = assign.searchQuery?.toLowerCase() ?? '';
//                                         const isAlreadyAssigned = Object.entries(assignments).some(
//                                           ([otherKey, details]) => otherKey !== key_id && details.employee_id === emp.id
//                                         );
//                                         return (
//                                           !isAlreadyAssigned &&
//                                           ((emp.name?.toLowerCase()?.includes(q) || false) ||
//                                             (emp.pay_code?.toLowerCase()?.includes(q) || false))
//                                         );
//                                       })
//                                       .map(emp => (
//                                         <li
//                                           key={emp.id}
//                                           onClick={() => {
//                                             handleAssignmentChange(key_id, 'employee_id', emp.id);
//                                             handleAssignmentChange(key_id, 'searchQuery', '');
//                                           }}
//                                           className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                                         >
//                                           {emp.pay_code} - {emp.name}
//                                         </li>
//                                       ))}
//                                     {employees
//                                       .filter(emp => {
//                                         const q = assign.searchQuery?.toLowerCase() ?? '';
//                                         const isAlreadyAssigned = Object.entries(assignments).some(
//                                           ([otherKey, details]) => otherKey !== key_id && details.employee_id === emp.id
//                                         );
//                                         return (
//                                           !isAlreadyAssigned &&
//                                           ((emp.name?.toLowerCase()?.includes(q) || false) ||
//                                             (emp.pay_code?.toLowerCase()?.includes(q) || false))
//                                         );
//                                       })
//                                       .length === 0 && <li className="px-4 py-2 text-gray-500">No matches found</li>}
//                                   </ul>
//                                 )}
//                               </div>
//                             </div>

//                             {selectedEmployee && (
//                               <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                                 <div className="flex items-center space-x-2">
//                                   <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                                     />
//                                   </svg>
//                                   <span className="text-sm font-medium text-green-800">{selectedEmployee.name} assigned</span>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="border-b border-gray-200 pb-8">
//                   <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//                     <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                     </div>
//                     Select Employee
//                   </h2>

//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee</label>
//                     <input
//                       type="text"
//                       placeholder="Search by name or pay code"
//                       className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium placeholder-gray-500 focus:outline-none"
//                       value={searchQuery}
//                       onChange={e => setSearchQuery(e.target.value)}
//                     />
//                   </div>

//                   <div className="max-h-96 overflow-y-auto">
//                     {employees.length === 0 ? (
//                       <div className="text-center py-12">
//                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                           <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                             />
//                           </svg>
//                         </div>
//                         <p className="text-gray-500 text-lg">No employees found</p>
//                         <p className="text-gray-400 text-sm mt-1">Please check the employee data or try a different search term</p>
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-1 gap-3">
//                         {filteredEmployees.map(employee => (
//                           <div
//                             key={employee.id}
//                             onClick={() => handleEmployeeSelect(employee)}
//                             className={`p-4 rounded-lg border cursor-pointer transition-all ${
//                               selectedEmployee?.id === employee.id
//                                 ? 'bg-blue-50 border-blue-200 shadow-md'
//                                 : 'bg-white hover:bg-gray-50 border-gray-200'
//                             }`}
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
//                                 {employee.name?.charAt(0) ?? '?'}
//                               </div>
//                               <div>
//                                 <h3 className="font-medium text-gray-800">{employee.name ?? 'Unknown'}</h3>
//                                 <p className="text-sm text-gray-500">
//                                   {employee.pay_code ?? 'N/A'} • {employee.section ?? 'N/A'}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {selectedEmployee && (
//                     <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                             <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                               />
//                             </svg>
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-green-800">Selected Employee</h4>
//                             <p className="text-sm text-gray-600">
//                               {selectedEmployee.name ?? 'Unknown'} ({selectedEmployee.pay_code ?? 'N/A'})
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {message && (
//                 <div className="animate-fade-in">
//                   <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
//                     <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//                       />
//                     </svg>
//                     <div>
//                       <h3 className="text-sm font-medium text-red-800 mb-1">Action Required</h3>
//                       <p className="text-sm text-red-700">{message}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-end space-x-4 pt-6">
//                 <button
//                   onClick={() => navigate(-1)}
//                   className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleStartTest}
//                   disabled={isLoading || !isFormValid}
//                   className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                         />
//                       </svg>
//                       <span>Starting Test...</span>
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M3 12a9 9 0 1018 0 9 9 0 00-18 0z"
//                         />
//                       </svg>
//                       <span>Start Test</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignEmployees;







import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  pay_code: string;
  section: string;
}

interface Station {
  station_id: number;
  station_name: string;
  subline: number;
}

interface QuestionPaper {
  id: number;
  name: string;
  station_id?: number;
  level_id?: number;
}

interface AssignmentDetails {
  employee_id: string | null;
  searchQuery?: string;
}

interface LocationState {
  questionPaperId?: number;
  skillId?: number;
  levelId?: number;
  skillName?: string;
  levelName?: string;
  fromNavigation?: boolean;
  examMode?: 'remote' | 'computer' | 'tablet';
  lineName?: string;
  prevpage?: string;
  sectionTitle?: string;
  Level?: any;
  departmentId?: number;
  lineId?: number;
  sublineId?: number;
  stationId?: number;
  stationName?: string;
}

const AssignEmployees: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = useMemo(() => location.state as LocationState | undefined, [location.state]);
  const CurrentLevel = locationState?.Level ?? locationState?.levelId ?? 2;
  const examMode = locationState?.examMode ?? 'computer';
  const stationId = locationState?.stationId ?? 1; // Fixed station ID

  console.log('Current Level:', CurrentLevel);
  console.log('Exam Mode:', examMode);
  console.log('Location State:', locationState);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [skills, setSkills] = useState<Station[]>([]);
  const [selectedSkill] = useState<number>(stationId); // Fixed to stationId (1)
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [filteredQuestionPapers, setFilteredQuestionPapers] = useState<QuestionPaper[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<string, AssignmentDetails>>({});
  const [remoteInputs, setRemoteInputs] = useState<string[]>([]);
  const [newRemote, setNewRemote] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track initial fetch to prevent multiple runs
  const hasFetched = useRef(false);

  const now = new Date();
  const formattedDate = now.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '');

  // Find the name of the selected paper
  const selectedPaperName = useMemo(() => {
    return filteredQuestionPapers.find(p => p.id === selectedPaperId)?.name;
  }, [filteredQuestionPapers, selectedPaperId]);
  
  const testName = `${selectedPaperName || 'Test'} ${formattedDate}`;

  // Filter question papers based on fixed selectedSkill and CurrentLevel and auto-select the first one
  useEffect(() => {
    const filtered = questionPapers.filter(
      paper => paper.station_id === selectedSkill && paper.level_id === CurrentLevel
    );
    setFilteredQuestionPapers(filtered);

    if (filtered.length > 0) {
      // Auto-select the first paper
      setSelectedPaperId(filtered[0].id);
      setMessage(null); // Clear previous messages if papers are found
    } else {
      setSelectedPaperId(null); // No papers, no selection
      setMessage('No question papers found for the selected station and level.');
    }
  }, [questionPapers, selectedSkill, CurrentLevel]); // Removed selectedPaperId from dependencies as it's set here

  // Retry logic for API calls
  const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${JSON.stringify(errorData)}`);
        }
        return await res.json();
      } catch (error) {
        if (i < retries - 1) {
          console.log(`Retry ${i + 1}/${retries} for ${url}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Fetch employees
    fetchWithRetry('http://127.0.0.1:8000/mastertable/')
      .then(data => {
        console.log('Employees fetched:', data);
        if (Array.isArray(data)) {
          const mappedEmployees = data.map(item => ({
            id: item.id || item.emp_id || 'N/A',
            name: item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Unknown',
            pay_code: item.pay_code || item.emp_id || 'N/A',
            section: item.section || item.department?.department_name || 'N/A',
          }));
          setEmployees(mappedEmployees);
          console.log('Mapped employees:', mappedEmployees);
        } else {
          throw new Error('Invalid employee data format');
        }
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
        setMessage('Failed to load employees: ' + error.message);
      });

    // Fetch stations
    fetchWithRetry('http://127.0.0.1:8000/stations/')
      .then(data => {
        console.log('Stations fetched:', data);
        if (Array.isArray(data)) {
          setSkills(data);
        } else {
          throw new Error('Invalid station data format');
        }
      })
      .catch(error => {
        console.error('Error fetching stations:', error);
        setMessage('Failed to load skills: ' + error.message);
      });

    // Fetch question papers
    const params = new URLSearchParams();
    if (locationState?.departmentId) params.append('department__id', locationState.departmentId.toString());
    if (locationState?.lineId) params.append('line__id', locationState.lineId.toString());
    if (locationState?.sublineId) params.append('subline__id', locationState.sublineId.toString());
    params.append('station__id', stationId.toString());
    params.append('level__id', CurrentLevel.toString());

    const altParams = new URLSearchParams(params);
    altParams.delete('station__id');
    altParams.delete('level__id');
    altParams.append('station', stationId.toString());
    altParams.append('level', CurrentLevel.toString());

    const fetchQuestionPapers = async () => {
      try {
        let data = await fetchWithRetry(`http://127.0.0.1:8000/questionpapers/?${params.toString()}`);
        if (!Array.isArray(data) || data.length === 0) {
          console.log('Trying alternative query parameters:', altParams.toString());
          data = await fetchWithRetry(`http://127.0.0.1:8000/questionpapers/?${altParams.toString()}`);
        }
        console.log('Question papers fetched:', data);
        if (Array.isArray(data)) {
          const mappedPapers = data.map(item => ({
            id: item.question_paper_id || item.id || item.pk,
            name: item.question_paper_name || item.name || 'Unknown',
            station_id: item.station_id || (item.station && typeof item.station === 'object' ? item.station.id : item.station) || null,
            level_id: item.level_id || (item.level && typeof item.level === 'object' ? item.level.id : item.level) || null,
          }));
          setQuestionPapers(mappedPapers);
          console.log('Mapped question papers:', mappedPapers);
        } else {
          throw new Error('Invalid question paper data format');
        }
      } catch (error) {
        console.error('Error fetching question papers:', error);
        setMessage('Failed to load question papers: ' + (error as Error).message);
        // Removed fallback question papers
        setQuestionPapers([]); // Ensure the state is an empty array if fetch fails
      }
    };

    fetchQuestionPapers();
  }, [locationState, stationId, CurrentLevel]);

  const handleAddRemote = () => {
    const trimmed = newRemote.trim();
    if (trimmed && !remoteInputs.includes(trimmed)) {
      setRemoteInputs(prev => [...prev, trimmed]);
      setNewRemote('');
    }
  };

  const handleRemoveRemote = (remoteId: string) => {
    setRemoteInputs(prev => prev.filter(id => id !== remoteId));
    setAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[remoteId];
      return newAssignments;
    });
  };

  const handleAssignmentChange = (
    key_id: string,
    field: keyof AssignmentDetails,
    value: string | null
  ) => {
    setAssignments(prev => ({
      ...prev,
      [key_id]: {
        ...prev[key_id],
        [field]: value,
      },
    }));
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAssignments({
      local: {
        employee_id: employee.id,
        searchQuery: '',
      },
    });
  };

  const handleStartTest = async () => {
    if (!testName.trim()) {
      setMessage('Please enter a test name.');
      return;
    }

    if (!selectedPaperId) {
      setMessage('Please select a question paper.'); // This should ideally be caught by auto-select or 'No paper available' message
      return;
    }

    if (examMode === 'remote') {
      for (const key_id of Object.keys(assignments)) {
        const a = assignments[key_id];
        if (!a.employee_id) {
          setMessage(`Please assign an employee for remote ${key_id}.`);
          return;
        }
      }
      if (Object.keys(assignments).length === 0) {
        setMessage('Please add at least one remote station and assign an employee.');
        return;
      }
    } else {
      if (!selectedEmployee) {
        setMessage('Please select an employee.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setMessage(null);

      if (examMode === 'remote') {
        const payload = {
          test_name: testName.trim(),
          question_paper_id: selectedPaperId,
          level: CurrentLevel,
          skill: selectedSkill,
          assignments: Object.entries(assignments).map(([key_id, details]) => ({
            key_id,
            employee_id: details.employee_id,
          })),
        };

        const res = await fetch('http://127.0.0.1:8000/start-test/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          setMessage(`Failed to start test: ${JSON.stringify(errorData)}`);
          return;
        }
      }

      navigate('/quiz-instructions', {
        state: {
          paperId: selectedPaperId,
          skillId: selectedSkill,
          levelId: CurrentLevel,
          examMode,
          employee: examMode !== 'remote' ? selectedEmployee : null,
          employeeId: examMode !== 'remote' ? selectedEmployee?.id : null,
          testName: testName.trim(), // Pass the generated test name
          ...locationState,
        },
      });
    } catch (error) {
      console.error('Error starting test:', error);
      setMessage(`Failed to start test: ${(error as Error).message}. Please try again or contact the administrator.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = examMode === 'remote'
    ? testName.trim() && selectedPaperId && Object.keys(assignments).length > 0 && Object.values(assignments).every(a => a.employee_id)
    : testName.trim() && selectedPaperId && selectedEmployee !== null;

  const filteredEmployees = employees.filter(emp => {
    const q = searchQuery.toLowerCase();
    return (
      (emp.name?.toLowerCase()?.includes(q) || false) ||
      (emp.pay_code?.toLowerCase()?.includes(q) || false)
    );
  });

  const stationDisplayName =
    locationState?.stationName ?? skills.find(s => s.station_id === selectedSkill)?.station_name ?? 'station 1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          }
          .glass-input {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .glass-input:focus {
            background: rgba(255, 255, 255, 0.9);
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }
          .remote-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
          }
          .remote-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .icon-glow {
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
          }
          .floating-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }
          .shape {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
            animation: float 20s infinite ease-in-out;
          }
          .shape:nth-child(1) {
            width: 300px;
            height: 300px;
            top: 10%;
            left: 10%;
            animation-delay: -2s;
          }
          .shape:nth-child(2) {
            width: 200px;
            height: 200px;
            top: 60%;
            right: 10%;
            animation-delay: -8s;
          }
          .shape:nth-child(3) {
            width: 150px;
            height: 150px;
            bottom: 20%;
            left: 50%;
            animation-delay: -15s;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(20px) rotate(240deg); }
          }
          .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 3px;
            transition: width 0.3s ease;
          }
        `,
        }}
      />

      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Debug Section */}
          {/* <div className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold">Debug Info</h3>
            <p>Employees: {JSON.stringify(employees)}</p>
            <p>Question Papers: {JSON.stringify(filteredQuestionPapers)}</p>
            <p>Skills: {JSON.stringify(skills)}</p>
            <p>Selected Skill: {selectedSkill}</p>
            <p>Selected Paper ID: {selectedPaperId}</p>
            <p>Station Display Name: {stationDisplayName}</p>
          </div> */}

          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 icon-glow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
              {examMode === 'remote' ? 'Test Assignment Portal' : 'Employee Assignment'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {examMode === 'remote'
                ? 'Configure and assign employees to remote testing stations'
                : 'Select an employee to start the test'}
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-800 capitalize">{examMode} Mode</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Setup Progress</span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(
                    ([testName.trim(), selectedPaperId, examMode === 'remote' ? Object.keys(assignments).length > 0 : selectedEmployee]
                      .filter(Boolean)
                      .length /
                      (examMode === 'remote' ? 3 : 3)) *
                      100
                  )}% Complete
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ([testName.trim(), selectedPaperId, examMode === 'remote' ? Object.keys(assignments).length > 0 : selectedEmployee]
                        .filter(Boolean)
                        .length /
                        (examMode === 'remote' ? 3 : 3)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 animate-slide-in">
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  Test Configuration
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium bg-gray-100 cursor-not-allowed"
                      value={testName}
                      readOnly
                    />
                    <p className="text-sm font-medium text-blue-600 mt-1">Generated Test Name: {testName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Paper</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium bg-gray-100 cursor-not-allowed"
                      value={selectedPaperName || 'No Question Paper Available'}
                      readOnly
                      disabled={!selectedPaperId}
                    />
                    <input type="hidden" name="question_paper_id" value={selectedPaperId ?? ''} />
                    {!selectedPaperId && (
                       <p className="text-sm font-medium text-red-600 mt-1">
                         No question paper selected or available for this configuration.
                       </p>
                     )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Station</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium bg-gray-100 cursor-not-allowed"
                      value={stationDisplayName}
                      readOnly
                    />
                    <input type="hidden" name="skill_station_id" value={selectedSkill} />
                  </div>
                </div>
              </div>

              {examMode === 'remote' ? (
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                    </div>
                    Remote Stations
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Remote Station</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium placeholder-gray-500 focus:outline-none"
                        placeholder="Enter Remote ID or Scan QR"
                        value={newRemote}
                        onChange={e => setNewRemote(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddRemote()}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleAddRemote}
                        disabled={!newRemote.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Remote</span>
                      </button>
                    </div>
                  </div>

                  {remoteInputs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No remote stations added yet</p>
                      <p className="text-gray-400 text-sm mt-1">Add remote stations to assign employees</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {remoteInputs.map((key_id, index) => {
                        const assign = assignments[key_id] || { employee_id: null };
                        const assignedEmployee = employees.find(e => e.id === assign.employee_id); // Renamed to avoid conflict

                        return (
                          <div
                            key={key_id}
                            className="remote-card rounded-xl p-6 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">{key_id}</span>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">Remote {key_id}</h3>
                                  {assignedEmployee && <p className="text-sm text-gray-500">{assignedEmployee.section}</p>}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveRemote(key_id)}
                                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                              >
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employee</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search employee by name or pay code"
                                  className="w-full px-3 py-2 glass-input rounded-lg text-gray-800 font-medium focus:outline-none"
                                  value={
                                    assign.employee_id
                                      ? employees.find(e => e.id === assign.employee_id)?.pay_code ?? ''
                                      : assign.searchQuery ?? ''
                                  }
                                  onChange={e => {
                                    const input = e.target.value;
                                    handleAssignmentChange(key_id, 'employee_id', null);
                                    handleAssignmentChange(key_id, 'searchQuery', input);
                                  }}
                                />
                                {assign.searchQuery?.trim() && (
                                  <ul className="absolute left-0 right-0 bg-white shadow-xl rounded-lg mt-1 z-50 max-h-60 overflow-y-auto border border-gray-200">
                                    {employees
                                      .filter(emp => {
                                        const q = assign.searchQuery?.toLowerCase() ?? '';
                                        const isAlreadyAssigned = Object.entries(assignments).some(
                                          ([otherKey, details]) => otherKey !== key_id && details.employee_id === emp.id
                                        );
                                        return (
                                          !isAlreadyAssigned &&
                                          ((emp.name?.toLowerCase()?.includes(q) || false) ||
                                            (emp.pay_code?.toLowerCase()?.includes(q) || false))
                                        );
                                      })
                                      .map(emp => (
                                        <li
                                          key={emp.id}
                                          onClick={() => {
                                            handleAssignmentChange(key_id, 'employee_id', emp.id);
                                            handleAssignmentChange(key_id, 'searchQuery', '');
                                          }}
                                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                        >
                                          {emp.pay_code} - {emp.name}
                                        </li>
                                      ))}
                                    {employees
                                      .filter(emp => {
                                        const q = assign.searchQuery?.toLowerCase() ?? '';
                                        const isAlreadyAssigned = Object.entries(assignments).some(
                                          ([otherKey, details]) => otherKey !== key_id && details.employee_id === emp.id
                                        );
                                        return (
                                          !isAlreadyAssigned &&
                                          ((emp.name?.toLowerCase()?.includes(q) || false) ||
                                            (emp.pay_code?.toLowerCase()?.includes(q) || false))
                                        );
                                      })
                                      .length === 0 && <li className="px-4 py-2 text-gray-500">No matches found</li>}
                                  </ul>
                                )}
                              </div>
                            </div>

                            {assignedEmployee && ( // Use assignedEmployee here
                              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium text-green-800">{assignedEmployee.name} assigned</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    Select Employee
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee</label>
                    <input
                      type="text"
                      placeholder="Search by name or pay code"
                      className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium placeholder-gray-500 focus:outline-none"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {employees.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-lg">No employees found</p>
                        <p className="text-gray-400 text-sm mt-1">Please check the employee data or try a different search term</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {filteredEmployees.map(employee => (
                          <div
                            key={employee.id}
                            onClick={() => handleEmployeeSelect(employee)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedEmployee?.id === employee.id
                                ? 'bg-blue-50 border-blue-200 shadow-md'
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {employee.name?.charAt(0) ?? '?'}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">{employee.name ?? 'Unknown'}</h3>
                                <p className="text-sm text-gray-500">
                                  {employee.pay_code ?? 'N/A'} • {employee.section ?? 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedEmployee && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">Selected Employee</h4>
                            <p className="text-sm text-gray-600">
                              {selectedEmployee.name ?? 'Unknown'} ({selectedEmployee.pay_code ?? 'N/A'})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {message && (
                <div className="animate-fade-in">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 mb-1">Action Required</h3>
                      <p className="text-sm text-red-700">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTest}
                  disabled={isLoading || !isFormValid}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Starting Test...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M3 12a9 9 0 1018 0 9 9 0 00-18 0z"
                        />
                      </svg>
                      <span>Start Test</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignEmployees;