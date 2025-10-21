

// import React, { useState, useEffect, useRef, type ChangeEvent, type MouseEvent, type FormEvent } from 'react';

// interface CheckSheetData {
//   operatorCategory: string;
//   operatorName: string;
//   processName: string;
//   supervisorName: string;
//   evaluationStartDate: string;
//   evaluationEndDate: string;
//   level: 'Level 2' | 'Level 3' | 'Level 4';
//   topics: {
//     srNo: number;
//     topicName: string;
//     description: string;
//     days: Record<string, string>;
//   }[];
//   remarks: string;
//   score: string;
//   signatures: { supervisor: string; checkedBy: string };
//   marksObtained: string;
//   value: string;
//   result: string;
// }

// const OperatorObservanceCheckSheet: React.FC = () => {
//   const [formData, setFormData] = useState<CheckSheetData>({
//     operatorCategory: '',
//     operatorName: '',
//     processName: '',
//     supervisorName: '',
//     evaluationStartDate: '',
//     evaluationEndDate: '',
//     level: 'Level 2',
//     topics: [
//       { srNo: 1, topicName: 'Work Procedure', description: 'Does Operator understand SOP/WI?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 2, topicName: 'Work Procedure', description: 'Does Operator adhering the SOP/WI?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 3, topicName: 'Work Procedure', description: 'Does Operator know the cycle time?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 4, topicName: 'Work Procedure', description: 'Does Operator work accordance with sequence?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 5, topicName: 'Work Procedure', description: 'Does Operator know & adhere to abnormal conditions & their reaction plan?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 6, topicName: 'Quality Check Points', description: 'Does operator inspected all check point in part?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 7, topicName: 'Quality Check Points', description: 'Does operator properly identified the defective parts as per rule?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 8, topicName: 'Quality Check Points', description: 'Is line change-over procedure followed & line clearance done?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 9, topicName: 'Behavioral, Safety & Discipline', description: 'Is operator behavior OK?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 10, topicName: 'Behavioral, Safety & Discipline', description: 'Is operator maintaining the 5S on station?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 11, topicName: 'Behavioral, Safety & Discipline', description: 'Does operator working safety?', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 12, topicName: 'Cycle Time Check Points', description: 'Does operator match the cycle time? (Mention cycle time achieved) [Min] [Max] reading', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//       { srNo: 13, topicName: 'Cycle Time Check Points', description: 'Average cycle time target vs actual', days: { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' } },
//     ],
//     remarks: '',
//     score: '0%',
//     signatures: { supervisor: '', checkedBy: '' },
//     marksObtained: '',
//     value: '',
//     result: '',
//   });

//   // State for tracking clicks
//   const clickState = useRef<{ srNo: number; day: string; clickCount: number; timeout?: NodeJS.Timeout }>({ srNo: 0, day: '', clickCount: 0 });

//   // Calculate day-wise scores and overall score
//   useEffect(() => {
//     const days = getDays();
//     const totalTopics = formData.topics.length;

//     // Calculate day-wise scores
//     const dayScores: Record<string, number> = {};
//     days.forEach((day) => {
//       let dayOkCount = 0;
//       formData.topics.forEach((topic) => {
//         if (topic.days[day] === 'O') {
//           dayOkCount += 1;
//         }
//       });
//       dayScores[day] = totalTopics > 0 ? (dayOkCount / totalTopics) * 100 : 0;
//     });

//     // Calculate overall score as average of day-wise scores
//     const validDayScores = days.map(day => dayScores[day]).filter(score => score !== undefined);
//     const overallScore =
//       validDayScores.length > 0
//         ? validDayScores.reduce((sum, score) => sum + score, 0) / validDayScores.length
//         : 0;

//     setFormData((prev) => ({
//       ...prev,
//       score: `${overallScore.toFixed(2)}%`,
//       value: `${overallScore.toFixed(2)}%`,
//       result: overallScore === 100 ? 'Qualify' : 'Re-training',
//     }));
//   }, [formData.topics, formData.level]);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTopicChange = (srNo: number, day: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       topics: prev.topics.map((topic) =>
//         topic.srNo === srNo ? { ...topic, days: { ...topic.days, [day]: value } } : topic
//       ),
//     }));
//   };

//   const handleDescriptionChange = (srNo: number, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       topics: prev.topics.map((topic) =>
//         topic.srNo === srNo ? { ...topic, description: value } : topic
//       ),
//     }));
//   };

//   const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const level = e.target.value as 'Level 2' | 'Level 3' | 'Level 4';
//     setFormData((prev) => {
//       let newDays: Record<string, string> = { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' };
//       if (level === 'Level 3') {
//         newDays = { W1: '', W2: '', W3: '', W4: '' };
//       } else if (level === 'Level 4') {
//         newDays = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', Jun: '', Jul: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
//       }
//       return {
//         ...prev,
//         level,
//         topics: prev.topics.map((topic) => ({ ...topic, days: { ...newDays } })),
//       };
//     });
//   };

//   const handleDayClick = (srNo: number, day: string, event: MouseEvent<HTMLInputElement>) => {
//     event.preventDefault();

//     // Clear any existing timeout
//     if (clickState.current.timeout) {
//       clearTimeout(clickState.current.timeout);
//     }

//     // Update click state
//     if (clickState.current.srNo === srNo && clickState.current.day === day) {
//       clickState.current.clickCount += 1;
//     } else {
//       clickState.current = { srNo, day, clickCount: 1 };
//     }

//     // Set timeout to process clicks after 300ms
//     clickState.current.timeout = setTimeout(() => {
//       const { clickCount, srNo: currentSrNo, day: currentDay } = clickState.current;
//       const currentValue = formData.topics.find((t) => t.srNo === currentSrNo)?.days[currentDay] || '';

//       if (clickCount === 1 && currentValue !== 'O') {
//         handleTopicChange(currentSrNo, currentDay, 'O');
//       } else if (clickCount === 2 && currentValue !== 'X') {
//         handleTopicChange(currentSrNo, currentDay, 'X');
//       } else if (clickCount >= 3) {
//         handleTopicChange(currentSrNo, currentDay, '');
//       }

//       // Reset click state
//       clickState.current = { srNo: 0, day: '', clickCount: 0 };
//     }, 300);
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     console.log('Form Data Submitted:', formData);
//   };

//   const getDays = (): string[] => {
//     switch (formData.level) {
//       case 'Level 2':
//         return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
//       case 'Level 3':
//         return ['W1', 'W2', 'W3', 'W4'];
//       case 'Level 4':
//         return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       default:
//         return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
//     }
//   };

//   const getHeading = (): string => {
//     switch (formData.level) {
//       case 'Level 2':
//         return 'Days';
//       case 'Level 3':
//         return 'Weeks';
//       case 'Level 4':
//         return 'Months';
//       default:
//         return 'Days';
//     }
//   };

//   const getDayScores = (): Record<string, number> => {
//     const days = getDays();
//     const totalTopics = formData.topics.length;
//     const dayScores: Record<string, number> = {};
//     days.forEach((day) => {
//       let dayOkCount = 0;
//       formData.topics.forEach((topic) => {
//         if (topic.days[day] === 'O') {
//           dayOkCount += 1;
//         }
//       });
//       dayScores[day] = totalTopics > 0 ? (dayOkCount / totalTopics) * 100 : 0;
//     });
//     return dayScores;
//   };

//   const rowGroups: { start: number; end: number; topicName: string; rowSpan: number }[] = [
//     { start: 1, end: 5, topicName: 'Work Procedure', rowSpan: 5 },
//     { start: 6, end: 8, topicName: 'Quality Check Points', rowSpan: 3 },
//     { start: 9, end: 11, topicName: 'Behavioral, Safety & Discipline', rowSpan: 3 },
//     { start: 12, end: 13, topicName: 'Cycle Time Check Points', rowSpan: 2 },
//   ];

//   const dayScores = getDayScores();

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6 sm:p-8 text-white text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Operator Observance Check Sheet</h2>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6 sm:p-8">
//           <div className="mb-8">
//             <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               Trainee Information
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Operator Category</label>
//                 <div className="space-y-2">
//                   {['New Operator', 'Re-join after some time', 'Transfer from other station'].map((category) => (
//                     <label key={category} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name="operatorCategory"
//                         value={category}
//                         checked={formData.operatorCategory.includes(category)}
//                         onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                           const value = e.target.value;
//                           setFormData((prev) => ({
//                             ...prev,
//                             operatorCategory: prev.operatorCategory.includes(value)
//                               ? prev.operatorCategory.replace(value, '').replace(', ,', ',').trim()
//                               : prev.operatorCategory + (prev.operatorCategory ? ', ' : '') + value,
//                           }));
//                         }}
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-600">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Operator Name</label>
//                 <input
//                   type="text"
//                   name="operatorName"
//                   value={formData.operatorName}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Process Name</label>
//                 <input
//                   type="text"
//                   name="processName"
//                   value={formData.processName}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Name</label>
//                 <input
//                   type="text"
//                   name="supervisorName"
//                   value={formData.supervisorName}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Start Date</label>
//                 <input
//                   type="date"
//                   name="evaluationStartDate"
//                   value={formData.evaluationStartDate}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation End Date</label>
//                 <input
//                   type="date"
//                   name="evaluationEndDate"
//                   value={formData.evaluationEndDate}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
//                 <select
//                   name="level"
//                   value={formData.level}
//                   onChange={handleLevelChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 >
//                   <option value="Level 2">Level 2 (Daily)</option>
//                   <option value="Level 3">Level 3 (Weekly)</option>
//                   <option value="Level 4">Level 4 (Monthly)</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="mb-8">
//             <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 mb-4 flex items-center">
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               Training Topics & Assessment
//             </h3>
//             <div className="overflow-x-auto rounded-xl shadow-sm">
//               <table className="w-full border-collapse bg-white">
//                 <thead>
//                   <tr className="bg-indigo-700 text-white text-sm">
//                     <th className="border border-gray-200 p-2 w-12">Sr. No.</th>
//                     <th className="border border-gray-200 p-2 w-32">Topic Name</th>
//                     <th className="border border-gray-200 p-2 w-64">Procedure Description</th>
//                     {getDays().map((day) => (
//                       <th key={day} className="border border-gray-200 p-2 w-12 text-center">
//                         {day}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rowGroups.map((group) => (
//                     <React.Fragment key={group.topicName}>
//                       {formData.topics
//                         .filter((topic) => topic.srNo >= group.start && topic.srNo <= group.end)
//                         .map((topic, index) => (
//                           <tr key={topic.srNo} className="hover:bg-gray-100 transition">
//                             <td className="border border-gray-200 p-2 text-center text-sm">{topic.srNo}</td>
//                             {index === 0 && (
//                               <td
//                                 className="border border-gray-200 p-2 text-center align-middle text-sm font-medium text-gray-700"
//                                 rowSpan={group.rowSpan}
//                               >
//                                 {group.topicName}
//                               </td>
//                             )}
//                             <td className="border border-gray-200 p-2">
//                               <input
//                                 type="text"
//                                 value={topic.description}
//                                 onChange={(e: ChangeEvent<HTMLInputElement>) => handleDescriptionChange(topic.srNo, e.target.value)}
//                                 className="w-full border border-gray-200 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                               />
//                             </td>
//                             {getDays().map((day) => (
//                               <td key={day} className="border border-gray-200 p-2 text-center">
//                                 <input
//                                   type="text"
//                                   value={topic.days[day] || ''}
//                                   onClick={(e: MouseEvent<HTMLInputElement>) => handleDayClick(topic.srNo, day, e)}
//                                   className="w-8 h-8 text-center font-bold rounded-md border-2 border-gray-300 focus:outline-none cursor-pointer transition"
//                                   style={{
//                                     color: topic.days[day] === 'O' ? '#10B981' : topic.days[day] === 'X' ? '#EF4444' : '#1F2937',
//                                     backgroundColor: topic.days[day] ? '#F3F4F6' : 'white',
//                                   }}
//                                   readOnly
//                                   title="Single click for 'O' (OK), double click for 'X' (NG), triple click to clear"
//                                 />
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                     </React.Fragment>
//                   ))}
//                   <tr className="bg-blue-50 font-semibold text-gray-800">
//                     <td className="border border-gray-200 p-2 text-center text-sm" colSpan={2}>
//                       Day-wise Score
//                     </td>
//                     <td className="border border-gray-200 p-2 text-center text-sm">Total</td>
//                     {getDays().map((day) => (
//                       <td key={day} className="border border-gray-200 p-2 text-center text-sm">
//                         {dayScores[day].toFixed(2)}%
//                       </td>
//                     ))}
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Remarks: If any? (Mention details of NG observation)</label>
//             <textarea
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleInputChange}
//               className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 transition"
//               placeholder="Enter any remarks here..."
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Overall Score</label>
//               <input
//                 type="text"
//                 name="score"
//                 value={formData.score}
//                 readOnly
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
//               <input
//                 type="text"
//                 name="marksObtained"
//                 value={formData.marksObtained}
//                 onChange={handleInputChange}
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Signature</label>
//               <input
//                 type="text"
//                 name="signatures.supervisor"
//                 value={formData.signatures.supervisor}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     signatures: { ...prev.signatures, supervisor: e.target.value },
//                   }))
//                 }
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Checked By (Incharge Name)</label>
//               <input
//                 type="text"
//                 name="signatures.checkedBy"
//                 value={formData.signatures.checkedBy}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     signatures: { ...prev.signatures, checkedBy: e.target.value },
//                   }))
//                 }
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Value (%)</label>
//               <input
//                 type="text"
//                 name="value"
//                 value={formData.value}
//                 readOnly
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
//               <input
//                 type="text"
//                 name="result"
//                 value={formData.result}
//                 readOnly
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//           </div>
//           <div className="flex items-center mb-6">
//             <label className="block text-sm font-medium text-gray-700 mr-4">Legends:</label>
//             <span className="text-sm text-gray-600">
//               <span className="text-green-600 font-bold">O</span>: OK;{' '}
//               <span className="text-red-600 font-bold">X</span>: Not Good (NG); NA: Not Applicable
//             </span>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition duration-300 text-sm font-medium"
//           >
//             Submit Check Sheet
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OperatorObservanceCheckSheet;



// import React, { useState, useEffect, useRef, type ChangeEvent, type MouseEvent, type FormEvent } from 'react';

// interface CheckSheetData {
//   operatorCategory: string;
//   operatorName: string;
//   processName: string;
//   supervisorName: string;
//   evaluationStartDate: string;
//   evaluationEndDate: string;
//   level: 'Level 2' | 'Level 3' | 'Level 4';
//   topics: {
//     srNo: number;
//     topicName: string;
//     description: string;
//     days: Record<string, string>;
//   }[];
//   remarks: string;
//   score: string;
//   signatures: { supervisor: string; checkedBy: string };
//   marksObtained: string;
//   value: string;
//   result: string;
// }

// // Define the location state (example set to Level 2; can be changed to Level 3 or Level 4)
// const locationState = {
//   departmentId: 1,
//   departmentName: "Production",
//   levelId: 2,
//   levelName: "Level 2",
//   lineId: 1,
//   lineName: "IMM",
//   stationId: 1,
//   stationName: "T-160 I",
//   sublineId: null,
//   sublineName: null
// };

// const OperatorObservanceCheckSheet: React.FC = () => {
//   const [formData, setFormData] = useState<CheckSheetData>(() => {
//     const level = locationState.levelName as 'Level 2' | 'Level 3' | 'Level 4';
//     let initialDays: Record<string, string>;
//     switch (level) {
//       case 'Level 2':
//         initialDays = { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' };
//         break;
//       case 'Level 3':
//         initialDays = { W1: '', W2: '', W3: '', W4: '' };
//         break;
//       case 'Level 4':
//         initialDays = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', Jun: '', Jul: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
//         break;
//       default:
//         initialDays = { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' };
//     }
//     return {
//       operatorCategory: '',
//       operatorName: '',
//       processName: '',
//       supervisorName: '',
//       evaluationStartDate: '',
//       evaluationEndDate: '',
//       level,
//       topics: [
//         { srNo: 1, topicName: 'Work Procedure', description: 'Does Operator understand SOP/WI?', days: { ...initialDays } },
//         { srNo: 2, topicName: 'Work Procedure', description: 'Does Operator adhering the SOP/WI?', days: { ...initialDays } },
//         { srNo: 3, topicName: 'Work Procedure', description: 'Does Operator know the cycle time?', days: { ...initialDays } },
//         { srNo: 4, topicName: 'Work Procedure', description: 'Does Operator work accordance with sequence?', days: { ...initialDays } },
//         { srNo: 5, topicName: 'Work Procedure', description: 'Does Operator know & adhere to abnormal conditions & their reaction plan?', days: { ...initialDays } },
//         { srNo: 6, topicName: 'Quality Check Points', description: 'Does operator inspected all check point in part?', days: { ...initialDays } },
//         { srNo: 7, topicName: 'Quality Check Points', description: 'Does operator properly identified the defective parts as per rule?', days: { ...initialDays } },
//         { srNo: 8, topicName: 'Quality Check Points', description: 'Is line change-over procedure followed & line clearance done?', days: { ...initialDays } },
//         { srNo: 9, topicName: 'Behavioral, Safety & Discipline', description: 'Is operator behavior OK?', days: { ...initialDays } },
//         { srNo: 10, topicName: 'Behavioral, Safety & Discipline', description: 'Is operator maintaining the 5S on station?', days: { ...initialDays } },
//         { srNo: 11, topicName: 'Behavioral, Safety & Discipline', description: 'Does operator working safety?', days: { ...initialDays } },
//         { srNo: 12, topicName: 'Cycle Time Check Points', description: 'Does operator match the cycle time? (Mention cycle time achieved) [Min] [Max] reading', days: { ...initialDays } },
//         { srNo: 13, topicName: 'Cycle Time Check Points', description: 'Average cycle time target vs actual', days: { ...initialDays } },
//       ],
//       remarks: '',
//       score: '0%',
//       signatures: { supervisor: '', checkedBy: '' },
//       marksObtained: '',
//       value: '',
//       result: '',
//     };
//   });

//   // State for tracking clicks
//   const clickState = useRef<{ srNo: number; day: string; clickCount: number; timeout?: NodeJS.Timeout }>({ srNo: 0, day: '', clickCount: 0 });

//   // Calculate period-wise scores and overall score
//   useEffect(() => {
//     const periods = getPeriods();
//     const totalTopics = formData.topics.length;

//     // Calculate period-wise scores
//     const periodScores: Record<string, number> = {};
//     periods.forEach((period) => {
//       let periodOkCount = 0;
//       formData.topics.forEach((topic) => {
//         if (topic.days[period] === 'O') {
//           periodOkCount += 1;
//         }
//       });
//       periodScores[period] = totalTopics > 0 ? (periodOkCount / totalTopics) * 100 : 0;
//     });

//     // Calculate overall score as average of period-wise scores
//     const validPeriodScores = periods.map(period => periodScores[period]).filter(score => score !== undefined);
//     const overallScore =
//       validPeriodScores.length > 0
//         ? validPeriodScores.reduce((sum, score) => sum + score, 0) / validPeriodScores.length
//         : 0;

//     setFormData((prev) => ({
//       ...prev,
//       score: `${overallScore.toFixed(2)}%`,
//       value: `${overallScore.toFixed(2)}%`,
//       result: overallScore === 100 ? 'Qualify' : 'Re-training',
//     }));
//   }, [formData.topics]);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTopicChange = (srNo: number, period: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       topics: prev.topics.map((topic) =>
//         topic.srNo === srNo ? { ...topic, days: { ...topic.days, [period]: value } } : topic
//       ),
//     }));
//   };

//   const handleDescriptionChange = (srNo: number, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       topics: prev.topics.map((topic) =>
//         topic.srNo === srNo ? { ...topic, description: value } : topic
//       ),
//     }));
//   };

//   const handlePeriodClick = (srNo: number, period: string, event: MouseEvent<HTMLInputElement>) => {
//     event.preventDefault();

//     // Clear any existing timeout
//     if (clickState.current.timeout) {
//       clearTimeout(clickState.current.timeout);
//     }

//     // Update click state
//     if (clickState.current.srNo === srNo && clickState.current.day === period) {
//       clickState.current.clickCount += 1;
//     } else {
//       clickState.current = { srNo, day: period, clickCount: 1 };
//     }

//     // Set timeout to process clicks after 300ms
//     clickState.current.timeout = setTimeout(() => {
//       const { clickCount, srNo: currentSrNo, day: currentPeriod } = clickState.current;
//       const currentValue = formData.topics.find((t) => t.srNo === currentSrNo)?.days[currentPeriod] || '';

//       if (clickCount === 1 && currentValue !== 'O') {
//         handleTopicChange(currentSrNo, currentPeriod, 'O');
//       } else if (clickCount === 2 && currentValue !== 'X') {
//         handleTopicChange(currentSrNo, currentPeriod, 'X');
//       } else if (clickCount >= 3) {
//         handleTopicChange(currentSrNo, currentPeriod, '');
//       }

//       // Reset click state
//       clickState.current = { srNo: 0, day: '', clickCount: 0 };
//     }, 300);
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     console.log('Form Data Submitted:', formData);
//   };

//   const getPeriods = (): string[] => {
//     switch (formData.level) {
//       case 'Level 2':
//         return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
//       case 'Level 3':
//         return ['W1', 'W2', 'W3', 'W4'];
//       case 'Level 4':
//         return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       default:
//         return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
//     }
//   };

//   const getHeading = (): string => {
//     switch (formData.level) {
//       case 'Level 2':
//         return 'Days';
//       case 'Level 3':
//         return 'Weeks';
//       case 'Level 4':
//         return 'Months';
//       default:
//         return 'Days';
//     }
//   };

//   const getPeriodScores = (): Record<string, number> => {
//     const periods = getPeriods();
//     const totalTopics = formData.topics.length;
//     const periodScores: Record<string, number> = {};
//     periods.forEach((period) => {
//       let periodOkCount = 0;
//       formData.topics.forEach((topic) => {
//         if (topic.days[period] === 'O') {
//           periodOkCount += 1;
//         }
//       });
//       periodScores[period] = totalTopics > 0 ? (periodOkCount / totalTopics) * 100 : 0;
//     });
//     return periodScores;
//   };

//   const rowGroups: { start: number; end: number; topicName: string; rowSpan: number }[] = [
//     { start: 1, end: 5, topicName: 'Work Procedure', rowSpan: 5 },
//     { start: 6, end: 8, topicName: 'Quality Check Points', rowSpan: 3 },
//     { start: 9, end: 11, topicName: 'Behavioral, Safety & Discipline', rowSpan: 3 },
//     { start: 12, end: 13, topicName: 'Cycle Time Check Points', rowSpan: 2 },
//   ];

//   const periodScores = getPeriodScores();

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6 sm:p-8 text-white text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Operator Observance Check Sheet</h2>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6 sm:p-8">
//           <div className="mb-8">
//             <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               Trainee Information
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Operator Category</label>
//                 <div className="space-y-2">
//                   {['New Operator', 'Re-join after some time', 'Transfer from other station'].map((category) => (
//                     <label key={category} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name="operatorCategory"
//                         value={category}
//                         checked={formData.operatorCategory.includes(category)}
//                         onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                           const value = e.target.value;
//                           setFormData((prev) => ({
//                             ...prev,
//                             operatorCategory: prev.operatorCategory.includes(value)
//                               ? prev.operatorCategory.replace(value, '').replace(', ,', ',').trim()
//                               : prev.operatorCategory + (prev.operatorCategory ? ', ' : '') + value,
//                           }));
//                         }}
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-600">{category}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Operator Name</label>
//                 <input
//                   type="text"
//                   name="operatorName"
//                   value={formData.operatorName}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Process Name</label>
//                 <input
//                   type="text"
//                   name="processName"
//                   value={formData.processName}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Name</label>
//                 <input
//                   type="text"
//                   name="supervisorName"
//                   value={formData.supervisorName}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Start Date</label>
//                 <input
//                   type="date"
//                   name="evaluationStartDate"
//                   value={formData.evaluationStartDate}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation End Date</label>
//                 <input
//                   type="date"
//                   name="evaluationEndDate"
//                   value={formData.evaluationEndDate}
//                   onChange={handleInputChange}
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
//                 <input
//                   type="text"
//                   value={formData.level}
//                   readOnly
//                   className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="mb-8">
//             <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 mb-4 flex items-center">
//               <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               Training Topics & Assessment
//             </h3>
//             <div className="overflow-x-auto rounded-xl shadow-sm">
//               <table className="w-full border-collapse bg-white">
//                 <thead>
//                   <tr className="bg-indigo-700 text-white text-sm">
//                     <th className="border border-gray-200 p-2 w-12">Sr. No.</th>
//                     <th className="border border-gray-200 p-2 w-32">Topic Name</th>
//                     <th className="border border-gray-200 p-2 w-64">Procedure Description</th>
//                     {getPeriods().map((period) => (
//                       <th key={period} className="border border-gray-200 p-2 w-12 text-center">
//                         {period}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rowGroups.map((group) => (
//                     <React.Fragment key={group.topicName}>
//                       {formData.topics
//                         .filter((topic) => topic.srNo >= group.start && topic.srNo <= group.end)
//                         .map((topic, index) => (
//                           <tr key={topic.srNo} className="hover:bg-gray-100 transition">
//                             <td className="border border-gray-200 p-2 text-center text-sm">{topic.srNo}</td>
//                             {index === 0 && (
//                               <td
//                                 className="border border-gray-200 p-2 text-center align-middle text-sm font-medium text-gray-700"
//                                 rowSpan={group.rowSpan}
//                               >
//                                 {group.topicName}
//                               </td>
//                             )}
//                             <td className="border border-gray-200 p-2">
//                               <input
//                                 type="text"
//                                 value={topic.description}
//                                 onChange={(e: ChangeEvent<HTMLInputElement>) => handleDescriptionChange(topic.srNo, e.target.value)}
//                                 className="w-full border border-gray-200 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                               />
//                             </td>
//                             {getPeriods().map((period) => (
//                               <td key={period} className="border border-gray-200 p-2 text-center">
//                                 <input
//                                   type="text"
//                                   value={topic.days[period] || ''}
//                                   onClick={(e: MouseEvent<HTMLInputElement>) => handlePeriodClick(topic.srNo, period, e)}
//                                   className="w-8 h-8 text-center font-bold rounded-md border-2 border-gray-300 focus:outline-none cursor-pointer transition"
//                                   style={{
//                                     color: topic.days[period] === 'O' ? '#10B981' : topic.days[period] === 'X' ? '#EF4444' : '#1F2937',
//                                     backgroundColor: topic.days[period] ? '#F3F4F6' : 'white',
//                                   }}
//                                   readOnly
//                                   title="Single click for 'O' (OK), double click for 'X' (NG), triple click to clear"
//                                 />
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                     </React.Fragment>
//                   ))}
//                   <tr className="bg-blue-50 font-semibold text-gray-800">
//                     <td className="border border-gray-200 p-2 text-center text-sm" colSpan={2}>
//                       {getHeading()}-wise Score
//                     </td>
//                     <td className="border border-gray-200 p-2 text-center text-sm">Total</td>
//                     {getPeriods().map((period) => (
//                       <td key={period} className="border border-gray-200 p-2 text-center text-sm">
//                         {periodScores[period].toFixed(2)}%
//                       </td>
//                     ))}
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Remarks: If any? (Mention details of NG observation)</label>
//             <textarea
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleInputChange}
//               className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 transition"
//               placeholder="Enter any remarks here..."
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Overall Score</label>
//               <input
//                 type="text"
//                 name="score"
//                 value={formData.score}
//                 readOnly
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
//               <input
//                 type="text"
//                 name="marksObtained"
//                 value={formData.marksObtained}
//                 onChange={handleInputChange}
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Signature</label>
//               <input
//                 type="text"
//                 name="signatures.supervisor"
//                 value={formData.signatures.supervisor}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     signatures: { ...prev.signatures, supervisor: e.target.value },
//                   }))
//                 }
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Checked By (Incharge Name)</label>
//               <input
//                 type="text"
//                 name="signatures.checkedBy"
//                 value={formData.signatures.checkedBy}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     signatures: { ...prev.signatures, checkedBy: e.target.value },
//                   }))
//                 }
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Value (%)</label>
//               <input
//                 type="text"
//                 name="value"
//                 value={formData.value}
//                 readOnly
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
//               <input
//                 type="text"
//                 name="result"
//                 value={formData.result}
//                 readOnly
//                 className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//           </div>
//           <div className="flex items-center mb-6">
//             <label className="block text-sm font-medium text-gray-700 mr-4">Legends:</label>
//             <span className="text-sm text-gray-600">
//               <span className="text-green-600 font-bold">O</span>: OK;{' '}
//               <span className="text-red-600 font-bold">X</span>: Not Good (NG); NA: Not Applicable
//             </span>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition duration-300 text-sm font-medium"
//           >
//             Submit Check Sheet
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OperatorObservanceCheckSheet;





import React, { useState, useEffect, useRef, type ChangeEvent, type MouseEvent, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';

interface CheckSheetData {
  operatorCategory: string;
  operatorName: string;
  processName: string;
  supervisorName: string;
  evaluationStartDate: string;
  evaluationEndDate: string;
  level: 'Level 2' | 'Level 3' | 'Level 4';
  topics: {
    srNo: number;
    topicName: string;
    description: string;
    days: Record<string, string>;
  }[];
  remarks: string;
  score: string;
  signatures: { supervisor: string; checkedBy: string };
  marksObtained: string;
  value: string;
  result: string;
}

interface LocationState {
  stationId: number;
  stationName: string;
  sublineId: number | null;
  sublineName: string | null;
  lineId: number | null;
  lineName: string | null;
  departmentId: number;
  departmentName: string | null;
  levelId: number;
  levelName: string;
}

const OperatorObservanceCheckSheet: React.FC = () => {
  const location = useLocation();
  const locationState = (location.state as LocationState) || undefined;

  // Validate locationState
  if (!locationState?.stationId || !locationState?.levelId || !locationState?.levelName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Missing Required Information</h2>
          <p className="text-gray-600">Station ID, Level ID, and Level Name are required.</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState<CheckSheetData>(() => {
    // Validate and set level from locationState
    const validLevels = ['Level 2', 'Level 3', 'Level 4'];
    const level = validLevels.includes(locationState.levelName)
      ? (locationState.levelName as 'Level 2' | 'Level 3' | 'Level 4')
      : 'Level 2'; // Fallback to Level 2 if invalid

    // Initialize periods based on level
    let initialDays: Record<string, string>;
    switch (level) {
      case 'Level 2':
        initialDays = { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' };
        break;
      case 'Level 3':
        initialDays = { W1: '', W2: '', W3: '', W4: '' };
        break;
      case 'Level 4':
        initialDays = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', Jun: '', Jul: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        break;
      default:
        initialDays = { D1: '', D2: '', D3: '', D4: '', D5: '', D6: '' };
    }

    return {
      operatorCategory: '',
      operatorName: '',
      processName: '',
      supervisorName: '',
      evaluationStartDate: '',
      evaluationEndDate: '',
      level,
      topics: [
        { srNo: 1, topicName: 'Work Procedure', description: 'Does Operator understand SOP/WI?', days: { ...initialDays } },
        { srNo: 2, topicName: 'Work Procedure', description: 'Does Operator adhering the SOP/WI?', days: { ...initialDays } },
        { srNo: 3, topicName: 'Work Procedure', description: 'Does Operator know the cycle time?', days: { ...initialDays } },
        { srNo: 4, topicName: 'Work Procedure', description: 'Does Operator work accordance with sequence?', days: { ...initialDays } },
        { srNo: 5, topicName: 'Work Procedure', description: 'Does Operator know & adhere to abnormal conditions & their reaction plan?', days: { ...initialDays } },
        { srNo: 6, topicName: 'Quality Check Points', description: 'Does operator inspected all check point in part?', days: { ...initialDays } },
        { srNo: 7, topicName: 'Quality Check Points', description: 'Does operator properly identified the defective parts as per rule?', days: { ...initialDays } },
        { srNo: 8, topicName: 'Quality Check Points', description: 'Is line change-over procedure followed & line clearance done?', days: { ...initialDays } },
        { srNo: 9, topicName: 'Behavioral, Safety & Discipline', description: 'Is operator behavior OK?', days: { ...initialDays } },
        { srNo: 10, topicName: 'Behavioral, Safety & Discipline', description: 'Is operator maintaining the 5S on station?', days: { ...initialDays } },
        { srNo: 11, topicName: 'Behavioral, Safety & Discipline', description: 'Does operator working safety?', days: { ...initialDays } },
        { srNo: 12, topicName: 'Cycle Time Check Points', description: 'Does operator match the cycle time? (Mention cycle time achieved) [Min] [Max] reading', days: { ...initialDays } },
        { srNo: 13, topicName: 'Cycle Time Check Points', description: 'Average cycle time target vs actual', days: { ...initialDays } },
      ],
      remarks: '',
      score: '0%',
      signatures: { supervisor: '', checkedBy: '' },
      marksObtained: '',
      value: '',
      result: '',
    };
  });

  // State for tracking clicks
  const clickState = useRef<{ srNo: number; period: string; clickCount: number; timeout?: NodeJS.Timeout }>({ srNo: 0, period: '', clickCount: 0 });

  // Calculate period-wise scores and overall score
  useEffect(() => {
    const periods = getPeriods();
    const totalTopics = formData.topics.length;

    // Calculate period-wise scores
    const periodScores: Record<string, number> = {};
    periods.forEach((period) => {
      let periodOkCount = 0;
      formData.topics.forEach((topic) => {
        if (topic.days[period] === 'O') {
          periodOkCount += 1;
        }
      });
      periodScores[period] = totalTopics > 0 ? (periodOkCount / totalTopics) * 100 : 0;
    });

    // Calculate overall score as average of period-wise scores
    const validPeriodScores = periods.map(period => periodScores[period]).filter(score => score !== undefined);
    const overallScore =
      validPeriodScores.length > 0
        ? validPeriodScores.reduce((sum, score) => sum + score, 0) / validPeriodScores.length
        : 0;

    setFormData((prev) => ({
      ...prev,
      score: `${overallScore.toFixed(2)}%`,
      value: `${overallScore.toFixed(2)}%`,
      result: overallScore === 100 ? 'Qualify' : 'Re-training',
    }));
  }, [formData.topics]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (srNo: number, period: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) =>
        topic.srNo === srNo ? { ...topic, days: { ...topic.days, [period]: value } } : topic
      ),
    }));
  };

  const handleDescriptionChange = (srNo: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) =>
        topic.srNo === srNo ? { ...topic, description: value } : topic
      ),
    }));
  };

  const handlePeriodClick = (srNo: number, period: string, event: MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    // Clear any existing timeout
    if (clickState.current.timeout) {
      clearTimeout(clickState.current.timeout);
    }

    // Update click state
    if (clickState.current.srNo === srNo && clickState.current.period === period) {
      clickState.current.clickCount += 1;
    } else {
      clickState.current = { srNo, period, clickCount: 1 };
    }

    // Set timeout to process clicks after 300ms
    clickState.current.timeout = setTimeout(() => {
      const { clickCount, srNo: currentSrNo, period: currentPeriod } = clickState.current;
      const currentValue = formData.topics.find((t) => t.srNo === currentSrNo)?.days[currentPeriod] || '';

      if (clickCount === 1 && currentValue !== 'O') {
        handleTopicChange(currentSrNo, currentPeriod, 'O');
      } else if (clickCount === 2 && currentValue !== 'X') {
        handleTopicChange(currentSrNo, currentPeriod, 'X');
      } else if (clickCount >= 3) {
        handleTopicChange(currentSrNo, currentPeriod, '');
      }

      // Reset click state
      clickState.current = { srNo: 0, period: '', clickCount: 0 };
    }, 300);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  const getPeriods = (): string[] => {
    switch (formData.level) {
      case 'Level 2':
        return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
      case 'Level 3':
        return ['W1', 'W2', 'W3', 'W4'];
      case 'Level 4':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
    }
  };

  const getHeading = (): string => {
    switch (formData.level) {
      case 'Level 2':
        return 'Days';
      case 'Level 3':
        return 'Weeks';
      case 'Level 4':
        return 'Months';
      default:
        return 'Days';
    }
  };

  const getPeriodScores = (): Record<string, number> => {
    const periods = getPeriods();
    const totalTopics = formData.topics.length;
    const periodScores: Record<string, number> = {};
    periods.forEach((period) => {
      let periodOkCount = 0;
      formData.topics.forEach((topic) => {
        if (topic.days[period] === 'O') {
          periodOkCount += 1;
        }
      });
      periodScores[period] = totalTopics > 0 ? (periodOkCount / totalTopics) * 100 : 0;
    });
    return periodScores;
  };

  const rowGroups: { start: number; end: number; topicName: string; rowSpan: number }[] = [
    { start: 1, end: 5, topicName: 'Work Procedure', rowSpan: 5 },
    { start: 6, end: 8, topicName: 'Quality Check Points', rowSpan: 3 },
    { start: 9, end: 11, topicName: 'Behavioral, Safety & Discipline', rowSpan: 3 },
    { start: 12, end: 13, topicName: 'Cycle Time Check Points', rowSpan: 2 },
  ];

  const periodScores = getPeriodScores();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6 sm:p-8 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Operator Observance Check Sheet</h2>
          <p className="text-sm mt-2">{locationState.stationName} - {locationState.levelName}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Trainee Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operator Category</label>
                <div className="space-y-2">
                  {['New Operator', 'Re-join after some time', 'Transfer from other station'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        name="operatorCategory"
                        value={category}
                        checked={formData.operatorCategory.includes(category)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            operatorCategory: prev.operatorCategory.includes(value)
                              ? prev.operatorCategory.replace(value, '').replace(', ,', ',').trim()
                              : prev.operatorCategory + (prev.operatorCategory ? ', ' : '') + value,
                          }));
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operator Name</label>
                <input
                  type="text"
                  name="operatorName"
                  value={formData.operatorName}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Process Name</label>
                <input
                  type="text"
                  name="processName"
                  value={formData.processName}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Name</label>
                <input
                  type="text"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Start Date</label>
                <input
                  type="date"
                  name="evaluationStartDate"
                  value={formData.evaluationStartDate}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation End Date</label>
                <input
                  type="date"
                  name="evaluationEndDate"
                  value={formData.evaluationEndDate}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">Level</label> */}
                {/* <input
                  type="text"
                //   value={formData.level}
                  readOnly
                  className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
                /> */}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Training Topics & Assessment
            </h3>
            <div className="overflow-x-auto rounded-xl shadow-sm">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-indigo-700 text-white text-sm">
                    <th className="border border-gray-200 p-2 w-12">Sr. No.</th>
                    <th className="border border-gray-200 p-2 w-32">Topic Name</th>
                    <th className="border border-gray-200 p-2 w-64">Procedure Description</th>
                    {getPeriods().map((period) => (
                      <th key={period} className="border border-gray-200 p-2 w-12 text-center">
                        {period}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowGroups.map((group) => (
                    <React.Fragment key={group.topicName}>
                      {formData.topics
                        .filter((topic) => topic.srNo >= group.start && topic.srNo <= group.end)
                        .map((topic, index) => (
                          <tr key={topic.srNo} className="hover:bg-gray-100 transition">
                            <td className="border border-gray-200 p-2 text-center text-sm">{topic.srNo}</td>
                            {index === 0 && (
                              <td
                                className="border border-gray-200 p-2 text-center align-middle text-sm font-medium text-gray-700"
                                rowSpan={group.rowSpan}
                              >
                                {group.topicName}
                              </td>
                            )}
                            <td className="border border-gray-200 p-2">
                              <input
                                type="text"
                                value={topic.description}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDescriptionChange(topic.srNo, e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                              />
                            </td>
                            {getPeriods().map((period) => (
                              <td key={period} className="border border-gray-200 p-2 text-center">
                                <input
                                  type="text"
                                  value={topic.days[period] || ''}
                                  onClick={(e: MouseEvent<HTMLInputElement>) => handlePeriodClick(topic.srNo, period, e)}
                                  className="w-8 h-8 text-center font-bold rounded-md border-2 border-gray-300 focus:outline-none cursor-pointer transition"
                                  style={{
                                    color: topic.days[period] === 'O' ? '#10B981' : topic.days[period] === 'X' ? '#EF4444' : '#1F2937',
                                    backgroundColor: topic.days[period] ? '#F3F4F6' : 'white',
                                  }}
                                  readOnly
                                  title="Single click for 'O' (OK), double click for 'X' (NG), triple click to clear"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                  <tr className="bg-blue-50 font-semibold text-gray-800">
                    <td className="border border-gray-200 p-2 text-center text-sm" colSpan={2}>
                      {getHeading()}-wise Score
                    </td>
                    <td className="border border-gray-200 p-2 text-center text-sm">Total</td>
                    {getPeriods().map((period) => (
                      <td key={period} className="border border-gray-200 p-2 text-center text-sm">
                        {periodScores[period].toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks: If any? (Mention details of NG observation)</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 transition"
              placeholder="Enter any remarks here..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Score</label>
              <input
                type="text"
                name="score"
                value={formData.score}
                readOnly
                className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
              <input
                type="text"
                name="marksObtained"
                value={formData.marksObtained}
                onChange={handleInputChange}
                className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Signature</label>
              <input
                type="text"
                name="signatures.supervisor"
                value={formData.signatures.supervisor}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    signatures: { ...prev.signatures, supervisor: e.target.value },
                  }))
                }
                className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Checked By (Incharge Name)</label>
              <input
                type="text"
                name="signatures.checkedBy"
                value={formData.signatures.checkedBy}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    signatures: { ...prev.signatures, checkedBy: e.target.value },
                  }))
                }
                className="block w-full border border-gray-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value (%)</label>
              <input
                type="text"
                name="value"
                value={formData.value}
                readOnly
                className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
              <input
                type="text"
                name="result"
                value={formData.result}
                readOnly
                className="block w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex items-center mb-6">
            <label className="block text-sm font-medium text-gray-700 mr-4">Legends:</label>
            <span className="text-sm text-gray-600">
              <span className="text-green-600 font-bold">O</span>: OK;{' '}
              <span className="text-red-600 font-bold">X</span>: Not Good (NG); NA: Not Applicable
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition duration-300 text-sm font-medium"
          >
            Submit Check Sheet
          </button>
        </form>
      </div>
    </div>
  );
};

export default OperatorObservanceCheckSheet;