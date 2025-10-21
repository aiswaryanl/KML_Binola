


// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const INFO_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
// const NAV_LEFT = 'R52:6';
// const NAV_RIGHT = 'R52:3';
// const OK = 'R52:7';
// const PAUSE = 'RS5:9';
// const RESUME = 'RS5:12';

// interface Question {
//   id: number;
//   question_text: string;
//   options: string[];
//   correct_index: number;
// }

// interface LocationState {
//   paperId: number;
//   skillId?: number;
//   levelId: number;
//   stationId?: number;
//   employee?: {
//     id: string;
//     name: string;
//     pay_code: string;
//     section: string;
//   };
//   employeeId?: string;
//   test_name?: string;
//   examMode?: string;
// }

// type AnswersMap = Record<string, (number | null)[]>;

// const RemoteQuiz: React.FC = () => {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState<AnswersMap>({});
//   const [answeredRemotes, setAnsweredRemotes] = useState<Set<string>>(new Set());
//   const [lastEventId, setLastEventId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [isPaused, setIsPaused] = useState(false);
//   const [quizEnded, setQuizEnded] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const isPausedRef = useRef(false);

//   const state = location.state as LocationState;
//   const paperId = state?.paperId;
//   const skillId = state?.skillId || state?.stationId;
//   const levelId = state?.levelId;
//   const employee = state?.employee;
//   const employeeId = state?.employeeId || employee?.id;
//   const testName = state?.test_name || `Remote_Group_Test_${new Date().toISOString().slice(0, 10)}`;
//   const examMode = state?.examMode || 'remote';

//   useEffect(() => {
//     isPausedRef.current = isPaused;
//   }, [isPaused]);

//   useEffect(() => {
//     if (!paperId || !skillId || !levelId) {
//       setLoading(false);
//       setErrorMessage('Invalid navigation state. Please start the quiz from the assignment page.');
//       setTimeout(() => navigate('/assign-employees'), 3000);
//       return;
//     }

//     const fetchQuestions = async () => {
//       try {
//         const res = await fetch(`http://127.0.0.1:8000/questionpapers/${paperId}/questions/`);
//         if (!res.ok) {
//           throw new Error(`Failed to fetch questions: ${res.status}`);
//         }
//         const data = await res.json();
//         const questionsData = data.questions || [];

//         if (!Array.isArray(questionsData) || questionsData.length === 0) {
//           setErrorMessage("No questions are available for this quiz. Please contact the administrator.");
//           setQuestions([]);
//           return;
//         }

//         const mapped: Question[] = questionsData
//           .map((q: any, index: number) => ({
//             id: q.question_id || q.id || index,
//             question_text: q.question_text || q.text || q.question || "",
//             options: [
//               q.option_a || q.options?.[0] || "",
//               q.option_b || q.options?.[1] || "",
//               q.option_c || q.options?.[2] || "",
//               q.option_d || q.options?.[3] || "",
//             ].filter(opt => opt && opt.trim() !== ""),
//             correct_index: Number.isInteger(q.correct_answer_index || q.correct_index)
//               ? q.correct_answer_index || q.correct_index
//               : 0,
//           }))
//           .filter(q => q.question_text && q.options.length >= 2 && q.correct_index < q.options.length);

//         if (mapped.length === 0) {
//           setErrorMessage('No valid questions found for this quiz. Please contact the administrator.');
//         } else {
//           setQuestions(mapped);
//         }
//       } catch (err) {
//         console.error('Failed to fetch questions:', err);
//         setErrorMessage("Failed to load questions. Please check your connection or contact support.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [paperId, skillId, levelId, navigate]);

//   const nextCalledRef = useRef(false);

//   const goToNextQuestion = () => {
//     if (nextCalledRef.current) return;
//     nextCalledRef.current = true;

//     setCurrentIndex(prev => {
//       if (prev < questions.length - 1) {
//         setAnsweredRemotes(new Set());
//         setTimeLeft(30);
//         return prev + 1;
//       } else {
//         if (!quizEnded) {
//           setQuizEnded(true);
//           submitQuiz();
//         }
//         return prev;
//       }
//     });

//     setTimeout(() => {
//       nextCalledRef.current = false;
//     }, 500);
//   };

//   const submitQuiz = async () => {
//     try {
//       const allRemoteAnswers: any[] = [];
      
//       Object.entries(answers).forEach(([remoteId, remoteAnswers]) => {
//         const userAnswers = remoteAnswers.map(answer => answer ?? -1);
//         allRemoteAnswers.push({
//           // ✅ UPDATED: The key is 'employee_id' as required by the backend.
//           // The value is the remote's key_id, which the backend will use for lookup.
//           employee_id: remoteId,
//           test_name: `${testName}_Remote_${remoteId}`,
//           question_paper_id: paperId,
//           skill_id: skillId,
//           level_id: levelId,
//           answers: userAnswers,
//         });
//       });

//       const submitPromises = allRemoteAnswers.map(payload =>
//         fetch('http://127.0.0.1:8000/api/end-test/', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         })
//       );

//       const responses = await Promise.all(submitPromises);
//       const failedSubmissions = responses.filter(res => !res.ok);
      
//       if (failedSubmissions.length > 0) {
//         for (const res of failedSubmissions) {
//             console.error(`Submission failed with status ${res.status}:`, await res.text());
//         }
//         setErrorMessage(`${failedSubmissions.length} remote submissions failed. Check console for details.`);
//       }

//       navigate('/test-ended', { 
//         state: { 
//           paperId, 
//           answers,
//           skillId,
//           levelId,
//           testName,
//           examMode: 'remote'
//         } 
//       });
//     } catch (err) {
//       console.error('Submit error:', err);
//       setErrorMessage('Failed to submit quiz results. Please contact support.');
//     }
//   };

//   useEffect(() => {
//     if (loading || !questions.length) return;

//     const timer = setInterval(() => {
//       if (!isPausedRef.current) {
//         setTimeLeft(prev => {
//           if (prev <= 1) {
//             goToNextQuestion();
//             return 30;
//           }
//           return prev - 1;
//         });
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [loading, currentIndex, questions.length]);

//   useEffect(() => {
//     if (loading || !questions.length) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch('http://127.0.0.1:8000/api/key-events/latest/');
//         if (!res.ok) return;

//         const evt = await res.json();
//         if (evt.id === lastEventId) return;

//         setLastEventId(evt.id);

//         const { key_id, info } = evt;
//         if (!key_id || !info) return;

//         if (info === PAUSE) {
//           setIsPaused(true);
//           return;
//         }

//         if (info === RESUME) {
//           setIsPaused(false);
//           return;
//         }

//         if (info in INFO_TO_INDEX) {
//           setAnswers(prev => {
//             const next = { ...prev };
//             if (!next[key_id]) next[key_id] = Array(questions.length).fill(null);
//             if (next[key_id][currentIndex] === null) {
//               next[key_id][currentIndex] = INFO_TO_INDEX[info];
//               setAnsweredRemotes(prevSet => new Set(prevSet).add(key_id));
//             }
//             return next;
//           });
//         } else if (info === NAV_LEFT) {
//           setCurrentIndex(i => Math.max(0, i - 1));
//           setAnsweredRemotes(new Set());
//           setTimeLeft(30);
//         } else if (info === NAV_RIGHT) {
//           if (currentIndex < questions.length - 1) {
//             goToNextQuestion();
//           }
//         } else if (info === OK && currentIndex === questions.length - 1 && !quizEnded) {
//           setQuizEnded(true);
//           submitQuiz();
//         }
//       } catch (err) {
//         console.error('Poll error:', err);
//       }
//     }, 500);

//     return () => clearInterval(interval);
//   }, [questions, currentIndex, answers, lastEventId, loading, navigate, paperId, skillId, levelId, testName]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-white text-xl font-semibold">Loading Quiz...</div>
//           <div className="text-slate-400 text-sm mt-2">Preparing your questions</div>
//         </div>
//       </div>
//     );
//   }

//   if (!questions.length) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <div className="text-red-400 text-2xl">!</div>
//           </div>
//           <div className="text-white text-xl font-semibold">No Questions Found</div>
//           <div className="text-slate-300 mt-2 mb-4 max-w-md mx-auto">
//             {errorMessage || 'Unable to load questions from server. Please check connection.'}
//           </div>
//           <button
//             onClick={() => navigate('/assign-employees')}
//             className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
//           >
//             Back to Assignment
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const q = questions[currentIndex];
//   const progress = ((currentIndex + 1) / questions.length) * 100;
//   const timeProgress = (timeLeft / 30) * 100;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
//       {/* Header */}
//       <header className="max-w-6xl mx-auto mb-8">
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-bold">Q</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Remote Group Quiz</h1>
//                 <div className="text-sm text-slate-300">Real-time Assessment</div>
//                 {skillId && levelId && (
//                   <div className="text-xs text-slate-400">
//                     Skill ID: {skillId} | Level ID: {levelId}
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="text-right">
//               <div className="text-sm text-slate-300 mb-1">Question Progress</div>
//               <div className="text-xl font-bold text-white">
//                 {currentIndex + 1} / {questions.length}
//               </div>
//             </div>
//           </div>
          
//           {/* Progress Bar */}
//           <div className="w-full bg-white/20 rounded-full h-2 mb-4">
//             <div 
//               className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
          
//           {/* Timer */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
//               <span className="text-white font-semibold">
//                 {isPaused ? 'Quiz Paused' : `${timeLeft}s remaining`}
//               </span>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//               <span className="text-slate-300 text-sm">
//                 {answeredRemotes.size} participant{answeredRemotes.size !== 1 ? 's' : ''} answered
//               </span>
//             </div>
//           </div>
          
//           {/* Timer Progress */}
//           {!isPaused && (
//             <div className="w-full bg-white/20 rounded-full h-1 mt-2">
//               <div 
//                 className={`h-1 rounded-full transition-all duration-1000 ${
//                   timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-yellow-500' : 'bg-green-500'
//                 }`}
//                 style={{ width: `${timeProgress}%` }}
//               />
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-6xl mx-auto">
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
//           {/* Question */}
//           <div className="mb-8">
//             <div className="text-sm text-slate-300 mb-2">Question {currentIndex + 1}</div>
//             <h2 className="text-2xl font-semibold text-white leading-relaxed">
//               {q.question_text}
//             </h2>
//           </div>

//           {/* Options */}
//           <div className="grid gap-4">
//             {q.options.map((opt, i) => (
//               <div
//                 key={i}
//                 className="group relative bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl p-6 transition-all duration-300 cursor-pointer"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-600/30 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-300">
//                     <span className="text-white font-bold text-lg">
//                       {String.fromCharCode(65 + i)}
//                     </span>
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-white text-lg font-medium group-hover:text-blue-200 transition-colors duration-300">
//                       {opt}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/5 group-hover:to-purple-600/5 rounded-xl transition-all duration-300 pointer-events-none"></div>
//               </div>
//             ))}
//           </div>

//           {/* Error Message */}
//           {errorMessage && (
//             <div className="mt-6 p-4 bg-red-900/50 border border-red-400/30 rounded-xl flex items-start space-x-3">
//               <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <div>
//                 <h3 className="text-sm font-medium text-red-300 mb-1">Quiz Error</h3>
//                 <p className="text-sm text-red-400">{errorMessage}</p>
//               </div>
//             </div>
//           )}

//           {/* Footer Stats */}
//           <div className="mt-8 pt-6 border-t border-white/20">
//             <div className="flex items-center justify-between text-sm">
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                   <span className="text-slate-300">Remote controlled</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                   <span className="text-slate-300">Group quiz mode</span>
//                 </div>
//               </div>
              
//               <div className="text-slate-400">
//                 Paper ID: {paperId || 'N/A'} | Test: {testName}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Floating Timer */}
//       <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
//         <div className="text-center">
//           <div className="text-lg font-bold text-white">{timeLeft}</div>
//           <div className="text-xs text-slate-300">seconds</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RemoteQuiz;


import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const INFO_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const NAV_LEFT = "R52:6";
const NAV_RIGHT = "R52:3";
const OK = "R52:7";
const PAUSE = "RS5:9";
const RESUME = "RS5:12";

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_index: number;
}

interface LocationState {
  paperId: number;
  skillId?: number;
  levelId: number;
  stationId?: number;
  employee?: {
    id: string;
    name: string;
    pay_code: string;
    section: string;
  };
  employeeId?: string;
  test_name?: string;
  examMode?: string;
}

type AnswersMap = Record<string, (number | null)[]>;

const RemoteQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [answeredRemotes, setAnsweredRemotes] = useState<Set<string>>(new Set());
  const [lastEventId, setLastEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isPausedRef = useRef(false);

  const state = location.state as LocationState;
  const paperId = state?.paperId;
  const skillId = state?.skillId || state?.stationId;
  const levelId = state?.levelId;
  const employee = state?.employee;
  const employeeId = state?.employeeId || employee?.id;
  const testName =
    state?.test_name ||
    `Remote_Group_Test_${new Date().toISOString().slice(0, 10)}`;
  const examMode = state?.examMode || "remote";

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!paperId || !skillId || !levelId) {
      setLoading(false);
      setErrorMessage(
        "Invalid navigation state. Please start the quiz from the assignment page."
      );
      setTimeout(() => navigate("/assign-employees"), 3000);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/questionpapers/${paperId}/questions/`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch questions: ${res.status}`);
        }
        const data = await res.json();
        const questionsData = data.questions || [];

        if (!Array.isArray(questionsData) || questionsData.length === 0) {
          setErrorMessage(
            "No questions are available for this quiz. Please contact the administrator."
          );
          setQuestions([]);
          return;
        }

        const mapped: Question[] = questionsData
          .map((q: any, index: number) => ({
            id: q.question_id || q.id || index,
            question_text: q.question_text || q.text || q.question || "",
            options: [
              q.option_a || q.options?.[0] || "",
              q.option_b || q.options?.[1] || "",
              q.option_c || q.options?.[2] || "",
              q.option_d || q.options?.[3] || "",
            ].filter((opt) => opt && opt.trim() !== ""),
            correct_index: Number.isInteger(
              q.correct_answer_index || q.correct_index
            )
              ? q.correct_answer_index || q.correct_index
              : 0,
          }))
          .filter(
            (q) =>
              q.question_text &&
              q.options.length >= 2 &&
              q.correct_index < q.options.length
          );

        if (mapped.length === 0) {
          setErrorMessage(
            "No valid questions found for this quiz. Please contact the administrator."
          );
        } else {
          setQuestions(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setErrorMessage(
          "Failed to load questions. Please check your connection or contact support."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [paperId, skillId, levelId, navigate]);

  const nextCalledRef = useRef(false);

  const goToNextQuestion = () => {
    if (nextCalledRef.current) return;
    nextCalledRef.current = true;

    setCurrentIndex((prev) => {
      if (prev < questions.length - 1) {
        setAnsweredRemotes(new Set());
        setTimeLeft(30);
        return prev + 1;
      } else {
        if (!quizEnded) {
          setQuizEnded(true);
          submitQuiz();
        }
        return prev;
      }
    });

    setTimeout(() => {
      nextCalledRef.current = false;
    }, 500);
  };

  const submitQuiz = async () => {
    try {
      // ✅ Backend expects { key_id: [answers] }
      const payload: Record<string, number[]> = {};

      Object.entries(answers).forEach(([remoteId, remoteAnswers]) => {
        payload[remoteId] = remoteAnswers.map((ans) => ans ?? -1);
      });

      console.log("Submitting payload:", payload);

      const res = await fetch("http://127.0.0.1:8000/api/end-test/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Submit failed:", await res.text());
        setErrorMessage(`Submission failed with status ${res.status}`);
        return;
      }

      const resultData = await res.json();
      console.log("Submit success:", resultData);

      navigate("/test-ended", {
        state: {
          paperId,
          answers,
          skillId,
          levelId,
          testName,
          examMode: "remote",
          results: resultData,
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMessage(
        "Failed to submit quiz results. Please contact support."
      );
    }
  };

  useEffect(() => {
    if (loading || !questions.length) return;

    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            goToNextQuestion();
            return 30;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, currentIndex, questions.length]);

  useEffect(() => {
    if (loading || !questions.length) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/key-events/latest/");
        if (!res.ok) return;

        const evt = await res.json();
        if (evt.id === lastEventId) return;

        setLastEventId(evt.id);

        const { key_id, info } = evt;
        if (!key_id || !info) return;

        if (info === PAUSE) {
          setIsPaused(true);
          return;
        }

        if (info === RESUME) {
          setIsPaused(false);
          return;
        }

        if (info in INFO_TO_INDEX) {
          setAnswers((prev) => {
            const next = { ...prev };
            if (!next[key_id])
              next[key_id] = Array(questions.length).fill(null);
            if (next[key_id][currentIndex] === null) {
              next[key_id][currentIndex] = INFO_TO_INDEX[info];
              setAnsweredRemotes((prevSet) => new Set(prevSet).add(key_id));
            }
            return next;
          });
        } else if (info === NAV_LEFT) {
          setCurrentIndex((i) => Math.max(0, i - 1));
          setAnsweredRemotes(new Set());
          setTimeLeft(30);
        } else if (info === NAV_RIGHT) {
          if (currentIndex < questions.length - 1) {
            goToNextQuestion();
          }
        } else if (info === OK && currentIndex === questions.length - 1 && !quizEnded) {
          setQuizEnded(true);
          submitQuiz();
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [questions, currentIndex, answers, lastEventId, loading, navigate, paperId, skillId, levelId, testName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading Quiz...</div>
          <div className="text-slate-400 text-sm mt-2">Preparing your questions</div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-red-400 text-2xl">!</div>
          </div>
          <div className="text-white text-xl font-semibold">No Questions Found</div>
          <div className="text-slate-300 mt-2 mb-4 max-w-md mx-auto">
            {errorMessage || "Unable to load questions from server. Please check connection."}
          </div>
          <button
            onClick={() => navigate("/assign-employees")}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Back to Assignment
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const timeProgress = (timeLeft / 30) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Remote Group Quiz</h1>
                <div className="text-sm text-slate-300">Real-time Assessment</div>
                {skillId && levelId && (
                  <div className="text-xs text-slate-400">
                    Skill ID: {skillId} | Level ID: {levelId}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-300 mb-1">Question Progress</div>
              <div className="text-xl font-bold text-white">
                {currentIndex + 1} / {questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPaused ? "bg-yellow-400" : "bg-red-400"
                } animate-pulse`}
              ></div>
              <span className="text-white font-semibold">
                {isPaused ? "Quiz Paused" : `${timeLeft}s remaining`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">
                {answeredRemotes.size} participant
                {answeredRemotes.size !== 1 ? "s" : ""} answered
              </span>
            </div>
          </div>

          {/* Timer Progress */}
          {!isPaused && (
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${
                  timeLeft <= 10
                    ? "bg-red-500"
                    : timeLeft <= 20
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${timeProgress}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {/* Question */}
          <div className="mb-8">
            <div className="text-sm text-slate-300 mb-2">
              Question {currentIndex + 1}
            </div>
            <h2 className="text-2xl font-semibold text-white leading-relaxed">
              {q.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="grid gap-4">
            {q.options.map((opt, i) => (
              <div
                key={i}
                className="group relative bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl p-6 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-600/30 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <span className="text-white font-bold text-lg">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-lg font-medium group-hover:text-blue-200 transition-colors duration-300">
                      {opt}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/5 group-hover:to-purple-600/5 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-400/30 rounded-xl flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-300 mb-1">
                  Quiz Error
                </h3>
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Footer Stats */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Remote controlled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Group quiz mode</span>
                </div>
              </div>

              <div className="text-slate-400">
                Paper ID: {paperId || "N/A"} | Test: {testName}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Timer */}
      <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{timeLeft}</div>
          <div className="text-xs text-slate-300">seconds</div>
        </div>
      </div>
    </div>
  );
};

export default RemoteQuiz;
