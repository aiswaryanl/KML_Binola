// import { useEffect, useState } from 'react';
// import { ChevronRight, Download, FileText, History } from 'lucide-react';

// const Report = () => {
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadSuccess, setDownloadSuccess] = useState(false);

//   const handleDownload = async () => {
//     try {
//       setIsDownloading(true);
//       setDownloadSuccess(false);

//       // Simulate download process
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       setDownloadSuccess(true);
//     } catch (error) {
//       console.error('Download error:', error);
//       alert('Failed to download the file. Please try again.');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const handleNavigate = (path) => {
//     console.log(`Navigating to: ${path}`);
//   };

//   useEffect(() => {
//     let timer;
//     if (downloadSuccess) {
//       timer = setTimeout(() => setDownloadSuccess(false), 4000);
//     }
//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [downloadSuccess]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
//       {/* Header */}
//       <div className="bg-white border-b border-slate-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-blue-400 rounded-lg flex items-center justify-center">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Employee Reports</h1>
//                 <p className="text-sm text-gray-600">Comprehensive employee data management</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Success Toast */}
//         {downloadSuccess && (
//           <div
//             role="status"
//             aria-live="polite"
//             className="fixed top-4 right-4 z-50 bg-white border border-green-200 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-3 animate-in slide-in-from-top-2"
//           >
//             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//               <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">Download completed!</p>
//               <p className="text-xs text-gray-600">Master table exported successfully</p>
//             </div>
//           </div>
//         )}

//         {/* Page Title */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Reports Dashboard</h2>
//           <p className="text-gray-600">Access and manage your employee reports and data exports</p>
//         </div>

//         {/* Report Cards Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Employee History Card */}
//           <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden">
//             <div className="p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div className="w-12 h-12 bg-gradient-to-r from-slate-400 to-gray-500 rounded-xl flex items-center justify-center">
//                   <History className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-3">Employee History</h3>
//               <p className="text-gray-600 mb-8 leading-relaxed">
//                 Complete record of all employee changes and updates. Track modifications, additions, and historical data points.
//               </p>
              
//               <button
//                 onClick={() => handleNavigate('/EmployeeHistorySearch')}
//                 className="w-full bg-gradient-to-r from-slate-400 to-gray-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-slate-500 hover:to-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
//               >
//                 <span>Access Report</span>
//                 <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
//               </button>
//             </div>
//           </div>

//           {/* Master Table Card */}
//           <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden">
//             <div className="p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-slate-400 rounded-xl flex items-center justify-center">
//                   <FileText className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-3">Master Table</h3>
//               <p className="text-gray-600 mb-8 leading-relaxed">
//                 Current snapshot of all employee records. View comprehensive data or export to Excel for further analysis.
//               </p>
              
//               <div className="space-y-3">
//                 <button
//                   onClick={() => handleNavigate('/MasterTable')}
//                   className="w-full bg-slate-50 text-slate-600 px-6 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
//                 >
//                   <span>View Report</span>
//                   <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
//                 </button>
                
//                 <button
//                   onClick={handleDownload}
//                   disabled={isDownloading}
//                   className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
//                     isDownloading 
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                       : 'bg-gradient-to-r from-blue-400 to-slate-400 text-white hover:from-blue-500 hover:to-slate-500'
//                   }`}
//                 >
//                   {isDownloading ? (
//                     <>
//                       <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       <span>Downloading...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Download className="w-5 h-5" />
//                       <span>Download Excel</span>
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

// export default Report;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import { ChevronRight, Download, FileText, History } from "lucide-react";

const Report = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const navigate = useNavigate(); // ✅ added

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setDownloadSuccess(true);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download the file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path); // ✅ updated to real navigation
  };

  useEffect(() => {
    let timer;
    if (downloadSuccess) {
      timer = setTimeout(() => setDownloadSuccess(false), 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [downloadSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-blue-400 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee Reports
                </h1>
                <p className="text-sm text-gray-600">
                  Comprehensive employee data management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Toast */}
        {downloadSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-4 right-4 z-50 bg-white border border-green-200 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-3 animate-in slide-in-from-top-2"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Download completed!
              </p>
              <p className="text-xs text-gray-600">
                Master table exported successfully
              </p>
            </div>
          </div>
        )}

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reports Dashboard
          </h2>
          <p className="text-gray-600">
            Access and manage your employee reports and data exports
          </p>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Employee History Card */}
          <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-400 to-gray-500 rounded-xl flex items-center justify-center">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Employee History
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Complete record of all employee changes and updates. Track
                modifications, additions, and historical data points.
              </p>

              <button
                onClick={() => handleNavigate("/EmployeeHistorySearch")}
                className="w-full bg-gradient-to-r from-slate-400 to-gray-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-slate-500 hover:to-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
              >
                <span>Access Report</span>
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Master Table Card */}
          <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-slate-400 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Master Table
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Current snapshot of all employee records. View comprehensive
                data or export to Excel for further analysis.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleNavigate("/MasterTable")}
                  className="w-full bg-slate-50 text-slate-600 px-6 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
                >
                  <span>View Report</span>
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isDownloading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-400 to-slate-400 text-white hover:from-blue-500 hover:to-slate-500"
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Excel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* OJT Status Card */}
          <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                OJT Status
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Track and manage trainee On Job Training status.
              </p>

              <button
                onClick={() => handleNavigate("/ojt-status")}
                className="w-full bg-gradient-to-r from-green-400 to-teal-400 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-500 hover:to-teal-500 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
              >
                <span>Access OJT</span>
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
