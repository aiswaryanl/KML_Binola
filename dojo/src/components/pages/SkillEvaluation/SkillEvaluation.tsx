



// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { User, Building, Calendar, MapPin, Users, FileText, CheckSquare, Percent } from 'lucide-react';
// import axios from 'axios';

// // ====================================================================================
// // --- AXIOS API CONFIGURATION ---
// // ====================================================================================
// const api = axios.create({
//     baseURL: "http://127.0.0.1:8000/",
//     headers: { 'Content-Type': 'application/json' }
// });

// // ====================================================================================
// // --- TYPE DEFINITIONS & STATIC DATA ---
// // ====================================================================================
// interface EmployeeDetails {
//     id: number;
//     emp_id: string;
//     first_name: string;
//     last_name: string;
//     department: number;
//     department_name: string;
//     designation: string;
//     date_of_joining: string;
// }

// interface LocationState {
//     employeeId: string;
//     stationName: string;
//     departmentId: number;
//     departmentName: string; 
//     levelId: number;
// }
// interface EvaluationCriteria {
//     id: number;
//     criteria: string;
// }
// interface FormData {
//     employeeName: string;
//     employeeCode: string;
//     designation: string;
//     department: string;
//     dateOfJoining: string;
//     stationName: string;
//     evaluationDate: string;
//     dojoInchargeName: string;
//     areaInchargeName: string;
//     evaluationScores: { [key: number]: { initial: string; reevaluation: string } };
// }
// interface ExistingEvaluationData {
//     id: number;
//     station_name: string;
//     evaluation_date: string;
//     dojo_incharge_name: string;
//     area_incharge_name: string;
//     total_marks: number;
//     status: string;
//     employee: string;
//     level: number;
//     level_name: string;
//     department: number;
//     department_name: string;
//     scores: Array<{
//         criteria_text: string;
//         initial_score: 'O' | 'X' | null;
//         reevaluation_score: 'O' | 'X' | null;
//     }>;
// }

// const evaluationCriteria: EvaluationCriteria[] = [
//     { id: 1, criteria: "Awareness of the part produced in Line/Machine" },
//     { id: 2, criteria: "Able to read work instruction & doing work as per work instruction" },
//     { id: 3, criteria: "Knows the dimension getting made on station and are associate check point" },
//     { id: 4, criteria: "Knowledge of defects (Post operation)" },
//     { id: 5, criteria: "Following Reject part / Fallen part handling rule" },
//     { id: 6, criteria: "Following Abnormal situation handling rule" },
//     { id: 7, criteria: "Maintaining the '5S' on station" },
//     { id: 8, criteria: "Adherence of PPE's as defined on station" },
//     { id: 9, criteria: "Knowledge about past customer complaints & PQI defects of concern area" },
//     { id: 10, criteria: "Awareness about the POKA YOKE - alarm and effect of bypass" },
//     { id: 11, criteria: "Basic knowledge of machine operation" },
//     { id: 12, criteria: "Mould loading and unloading (Center matching- ring location function)" },
//     { id: 13, criteria: "Crane operation (Remote function - direction)" },
//     { id: 14, criteria: "Knows & maintain machine start up check sheet properly (Loading and unloading - readiness check sheet)" }
// ];
// const TOTAL_CRITERIA_COUNT = evaluationCriteria.length;


// // ====================================================================================
// // --- REACT COMPONENT ---
// // ====================================================================================
// function SkillEvaluationForm() {
//     const location = useLocation();
//     const navigate = useNavigate();
    
//     const { employeeId, stationName, departmentId, departmentName, levelId } = (location.state as LocationState) || {};

//     const [existingEvaluationId, setExistingEvaluationId] = useState<number | null>(null);
//     const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [pageStatus, setPageStatus] = useState<string>('Initializing...');
//     const [formData, setFormData] = useState<FormData>({ employeeName: '', employeeCode: '', designation: '', department: '', dateOfJoining: '', stationName: stationName || '', evaluationDate: new Date().toISOString().split('T')[0], dojoInchargeName: '', areaInchargeName: '', evaluationScores: {} });
//     const [totalMarks, setTotalMarks] = useState('0');
//     const [evaluationStatus, setEvaluationStatus] = useState<string | null>(null);

//     useEffect(() => {
//         const scores = Object.values(formData.evaluationScores);
//         if (!scores || scores.length === 0) { setTotalMarks('0'); return; }
//         const okCount = scores.filter(score => score.initial === 'O').length;
//         const percentage = (okCount / TOTAL_CRITERIA_COUNT) * 100;
//         setTotalMarks(percentage.toFixed(0));
//     }, [formData.evaluationScores]);

//     useEffect(() => {
//         const getInitialData = async () => {
//             if (!employeeId || !stationName || !departmentId || !levelId) {
//                 setError("Missing required information (Employee, Station, Department, or Level). Please go back and select all options.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setPageStatus('Loading employee details...');
//                 const empResponse = await api.get(`/mastertable/${employeeId}/`);
//                 const employeeData: EmployeeDetails = empResponse.data;
//                 setEmployeeDetails(employeeData);

//                 setFormData(prev => ({
//                     ...prev,
//                     employeeName: `${employeeData.first_name} ${employeeData.last_name}`,
//                     employeeCode: employeeData.emp_id,
//                     department: departmentName || `Dept ID: ${departmentId}`,
//                     designation: employeeData.designation || 'N/A',
//                     dateOfJoining: employeeData.date_of_joining,
//                 }));

//                 setPageStatus('Checking for existing evaluation...');

//                 const queryParams = new URLSearchParams({
//                     employee__emp_id: employeeId,
//                     department: departmentId.toString(),
//                     station_name: stationName,
//                     level: levelId.toString(),
//                 });

//                 const existingEvalResponse = await api.get(`/skillevaluations/?${queryParams.toString()}`);

//                 if (existingEvalResponse.data && existingEvalResponse.data.length > 0) {
//                     console.log("Found existing evaluation:", existingEvalResponse.data[0]);
//                     const existingData: ExistingEvaluationData = existingEvalResponse.data[0];
//                     setExistingEvaluationId(existingData.id);
//                     populateFormWithExistingData(existingData);
//                 } else {
//                     console.log("No existing evaluation found for this combination. This will be a new entry.");
//                     setPageStatus('');
//                 }

//             } catch (err: any) {
//                 setError(err.response?.data?.detail || err.message || "An unknown error occurred.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const populateFormWithExistingData = (data: ExistingEvaluationData) => {
//              const scoresObject = data.scores.reduce((acc, score) => {
//                 const criteria = evaluationCriteria.find(c => c.criteria === score.criteria_text);
//                 if (criteria) {
//                     acc[criteria.id] = { initial: score.initial_score || '', reevaluation: score.reevaluation_score || '' };
//                 }
//                 return acc;
//             }, {} as { [key: number]: { initial: string; reevaluation: string } });

//             setFormData(prev => ({
//                 ...prev,
//                 evaluationDate: data.evaluation_date,
//                 dojoInchargeName: data.dojo_incharge_name,
//                 areaInchargeName: data.area_incharge_name,
//                 evaluationScores: scoresObject,
//             }));
//             setTotalMarks(data.total_marks.toString());
//             setEvaluationStatus(data.status);
//         };

//         getInitialData();
//     }, [employeeId, stationName, departmentId, departmentName, levelId]);

//     const handleInputChange = (field: keyof Omit<FormData, 'evaluationScores'>, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); };
//     const handleEvaluationChange = (criteriaId: number, type: 'initial' | 'reevaluation', value: string) => { setFormData(prev => ({ ...prev, evaluationScores: { ...prev.evaluationScores, [criteriaId]: { ...prev.evaluationScores[criteriaId], [type]: value, }, }, })); };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!employeeDetails || !levelId || !departmentId || !stationName) {
//             alert("Cannot submit: Critical employee, level, department, or station data is missing.");
//             return;
//         }

//         const scoresArray = evaluationCriteria.map(criterion => ({
//             criteria_text: criterion.criteria,
//             initial_score: formData.evaluationScores[criterion.id]?.initial || null,
//             reevaluation_score: formData.evaluationScores[criterion.id]?.reevaluation || null,
//         }));
        
//         const submissionPayload = {
//             employee: employeeDetails.emp_id,
//             department: departmentId,
//             level: levelId,
//             station_name: formData.stationName,
//             evaluation_date: formData.evaluationDate,
//             dojo_incharge_name: formData.dojoInchargeName,
//             area_incharge_name: formData.areaInchargeName,
//             total_marks: Number(totalMarks),
//             scores: scoresArray,
//         };

//         const isEditMode = existingEvaluationId !== null;
//         const url = isEditMode ? `/skillevaluations/${existingEvaluationId}/` : '/skillevaluations/';
//         const method = isEditMode ? 'PUT' : 'POST';

//         console.log(`Submitting with method: ${method} to URL: ${url}`);

//         try {
//             await api({ method, url, data: submissionPayload });
//             alert(`Evaluation successfully ${isEditMode ? 'updated' : 'submitted'}!`);
//             navigate(-1);

//         } catch (error: any) {
//             const errorMsg = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
//             alert(`Submission failed:\n${errorMsg}`);
//         }
//     };
    
//     if (loading) { return (<div className="flex flex-col justify-center items-center min-h-screen bg-slate-50"><p className="text-lg text-gray-700">{pageStatus}</p></div>); }
//     if (error) { return (<div className="flex flex-col justify-center items-center min-h-screen bg-red-50 p-6"><h2 className="text-xl font-bold text-red-700 mb-2">Error</h2><p className="text-red-600 text-center">{error}</p><button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Back</button></div>); }
    
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
//             <div className="max-w-6xl mx-auto">
//                 <div className="bg-white rounded-xl shadow-lg border-t-4 border-blue-600">
//                     <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex justify-between items-center">
//                         <div className="flex items-center gap-4">
//                             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
//                             <div>
//                                 <h1 className="text-2xl font-bold">PENSTONE</h1>
//                                 <p className="text-blue-100">Skill Evaluation Sheet - Level {levelId || 'N/A'}</p>
//                             </div>
//                         </div>
//                         <h2 className="text-2xl font-bold">{existingEvaluationId ? 'Edit / View Evaluation' : 'New Evaluation'}</h2>
//                     </div>

//                     {evaluationStatus && (<div className="p-4 m-6 bg-blue-50 border border-blue-200 rounded-lg text-center"><p className="font-semibold text-blue-800">Current Status: <span className="font-bold text-lg">{evaluationStatus}</span></p></div>)}

//                     <form onSubmit={handleSubmit} className="p-6 space-y-8">
//                         {/* Employee Details Section (Read-Only) */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><User className="w-4 h-4 text-blue-600" />Employee Name</label><input type="text" value={formData.employeeName} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><FileText className="w-4 h-4 text-blue-600" />Employee Code</label><input type="text" value={formData.employeeCode} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Users className="w-4 h-4 text-blue-600" />Designation</label><input type="text" value={formData.designation} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Building className="w-4 h-4 text-blue-600" />Department</label><input type="text" value={formData.department} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Calendar className="w-4 h-4 text-blue-600" />Date of Joining</label><input type="date" value={formData.dateOfJoining} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><MapPin className="w-4 h-4 text-blue-600" />Station Name</label><input type="text" value={formData.stationName} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
//                         </div>

//                         {/* Evaluation Details Section (Editable) */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {/* ✅ --- THE FIX IS HERE --- ✅ */}
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Calendar className="w-4 h-4 text-blue-600" />Evaluation Date</label><input type="date" value={formData.evaluationDate} onChange={(e) => handleInputChange('evaluationDate', e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><User className="w-4 h-4 text-blue-600" />DOJO Incharge Name</label><input type="text" value={formData.dojoInchargeName} onChange={(e) => handleInputChange('dojoInchargeName', e.target.value)} required placeholder="Enter name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
//                             <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><User className="w-4 h-4 text-blue-600" />Area In-charge Name</label><input type="text" value={formData.areaInchargeName} onChange={(e) => handleInputChange('areaInchargeName', e.target.value)} required placeholder="Enter name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
//                         </div>

//                         {/* Evaluation Criteria Table */}
//                         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Sr.</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Criteria</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Initial Eval (O/X)</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Re-Eval (O/X)</th></tr></thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                     {evaluationCriteria.map((item) => (<tr key={item.id}><td className="px-4 py-3 font-medium text-gray-900 border-r">{item.id}</td><td className="px-4 py-3 text-sm text-gray-700 border-r">{item.criteria}</td><td className="px-4 py-3 text-center border-r"><div className="flex justify-center gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`initial_${item.id}`} value="O" checked={formData.evaluationScores[item.id]?.initial === 'O'} onChange={(e) => handleEvaluationChange(item.id, 'initial', e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" /><span className="text-green-600 font-semibold">O</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`initial_${item.id}`} value="X" checked={formData.evaluationScores[item.id]?.initial === 'X'} onChange={(e) => handleEvaluationChange(item.id, 'initial', e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" /><span className="text-red-600 font-semibold">X</span></label></div></td><td className="px-4 py-3 text-center"><div className="flex justify-center gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`reevaluation_${item.id}`} value="O" checked={formData.evaluationScores[item.id]?.reevaluation === 'O'} onChange={(e) => handleEvaluationChange(item.id, 'reevaluation', e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" /><span className="text-green-600 font-semibold">O</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`reevaluation_${item.id}`} value="X" checked={formData.evaluationScores[item.id]?.reevaluation === 'X'} onChange={(e) => handleEvaluationChange(item.id, 'reevaluation', e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" /><span className="text-red-600 font-semibold">X</span></label></div></td></tr>))}
//                                 </tbody>
//                             </table>
//                         </div>
                        
//                         {/* Summary and Submission */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-6">
//                             <div className="space-y-2">
//                                 <label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Percent className="w-4 h-4 text-blue-600" />Total Marks (Calculated)</label>
//                                 <div className="relative"><input type="number" value={totalMarks} readOnly className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /><div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><span className="text-gray-500 sm:text-sm">%</span></div></div>
//                             </div>
//                             <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Legends</label><div className="flex items-center gap-6 text-sm pt-2"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span>OK : O (1 Point)</span><span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span>NG : X (0 Points)</span></div></div>
//                         </div>

//                         <div className="flex justify-center pt-4">
//                             <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 flex items-center gap-2"><CheckSquare className="w-5 h-5" />{existingEvaluationId ? 'Update Evaluation' : 'Submit Evaluation'}</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SkillEvaluationForm;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Building, Calendar, MapPin, Users, FileText, CheckSquare, Percent } from 'lucide-react';
import axios from 'axios';

// ====================================================================================
// --- AXIOS API CONFIGURATION ---
// ====================================================================================
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/", // Make sure this is your correct API URL
    headers: { 'Content-Type': 'application/json' }
});

// ====================================================================================
// --- TYPE DEFINITIONS ---
// ====================================================================================
interface EmployeeDetails {
    id: number;
    emp_id: string;
    first_name: string;
    last_name: string;
    department: number;
    department_name: string;
    designation: string;
    date_of_joining: string;
}

interface LocationState {
    employeeId: string;
    stationName: string;
    departmentId: number;
    departmentName: string; 
    levelId: number;
}

// NEW: This interface matches the response from your /levels/:id/criteria/ API endpoint
interface EvaluationCriteria {
    id: number;
    criteria_text: string; 
}

interface FormData {
    employeeName: string;
    employeeCode: string;
    designation: string;
    department: string;
    dateOfJoining: string;
    stationName: string;
    evaluationDate: string;
    dojoInchargeName: string;
    areaInchargeName: string;
    evaluationScores: { [key: number]: { initial: string; reevaluation: string } };
}

interface ExistingEvaluationData {
    id: number;
    station_name: string;
    evaluation_date: string;
    dojo_incharge_name: string;
    area_incharge_name: string;
    total_marks: number;
    status: string;
    employee: string;
    level: number;
    level_name: string;
    department: number;
    department_name: string;
    scores: Array<{
        criteria_text: string;
        initial_score: 'O' | 'X' | null;
        reevaluation_score: 'O' | 'X' | null;
    }>;
}

// ====================================================================================
// --- REACT COMPONENT ---
// ====================================================================================
function SkillEvaluationForm() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { employeeId, stationName, departmentId, departmentName, levelId } = (location.state as LocationState) || {};

    const [existingEvaluationId, setExistingEvaluationId] = useState<number | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageStatus, setPageStatus] = useState<string>('Initializing...');
    const [formData, setFormData] = useState<FormData>({ employeeName: '', employeeCode: '', designation: '', department: '', dateOfJoining: '', stationName: stationName || '', evaluationDate: new Date().toISOString().split('T')[0], dojoInchargeName: '', areaInchargeName: '', evaluationScores: {} });
    const [totalMarks, setTotalMarks] = useState('0');
    const [evaluationStatus, setEvaluationStatus] = useState<string | null>(null);
    
    // NEW: State to hold the dynamically fetched criteria
    const [criteriaList, setCriteriaList] = useState<EvaluationCriteria[]>([]);

    // MODIFIED: useEffect for total marks calculation
    useEffect(() => {
        // If criteria haven't loaded, percentage is 0
        if (criteriaList.length === 0) {
            setTotalMarks('0');
            return;
        }
        const scores = Object.values(formData.evaluationScores);
        const okCount = scores.filter(score => score.initial === 'O').length;
        // Use the dynamic length of the fetched criteria list
        const percentage = (okCount / criteriaList.length) * 100;
        setTotalMarks(percentage.toFixed(0));
    }, [formData.evaluationScores, criteriaList]); // Added criteriaList as a dependency

    // MODIFIED: Main useEffect to fetch all initial data
    useEffect(() => {
        const getInitialData = async () => {
            if (!employeeId || !stationName || !departmentId || !levelId) {
                setError("Missing required information (Employee, Station, Department, or Level). Please go back and select all options.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // --- STEP 1: FETCH CRITERIA FROM THE API ---
                setPageStatus('Loading evaluation criteria...');
                let fetchedCriteria: EvaluationCriteria[] = [];
                try {
                    // This is the new API call
                    const criteriaResponse = await api.get(`/levels/${levelId}/criteria/`);
                    fetchedCriteria = criteriaResponse.data;
                    setCriteriaList(fetchedCriteria);
                } catch (critErr) {
                    setError(`Failed to load evaluation criteria for Level ${levelId}. Please check the API and try again.`);
                    setLoading(false);
                    return; // Stop execution if criteria fails to load
                }

                // --- STEP 2: FETCH EMPLOYEE DETAILS (same as before) ---
                setPageStatus('Loading employee details...');
                const empResponse = await api.get(`/mastertable/${employeeId}/`);
                const employeeData: EmployeeDetails = empResponse.data;
                setEmployeeDetails(employeeData);

                setFormData(prev => ({
                    ...prev,
                    employeeName: `${employeeData.first_name} ${employeeData.last_name}`,
                    employeeCode: employeeData.emp_id,
                    department: departmentName || `Dept ID: ${departmentId}`,
                    designation: employeeData.designation || 'N/A',
                    dateOfJoining: employeeData.date_of_joining,
                }));

                // --- STEP 3: CHECK FOR EXISTING EVALUATION ---
                setPageStatus('Checking for existing evaluation...');
                const queryParams = new URLSearchParams({
                    employee__emp_id: employeeId,
                    department: departmentId.toString(),
                    station_name: stationName,
                    level: levelId.toString(),
                });
                const existingEvalResponse = await api.get(`/skillevaluations/?${queryParams.toString()}`);

                if (existingEvalResponse.data && existingEvalResponse.data.length > 0) {
                    const existingData: ExistingEvaluationData = existingEvalResponse.data[0];
                    setExistingEvaluationId(existingData.id);
                    // Pass fetchedCriteria directly because state update might not have finished
                    populateFormWithExistingData(existingData, fetchedCriteria);
                } else {
                    console.log("No existing evaluation found. This will be a new entry.");
                }

            } catch (err: any) {
                setError(err.response?.data?.detail || err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
                setPageStatus('');
            }
        };

        const populateFormWithExistingData = (data: ExistingEvaluationData, currentCriteria: EvaluationCriteria[]) => {
             const scoresObject = data.scores.reduce((acc, score) => {
                // Use the passed-in criteria list to find the match
                const criteria = currentCriteria.find(c => c.criteria_text === score.criteria_text);
                if (criteria) {
                    acc[criteria.id] = { initial: score.initial_score || '', reevaluation: score.reevaluation_score || '' };
                }
                return acc;
            }, {} as { [key: number]: { initial: string; reevaluation: string } });

            setFormData(prev => ({
                ...prev,
                evaluationDate: data.evaluation_date,
                dojoInchargeName: data.dojo_incharge_name,
                areaInchargeName: data.area_incharge_name,
                evaluationScores: scoresObject,
            }));
            setTotalMarks(data.total_marks.toString());
            setEvaluationStatus(data.status);
        };

        getInitialData();
    }, [employeeId, stationName, departmentId, departmentName, levelId]);

    const handleInputChange = (field: keyof Omit<FormData, 'evaluationScores'>, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); };
    const handleEvaluationChange = (criteriaId: number, type: 'initial' | 'reevaluation', value: string) => { setFormData(prev => ({ ...prev, evaluationScores: { ...prev.evaluationScores, [criteriaId]: { ...prev.evaluationScores[criteriaId], [type]: value, }, }, })); };

    // MODIFIED: handleSubmit to use the dynamic criteriaList
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeDetails || !levelId || !departmentId || !stationName) {
            alert("Cannot submit: Critical employee, level, department, or station data is missing.");
            return;
        }

        const scoresArray = criteriaList.map(criterion => ({
            criteria_text: criterion.criteria_text, // Use criteria_text
            initial_score: formData.evaluationScores[criterion.id]?.initial || null,
            reevaluation_score: formData.evaluationScores[criterion.id]?.reevaluation || null,
        }));
        
        const submissionPayload = {
            employee: employeeDetails.emp_id,
            department: departmentId,
            level: levelId,
            station_name: formData.stationName,
            evaluation_date: formData.evaluationDate,
            dojo_incharge_name: formData.dojoInchargeName,
            area_incharge_name: formData.areaInchargeName,
            total_marks: Number(totalMarks),
            scores: scoresArray,
        };

        const isEditMode = existingEvaluationId !== null;
        const url = isEditMode ? `/skillevaluations/${existingEvaluationId}/` : '/skillevaluations/';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            await api({ method, url, data: submissionPayload });
            alert(`Evaluation successfully ${isEditMode ? 'updated' : 'submitted'}!`);
            navigate(-1);
        } catch (error: any) {
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
            alert(`Submission failed:\n${errorMsg}`);
        }
    };
    
    if (loading) { return (<div className="flex flex-col justify-center items-center min-h-screen bg-slate-50"><p className="text-lg text-gray-700">{pageStatus}</p></div>); }
    if (error) { return (<div className="flex flex-col justify-center items-center min-h-screen bg-red-50 p-6"><h2 className="text-xl font-bold text-red-700 mb-2">Error</h2><p className="text-red-600 text-center">{error}</p><button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Back</button></div>); }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border-t-4 border-blue-600">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
                            <div>
                                <h1 className="text-2xl font-bold">PENSTONE</h1>
                                <p className="text-blue-100">Skill Evaluation Sheet - Level {levelId || 'N/A'}</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">{existingEvaluationId ? 'Edit / View Evaluation' : 'New Evaluation'}</h2>
                    </div>

                    {evaluationStatus && (<div className="p-4 m-6 bg-blue-50 border border-blue-200 rounded-lg text-center"><p className="font-semibold text-blue-800">Current Status: <span className="font-bold text-lg">{evaluationStatus}</span></p></div>)}

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Employee & Evaluation Details Sections (No changes here) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><User className="w-4 h-4 text-blue-600" />Employee Name</label><input type="text" value={formData.employeeName} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><FileText className="w-4 h-4 text-blue-600" />Employee Code</label><input type="text" value={formData.employeeCode} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Users className="w-4 h-4 text-blue-600" />Designation</label><input type="text" value={formData.designation} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Building className="w-4 h-4 text-blue-600" />Department</label><input type="text" value={formData.department} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Calendar className="w-4 h-4 text-blue-600" />Date of Joining</label><input type="date" value={formData.dateOfJoining} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><MapPin className="w-4 h-4 text-blue-600" />Station Name</label><input type="text" value={formData.stationName} readOnly className="w-full px-4 py-3 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Calendar className="w-4 h-4 text-blue-600" />Evaluation Date</label><input type="date" value={formData.evaluationDate} onChange={(e) => handleInputChange('evaluationDate', e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><User className="w-4 h-4 text-blue-600" />DOJO Incharge Name</label><input type="text" value={formData.dojoInchargeName} onChange={(e) => handleInputChange('dojoInchargeName', e.target.value)} required placeholder="Enter name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                            <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><User className="w-4 h-4 text-blue-600" />Area In-charge Name</label><input type="text" value={formData.areaInchargeName} onChange={(e) => handleInputChange('areaInchargeName', e.target.value)} required placeholder="Enter name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                        </div>

                        {/* MODIFIED: Evaluation Criteria Table */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <table className="w-full">
                                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Sr.</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Criteria</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-r">Initial Eval (O/X)</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Re-Eval (O/X)</th></tr></thead>
                                <tbody className="divide-y divide-gray-200">
                                    {criteriaList.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 font-medium text-gray-900 border-r">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 border-r">{item.criteria_text}</td>
                                            <td className="px-4 py-3 text-center border-r"><div className="flex justify-center gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`initial_${item.id}`} value="O" checked={formData.evaluationScores[item.id]?.initial === 'O'} onChange={(e) => handleEvaluationChange(item.id, 'initial', e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" /><span className="text-green-600 font-semibold">O</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`initial_${item.id}`} value="X" checked={formData.evaluationScores[item.id]?.initial === 'X'} onChange={(e) => handleEvaluationChange(item.id, 'initial', e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" /><span className="text-red-600 font-semibold">X</span></label></div></td>
                                            <td className="px-4 py-3 text-center"><div className="flex justify-center gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`reevaluation_${item.id}`} value="O" checked={formData.evaluationScores[item.id]?.reevaluation === 'O'} onChange={(e) => handleEvaluationChange(item.id, 'reevaluation', e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500" /><span className="text-green-600 font-semibold">O</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name={`reevaluation_${item.id}`} value="X" checked={formData.evaluationScores[item.id]?.reevaluation === 'X'} onChange={(e) => handleEvaluationChange(item.id, 'reevaluation', e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" /><span className="text-red-600 font-semibold">X</span></label></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Summary and Submission Section (No changes here) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Percent className="w-4 h-4 text-blue-600" />Total Marks (Calculated)</label>
                                <div className="relative"><input type="number" value={totalMarks} readOnly className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /><div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><span className="text-gray-500 sm:text-sm">%</span></div></div>
                            </div>
                            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Legends</label><div className="flex items-center gap-6 text-sm pt-2"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span>OK : O (1 Point)</span><span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span>NG : X (0 Points)</span></div></div>
                        </div>
                        <div className="flex justify-center pt-4">
                            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 flex items-center gap-2"><CheckSquare className="w-5 h-5" />{existingEvaluationId ? 'Update Evaluation' : 'Submit Evaluation'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SkillEvaluationForm;