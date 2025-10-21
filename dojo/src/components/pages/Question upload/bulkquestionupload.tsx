// import React, { useState, useEffect, type ChangeEvent } from 'react';
// import axios from 'axios';

// // --- API URLs ---
// const API_URL = 'http://127.0.0.1:8000/template-questions/bulk-upload/';
// const DOWNLOAD_TEMPLATE_URL = 'http://127.0.0.1:8000/template-questions/download-template/';
// const QUESTION_PAPER_DETAIL_URL = 'http://127.0.0.1:8000/questionpapers/'; // DRF endpoint

// // --- TYPE DEFINITIONS ---
// interface UploadResult {
//   status: string;
//   created_count: number;
//   error_count: number;
//   errors: { row: number; errors: any }[];
//   detail?: string;
// }

// interface RelName {
//   id: number;
//   name: string;
// }

// interface QuestionPaperDetails {
//   id: number;
//   question_paper_name: string;
//   department: RelName;
//   line: RelName;
//   subline: RelName;
//   station: RelName;
//   level: RelName;
// }

// interface TemplateQuestionBulkUploadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onUploadSuccess: () => void;
//   questionPaperId: number;
// }

// const TemplateQuestionBulkUploadModal: React.FC<TemplateQuestionBulkUploadModalProps> = ({
//   isOpen,
//   onClose,
//   onUploadSuccess,
//   questionPaperId,
// }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'result'>('idle');
//   const [result, setResult] = useState<UploadResult | null>(null);
//   const [paperDetails, setPaperDetails] = useState<QuestionPaperDetails | null>(null);

//   // Fetch question paper details when modal opens
//   useEffect(() => {
//     if (isOpen && questionPaperId) {
//       axios
//         .get<QuestionPaperDetails>(`${QUESTION_PAPER_DETAIL_URL}${questionPaperId}/`)
//         .then((res) => setPaperDetails(res.data))
//         .catch((err) => console.error('Failed to fetch question paper details', err));
//     }
//   }, [isOpen, questionPaperId]);

//   // Build dynamic template download URL (includes level)
//   const buildDownloadUrl = () => {
//     if (!paperDetails) return DOWNLOAD_TEMPLATE_URL;
//     const params = new URLSearchParams({
//       department: paperDetails.department?.name ?? '',
//       line: paperDetails.line?.name ?? '',
//       subline: paperDetails.subline?.name ?? '',
//       station: paperDetails.station?.name ?? '',
//       level: paperDetails.level?.name ?? '',
//       question_paper_id: String(questionPaperId),
//     });
//     return `${DOWNLOAD_TEMPLATE_URL}?${params.toString()}`;
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const resetState = () => {
//     setSelectedFile(null);
//     setUploadState('idle');
//     setResult(null);
//   };

//   const handleClose = () => {
//     resetState();
//     onClose();
//   };

//   const handleUpload = async () => {
//     if (!selectedFile || !questionPaperId) return;
//     setUploadState('uploading');

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('question_paper_id', String(questionPaperId));

//     try {
//       const response = await axios.post<UploadResult>(API_URL, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setResult(response.data);
//       if (response.data.created_count > 0) {
//         onUploadSuccess();
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         const detail =
//           (error.response.data as any)?.detail || 'An error occurred during upload.';
//         setResult({
//           status: 'Upload Failed',
//           created_count: 0,
//           error_count: 1,
//           errors: [],
//           detail,
//         });
//       } else {
//         setResult({
//           status: 'Upload Failed',
//           created_count: 0,
//           error_count: 1,
//           errors: [],
//           detail: 'An unknown network error occurred.',
//         });
//       }
//     } finally {
//       setUploadState('result');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-xl font-bold text-gray-800">Bulk Upload Template Questions</h2>
//           <button
//             onClick={handleClose}
//             className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
//             aria-label="Close"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 overflow-y-auto">
//           {uploadState === 'idle' && (
//             <>
//               <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
//                 <h3 className="font-bold mb-2">Instructions</h3>

//                 {paperDetails && (
//                   <p className="text-sm mb-3">
//                     <b>Level:</b> {paperDetails.level?.name} &nbsp; | &nbsp;
//                     <b>Department:</b> {paperDetails.department?.name} &nbsp; | &nbsp;
//                     <b>Line:</b> {paperDetails.line?.name} &nbsp; | &nbsp;
//                     <b>Subline:</b> {paperDetails.subline?.name} &nbsp; | &nbsp;
//                     <b>Station:</b> {paperDetails.station?.name}
//                   </p>
//                 )}

//                 <ol className="list-decimal list-inside space-y-1 text-sm">
//                   <li>Download the Excel template. It includes required columns and examples.</li>
//                   <li>Add new question rows in the <b>Template_Questions</b> sheet.</li>
//                   <li>
//                     Required columns: <code>question</code>, <code>option_a</code>,{' '}
//                     <code>option_b</code>, <code>option_c</code>, <code>option_d</code>,{' '}
//                     <code>correct_answer</code>.
//                   </li>
//                   <li>Make sure the correct_answer exactly matches one of the options.</li>
//                   <li>Save the file and upload it below.</li>
//                 </ol>

//                 <a
//                   href={buildDownloadUrl()}
//                   className="text-blue-600 hover:text-blue-800 font-semibold mt-3 inline-block"
//                 >
//                   Download Template
//                 </a>
//               </div>

//               {/* Upload box */}
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                 <input
//                   id="template-upload-input"
//                   type="file"
//                   accept=".xlsx,.xls"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <label
//                   htmlFor="template-upload-input"
//                   className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
//                 >
//                   Choose File
//                 </label>
//                 {selectedFile ? (
//                   <div className="mt-3 text-sm text-gray-700">
//                     Selected: <b>{selectedFile.name}</b>
//                   </div>
//                 ) : (
//                   <div className="mt-3 text-sm text-gray-500">No file selected</div>
//                 )}
//                 <div className="mt-4">
//                   <button
//                     onClick={handleUpload}
//                     disabled={!selectedFile}
//                     className={`px-4 py-2 rounded-md text-white ${
//                       selectedFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
//                     }`}
//                   >
//                     Upload
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {uploadState === 'uploading' && (
//             <div className="flex flex-col items-center justify-center py-8">
//               <div className="animate-spin h-10 w-10 border-4 border-blue-300 border-t-transparent rounded-full"></div>
//               <p className="mt-4 text-gray-700">Uploading...</p>
//             </div>
//           )}

//           {uploadState === 'result' && result && (
//             <div className="space-y-4">
//               <div
//                 className={`p-4 rounded-md ${
//                   result.status.toLowerCase().includes('fail')
//                     ? 'bg-red-50 text-red-800 border border-red-200'
//                     : 'bg-green-50 text-green-800 border border-green-200'
//                 }`}
//               >
//                 <div className="font-semibold">{result.status}</div>
//                 {result.detail && <div className="text-sm mt-1">{result.detail}</div>}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-4 rounded-md border">
//                   <div className="text-sm text-gray-500">Created</div>
//                   <div className="text-2xl font-bold text-green-700">{result.created_count}</div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-md border">
//                   <div className="text-sm text-gray-500">Errors</div>
//                   <div className="text-2xl font-bold text-red-700">{result.error_count}</div>
//                 </div>
//               </div>

//               {result.errors && result.errors.length > 0 && (
//                 <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
//                   <div className="font-semibold text-yellow-800 mb-2">Row Errors</div>
//                   <ul className="text-sm text-yellow-800 space-y-2 max-h-48 overflow-auto">
//                     {result.errors.map((e, idx) => (
//                       <li key={idx}>
//                         <b>Row {e.row}:</b> {JSON.stringify(e.errors)}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={resetState}
//                   className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
//                 >
//                   Upload another file
//                 </button>
//                 <button
//                   onClick={handleClose}
//                   className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {uploadState === 'idle' && (
//           <div className="p-4 border-t flex justify-end gap-2">
//             <button onClick={handleClose} className="px-4 py-2 rounded-md border hover:bg-gray-50">
//               Cancel
//             </button>
//             <button
//               onClick={handleUpload}
//               disabled={!selectedFile}
//               className={`px-4 py-2 rounded-md text-white ${
//                 selectedFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
//               }`}
//             >
//               Upload
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateQuestionBulkUploadModal;




import React, { useState, useEffect, type ChangeEvent } from 'react';
import axios from 'axios';

// --- API URLs ---
const BASE_API_URL = 'http://127.0.0.1:8000';
const UPLOAD_API_URL = `${BASE_API_URL}/template-questions/bulk-upload/`;
const DOWNLOAD_TEMPLATE_URL = `${BASE_API_URL}/template-questions/download-template/`;
const QUESTION_PAPER_DETAIL_URL = `${BASE_API_URL}/questionpapers/`;

// --- TYPE DEFINITIONS ---
interface UploadResult {
  status: string;
  created_count: number;
  error_count: number;
  errors: { row: number; errors: any }[];
  detail?: string;
}

interface RelName {
  id: number;
  name: string;
}

interface QuestionPaperDetails {
  id: number;
  question_paper_name: string;
  department: RelName;
  line: RelName;
  subline: RelName;
  station: RelName;
  level: RelName;
}

interface TemplateQuestionBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  questionPaperId: number;
}

const TemplateQuestionBulkUploadModal: React.FC<TemplateQuestionBulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  questionPaperId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'result'>('idle');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [paperDetails, setPaperDetails] = useState<QuestionPaperDetails | null>(null);

  // Fetch question paper details when modal opens
  useEffect(() => {
    if (isOpen && questionPaperId) {
      axios
        .get<QuestionPaperDetails>(`${QUESTION_PAPER_DETAIL_URL}${questionPaperId}/`)
        .then((res) => setPaperDetails(res.data))
        .catch((err) => console.error('Failed to fetch question paper details', err));
    }
  }, [isOpen, questionPaperId]);

  // Build dynamic template download URL
  const buildDownloadUrl = () => {
    // Only the question_paper_id is needed by the backend
    return `${DOWNLOAD_TEMPLATE_URL}?question_paper_id=${questionPaperId}`;
  };

  const formatErrorObject = (errors: any): string => {
    if (typeof errors === 'string') {
      return errors;
    }
    return Object.entries(errors)
      .map(([field, messages]) => {
        const messageStr = Array.isArray(messages) ? messages.join(', ') : String(messages);
        return `${field}: ${messageStr}`;
      })
      .join(' | ');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setResult(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile || !questionPaperId) return;
    setUploadState('uploading');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('question_paper_id', String(questionPaperId));

    try {
      const response = await axios.post<UploadResult>(UPLOAD_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      if (response.data.created_count > 0) {
        onUploadSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as UploadResult;
        // Check if the backend sent our structured validation error response
        if (errorData.status && errorData.errors) {
          setResult(errorData);
        } else {
          // Otherwise, fall back to a simple 'detail' message
          const detail = (errorData as any)?.detail || 'An unexpected error occurred during upload.';
          setResult({
            status: 'Upload Failed',
            created_count: 0,
            error_count: 1,
            errors: [],
            detail,
          });
        }
      } else {
        // Handle network errors or other non-Axios errors
        setResult({
          status: 'Upload Failed',
          created_count: 0,
          error_count: 1,
          errors: [],
          detail: 'A network error occurred. Please check your connection.',
        });
      }
    } finally {
      setUploadState('result');
    }
  };

  if (!isOpen) return null;

  // --- JSX REMAINS THE SAME, BUT THE ERROR MAPPING IS NOW UPDATED ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Bulk Upload Template Questions</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {uploadState === 'idle' && (
            <>
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">Instructions for: {paperDetails?.question_paper_name}</h3>

                {paperDetails && (
                  <p className="text-sm mb-3">
                    <b>Level:</b> {paperDetails.level?.name} | <b>Department:</b> {paperDetails.department?.name} | <b>Line:</b> {paperDetails.line?.name} | <b>Subline:</b> {paperDetails.subline?.name} | <b>Station:</b> {paperDetails.station?.name}
                  </p>
                )}

                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Download the Excel template. It includes required columns and examples.</li>
                  <li>Add new question rows in the <b>Template_Questions</b> sheet.</li>
                  <li>
                    Required columns: <code>question</code>, <code>option_a</code>,{' '}
                    <code>option_b</code>, <code>option_c</code>, <code>option_d</code>,{' '}
                    <code>correct_answer</code>.
                  </li>
                  <li>Make sure the correct_answer exactly matches one of the options.</li>
                  <li>Save the file and upload it below.</li>
                </ol>

                <a
                  href={buildDownloadUrl()}
                  className="text-blue-600 hover:text-blue-800 font-semibold mt-3 inline-block"
                >
                  Download Template
                </a>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  id="template-upload-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="template-upload-input"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                >
                  Choose File
                </label>
                {selectedFile ? (
                  <div className="mt-3 text-sm text-gray-700">
                    Selected: <b>{selectedFile.name}</b>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-gray-500">No file selected</div>
                )}
              </div>
            </>
          )}

          {uploadState === 'uploading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin h-10 w-10 border-4 border-blue-300 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-gray-700">Uploading...</p>
            </div>
          )}

          {uploadState === 'result' && result && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-md ${
                  result.status.toLowerCase().includes('fail')
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}
              >
                <div className="font-semibold">{result.status}</div>
                {result.detail && <div className="text-sm mt-1">{result.detail}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-2xl font-bold text-green-700">{result.created_count}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="text-sm text-gray-500">Errors</div>
                  <div className="text-2xl font-bold text-red-700">{result.error_count}</div>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <div className="font-semibold text-yellow-800 mb-2">Row Errors</div>
                  <ul className="text-sm text-yellow-800 space-y-2 max-h-48 overflow-auto">
                    {result.errors.map((e, idx) => (
                      <li key={idx}>
                        <b>Row {e.row}:</b> {formatErrorObject(e.errors)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={resetState}
                  className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
                >
                  Upload another file
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {uploadState === 'idle' && (
          <div className="p-4 border-t flex justify-end gap-2">
            <button onClick={handleClose} className="px-4 py-2 rounded-md border hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`px-4 py-2 rounded-md text-white ${
                selectedFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateQuestionBulkUploadModal;