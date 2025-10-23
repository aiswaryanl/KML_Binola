// // OJTForm.tsx - Updated with proper quantity structure

// import React, { useState, useEffect } from 'react';
// import type { AssessmentMode, TrainingTopic, FormData, QuantityEvaluation } from '../../constants/types';
// import OJTHeader from '../../molecules/OJTHeader/OJTHeader';
// import OJTSettingsPanel from '../../molecules/OJTSettingsPanel/OJTSettingsPanel';
// import TraineeInfoForm from '../../molecules/TraineeInfoForm/TraineeInfoForm';
// import QualityAssessmentForm from '../../molecules/QualityAssessmentForm/QualityAssessmentForm';
// import QuantityAssessmentForm from '../../molecules/QuantityAssessmentForm/QuantityAssessmentForm';
// import QualityAssessmentCriteria from '../../molecules/QualityAssessmentCriteria/QualityAssessmentCriteria';
// import ProductionMarkingScheme from '../../molecules/ProductionMarkingScheme/ProductionMarkingScheme';
// import JudgmentCriteria from '../../molecules/JudgmentCriteria/JudgmentCriteria';
// import SignaturesSection from '../../molecules/SignaturesSection/SignaturesSection';
// import { useLocation } from 'react-router-dom';
// import { ojtApi } from '../../hooks/ServiceApis';

// interface ApiTopic {
//   id?: number;
//   topic_id?: number;
//   topic_name?: string;
//   topic?: string;
//   sl_no?: number;
//   category?: string;
// }

// interface ApiDay {
//   id: number;
//   name: string;
//   department: number;
//   level: number;
// }

// interface QuantityScoreRange {
//   id: number;
//   department: number;
//   level: number;
//   score_type: "production" | "rejection";
//   min_value: string;
//   max_value: string;
//   marks: number;
// }

// const OJTForm: React.FC = () => {
//   const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('quality');
//   const [isLoading, setIsLoading] = useState(true);
//   const location = useLocation();
//   const [scoreRanges, setScoreRanges] = useState<{ min_score: number; max_score: number } | null>(null);
//   const [criteria, setCriteria] = useState<number[]>([]);
//   const [quantityCriteria, setQuantityCriteria] = useState<{
//     production_passing_percentage: number;
//     rejection_passing_percentage: number;
//   } | null>(null);

//   const [quantityScoreRange, setQuantityScoreRange] = useState<any[] | null>(null);

//   // Extract data from location.state
//   const locationState = location.state || {};

//   const [qualityTopics, setQualityTopics] = useState<TrainingTopic[]>([]);
//   const [quantityTopics, setQuantityTopics] = useState<TrainingTopic[]>([]);
//   const [days, setDays] = useState<string[]>([]);
//   const [dayIdMapping, setDayIdMapping] = useState<Record<string, number>>({});
//   const [existingOjtId, setExistingOjtId] = useState<number | null>(null);
//   const [quantityEvaluations, setQuantityEvaluations] = useState<QuantityEvaluation[]>([]);
//   const [existingQuantityId, setExistingQuantityId] = useState<number | null>(null);
//   const [lastFilledDayIndex, setLastFilledDayIndex] = useState<number>(-1);
//   const [assessmentModeLoaded, setAssessmentModeLoaded] = useState(false);
//   // Add status state for quantity assessment
//   const [status, setStatus] = useState<string>('Pending');

//   const [assessmentResult, setAssessmentResult] = useState<'Pass' | 'Fail' | 'Pending'>('Pending');

//   const [formData, setFormData] = useState<FormData>({
//     traineeInfo: {
//       name: locationState.employeeName || '',
//       id: locationState.employeeId || '',
//       empNo: locationState.employeeId || '',
//       stationName: locationState.stationName || '',
//       lineName: locationState.lineName || '',
//       processName: locationState.sublineName || '',
//       revisionDate: new Date().toISOString().split('T')[0],
//       doi: new Date().toISOString().split('T')[0],
//       trainerName: '',
//       trainerLine: locationState.lineName || '',
//     },
//     dailyScores: {},
//     signatures: {
//       preparedBy: '',
//       approvedBy: '',
//       engineerJudge: '',
//     },
//   });

//   // console.log(formData);

// const fetchAssessmentMode = async () => {
//   try {
//     const data = await ojtApi.getAssessmentMode();
//     setAssessmentMode(data.mode);
//     setAssessmentModeLoaded(true);         // <--- important
//     // console.log('Current assessment mode:', data.mode);
//   } catch (error) {
//     console.error('Error fetching assessment mode:', error);
//     setAssessmentModeLoaded(true);         // still mark loaded to avoid blocking forever
//   }
// };


//   const fetchScoreRanges = async () => {
//     try {
//       const data = await ojtApi.getScoreRanges(
//         locationState.departmentId,
//         locationState.levelId
//       );

//       if (data && data.length > 0) {
//         setScoreRanges({
//           min_score: data[0].min_score,
//           max_score: data[0].max_score
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching score ranges:", error);
//     }
//   };

//   const fetchCriteria = async () => {
//     try {
//       const existingCriteria = await ojtApi.getPassingCriteria(
//         locationState.departmentId,
//         locationState.levelId
//       );

//       // console.log(existingCriteria)

//       if (Array.isArray(existingCriteria) && existingCriteria.length > 0) {
//         const sortedCriteria = existingCriteria.sort((a: any, b: any) => a.day - b.day);
//         const percentages = sortedCriteria.map((c: any) => {
//           return c.percentage;
//         });
//         setCriteria(percentages);
//       } else {
//         setCriteria([]);
//       }
//     } catch (error) {
//       console.error("Error fetching criteria:", error);
//       setCriteria([]);
//     }
//   };

//   const fetchQuantityScoreRange = async () => {
//     try {
//       const data = await ojtApi.getQuantityScoreRanges(
//         locationState.departmentId,
//         locationState.levelId
//       );

//       // console.log("quantity data", data);

//       if (Array.isArray(data) && data.length > 0) {
//         setQuantityScoreRange(data);
//       } else {
//         setQuantityScoreRange(null);
//       }
//     } catch (error) {
//       console.error("Error fetching quantity score range:", error);
//       setQuantityScoreRange(null);
//     }
//   };

//   const fetchQuantityPassingCriteria = async () => {
//     try {
//       const data = await ojtApi.getQuantityPassingCriteria(
//         locationState.departmentId,
//         locationState.levelId
//       );

//       if (Array.isArray(data) && data.length > 0) {
//         setQuantityCriteria({
//           production_passing_percentage: parseFloat(data[0].production_passing_percentage),
//           rejection_passing_percentage: parseFloat(data[0].rejection_passing_percentage),
//         });
//       } else {
//         setQuantityCriteria(null);
//       }
//     } catch (error) {
//       console.error("Error fetching quantity passing criteria:", error);
//       setQuantityCriteria(null);
//     }
//   };

  

//   // Fetch topics and days based on department and level from location state
//   useEffect(() => {
//     const fetchFormData = async () => {
//       if (!locationState?.departmentId || !locationState?.levelId) {
//         console.error('Department ID or Level ID not found in location state');
//         setIsLoading(false);
//         return;
//       }

//       try {
//         setIsLoading(true);

//         // Fetch quality topics
//         const qualityTopicsData: any[] = await ojtApi.getTopics(
//           locationState.departmentId,
//           locationState.levelId
//         );

//         const transformedQualityTopics: TrainingTopic[] = qualityTopicsData.map((topic: ApiTopic) => ({
//           id: topic.id || topic.topic_id || 0,
//           description: topic.topic || topic.topic_name || '',
//           category: topic.category || 'Technical Knowledge'
//         }));

//         setQualityTopics(transformedQualityTopics);

//         // For quantity topics, we'll use a default set since they're different from quality topics
//         setQuantityTopics([
//           { id: 1, description: 'Production Quantity', category: 'Production' },
//           { id: 2, description: 'Quality (Number of Rejections)', category: 'Quality' },
//         ]);

//         // Fetch days
//         const daysData: ApiDay[] = await ojtApi.getDays(
//           locationState.departmentId,
//           locationState.levelId
//         );

//         // Create mapping between day names and their actual IDs
//         const dayMapping: Record<string, number> = {};
//         const transformedDays: string[] = daysData.map((day: ApiDay) => {
//           const dayName = day.name || `Day-${day.id}`;
//           dayMapping[dayName] = day.id;
//           return dayName;
//         });

//         setDays(transformedDays);
//         setDayIdMapping(dayMapping);

//       } catch (error) {
//         console.error('Error fetching form data:', error);
//         // Fallback to default data if API fails
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFormData();
//     fetchScoreRanges();
//     fetchCriteria();
//     fetchQuantityPassingCriteria();
//     fetchQuantityScoreRange();
//     fetchAssessmentMode();
//   }, [locationState]);


//   useEffect(() => {
//   if (!assessmentModeLoaded) return;

//   if (assessmentMode === 'quantity') {
//     // remove quality scores when in quantity mode
//     setFormData(prev => ({ ...prev, dailyScores: {} }));
//   } else {
//     // remove quantity evaluations when in quality mode
//     setQuantityEvaluations([]);
//     setExistingQuantityId(null);
//     setStatus('Pending');
//   }
// }, [assessmentMode, assessmentModeLoaded]);

//   // Fetch existing data based on assessment mode
//   useEffect(() => {
//     const fetchExistingData = async () => {
//        if (!assessmentModeLoaded) return;
//       if (!locationState?.employeeId || !locationState?.stationName) return;

//       try {
//         if (assessmentMode === 'quality') {
//           const data: any[] = await ojtApi.getQualityTraineeInfoList(
//             locationState.employeeId,
//             locationState.stationName
//           );

//           if (data && data.length > 0) {
//             const ojtRecord = data[0];
//             setExistingOjtId(ojtRecord.id);

//             setAssessmentResult(ojtRecord.status || 'Pending');

//             const prefilledScores: Record<number, Record<string, string>> = {};
//             ojtRecord.scores_data.forEach((scoreItem: any) => {
//               const dayName = Object.keys(dayIdMapping).find(
//                 (key) => dayIdMapping[key] === scoreItem.day
//               ) || `Day-${scoreItem.day}`;
//               if (!prefilledScores[scoreItem.topic]) prefilledScores[scoreItem.topic] = {};
//               prefilledScores[scoreItem.topic][dayName] = String(scoreItem.score);
//             });

//             let lastIndex = -1;
//             Object.values(prefilledScores).forEach((dayScores) => {
//               days.forEach((day, i) => {
//                 if (dayScores[day]) {
//                   lastIndex = Math.max(lastIndex, i);
//                 }
//               });
//             });
//             setLastFilledDayIndex(lastIndex);

//             setFormData((prev) => ({
//               ...prev,
//               traineeInfo: {
//                 name: ojtRecord.trainee_name,
//                 id: ojtRecord.trainer_id,
//                 empNo: ojtRecord.emp_id,
//                 stationName: ojtRecord.station,
//                 lineName: ojtRecord.line,
//                 processName: ojtRecord.subline,
//                 revisionDate: ojtRecord.revision_date,
//                 doi: ojtRecord.doj,
//                 trainerName: ojtRecord.trainer_name,
//                 trainerLine: ojtRecord.line,
//               },
//               dailyScores: prefilledScores,
//             }));
//           }
//         } else {
//           // Quantity mode
//           const data: any[] = await ojtApi.getQuantityTraineeInfoList(
//             locationState.employeeId,
//             locationState.levelId,
//             locationState.stationName,
//           );
//           // console.log('Quantity fetch', data);

//           if (data && data.length > 0) {
//             const quantityRecord = data[0];
//             setExistingQuantityId(quantityRecord.id);
//             setQuantityEvaluations(quantityRecord.evaluations_data || []);
//             setStatus(quantityRecord.status || 'Pending');
//             setAssessmentResult(quantityRecord.status || 'Pending');

//             // Update form data with existing quantity record
//             setFormData(prev => ({
//               ...prev,
//               traineeInfo: {
//                 ...prev.traineeInfo,
//                 name: quantityRecord.trainee_name || locationState.employeeName || '',
//                 id: quantityRecord.trainee_id || locationState.employeeId || '',
//                 empNo: quantityRecord.emp_id || locationState.employeeId || '',
//                 stationName: quantityRecord.station_name || locationState.stationName || '',
//                 lineName: quantityRecord.line_name || locationState.lineName || '',
//                 processName: quantityRecord.process_name || locationState.sublineName || '',
//                 revisionDate: quantityRecord.revision_date || new Date().toISOString().split('T')[0],
//                 doi: quantityRecord.doj || new Date().toISOString().split('T')[0],
//                 trainerName: quantityRecord.trainer_name || '',
//                 trainerLine: quantityRecord.line_name || locationState.lineName || '',
//               },
//               signatures: {
//                 ...prev.signatures,
//                 engineerJudge: quantityRecord.engineer_judge || '',
//               }
//             }));
//           } else {
//             // If no existing data, initialize with one empty evaluation
//             setQuantityEvaluations([
//               {
//                 day: 1,
//                 date: new Date().toISOString().split('T')[0],
//                 plan: 0,
//                 production_actual: 0,
//                 production_marks: 0,
//                 rejection_marks: 0,
//                 number_of_rejections: 0
//               }
//             ]);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setAssessmentResult('Pending'); // Reset on error
//         setStatus('Pending'); // Also reset status on error

//         if (assessmentMode === 'quantity') {
//           setQuantityEvaluations([
//             {
//               day: 1,
//               date: new Date().toISOString().split('T')[0],
//               plan: 0,
//               production_actual: 0,
//               production_marks: 0,
//               rejection_marks: 0,
//               number_of_rejections: 0
//             }
//           ]);
//         }
//       }
//     };

//     fetchExistingData();
//   }, [assessmentMode, locationState, dayIdMapping]);

//   const handleInputChange = (section: string, field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section as keyof FormData],
//         [field]: value,
//       },
//     }));
//   };

//   const handleScoreChange = (topicId: number | string, day: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       dailyScores: {
//         ...prev.dailyScores,
//         [topicId]: {
//           ...prev.dailyScores[topicId],
//           [day]: value,
//         },
//       },
//     }));
//   };

//   // Add function to handle quantity evaluation changes
//   const handleQuantityEvaluationChange = (index: number, field: keyof QuantityEvaluation, value: string | number) => {
//     setQuantityEvaluations(prev => {
//       const updatedEvaluations = [...prev];
//       updatedEvaluations[index] = {
//         ...updatedEvaluations[index],
//         [field]: value
//       };
//       return updatedEvaluations;
//     });
//   };

//   // Add function to add a new evaluation day
//   const addEvaluationDay = () => {
//     setQuantityEvaluations(prev => [
//       ...prev,
//       {
//         day: prev.length + 1,
//         date: new Date().toISOString().split('T')[0],
//         plan: 0,
//         production_actual: 0,
//         production_marks: 0,
//         rejection_marks: 0,
//         number_of_rejections: 0
//       }
//     ]);
//   };

//   // Add function to remove an evaluation day
//   const removeEvaluationDay = (index: number) => {
//     setQuantityEvaluations(prev => {
//       const filtered = prev.filter((_, i) => i !== index);
//       // Re-number the days to maintain sequence
//       return filtered.map((evaluation, i) => ({ ...evaluation, day: i + 1 }));
//     });
//   };

//   const currentTopics = assessmentMode === 'quality' ? qualityTopics : quantityTopics;

//   const preparePayload = () => {
//     if (assessmentMode === 'quality') {
//       const { traineeInfo, dailyScores } = formData;

//       const scoresArray = Object.entries(dailyScores).flatMap(([topicId, dayScores]) => {
//         return Object.entries(dayScores).map(([dayName, score]) => {
//           const dayId = dayIdMapping[dayName];

//           if (!dayId) {
//             console.warn(`Day ID not found for day: ${dayName}`);
//             return null;
//           }

//           return {
//             topic: Number(topicId),
//             day: dayId,
//             score: Number(score)
//           };
//         }).filter(score => score !== null);
//       });

//       return {
//         trainee_name: traineeInfo.name,
//         trainer_id: traineeInfo.id,
//         emp_id: traineeInfo.empNo,
//         line: traineeInfo.lineName,
//         subline: traineeInfo.processName,
//         station: traineeInfo.stationName,
//         process_name: traineeInfo.processName,
//         revision_date: traineeInfo.revisionDate,
//         doj: traineeInfo.doi,
//         trainer_name: traineeInfo.trainerName,
//         status: "Active",
//         scores: scoresArray
//       };
//     } else {
//       // Updated quantity mode payload to match your structure
//       return {
//         level: locationState.levelId,
//         trainee_name: formData.traineeInfo.name,
//         trainee_id: formData.traineeInfo.id,
//         emp_id: formData.traineeInfo.empNo,
//         station_name: formData.traineeInfo.stationName,
//         line_name: formData.traineeInfo.lineName,
//         process_name: formData.traineeInfo.processName,
//         revision_date: formData.traineeInfo.revisionDate,
//         doj: formData.traineeInfo.doi,
//         trainer_name: formData.traineeInfo.trainerName,
//         engineer_judge: formData.signatures.engineerJudge,
//         status: status,
//         evaluations: quantityEvaluations.map(evaluation => ({
//           day: evaluation.day,
//           date: evaluation.date,
//           plan: evaluation.plan,
//           production_actual: evaluation.production_actual,
//           number_of_rejections: evaluation.number_of_rejections
//         }))
//       };
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const payload = preparePayload();
//       // console.log("Submitting payload:", payload);

//       if (assessmentMode === 'quality') {
//         if (existingOjtId) {
//           const response = await ojtApi.updateOJTData(existingOjtId, payload);
//           // console.log("OJT Data updated successfully:", response);
//           alert("OJT Data updated successfully!");
//         } else {
//           const response = await ojtApi.postOJTData(payload);
//           // console.log("OJT Data saved successfully:", response);
//           alert("OJT Data saved successfully!");
//         }
//       } else {
//         // Quantity mode
//         if (existingQuantityId) {
//           const response = await ojtApi.updateOJTQuantityData(existingQuantityId, payload);
//           // console.log("Quantity Data updated successfully:", response);
//           alert("Quantity Data updated successfully!");
//         } else {
//           const response = await ojtApi.postOJTQuantityData(payload);
//           // console.log("Quantity Data saved successfully:", response);
//           alert("Quantity Data saved successfully!");
//         }
//       }
//     } catch (error) {
//       console.error("Error saving Data:", error);
//       alert("Failed to save Data. Please try again.");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading form data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="max-w-7xl mx-auto p-8">
//         <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">

//           {/* Header Component */}
//           <OJTHeader />

//           <div className="p-8">
//             {/* Trainee Information Form */}
//             <TraineeInfoForm
//               formData={formData}
//               handleInputChange={handleInputChange}
//             />

//             {/* Assessment Forms - Conditional Rendering */}
//             {assessmentMode === 'quality' ? (
//               <QualityAssessmentForm
//                 currentTopics={currentTopics}
//                 days={days}
//                 formData={formData}
//                 handleScoreChange={handleScoreChange}
//                 scoreRanges={scoreRanges}
//                 lastFilledDayIndex={lastFilledDayIndex}
//               />
//             ) : (
//               <QuantityAssessmentForm
//                 formData={formData}
//                 scoreRange={quantityScoreRange}
//                 handleInputChange={handleInputChange}
//                 quantityEvaluations={quantityEvaluations}
//                 handleQuantityEvaluationChange={handleQuantityEvaluationChange}
//                 addEvaluationDay={addEvaluationDay}
//                 removeEvaluationDay={removeEvaluationDay}
             
//               />
//             )}

//             {/* Assessment Criteria Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//               {/* Quality-based Criteria */}
//               {assessmentMode === 'quality' && (
//                 <QualityAssessmentCriteria
//                   criteria={criteria}
//                   scoreRanges={scoreRanges}
//                 />
//               )}

//               {/* Quantity-based Criteria */}
//               {assessmentMode === 'quantity' && (
//                 <div className="lg:col-span-2 space-y-8">
//                   <ProductionMarkingScheme
//                     criteria={quantityCriteria}
//                     scoreRange={quantityScoreRange}
//                   />
//                 </div>
//               )}

//               {/* Judgment Criteria */}
//               <JudgmentCriteria result={assessmentResult} />
//             </div>

//             {/* Signatures Section */}
//             <SignaturesSection
//               formData={formData}
//               handleInputChange={handleInputChange}
//               handleSave={handleSubmit}
//               handleDownloadPDF={() => console.log("Download PDF clicked")}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OJTForm;



import React, { useState, useEffect } from 'react';
import type { AssessmentMode, TrainingTopic, FormData, QuantityEvaluation, Station } from '../../constants/types';
import OJTHeader from '../../molecules/OJTHeader/OJTHeader';
import TraineeInfoForm from '../../molecules/TraineeInfoForm/TraineeInfoForm';
import QualityAssessmentForm from '../../molecules/QualityAssessmentForm/QualityAssessmentForm';
import QuantityAssessmentForm from '../../molecules/QuantityAssessmentForm/QuantityAssessmentForm';
import QualityAssessmentCriteria from '../../molecules/QualityAssessmentCriteria/QualityAssessmentCriteria';
import ProductionMarkingScheme from '../../molecules/ProductionMarkingScheme/ProductionMarkingScheme';
import JudgmentCriteria from '../../molecules/JudgmentCriteria/JudgmentCriteria';
import SignaturesSection from '../../molecules/SignaturesSection/SignaturesSection';
import { useLocation, useNavigate } from 'react-router-dom';
import { ojtApi } from '../../hooks/ServiceApis';

interface ApiTopic {
  id?: number;
  topic_id?: number;
  topic_name?: string;
  topic?: string;
  sl_no?: number;
  category?: string;
}

interface ApiDay {
  id: number;
  name: string;
  department: number;
  level: number;
}

interface QuantityScoreRange {
  id: number;
  department: number;
  level: number;
  score_type: 'production' | 'rejection';
  min_value: string;
  max_value: string;
  marks: number;
}

interface StationDetails {
  station_id: number;
  station_name: string;
}

const OJTForm: React.FC = () => {
  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('quantity');
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentModeLoaded, setAssessmentModeLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [scoreRanges, setScoreRanges] = useState<{ min_score: number; max_score: number } | null>(null);
  const [criteria, setCriteria] = useState<number[]>([]);
  const [quantityCriteria, setQuantityCriteria] = useState<{
    production_passing_percentage: number;
    rejection_passing_percentage: number;
  } | null>(null);
  const [quantityScoreRange, setQuantityScoreRange] = useState<any[] | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [qualityTopics, setQualityTopics] = useState<TrainingTopic[]>([]);
  const [quantityTopics, setQuantityTopics] = useState<TrainingTopic[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [dayIdMapping, setDayIdMapping] = useState<Record<string, number>>({});
  const [existingOjtId, setExistingOjtId] = useState<number | null>(null);
  const [quantityEvaluations, setQuantityEvaluations] = useState<QuantityEvaluation[]>([]);
  const [existingQuantityId, setExistingQuantityId] = useState<number | null>(null);
  const [lastFilledDayIndex, setLastFilledDayIndex] = useState<number>(-1);
  const [status, setStatus] = useState<string>('Pending');

  const locationState = location.state || {};

  const [formData, setFormData] = useState<FormData>({
    traineeInfo: {
      name: locationState.employeeName || '',
      id: locationState.employeeId || '',
      empNo: locationState.employeeId || '',
      stationName: locationState.stationName || '',
      stationId: locationState.stationId || null,
      lineName: locationState.lineName || '',
      processName: locationState.sublineName || '',
      revisionDate: new Date().toISOString().split('T')[0],
      doi: new Date().toISOString().split('T')[0],
      trainerName: '',
      trainerLine: locationState.lineName || '',
    },
    dailyScores: {},
    signatures: {
      preparedBy: '',
      approvedBy: '',
      engineerJudge: '',
    },
  });

  const fetchAssessmentMode = async () => {
    try {
      const data = await ojtApi.getAssessmentMode();
      setAssessmentMode(data.mode);
      setAssessmentModeLoaded(true);
    } catch (error) {
      console.error('Error fetching assessment mode:', error);
      setAssessmentModeLoaded(true);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await ojtApi.getStations();
      setStations(data);
      if (locationState.stationName && !locationState.stationId) {
        const matchedStation = data.find((s: Station) => s.station_name === locationState.stationName);
        if (matchedStation) {
          setFormData(prev => ({
            ...prev,
            traineeInfo: { ...prev.traineeInfo, stationId: matchedStation.station_id },
          }));
        } else {
          console.warn(`No station found for name: ${locationState.stationName}. Please select a station manually.`);
        }
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const fetchScoreRanges = async () => {
    try {
      const data = await ojtApi.getScoreRanges(locationState.departmentId, locationState.levelId);
      if (data && data.length > 0) {
        setScoreRanges({ min_score: data[0].min_score, max_score: data[0].max_score });
      }
    } catch (error) {
      console.error('Error fetching score ranges:', error);
    }
  };

  const fetchCriteria = async () => {
    try {
      const existingCriteria = await ojtApi.getPassingCriteria(locationState.departmentId, locationState.levelId);
      if (Array.isArray(existingCriteria) && existingCriteria.length > 0) {
        const sortedCriteria = existingCriteria.sort((a: any, b: any) => a.day - b.day);
        const percentages = sortedCriteria.map((c: any) => c.percentage);
        setCriteria(percentages);
      } else {
        setCriteria([]);
      }
    } catch (error) {
      console.error('Error fetching criteria:', error);
      setCriteria([]);
    }
  };

  const fetchQuantityScoreRange = async () => {
    try {
      const data = await ojtApi.getQuantityScoreRanges(locationState.departmentId, locationState.levelId);
      if (Array.isArray(data) && data.length > 0) {
        setQuantityScoreRange(data);
      } else {
        setQuantityScoreRange(null);
      }
    } catch (error) {
      console.error('Error fetching quantity score range:', error);
      setQuantityScoreRange(null);
    }
  };

  const fetchQuantityPassingCriteria = async () => {
    try {
      const data = await ojtApi.getQuantityPassingCriteria(locationState.departmentId, locationState.levelId);
      if (Array.isArray(data) && data.length > 0) {
        setQuantityCriteria({
          production_passing_percentage: parseFloat(data[0].production_passing_percentage),
          rejection_passing_percentage: parseFloat(data[0].rejection_passing_percentage),
        });
      } else {
        setQuantityCriteria(null);
      }
    } catch (error) {
      console.error('Error fetching quantity passing criteria:', error);
      setQuantityCriteria(null);
    }
  };

  useEffect(() => {
    const fetchFormData = async () => {
      if (!locationState?.departmentId || !locationState?.levelId) {
        console.warn('Department ID or Level ID not found in location state. Proceeding with form initialization.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await fetchStations();
        const qualityTopicsData: any[] = await ojtApi.getTopics(locationState.departmentId, locationState.levelId);
        const transformedQualityTopics: TrainingTopic[] = qualityTopicsData.map((topic: ApiTopic) => ({
          id: topic.id || topic.topic_id || 0,
          description: topic.topic || topic.topic_name || '',
          category: topic.category || 'Technical Knowledge',
        }));
        setQualityTopics(transformedQualityTopics);

        setQuantityTopics([
          { id: 1, description: 'Production Quantity', category: 'Production' },
          { id: 2, description: 'Quality (Number of Rejections)', category: 'Quality' },
        ]);

        const daysData: ApiDay[] = await ojtApi.getDays(locationState.departmentId, locationState.levelId);
        const dayMapping: Record<string, number> = {};
        const transformedDays: string[] = daysData.map((day: ApiDay) => {
          const dayName = day.name || `Day-${day.id}`;
          dayMapping[dayName] = day.id;
          return dayName;
        });
        setDays(transformedDays);
        setDayIdMapping(dayMapping);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
    fetchScoreRanges();
    fetchCriteria();
    fetchQuantityPassingCriteria();
    fetchQuantityScoreRange();
    fetchAssessmentMode();
  }, [locationState]);

  useEffect(() => {
    if (!assessmentModeLoaded) return;
    if (assessmentMode === 'quantity') {
      setFormData(prev => ({ ...prev, dailyScores: {} }));
      if (!quantityEvaluations.length) {
        setQuantityEvaluations([
          {
            day: 1,
            date: new Date().toISOString().split('T')[0],
            plan: 0,
            production_actual: 0,
            production_marks: 0,
            rejection_marks: 0,
            number_of_rejections: 0,
          },
        ]);
      }
    } else {
      setQuantityEvaluations([]);
      setExistingQuantityId(null);
      setStatus('Pending');
    }
  }, [assessmentMode, assessmentModeLoaded]);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!assessmentModeLoaded) return;
      if (!locationState?.employeeId || !locationState?.stationId || !locationState?.levelId) {
        console.warn('Missing employeeId, stationId, or levelId in location state. Proceeding with form initialization.');
        if (assessmentMode === 'quantity' && !quantityEvaluations.length) {
          setQuantityEvaluations([
            {
              day: 1,
              date: new Date().toISOString().split('T')[0],
              plan: 0,
              production_actual: 0,
              production_marks: 0,
              rejection_marks: 0,
              number_of_rejections: 0,
            },
          ]);
        }
        return;
      }

      try {
        if (assessmentMode === 'quality') {
          const data: any[] = await ojtApi.getQualityTraineeInfoList(
            locationState.employeeId,
            locationState.stationId,
          );
          console.log('Quality data fetched:', data);
          if (data && data.length > 0) {
            const ojtRecord = data[0];
            setExistingOjtId(ojtRecord.id);

            const prefilledScores: Record<number, Record<string, string>> = {};
            ojtRecord.scores_data.forEach((scoreItem: any) => {
              const dayName = Object.keys(dayIdMapping).find(
                (key) => dayIdMapping[key] === scoreItem.day,
              ) || `Day-${scoreItem.day}`;
              if (!prefilledScores[scoreItem.topic]) prefilledScores[scoreItem.topic] = {};
              prefilledScores[scoreItem.topic][dayName] = String(scoreItem.score);
            });

            let lastIndex = -1;
            Object.values(prefilledScores).forEach((dayScores) => {
              days.forEach((day, i) => {
                if (dayScores[day]) {
                  lastIndex = Math.max(lastIndex, i);
                }
              });
            });
            setLastFilledDayIndex(lastIndex);

            setFormData((prev) => ({
              ...prev,
              traineeInfo: {
                name: ojtRecord.trainee_name,
                id: ojtRecord.trainer_id,
                empNo: ojtRecord.emp_id,
                stationName: ojtRecord.station_name,
                stationId: ojtRecord.station,
                lineName: ojtRecord.line,
                processName: ojtRecord.subline,
                revisionDate: ojtRecord.revision_date,
                doi: ojtRecord.doj,
                trainerName: ojtRecord.trainer_name,
                trainerLine: ojtRecord.line,
              },
              dailyScores: prefilledScores,
            }));
          }
        } else {
          const data: any[] = await ojtApi.getQuantityTraineeInfoList(
            locationState.employeeId,
            locationState.levelId,
            locationState.stationId,
          );
          console.log('Quantity data fetched:', data);
          if (data && data.length > 0) {
            const latestRecord = data.sort((a, b) => b.id - a.id)[0];
            console.log('Latest quantity record:', latestRecord);
            setExistingQuantityId(latestRecord.id);
            const newEvaluations = latestRecord.evaluations_data && Array.isArray(latestRecord.evaluations_data)
              ? latestRecord.evaluations_data
                  .sort((a: any, b: any) => a.day - b.day)
                  .map((evaluation: any) => ({
                    day: evaluation.day,
                    date: evaluation.date,
                    plan: evaluation.plan,
                    production_actual: evaluation.production_actual,
                    production_marks: parseFloat(evaluation.production_marks) || 0,
                    rejection_marks: parseFloat(evaluation.rejection_marks) || 0,
                    number_of_rejections: evaluation.number_of_rejections,
                  }))
              : [];
            setQuantityEvaluations(newEvaluations);
            setStatus(latestRecord.status || 'Pending');

            setFormData(prev => ({
              ...prev,
              traineeInfo: {
                ...prev.traineeInfo,
                name: latestRecord.trainee_name || locationState.employeeName || '',
                id: latestRecord.trainee_id || locationState.employeeId || '',
                empNo: latestRecord.emp_id || locationState.employeeId || '',
                stationName: latestRecord.station_name || locationState.stationName || '',
                stationId: latestRecord.station || locationState.stationId || null,
                lineName: latestRecord.line_name || locationState.lineName || '',
                processName: latestRecord.process_name || locationState.sublineName || '',
                revisionDate: latestRecord.revision_date || new Date().toISOString().split('T')[0],
                doi: latestRecord.doj || new Date().toISOString().split('T')[0],
                trainerName: latestRecord.trainer_name || '',
                trainerLine: latestRecord.line_name || locationState.lineName || '',
              },
              signatures: {
                ...prev.signatures,
                engineerJudge: latestRecord.engineer_judge || '',
              },
            }));
          } else {
            console.warn('No quantity records found, initializing with default evaluation.');
            setQuantityEvaluations([
              {
                day: 1,
                date: new Date().toISOString().split('T')[0],
                plan: 0,
                production_actual: 0,
                production_marks: 0,
                rejection_marks: 0,
                number_of_rejections: 0,
              },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching existing data:', error);
        if (assessmentMode === 'quantity') {
          setQuantityEvaluations([
            {
              day: 1,
              date: new Date().toISOString().split('T')[0],
              plan: 0,
              production_actual: 0,
              production_marks: 0,
              rejection_marks: 0,
              number_of_rejections: 0,
            },
          ]);
        }
      }
    };

    fetchExistingData();
  }, [assessmentMode, locationState?.stationId, locationState?.employeeId, locationState?.levelId, dayIdMapping, assessmentModeLoaded]);

  useEffect(() => {
    console.log('quantityEvaluations state updated:', quantityEvaluations);
  }, [quantityEvaluations]);

  const handleInputChange = (section: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value,
      },
    }));
  };

  const handleScoreChange = (topicId: number | string, day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dailyScores: {
        ...prev.dailyScores,
        [topicId]: {
          ...prev.dailyScores[topicId],
          [day]: value,
        },
      },
    }));
  };

  const handleQuantityEvaluationChange = (index: number, field: keyof QuantityEvaluation, value: string | number) => {
    setQuantityEvaluations(prev => {
      const updatedEvaluations = [...prev];
      updatedEvaluations[index] = {
        ...updatedEvaluations[index],
        [field]: value,
      };
      return updatedEvaluations;
    });
  };

  const addEvaluationDay = async () => {
    try {
      // Fetch the latest record to get the current evaluations
      let newDayNumber = 1;
      if (existingQuantityId) {
        const data: any[] = await ojtApi.getQuantityTraineeInfoList(
          locationState.employeeId,
          locationState.levelId,
          locationState.stationId,
        );
        if (data && data.length > 0) {
          const latestRecord = data.sort((a, b) => b.id - a.id)[0];
          const existingDays = latestRecord.evaluations_data && Array.isArray(latestRecord.evaluations_data)
            ? latestRecord.evaluations_data.map((e: any) => e.day)
            : [];
          newDayNumber = existingDays.length > 0 ? Math.max(...existingDays) + 1 : 1;
        }
      }

      const newDay = {
        day: newDayNumber,
        date: new Date().toISOString().split('T')[0],
        plan: 0,
        production_actual: 0,
        production_marks: 0,
        rejection_marks: 0,
        number_of_rejections: 0,
      };

      // Prepare payload with only the new day's evaluation
      const payload = {
        level: locationState.levelId,
        trainee_name: formData.traineeInfo.name,
        trainee_id: formData.traineeInfo.id,
        emp_id: formData.traineeInfo.empNo,
        station_name: formData.traineeInfo.stationName,
        station_id: formData.traineeInfo.stationId || locationState.stationId || null,
        line_name: formData.traineeInfo.lineName,
        process_name: formData.traineeInfo.processName,
        revision_date: formData.traineeInfo.revisionDate,
        doj: formData.traineeInfo.doi,
        trainer_name: formData.traineeInfo.trainerName,
        engineer_judge: formData.signatures.engineerJudge,
        status: status || 'Pending',
        evaluations: [newDay],
      };

      console.log('Submitting payload for adding new day:', payload);

      let response;
      if (existingQuantityId) {
        response = await ojtApi.updateOJTQuantityData(existingQuantityId, payload);
      } else {
        response = await ojtApi.postOJTQuantityData(payload);
      }

      // Fetch the latest record to update the UI
      const data: any[] = await ojtApi.getQuantityTraineeInfoList(
        locationState.employeeId,
        locationState.levelId,
        locationState.stationId,
      );
      console.log('Quantity data after adding new day:', data);
      if (data && data.length > 0) {
        const latestRecord = data.sort((a, b) => b.id - a.id)[0];
        console.log('Latest quantity record after adding new day:', latestRecord);
        setExistingQuantityId(latestRecord.id);
        const newEvaluations = latestRecord.evaluations_data && Array.isArray(latestRecord.evaluations_data)
          ? latestRecord.evaluations_data
              .sort((a: any, b: any) => a.day - b.day)
              .map((evaluation: any) => ({
                day: evaluation.day,
                date: evaluation.date,
                plan: evaluation.plan,
                production_actual: evaluation.production_actual,
                production_marks: parseFloat(evaluation.production_marks) || 0,
                rejection_marks: parseFloat(evaluation.rejection_marks) || 0,
                number_of_rejections: evaluation.number_of_rejections,
              }))
          : [newDay];
        setQuantityEvaluations(newEvaluations);
        setStatus(latestRecord.status || 'Pending');
      } else {
        console.warn('No quantity records found after adding new day, using local state.');
        setQuantityEvaluations(prev => [...prev, newDay]);
      }
      alert('New day added successfully!');
    } catch (error: any) {
      console.error('Error adding new day:', error);
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response.data)
        : 'Failed to add new day. Please check the input data and try again.';
      alert(errorMessage);
    }
  };

  const removeEvaluationDay = (index: number) => {
    setQuantityEvaluations(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((evaluation, i) => ({ ...evaluation, day: i + 1 }));
    });
  };

  const preparePayload = () => {
    if (!formData.traineeInfo.stationId) {
      throw new Error('Station ID is required. Please select a station.');
    }
    if (assessmentMode === 'quality') {
      const { traineeInfo, dailyScores } = formData;
      const scoresArray = Object.entries(dailyScores).flatMap(([topicId, dayScores]) => {
        return Object.entries(dayScores).map(([dayName, score]) => {
          const dayId = dayIdMapping[dayName];
          if (!dayId) {
            console.warn(`Day ID not found for day: ${dayName}`);
            return null;
          }
          return {
            topic: Number(topicId),
            day: dayId,
            score: Number(score),
          };
        }).filter(score => score !== null);
      });

      return {
        trainee_name: traineeInfo.name,
        trainer_id: traineeInfo.id,
        emp_id: traineeInfo.empNo,
        line: traineeInfo.lineName,
        subline: traineeInfo.processName,
        station: traineeInfo.stationId,
        process_name: traineeInfo.processName,
        revision_date: traineeInfo.revisionDate,
        doj: traineeInfo.doi,
        trainer_name: traineeInfo.trainerName,
        status: 'Active',
        scores: scoresArray,
      };
    } else {
      if (!locationState.levelId) {
        throw new Error('Level ID is required for quantity assessment.');
      }
      return {
        level: locationState.levelId,
        trainee_name: formData.traineeInfo.name,
        trainee_id: formData.traineeInfo.id,
        emp_id: formData.traineeInfo.empNo,
        station_name: formData.traineeInfo.stationName,
        station_id: formData.traineeInfo.stationId || locationState.stationId || null,
        line_name: formData.traineeInfo.lineName,
        process_name: formData.traineeInfo.processName,
        revision_date: formData.traineeInfo.revisionDate,
        doj: formData.traineeInfo.doi,
        trainer_name: formData.traineeInfo.trainerName,
        engineer_judge: formData.signatures.engineerJudge,
        status: status,
        evaluations: quantityEvaluations.map(evaluation => ({
          day: evaluation.day,
          date: evaluation.date,
          plan: evaluation.plan,
          production_actual: evaluation.production_actual,
          number_of_rejections: evaluation.number_of_rejections,
        })),
      };
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = preparePayload();
      console.log('Submitting payload:', payload);
      if (assessmentMode === 'quality') {
        if (existingOjtId) {
          await ojtApi.updateOJTData(existingOjtId, payload);
          alert('OJT Data updated successfully!');
        } else {
          await ojtApi.postOJTData(payload);
          alert('OJT Data saved successfully!');
        }
      } else {
        if (existingQuantityId) {
          await ojtApi.updateOJTQuantityData(existingQuantityId, payload);
          alert('Quantity Data updated successfully!');
        } else {
          await ojtApi.postOJTQuantityData(payload);
          alert('Quantity Data saved successfully!');
        }
        // Refresh the latest record after submission
        const data: any[] = await ojtApi.getQuantityTraineeInfoList(
          locationState.employeeId,
          locationState.levelId,
          locationState.stationId,
        );
        console.log('Quantity data after saving:', data);
        if (data && data.length > 0) {
          const latestRecord = data.sort((a, b) => b.id - a.id)[0];
          console.log('Latest quantity record after saving:', latestRecord);
          setExistingQuantityId(latestRecord.id);
          const newEvaluations = latestRecord.evaluations_data && Array.isArray(latestRecord.evaluations_data)
            ? latestRecord.evaluations_data
                .sort((a: any, b: any) => a.day - b.day)
                .map((evaluation: any) => ({
                  day: evaluation.day,
                  date: evaluation.date,
                  plan: evaluation.plan,
                  production_actual: evaluation.production_actual,
                  production_marks: parseFloat(evaluation.production_marks) || 0,
                  rejection_marks: parseFloat(evaluation.rejection_marks) || 0,
                  number_of_rejections: evaluation.number_of_rejections,
                }))
            : [];
          setQuantityEvaluations(newEvaluations);
          setStatus(latestRecord.status || 'Pending');
        } else {
          console.warn('No quantity records found after saving, resetting evaluations.');
          setQuantityEvaluations([
            {
              day: 1,
              date: new Date().toISOString().split('T')[0],
              plan: 0,
              production_actual: 0,
              production_marks: 0,
              rejection_marks: 0,
              number_of_rejections: 0,
            },
          ]);
        }
      }
      navigate('/');
    } catch (error: any) {
      console.error('Error saving Data:', error);
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response.data)
        : 'Failed to save Data. Please try again.';
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
          <OJTHeader />
          <div className="p-8">
            <TraineeInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
              stations={stations}
            />
            {assessmentMode === 'quality' ? (
              <QualityAssessmentForm
                currentTopics={qualityTopics}
                days={days}
                formData={formData}
                handleScoreChange={handleScoreChange}
                scoreRanges={scoreRanges}
                lastFilledDayIndex={lastFilledDayIndex}
              />
            ) : (
              <QuantityAssessmentForm
                formData={formData}
                scoreRange={quantityScoreRange}
                handleInputChange={handleInputChange}
                quantityEvaluations={quantityEvaluations}
                handleQuantityEvaluationChange={handleQuantityEvaluationChange}
                addEvaluationDay={addEvaluationDay}
                removeEvaluationDay={removeEvaluationDay}
              />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {assessmentMode === 'quality' && (
                <QualityAssessmentCriteria
                  criteria={criteria}
                  scoreRanges={scoreRanges}
                />
              )}
              {assessmentMode === 'quantity' && (
                <div className="lg:col-span-2 space-y-8">
                  <ProductionMarkingScheme
                    criteria={quantityCriteria}
                    scoreRange={quantityScoreRange}
                  />
                </div>
              )}
              <JudgmentCriteria />
            </div>
            <SignaturesSection
              formData={formData}
              handleInputChange={handleInputChange}
              handleSave={handleSubmit}
              handleDownloadPDF={() => console.log('Download PDF clicked')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OJTForm;