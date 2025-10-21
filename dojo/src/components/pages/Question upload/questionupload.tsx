// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import axios from 'axios';
// import HanchouBulkUploadModal from './bulkquestionupload';

// // No changes needed in apiClient setup
// const apiClient = axios.create({
//   baseURL: 'http://127.0.0.1:8000', 
// });

// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );


// // No changes needed in type definitions
// export interface QuestionPaper {
//   question_paper_id: number;
//   question_paper_name: string;
// }

// export interface Question {
//   id: number;
//   question_paper: number; 
//   question: string;
//   option_a: string;
//   option_b: string;
//   option_c: string;
//   option_d: string;
//   correct_answer: string;
// }

// type QuestionPayload = Omit<Question, 'id' | 'question_paper'> & { question_paper: number };


// // --- ICONS (No changes needed) ---
// const EditIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>);
// const DeleteIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
// const BookIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-8.995l11.494 0M4.753 12.747l14.494 0M4 6h16M4 18h16" /></svg>);
// const TargetIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
// const UploadCloudIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>);
// const DocumentTextIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
// const SearchIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);


// const QuestionUpload: React.FC = () => {
//     // Data states
//     const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [selectedQuestionPaperId, setSelectedQuestionPaperId] = useState<number | null>(null);
//     const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

//     // UI/Control states
//     const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isSearchFocused, setIsSearchFocused] = useState(false);
//     const [isLoading, setIsLoading] = useState({ papers: false, questions: false });
//     const searchRef = useRef<HTMLDivElement>(null);

//     // No changes needed in useEffect hooks
//     useEffect(() => {
//         const fetchPapers = async () => {
//             setIsLoading(prev => ({ ...prev, papers: true }));
//             try {
//                 const response = await apiClient.get<QuestionPaper[]>('/questionpapers/');
//                 setQuestionPapers(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch question papers:", error);
//                 alert("Could not load question papers.");
//             } finally {
//                 setIsLoading(prev => ({ ...prev, papers: false }));
//             }
//         };
//         fetchPapers();
//     }, []);

//     useEffect(() => {
//         if (!selectedQuestionPaperId) {
//             setQuestions([]);
//             return;
//         }
//         const fetchQuestions = async () => {
//             setIsLoading(prev => ({ ...prev, questions: true }));
//             try {
//                 const response = await apiClient.get<Question[]>(`/template-questions/?question_paper=${selectedQuestionPaperId}`);
//                 setQuestions(response.data);
//             } catch (error) {
//                 console.error(`Failed to fetch questions for paper ${selectedQuestionPaperId}:`, error);
//                 alert("Could not load questions for the selected paper.");
//             } finally {
//                 setIsLoading(prev => ({ ...prev, questions: false }));
//             }
//         };
//         fetchQuestions();
//     }, [selectedQuestionPaperId]);

//     // No changes needed in memos or handlers until handleFormSubmit
//     const filteredQuestionPapers = useMemo(() => {
//         if (!searchTerm) return questionPapers;
//         return questionPapers.filter(paper => 
//             paper.question_paper_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             paper.question_paper_id.toString().includes(searchTerm)
//         );
//     }, [searchTerm, questionPapers]);

//     const selectedPaperName = useMemo(() => {
//         return questionPapers.find(p => p.question_paper_id === selectedQuestionPaperId)?.question_paper_name || '';
//     }, [selectedQuestionPaperId, questionPapers]);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//                 setIsSearchFocused(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handlePaperSelect = (paper: QuestionPaper) => {
//         setSelectedQuestionPaperId(paper.question_paper_id);
//         setSearchTerm(paper.question_paper_name);
//         setIsSearchFocused(false);
//         setEditingQuestion(null);
//     };

//     const handleClearSelection = () => {
//         setSelectedQuestionPaperId(null);
//         setSearchTerm('');
//         setEditingQuestion(null);
//     };

//     const handleDelete = async (questionId: number) => {
//         if (window.confirm('Are you sure you want to delete this question?')) {
//             try {
//                 await apiClient.delete(`/template-questions/${questionId}/`);
//                 setQuestions(prev => prev.filter(q => q.id !== questionId));
//             } catch (error) {
//                 alert("Failed to delete the question.");
//             }
//         }
//     };

//     const handleEdit = (question: Question) => {
//         setEditingQuestion(question);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     // ===================================================================
//     // ===               *** CHANGE IS IMPLEMENTED HERE ***            ===
//     // ===================================================================
//     const handleFormSubmit = async (submittedQuestion: Omit<Question, 'id' | 'question_paper'>) => {
//         if (!selectedQuestionPaperId) { 
//             alert("Please select a question paper before saving."); 
//             return; 
//         }

//         // 1. Create a FormData object. This will be used for both creating and updating.
//         const formData = new FormData();
//         formData.append('question_paper', String(selectedQuestionPaperId));
//         formData.append('question', submittedQuestion.question);
//         formData.append('option_a', submittedQuestion.option_a);
//         formData.append('option_b', submittedQuestion.option_b);
//         formData.append('option_c', submittedQuestion.option_c);
//         formData.append('option_d', submittedQuestion.option_d);
//         formData.append('correct_answer', submittedQuestion.correct_answer);
        
//         try {
//             if (editingQuestion) { 
//                 // --- UPDATE ---
//                 // Send FormData with the PUT request. Axios will set the correct headers.
//                 const response = await apiClient.put<Question>(`/template-questions/${editingQuestion.id}/`, formData);
//                 setQuestions(qs => qs.map(q => q.id === response.data.id ? response.data : q));
//             } else { 
//                 // --- CREATE ---
//                 // Send FormData with the POST request.
//                 const response = await apiClient.post<Question>('/template-questions/', formData);
//                 setQuestions(qs => [...qs, response.data]);
//             }
//             setEditingQuestion(null);
//         } catch(error) {
//             alert(`Failed to save the question. Please check the console for details.`);
//             console.error("Save question error:", error);
//         }
//     };
//     // ===================================================================
//     // ===                    *** END OF CHANGE ***                    ===
//     // ===================================================================

//     const handleCancelEdit = () => setEditingQuestion(null);

//     const handleUploadSuccess = () => {
//         alert("Upload successful! Refreshing question list.");
//         if (selectedQuestionPaperId) {
//             setIsLoading(prev => ({ ...prev, questions: true }));
//             apiClient.get<Question[]>(`/template-questions/?question_paper=${selectedQuestionPaperId}`)
//                 .then(response => setQuestions(response.data))
//                 .catch(err => console.error("Failed to refetch questions:", err))
//                 .finally(() => setIsLoading(prev => ({ ...prev, questions: false })));
//         }
//     };

//     return (
//         // No changes needed in the JSX
//         <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
//                     <label htmlFor="question-paper-search" className="flex items-center gap-3 mb-2 text-lg font-bold text-gray-800">
//                         <DocumentTextIcon className="h-6 w-6 text-blue-600"/>
//                         Select Question Paper
//                     </label>
//                     <p className="text-sm text-gray-500 mb-4">Search by name or ID to view questions or add new ones.</p>
                    
//                     <div ref={searchRef} className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <SearchIcon className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                             id="question-paper-search"
//                             type="text"
//                             value={searchTerm}
//                             onChange={(e) => {
//                                 setSearchTerm(e.target.value);
//                                 if (selectedQuestionPaperId) setSelectedQuestionPaperId(null);
//                             }}
//                             onFocus={() => setIsSearchFocused(true)}
//                             placeholder="Search for a question paper..."
//                             className="block w-full px-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
//                         />
//                         {searchTerm && (
//                             <button onClick={handleClearSelection} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-800">
//                                 &#x2715;
//                             </button>
//                         )}
//                         {isSearchFocused && !selectedQuestionPaperId && (
//                             <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                 {isLoading.papers ? (
//                                     <li className="px-4 py-3 text-gray-500">Loading...</li>
//                                 ) : filteredQuestionPapers.length > 0 ? (
//                                     filteredQuestionPapers.map(paper => (
//                                         <li key={paper.question_paper_id} onClick={() => handlePaperSelect(paper)} className="px-4 py-3 cursor-pointer hover:bg-indigo-50">
//                                             <p className="font-semibold text-gray-800">{paper.question_paper_name}</p>
//                                             <p className="text-sm text-gray-500">ID: {paper.question_paper_id}</p>
//                                         </li>
//                                     ))
//                                 ) : ( <li className="px-4 py-3 text-gray-500">No results found.</li> )}
//                             </ul>
//                         )}
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//                     <div className="lg:col-span-3">
//                         <QuestionForm 
//                             key={editingQuestion ? editingQuestion.id : 'new'}
//                             existingQuestion={editingQuestion}
//                             onSubmitSuccess={handleFormSubmit}
//                             onCancel={handleCancelEdit}
//                             onBulkUploadClick={() => setIsUploadModalOpen(true)}
//                             disabled={!selectedQuestionPaperId}
//                         />
//                     </div>
//                     <div className="lg:col-span-2">
//                        <div className="bg-white p-6 rounded-xl shadow-lg h-full">
//                             <div className="flex justify-between items-center mb-4">
//                                  <div className="flex items-center gap-3">
//                                     <div className="bg-green-100 p-2 rounded-lg"><BookIcon className="h-6 w-6 text-green-600"/></div>
//                                     <h2 className="text-xl font-bold text-gray-800">Questions</h2>
//                                  </div>
//                                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
//                                     {questions.length} Questions
//                                 </span>
//                             </div>
//                             <div className="mt-4 pr-2 -mr-2 h-[70vh] overflow-y-auto">
//                                 {isLoading.questions ? (
//                                     <div className="text-center text-gray-500 pt-16">Loading questions...</div>
//                                 ) : !selectedQuestionPaperId ? (
//                                     <div className="text-center text-gray-500 pt-16">
//                                         <h3 className="font-bold text-lg">No Paper Selected</h3>
//                                         <p>Please search for and select a question paper to begin.</p>
//                                     </div>
//                                 ) : questions.length === 0 ? (
//                                     <div className="text-center text-gray-500 pt-16">
//                                         <h3 className="font-bold text-lg">No Questions Yet</h3>
//                                         <p>No questions found for <span className="font-semibold">{selectedPaperName}</span>. Add one!</p>
//                                     </div>
//                                 ) : (
//                                     <ul className="space-y-3">
//                                         {questions.map((q, index) => (
//                                             <li key={q.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg shadow-sm">
//                                                 <div className="flex justify-between items-start">
//                                                     <p className="text-gray-800 pr-4">
//                                                         <span className="font-bold text-gray-500 mr-2">{index + 1}.</span>{q.question}
//                                                     </p>
//                                                     <div className="flex items-center gap-1 flex-shrink-0">
//                                                         <button onClick={() => handleEdit(q)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><EditIcon className="h-4 w-4"/></button>
//                                                         <button onClick={() => handleDelete(q.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"><DeleteIcon className="h-4 w-4"/></button>
//                                                     </div>
//                                                 </div>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                        </div>
//                     </div>
//                 </div>
//             </div>
            
//             <HanchouBulkUploadModal
//                 isOpen={isUploadModalOpen}
//                 onClose={() => setIsUploadModalOpen(false)}
//                 onUploadSuccess={handleUploadSuccess}
//                 questionPaperId={selectedQuestionPaperId}
//             />
//         </div>
//     );
// };

// // --- FORM COMPONENT (No changes needed here) ---
// interface QuestionFormProps {
//     existingQuestion: Question | null;
//     onSubmitSuccess: (question: Omit<Question, 'id' | 'question_paper'>) => void;
//     onCancel: () => void;
//     onBulkUploadClick: () => void;
//     disabled: boolean;
// }

// const QuestionForm: React.FC<QuestionFormProps> = ({ existingQuestion, onSubmitSuccess, onCancel, onBulkUploadClick, disabled }) => {
//     const isEditing = !!existingQuestion;
//     const initialFormState = { question: '', options: ['', '', '', ''], correctAnswerIndex: null as number | null };
//     const [formData, setFormData] = useState(initialFormState);

//     useEffect(() => {
//         if (existingQuestion) {
//             const options = [existingQuestion.option_a, existingQuestion.option_b, existingQuestion.option_c, existingQuestion.option_d];
//             const correctIndex = options.findIndex(opt => opt === existingQuestion.correct_answer);
//             setFormData({ question: existingQuestion.question, options, correctAnswerIndex: correctIndex !== -1 ? correctIndex : null });
//         } else {
//             setFormData(initialFormState);
//         }
//     }, [existingQuestion]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (disabled) return;
//         if (!formData.question.trim() || formData.options.some(opt => !opt.trim()) || formData.correctAnswerIndex === null) {
//             alert('All fields are required, and a correct answer must be selected.');
//             return;
//         }
//         const payload = {
//             question: formData.question,
//             option_a: formData.options[0],
//             option_b: formData.options[1],
//             option_c: formData.options[2],
//             option_d: formData.options[3],
//             correct_answer: formData.options[formData.correctAnswerIndex!],
//         };
//         onSubmitSuccess(payload);
//         if (!isEditing) setFormData(initialFormState);
//     };
    
//     return (
//          <div className={`bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
//             <fieldset disabled={disabled}>
//                 <div className="flex justify-between items-center mb-6 border-b pb-4">
//                     <h2 className="text-xl font-bold text-gray-800">
//                         {disabled ? 'Select a Paper to Start' : isEditing ? 'Edit Question' : 'Add New Question'}
//                     </h2>
//                     {!isEditing && (
//                         <button type="button" onClick={onBulkUploadClick} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                             <UploadCloudIcon className="h-4 w-4" /> Bulk Upload
//                         </button>
//                     )}
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                       <label htmlFor="question" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><EditIcon className="h-4 w-4 text-gray-400" /> Question Text</label>
//                       <textarea id="question" rows={4} value={formData.question} onChange={(e) => setFormData(p => ({...p, question: e.target.value}))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder={disabled ? 'Select a question paper first...' : 'Enter your question here...'} />
//                     </div>
//                     <div>
//                         <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><TargetIcon className="h-4 w-4 text-gray-400"/> Answer Options</label>
//                         <div className="space-y-3 mt-1">
//                             {formData.options.map((option, index) => (
//                                <div key={index} className="flex items-center justify-between p-2 pl-4 border border-gray-300 bg-white rounded-lg shadow-sm">
//                                     <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-gray-600 font-bold mr-3 text-sm">{String.fromCharCode(65 + index)}</span>
//                                     <input type="text" value={option} onChange={(e) => { const newOptions = [...formData.options]; newOptions[index] = e.target.value; setFormData(p => ({ ...p, options: newOptions })); }} required className="w-full border-none focus:ring-0 p-1 bg-transparent" placeholder={`Option ${String.fromCharCode(65 + index)}`} />
//                                     <div className="flex items-center ml-4">
//                                       <input type="radio" id={`correct_${index}`} name="correctAnswer" checked={formData.correctAnswerIndex === index} onChange={() => setFormData(p => ({...p, correctAnswerIndex: index}))} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
//                                       <label htmlFor={`correct_${index}`} className="ml-2 text-sm text-gray-600">Correct</label>
//                                    </div>
//                                </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="flex items-center justify-end gap-3 pt-4">
//                         {isEditing && ( <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button> )}
//                         <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto">{isEditing ? 'Update Question' : 'Save Question'}</button>
//                     </div>
//                 </form>
//             </fieldset>
//          </div>
//     );
// };

// export default QuestionUpload;




import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import HanchouBulkUploadModal from './bulkquestionupload';

// No changes needed in apiClient setup
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// No changes needed in type definitions
export interface QuestionPaper {
  question_paper_id: number;
  question_paper_name: string;
}

export interface Question {
  id: number;
  question_paper: number; 
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

type QuestionPayload = Omit<Question, 'id' | 'question_paper'> & { question_paper: number };

// --- ENHANCED ICONS ---
const EditIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>);
const DeleteIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const BookIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.747-8.995l11.494 0M4.753 12.747l14.494 0M4 6h16M4 18h16" /></svg>);
const TargetIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const UploadCloudIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>);
const DocumentTextIcon = ({ className = "h-6 w-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const SearchIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const SparklesIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>);
const CheckCircleIcon = ({ className = "h-5 w-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);

const QuestionUpload: React.FC = () => {
    // Data states
    const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestionPaperId, setSelectedQuestionPaperId] = useState<number | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    // UI/Control states
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoading, setIsLoading] = useState({ papers: false, questions: false });
    const searchRef = useRef<HTMLDivElement>(null);

    // No changes needed in useEffect hooks
    useEffect(() => {
        const fetchPapers = async () => {
            setIsLoading(prev => ({ ...prev, papers: true }));
            try {
                const response = await apiClient.get<QuestionPaper[]>('/questionpapers/');
                setQuestionPapers(response.data);
            } catch (error) {
                console.error("Failed to fetch question papers:", error);
                alert("Could not load question papers.");
            } finally {
                setIsLoading(prev => ({ ...prev, papers: false }));
            }
        };
        fetchPapers();
    }, []);

    useEffect(() => {
        if (!selectedQuestionPaperId) {
            setQuestions([]);
            return;
        }
        const fetchQuestions = async () => {
            setIsLoading(prev => ({ ...prev, questions: true }));
            try {
                const response = await apiClient.get<Question[]>(`/template-questions/?question_paper=${selectedQuestionPaperId}`);
                setQuestions(response.data);
            } catch (error) {
                console.error(`Failed to fetch questions for paper ${selectedQuestionPaperId}:`, error);
                alert("Could not load questions for the selected paper.");
            } finally {
                setIsLoading(prev => ({ ...prev, questions: false }));
            }
        };
        fetchQuestions();
    }, [selectedQuestionPaperId]);

    // No changes needed in memos or handlers until handleFormSubmit
    const filteredQuestionPapers = useMemo(() => {
        if (!searchTerm) return questionPapers;
        return questionPapers.filter(paper => 
            paper.question_paper_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.question_paper_id.toString().includes(searchTerm)
        );
    }, [searchTerm, questionPapers]);

    const selectedPaperName = useMemo(() => {
        return questionPapers.find(p => p.question_paper_id === selectedQuestionPaperId)?.question_paper_name || '';
    }, [selectedQuestionPaperId, questionPapers]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePaperSelect = (paper: QuestionPaper) => {
        setSelectedQuestionPaperId(paper.question_paper_id);
        setSearchTerm(paper.question_paper_name);
        setIsSearchFocused(false);
        setEditingQuestion(null);
    };

    const handleClearSelection = () => {
        setSelectedQuestionPaperId(null);
        setSearchTerm('');
        setEditingQuestion(null);
    };

    const handleDelete = async (questionId: number) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await apiClient.delete(`/template-questions/${questionId}/`);
                setQuestions(prev => prev.filter(q => q.id !== questionId));
            } catch (error) {
                alert("Failed to delete the question.");
            }
        }
    };

    const handleEdit = (question: Question) => {
        setEditingQuestion(question);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormSubmit = async (submittedQuestion: Omit<Question, 'id' | 'question_paper'>) => {
        if (!selectedQuestionPaperId) { 
            alert("Please select a question paper before saving."); 
            return; 
        }

        const formData = new FormData();
        formData.append('question_paper', String(selectedQuestionPaperId));
        formData.append('question', submittedQuestion.question);
        formData.append('option_a', submittedQuestion.option_a);
        formData.append('option_b', submittedQuestion.option_b);
        formData.append('option_c', submittedQuestion.option_c);
        formData.append('option_d', submittedQuestion.option_d);
        formData.append('correct_answer', submittedQuestion.correct_answer);
        
        try {
            if (editingQuestion) { 
                const response = await apiClient.put<Question>(`/template-questions/${editingQuestion.id}/`, formData);
                setQuestions(qs => qs.map(q => q.id === response.data.id ? response.data : q));
            } else { 
                const response = await apiClient.post<Question>('/template-questions/', formData);
                setQuestions(qs => [...qs, response.data]);
            }
            setEditingQuestion(null);
        } catch(error) {
            alert(`Failed to save the question. Please check the console for details.`);
            console.error("Save question error:", error);
        }
    };

    const handleCancelEdit = () => setEditingQuestion(null);

    const handleUploadSuccess = () => {
        alert("Upload successful! Refreshing question list.");
        if (selectedQuestionPaperId) {
            setIsLoading(prev => ({ ...prev, questions: true }));
            apiClient.get<Question[]>(`/template-questions/?question_paper=${selectedQuestionPaperId}`)
                .then(response => setQuestions(response.data))
                .catch(err => console.error("Failed to refetch questions:", err))
                .finally(() => setIsLoading(prev => ({ ...prev, questions: false })));
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                            <DocumentTextIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Question Manager
                            </h1>
                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                <SparklesIcon className="h-4 w-4 text-yellow-500" />
                                Create and manage questions for your papers
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search Section */}
                                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
                    <label htmlFor="question-paper-search" className="flex items-center gap-3 mb-3 text-xl font-bold text-gray-800">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DocumentTextIcon className="h-6 w-6 text-blue-600"/>
                        </div>
                        Select Question Paper
                    </label>
                    <p className="text-sm text-gray-500 mb-6">Search by name or ID to view questions or add new ones.</p>
                    
                    <div ref={searchRef} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="question-paper-search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (selectedQuestionPaperId) setSelectedQuestionPaperId(null);
                            }}
                            onFocus={() => setIsSearchFocused(true)}
                            placeholder="Search for a question paper..."
                            className="block w-full px-12 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg transition-all duration-200 hover:border-gray-300"
                        />
                        {searchTerm && (
                            <button 
                                onClick={handleClearSelection} 
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        {isSearchFocused && !selectedQuestionPaperId && (
                            <ul className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                {isLoading.papers ? (
                                    <li className="px-6 py-4 text-gray-500 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                            Loading papers...
                                        </div>
                                    </li>
                                ) : filteredQuestionPapers.length > 0 ? (
                                    filteredQuestionPapers.map(paper => (
                                        <li 
                                            key={paper.question_paper_id} 
                                            onClick={() => handlePaperSelect(paper)} 
                                            className="px-6 py-4 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100 last:border-0"
                                        >
                                            <p className="font-semibold text-gray-800">{paper.question_paper_name}</p>
                                            <p className="text-sm text-gray-500 mt-1">ID: {paper.question_paper_id}</p>
                                        </li>
                                    ))
                                ) : ( 
                                    <li className="px-6 py-8 text-gray-500 text-center">
                                        <p className="font-medium">No results found</p>
                                        <p className="text-sm mt-1">Try a different search term</p>
                                    </li> 
                                )}
                            </ul>
                        )}
                    </div>
                    
                    {selectedQuestionPaperId && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium text-gray-700">Selected:</span>
                                    <span className="font-bold text-gray-900">{selectedPaperName}</span>
                                </div>
                                <button
                                    onClick={handleClearSelection}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <QuestionForm 
                            key={editingQuestion ? editingQuestion.id : 'new'}
                            existingQuestion={editingQuestion}
                            onSubmitSuccess={handleFormSubmit}
                            onCancel={handleCancelEdit}
                            onBulkUploadClick={() => setIsUploadModalOpen(true)}
                            disabled={!selectedQuestionPaperId}
                        />
                    </div>
                    <div className="lg:col-span-2">
                       <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full">
                            <div className="flex justify-between items-center mb-6">
                                 <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-md">
                                        <BookIcon className="h-6 w-6 text-white"/>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Questions</h2>
                                 </div>
                                 <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 text-sm font-bold px-4 py-2 rounded-full">
                                    {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                                </span>
                            </div>
                            <div className="mt-4 pr-2 -mr-2 h-[70vh] overflow-y-auto custom-scrollbar">
                                {isLoading.questions ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                                        <p className="font-medium">Loading questions...</p>
                                    </div>
                                ) : !selectedQuestionPaperId ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                                        <div className="bg-gray-100 rounded-full p-6 mb-4">
                                            <SearchIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <h3 className="font-bold text-xl mb-2">No Paper Selected</h3>
                                        <p className="text-center">Please search for and select a question paper to begin.</p>
                                    </div>
                                ) : questions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                                        <div className="bg-indigo-100 rounded-full p-6 mb-4">
                                            <SparklesIcon className="h-12 w-12 text-indigo-400" />
                                        </div>
                                        <h3 className="font-bold text-xl mb-2">No Questions Yet</h3>
                                        <p className="text-center">No questions found for <span className="font-semibold text-indigo-600">{selectedPaperName}</span>.</p>
                                        <p className="text-sm mt-2">Add your first question!</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {questions.map((q, index) => (
                                            <li 
                                                key={q.id} 
                                                className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 pr-4">
                                                        <div className="flex items-start gap-3">
                                                            <span className="flex items-center justify-center h-7 w-7 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg font-bold text-sm shadow-sm">
                                                                {index + 1}
                                                            </span>
                                                            <p className="text-gray-800 font-medium flex-1">{q.question}</p>
                                                        </div>
                                                        <div className="mt-2 ml-10 text-sm text-gray-600">
                                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md">
                                                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                                                {q.correct_answer}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button 
                                                            onClick={() => handleEdit(q)} 
                                                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200 hover:scale-110"
                                                            title="Edit"
                                                        >
                                                            <EditIcon className="h-4 w-4"/>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(q.id)} 
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                                                            title="Delete"
                                                        >
                                                            <DeleteIcon className="h-4 w-4"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                       </div>
                    </div>
                </div>
            </div>
            
            <HanchouBulkUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
                questionPaperId={selectedQuestionPaperId}
            />
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

// --- ENHANCED FORM COMPONENT ---
interface QuestionFormProps {
    existingQuestion: Question | null;
    onSubmitSuccess: (question: Omit<Question, 'id' | 'question_paper'>) => void;
    onCancel: () => void;
    onBulkUploadClick: () => void;
    disabled: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ existingQuestion, onSubmitSuccess, onCancel, onBulkUploadClick, disabled }) => {
    const isEditing = !!existingQuestion;
    const initialFormState = { question: '', options: ['', '', '', ''], correctAnswerIndex: null as number | null };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (existingQuestion) {
            const options = [existingQuestion.option_a, existingQuestion.option_b, existingQuestion.option_c, existingQuestion.option_d];
            const correctIndex = options.findIndex(opt => opt === existingQuestion.correct_answer);
            setFormData({ question: existingQuestion.question, options, correctAnswerIndex: correctIndex !== -1 ? correctIndex : null });
        } else {
            setFormData(initialFormState);
        }
    }, [existingQuestion]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return;
        if (!formData.question.trim() || formData.options.some(opt => !opt.trim()) || formData.correctAnswerIndex === null) {
            alert('All fields are required, and a correct answer must be selected.');
            return;
        }
        const payload = {
            question: formData.question,
            option_a: formData.options[0],
            option_b: formData.options[1],
            option_c: formData.options[2],
            option_d: formData.options[3],
            correct_answer: formData.options[formData.correctAnswerIndex!],
        };
        onSubmitSuccess(payload);
        if (!isEditing) setFormData(initialFormState);
    };
    
    return (
         <div className={`bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 ${disabled ? 'opacity-50' : ''}`}>
            <fieldset disabled={disabled}>
                <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {disabled ? 'Select a Paper to Start' : isEditing ? 'Edit Question' : 'Add New Question'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {disabled ? 'Choose a question paper from the search above' : isEditing ? 'Update the question details below' : 'Create a new question for the selected paper'}
                        </p>
                    </div>
                    {!isEditing && !disabled && (
                        <button 
                            type="button" 
                            onClick={onBulkUploadClick} 
                                                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <UploadCloudIcon className="h-4 w-4" />
                            Bulk Upload
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="question" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <EditIcon className="h-4 w-4 text-gray-400" />
                            Question Text
                        </label>
                        <textarea 
                            id="question" 
                            rows={4} 
                            value={formData.question} 
                            onChange={(e) => setFormData(p => ({...p, question: e.target.value}))} 
                            required 
                            className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 resize-none" 
                            placeholder={disabled ? 'Select a question paper first...' : 'Enter your question here...'} 
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                            <TargetIcon className="h-4 w-4 text-gray-400"/>
                            Answer Options
                        </label>
                        <div className="space-y-3">
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 border-2 border-gray-200 bg-gray-50 rounded-xl hover:border-indigo-300 transition-all duration-200 group">
                                    <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-sm">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <input 
                                        type="text" 
                                        value={option} 
                                        onChange={(e) => { 
                                            const newOptions = [...formData.options]; 
                                            newOptions[index] = e.target.value; 
                                            setFormData(p => ({ ...p, options: newOptions })); 
                                        }} 
                                        required 
                                        className="flex-1 px-3 py-2 border-0 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200" 
                                        placeholder={`Option ${String.fromCharCode(65 + index)}`} 
                                    />
                                    <div className="flex items-center">
                                        <input 
                                            type="radio" 
                                            id={`correct_${index}`} 
                                            name="correctAnswer" 
                                            checked={formData.correctAnswerIndex === index} 
                                            onChange={() => setFormData(p => ({...p, correctAnswerIndex: index}))} 
                                            className="h-5 w-5 text-green-600 border-2 border-gray-300 focus:ring-green-500 focus:ring-offset-0 cursor-pointer" 
                                        />
                                        <label 
                                            htmlFor={`correct_${index}`} 
                                            className="ml-2 text-sm font-medium text-gray-600 cursor-pointer select-none"
                                        >
                                            Correct
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {formData.correctAnswerIndex === null && (
                            <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Please select the correct answer
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                        {isEditing && ( 
                            <button 
                                type="button" 
                                onClick={onCancel} 
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                                Cancel
                            </button> 
                        )}
                        <button 
                            type="submit" 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={disabled || formData.correctAnswerIndex === null}
                        >
                            {isEditing ? 'Update Question' : 'Save Question'}
                        </button>
                    </div>
                </form>
            </fieldset>
         </div>
    );
};

export default QuestionUpload;