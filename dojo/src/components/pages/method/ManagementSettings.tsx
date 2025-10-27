// import React, { useState, useEffect } from "react";
// import { Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp, Calendar, BarChart3, Building, Factory, Briefcase } from "lucide-react";

// interface ManagementReviewData {
//   id?: number;
//   hq: string;
//   factory: string;
//   department: string;
//   month_year: string;
//   new_operators_joined: number;
//   new_operators_trained: number;
//   total_training_plans: number;
//   total_trainings_actual: number;
//   total_defects_msil: number;
//   ctq_defects_msil: number;
//   total_defects_tier1: number;
//   ctq_defects_tier1: number;
//   total_internal_rejection: number;
//   ctq_internal_rejection: number;
// }

// const  ManagementSettings: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [managementReviewData, setManagementReviewData] = useState<ManagementReviewData[]>([
//     {
//       id: 1,
//       hq: 'Mumbai HQ',
//       factory: 'Factory A',
//       department: 'Production',
//       month_year: '2024-01-01',
//       new_operators_joined: 15,
//       new_operators_trained: 12,
//       total_training_plans: 25,
//       total_trainings_actual: 23,
//       total_defects_msil: 8,
//       ctq_defects_msil: 3,
//       total_defects_tier1: 12,
//       ctq_defects_tier1: 5,
//       total_internal_rejection: 4,
//       ctq_internal_rejection: 2,
//     },
//     {
//       id: 2,
//       hq: 'Delhi HQ',
//       factory: 'Factory B',
//       department: 'Quality',
//       month_year: '2024-02-01',
//       new_operators_joined: 18,
//       new_operators_trained: 16,
//       total_training_plans: 30,
//       total_trainings_actual: 28,
//       total_defects_msil: 6,
//       ctq_defects_msil: 2,
//       total_defects_tier1: 10,
//       ctq_defects_tier1: 4,
//       total_internal_rejection: 3,
//       ctq_internal_rejection: 1,
//     },
//   ]);
//   const [uploadFile, setUploadFile] = useState<File | null>(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [formData, setFormData] = useState<ManagementReviewData>({
//     hq: '',
//     factory: '',
//     department: '',
//     month_year: '',
//     new_operators_joined: 0,
//     new_operators_trained: 0,
//     total_training_plans: 0,
//     total_trainings_actual: 0,
//     total_defects_msil: 0,
//     ctq_defects_msil: 0,
//     total_defects_tier1: 0,
//     ctq_defects_tier1: 0,
//     total_internal_rejection: 0,
//     ctq_internal_rejection: 0,
//   });

//   // Dropdown options
//   const hqOptions = [
//     { value: '', label: 'Select HQ' },
//     { value: 'Mumbai HQ', label: 'Mumbai HQ' },
//     { value: 'Delhi HQ', label: 'Delhi HQ' },
//     { value: 'Bangalore HQ', label: 'Bangalore HQ' },
//     { value: 'Chennai HQ', label: 'Chennai HQ' },
//     { value: 'Pune HQ', label: 'Pune HQ' },
//   ];

//   const factoryOptions = [
//     { value: '', label: 'Select Factory' },
//     { value: 'Factory A', label: 'Factory A' },
//     { value: 'Factory B', label: 'Factory B' },
//     { value: 'Factory C', label: 'Factory C' },
//     { value: 'Factory D', label: 'Factory D' },
//     { value: 'Factory E', label: 'Factory E' },
//   ];

//   const departmentOptions = [
//     { value: '', label: 'Select Department' },
//     { value: 'Production', label: 'Production' },
//     { value: 'Quality', label: 'Quality' },
//     { value: 'Maintenance', label: 'Maintenance' },
//     { value: 'Engineering', label: 'Engineering' },
//     { value: 'Safety', label: 'Safety' },
//     { value: 'HR', label: 'Human Resources' },
//     { value: 'Finance', label: 'Finance' },
//     { value: 'Operations', label: 'Operations' },
//   ];

//   const tabs = [
//     { id: 'overview', name: 'Overview', icon: BarChart3 },
//     { id: 'add-data', name: 'Add Data', icon: Plus },
//     { id: 'upload', name: 'Upload Excel', icon: Upload },
//     { id: 'data-list', name: 'Data Records', icon: FileSpreadsheet },
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const formattedData = {
//       ...formData,
//       id: Date.now(), // Simulate ID generation
//       month_year: formData.month_year ? `${formData.month_year}-01` : ''
//     };

//     setManagementReviewData(prev => [...prev, formattedData]);
    
//     setFormData({
//       hq: '',
//       factory: '',
//       department: '',
//       month_year: '',
//       new_operators_joined: 0,
//       new_operators_trained: 0,
//       total_training_plans: 0,
//       total_trainings_actual: 0,
//       total_defects_msil: 0,
//       ctq_defects_msil: 0,
//       total_defects_tier1: 0,
//       ctq_defects_tier1: 0,
//       total_internal_rejection: 0,
//       ctq_internal_rejection: 0,
//     });
    
//     alert('Data added successfully!');
//     setActiveTab('data-list');
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm('Are you sure you want to delete this entry?')) {
//       setManagementReviewData(prev => prev.filter(item => item.id !== id));
//       alert('Entry deleted successfully!');
//     }
//   };

//   const handleExcelUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!uploadFile) {
//       alert('Please select a file to upload');
//       return;
//     }

//     setUploadLoading(true);
    
//     // Simulate upload process
//     setTimeout(() => {
//       alert('Excel file uploaded successfully!');
//       setUploadFile(null);
//       const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
//       if (fileInput) fileInput.value = '';
//       setUploadLoading(false);
//     }, 2000);
//   };

//   const handleInputChange = (field: keyof ManagementReviewData, value: string | number) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return '';
    
//     const dateParts = dateString.split('-');
//     const year = dateParts[0];
//     const month = dateParts[1].length === 2 ? dateParts[1] : dateParts[1].padStart(2, '0');
    
//     const date = new Date(`${year}-${month}-01`);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long' 
//     });
//   };

//   const dropdownFields = [
//     { id: 'hq', label: 'Headquarters', options: hqOptions, required: true, icon: Building },
//     { id: 'factory', label: 'Factory', options: factoryOptions, required: true, icon: Factory },
//     { id: 'department', label: 'Department', options: departmentOptions, required: true, icon: Briefcase },
//   ];

//   const formFields = [
//     { id: 'month_year', label: 'Month/Year', type: 'month', required: true, icon: Calendar },
//     { id: 'new_operators_joined', label: 'New Operators Joined', type: 'number', required: true, icon: Users },
//     { id: 'new_operators_trained', label: 'New Operators Trained', type: 'number', required: true, icon: Users },
//     { id: 'total_training_plans', label: 'Total Training Plans', type: 'number', required: true, icon: TrendingUp },
//     { id: 'total_trainings_actual', label: 'Total Trainings Actual', type: 'number', required: true, icon: TrendingUp },
//     { id: 'total_defects_msil', label: 'Total Defects MSIL', type: 'number', required: true, icon: BarChart3 },
//     { id: 'ctq_defects_msil', label: 'CTQ Defects MSIL', type: 'number', required: true, icon: BarChart3 },
//     { id: 'total_defects_tier1', label: 'Total Defects Tier1', type: 'number', required: true, icon: BarChart3 },
//     { id: 'ctq_defects_tier1', label: 'CTQ Defects Tier1', type: 'number', required: true, icon: BarChart3 },
//     { id: 'total_internal_rejection', label: 'Total Internal Rejection', type: 'number', required: true, icon: BarChart3 },
//     { id: 'ctq_internal_rejection', label: 'CTQ Internal Rejection', type: 'number', required: true, icon: BarChart3 },
//   ];

//   const getOverviewStats = () => {
//     const totalOperators = managementReviewData.reduce((sum, item) => sum + item.new_operators_joined, 0);
//     const totalTrained = managementReviewData.reduce((sum, item) => sum + item.new_operators_trained, 0);
//     const totalDefects = managementReviewData.reduce((sum, item) => sum + item.total_defects_msil + item.total_defects_tier1, 0);
//     const totalTrainingPlans = managementReviewData.reduce((sum, item) => sum + item.total_training_plans, 0);

//     return [
//       { title: 'Total Operators Joined', value: totalOperators, icon: Users, color: 'bg-blue-500' },
//       { title: 'Total Operators Trained', value: totalTrained, icon: TrendingUp, color: 'bg-green-500' },
//       { title: 'Total Defects', value: totalDefects, icon: BarChart3, color: 'bg-red-500' },
//       { title: 'Total Training Plans', value: totalTrainingPlans, icon: TrendingUp, color: 'bg-purple-500' },
//     ];
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return (
//           <div className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {getOverviewStats().map((stat, index) => {
//                 const IconComponent = stat.icon;
//                 return (
//                   <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
//                         <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//                       </div>
//                       <div className={`${stat.color} p-3 rounded-xl`}>
//                         <IconComponent className="h-6 w-6 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
//               <div className="space-y-4">
//                 {managementReviewData.slice(-3).map((item, index) => (
//                   <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
//                     <div className="bg-blue-100 p-2 rounded-lg mr-4">
//                       <Calendar className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium text-gray-800">{formatDate(item.month_year)} - {item.hq}</p>
//                       <p className="text-sm text-gray-600">{item.factory} - {item.department}</p>
//                       <p className="text-sm text-gray-600">{item.new_operators_joined} operators joined, {item.new_operators_trained} trained</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );

//       case 'add-data':
//         return (
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <div className="flex items-center mb-6">
//               <Plus className="h-6 w-6 text-blue-600 mr-3" />
//               <h2 className="text-2xl font-bold text-gray-800">Add New Entry</h2>
//             </div>
            
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Dropdown Fields Section */}
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <Building className="h-5 w-5 mr-2 text-blue-600" />
//                   Organization Details
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {dropdownFields.map((field) => {
//                     const IconComponent = field.icon;
//                     return (
//                       <div key={field.id} className="space-y-2">
//                         <label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                           <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
//                           {field.label}
//                           {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <select
//                           id={field.id}
//                           value={formData[field.id as keyof ManagementReviewData] as string}
//                           onChange={(e) => handleInputChange(field.id as keyof ManagementReviewData, e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
//                           required={field.required}
//                         >
//                           {field.options.map((option) => (
//                             <option key={option.value} value={option.value}>
//                               {option.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Regular Form Fields Section */}
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
//                   Performance Metrics
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {formFields.map((field) => {
//                     const IconComponent = field.icon;
//                     return (
//                       <div key={field.id} className="space-y-2">
//                         <label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                           <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
//                           {field.label}
//                           {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <input
//                           id={field.id}
//                           type={field.type}
//                           value={formData[field.id as keyof ManagementReviewData] as string | number}
//                           onChange={(e) => handleInputChange(field.id as keyof ManagementReviewData, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           required={field.required}
//                           min={field.type === 'number' ? 0 : undefined}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="flex justify-end pt-6">
//                 <button
//                   type="submit"
//                   className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg"
//                 >
//                   <Plus className="inline h-5 w-5 mr-2" />
//                   Add Entry
//                 </button>
//               </div>
//             </form>
//           </div>
//         );

//       case 'upload':
//         return (
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <div className="flex items-center mb-6">
//               <Upload className="h-6 w-6 text-green-600 mr-3" />
//               <h2 className="text-2xl font-bold text-gray-800">Upload Excel Data</h2>
//             </div>
            
//             <form onSubmit={handleExcelUpload} className="space-y-6">
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
//                 <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <div className="space-y-2">
//                   <label htmlFor="excel-upload" className="block text-lg font-medium text-gray-700">
//                     Choose Excel File
//                   </label>
//                   <p className="text-sm text-gray-500">Upload .xlsx or .xls files</p>
//                   <input
//                     id="excel-upload"
//                     type="file"
//                     accept=".xlsx,.xls"
//                     onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
//                     className="block w-full text-sm text-gray-500 mt-4
//                       file:mr-4 file:py-3 file:px-6
//                       file:rounded-xl file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-green-50 file:text-green-700
//                       hover:file:bg-green-100 file:transition-colors file:duration-200"
//                   />
//                 </div>
//               </div>
              
//               {uploadFile && (
//                 <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                   <div className="flex items-center">
//                     <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
//                     <span className="text-green-800 font-medium">{uploadFile.name}</span>
//                   </div>
//                 </div>
//               )}
              
//               <div className="flex justify-center">
//                 <button
//                   type="submit"
//                   disabled={!uploadFile || uploadLoading}
//                   className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg"
//                 >
//                   {uploadLoading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <Upload className="h-5 w-5 mr-2" />
//                       Upload Excel
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         );

//       case 'data-list':
//         return (
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center">
//                 <FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-800">Data Records</h2>
//                 <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
//                   {managementReviewData.length} entries
//                 </span>
//               </div>
//             </div>
            
//             {managementReviewData.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Joined</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Trained</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Plans</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Defects</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {managementReviewData.map((item, index) => (
//                       <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <Building className="h-4 w-4 text-gray-400 mr-2" />
//                             <span className="text-sm font-medium text-gray-900">{item.hq}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <Factory className="h-4 w-4 text-gray-400 mr-2" />
//                             <span className="text-sm text-gray-900">{item.factory}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
//                             <span className="text-sm text-gray-900">{item.department}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <Calendar className="h-4 w-4 text-gray-400 mr-2" />
//                             <span className="text-sm font-medium text-gray-900">{formatDate(item.month_year)}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.new_operators_joined}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.new_operators_trained}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_training_plans}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_defects_msil + item.total_defects_tier1}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button
//                             onClick={() => handleDelete(item.id!)}
//                             className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
//                           >
//                             <Trash2 className="h-4 w-4 mr-1" />
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <p className="text-xl font-medium text-gray-900 mb-2">No data available</p>
//                 <p className="text-gray-500 mb-6">Start by adding your first entry or uploading an Excel file</p>
//                 <div className="space-x-4">
//                   <button
//                     onClick={() => setActiveTab('add-data')}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Data
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('upload')}
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     <Upload className="h-4 w-4 mr-2" />
//                     Upload Excel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Management Review Dashboard</h1>
//           <p className="text-lg text-gray-600">Track and manage your operational metrics efficiently</p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="mb-8">
//           <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
//             <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
//               {tabs.map((tab) => {
//                 const IconComponent = tab.icon;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`${
//                       activeTab === tab.id
//                         ? 'border-blue-500 text-blue-600 bg-blue-50'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center space-x-2`}
//                   >
//                     <IconComponent className="h-5 w-5" />
//                     <span>{tab.name}</span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {renderTabContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagementSettings;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp, Calendar, BarChart3, Building, Factory, Briefcase, AlertCircle, Loader2 } from "lucide-react";

// // --- Configuration ---
// // IMPORTANT: Replace with your Django API URL.
// const API_BASE_URL = "http://127.0.0.1:8000/";

// // --- Interfaces ---
// interface ManagementReviewData {
//   id?: number;
//   hq: string;
//   factory: string;
//   department: string;
//   month_year: string; // Format: "YYYY-MM"
//   new_operators_joined: number;
//   new_operators_trained: number;
//   total_training_plans: number;
//   total_trainings_actual: number;
//   total_defects_msil: number;
//   ctq_defects_msil: number;
//   total_defects_tier1: number;
//   ctq_defects_tier1: number;
//   total_internal_rejection: number;
//   ctq_internal_rejection: number;
// }

// // For options we build for the dropdowns
// interface DropdownOption {
//   id: number;
//   name: string;
// }

// // For the raw data from /hierarchy-simple/
// interface HierarchyItem {
//   hq: number;
//   hq_name: string;
//   factory: number;
//   factory_name: string;
//   structure_data: {
//     departments: {
//       id: number;
//       department_name: string;
//     }[];
//   };
// }

// const ManagementSettings: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [managementReviewData, setManagementReviewData] = useState<ManagementReviewData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [uploadFile, setUploadFile] = useState<File | null>(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [formData, setFormData] = useState<ManagementReviewData>({
//     hq: '', factory: '', department: '', month_year: '',
//     new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
//     total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
//     total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
//     ctq_internal_rejection: 0,
//   });

//   const [hqOptions, setHqOptions] = useState<DropdownOption[]>([]);
//   const [factoryOptions, setFactoryOptions] = useState<DropdownOption[]>([]);
//   const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>([]);

//   const [nameToIdMap, setNameToIdMap] = useState<Record<string, Record<string, number>>>({ hq: {}, factory: {}, department: {} });
//   const [idToNameMap, setIdToNameMap] = useState<Record<string, Record<number, string>>>({ hq: {}, factory: {}, department: {} });
  
//   const tabs = [
//     { id: 'overview', name: 'Overview', icon: BarChart3 },
//     { id: 'add-data', name: 'Add Data', icon: Plus },
//     { id: 'upload', name: 'Upload Excel', icon: Upload },
//     { id: 'data-list', name: 'Data Records', icon: FileSpreadsheet },
//   ];

//   // --- Data Fetching and Initialization ---
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         // Fetch hierarchy and existing reviews data in parallel
//         const [hierarchyRes, reviewsRes] = await Promise.all([
//           axios.get<HierarchyItem[]>(`${API_BASE_URL}/hierarchy-simple/`),
//           axios.get(`${API_BASE_URL}/management-reviews/`),
//         ]);

//         const hierarchyData = hierarchyRes.data;

//         // --- Process hierarchy data to build unique dropdown lists ---
//         const hqMap = new Map<number, string>();
//         const factoryMap = new Map<number, string>();
//         const departmentMap = new Map<number, string>();

//         for (const structure of hierarchyData) {
//             if (!hqMap.has(structure.hq)) {
//                 hqMap.set(structure.hq, structure.hq_name);
//             }
//             if (!factoryMap.has(structure.factory)) {
//                 factoryMap.set(structure.factory, structure.factory_name);
//             }
            
//             if (structure.structure_data?.departments) {
//                 for (const dept of structure.structure_data.departments) {
//                     if (!departmentMap.has(dept.id)) {
//                         departmentMap.set(dept.id, dept.department_name);
//                     }
//                 }
//             }
//         }
        
//         const fetchedHqs = Array.from(hqMap, ([id, name]) => ({ id, name }));
//         const fetchedFactories = Array.from(factoryMap, ([id, name]) => ({ id, name }));
//         const fetchedDepartments = Array.from(departmentMap, ([id, name]) => ({ id, name }));

//         setHqOptions(fetchedHqs);
//         setFactoryOptions(fetchedFactories);
//         setDepartmentOptions(fetchedDepartments);
        
//         // --- Create lookup maps for data transformation ---
//         const createMaps = (options: DropdownOption[]) => {
//             const nameToId = options.reduce((acc, item) => ({ ...acc, [item.name]: item.id }), {});
//             const idToName = options.reduce((acc, item) => ({ ...acc, [item.id]: item.name }), {});
//             return { nameToId, idToName };
//         };
        
//         const hqMaps = createMaps(fetchedHqs);
//         const factoryMaps = createMaps(fetchedFactories);
//         const departmentMaps = createMaps(fetchedDepartments);

//         setNameToIdMap({ hq: hqMaps.nameToId, factory: factoryMaps.nameToId, department: departmentMaps.nameToId });
//         const newIdToNameMap = { hq: hqMaps.idToName, factory: factoryMaps.idToName, department: departmentMaps.idToName };
//         setIdToNameMap(newIdToNameMap);
        
//         // --- Transform existing review data using the maps we just built ---
//         const transformedData = reviewsRes.data.map((item: any) => ({
//           ...item,
//           hq: newIdToNameMap.hq[item.hq] || 'Unknown HQ',
//           factory: newIdToNameMap.factory[item.factory] || 'Unknown Factory',
//           department: newIdToNameMap.department[item.department] || 'Unknown Dept',
//           month_year: `${item.year}-${String(item.month).padStart(2, '0')}`,
//         }));
        
//         setManagementReviewData(transformedData);
        
//       } catch (err) {
//         setError("Failed to fetch data. Please ensure the API is running and the /hierarchy-simple/ endpoint is available.");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     initializeData();
//   }, []);

//   // --- CRUD Operations ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     const [year, month] = formData.month_year.split('-').map(Number);
//     const payload = {
//         ...formData,
//         hq: nameToIdMap.hq[formData.hq],
//         factory: nameToIdMap.factory[formData.factory],
//         department: nameToIdMap.department[formData.department],
//         year,
//         month,
//     };
//     delete (payload as any).month_year;
//     delete (payload as any).id;

//     try {
//         const response = await axios.post(`${API_BASE_URL}/management-reviews/`, payload);
//         const newItemFromApi = response.data;
        
//         const transformedNewItem = {
//             ...newItemFromApi,
//             hq: idToNameMap.hq[newItemFromApi.hq],
//             factory: idToNameMap.factory[newItemFromApi.factory],
//             department: idToNameMap.department[newItemFromApi.department],
//             month_year: `${newItemFromApi.year}-${String(newItemFromApi.month).padStart(2, '0')}`,
//         };
        
//         setManagementReviewData(prev => [...prev, transformedNewItem]);
//         setFormData({
//             hq: '', factory: '', department: '', month_year: '',
//             new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
//             total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
//             total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
//             ctq_internal_rejection: 0,
//         });
        
//         alert('Data added successfully!');
//         setActiveTab('data-list');
//     } catch (err: any) {
//         console.error("Failed to add entry:", err);
//         const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Could not add the entry.';
//         alert(`Error: ${errorMsg}`);
//     } finally {
//         setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this entry?')) {
//         try {
//             await axios.delete(`${API_BASE_URL}/management-reviews/${id}/`);
//             setManagementReviewData(prev => prev.filter(item => item.id !== id));
//             alert('Entry deleted successfully!');
//         } catch(err) {
//             console.error("Failed to delete entry:", err);
//             alert('Error: Could not delete the entry.');
//         }
//     }
//   };

//   const handleExcelUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!uploadFile) {
//       alert('Please select a file to upload');
//       return;
//     }
//     setUploadLoading(true);
//     setTimeout(() => {
//       alert('Excel file uploaded successfully! (Simulation)');
//       setUploadFile(null);
//       const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
//       if (fileInput) fileInput.value = '';
//       setUploadLoading(false);
//     }, 2000);
//   };

//   const handleInputChange = (field: keyof ManagementReviewData, value: string | number) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return '';
//     const [year, month] = dateString.split('-');
//     const date = new Date(parseInt(year), parseInt(month) - 1, 1);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
//   };
  
//   const dropdownFields = [
//     { id: 'hq', label: 'Headquarters', options: hqOptions, required: true, icon: Building },
//     { id: 'factory', label: 'Factory', options: factoryOptions, required: true, icon: Factory },
//     { id: 'department', label: 'Department', options: departmentOptions, required: true, icon: Briefcase },
//   ];

//   const formFields = [
//     { id: 'month_year', label: 'Month/Year', type: 'month', required: true, icon: Calendar },
//     { id: 'new_operators_joined', label: 'New Operators Joined', type: 'number', required: true, icon: Users },
//     { id: 'new_operators_trained', label: 'New Operators Trained', type: 'number', required: true, icon: Users },
//     { id: 'total_training_plans', label: 'Total Training Plans', type: 'number', required: true, icon: TrendingUp },
//     { id: 'total_trainings_actual', label: 'Total Trainings Actual', type: 'number', required: true, icon: TrendingUp },
//     { id: 'total_defects_msil', label: 'Total Defects MSIL', type: 'number', required: true, icon: BarChart3 },
//     { id: 'ctq_defects_msil', label: 'CTQ Defects MSIL', type: 'number', required: true, icon: BarChart3 },
//     { id: 'total_defects_tier1', label: 'Total Defects Tier1', type: 'number', required: true, icon: BarChart3 },
//     { id: 'ctq_defects_tier1', label: 'CTQ Defects Tier1', type: 'number', required: true, icon: BarChart3 },
//     { id: 'total_internal_rejection', label: 'Total Internal Rejection', type: 'number', required: true, icon: BarChart3 },
//     { id: 'ctq_internal_rejection', label: 'CTQ Internal Rejection', type: 'number', required: true, icon: BarChart3 },
//   ];

//   const getOverviewStats = () => {
//     if (!managementReviewData || managementReviewData.length === 0) {
//       return [
//         { title: 'Total Operators Joined', value: 0, icon: Users, color: 'bg-blue-500' },
//         { title: 'Total Operators Trained', value: 0, icon: TrendingUp, color: 'bg-green-500' },
//         { title: 'Total Defects', value: 0, icon: BarChart3, color: 'bg-red-500' },
//         { title: 'Total Training Plans', value: 0, icon: TrendingUp, color: 'bg-purple-500' },
//       ];
//     }
//     const totalOperators = managementReviewData.reduce((sum, item) => sum + item.new_operators_joined, 0);
//     const totalTrained = managementReviewData.reduce((sum, item) => sum + item.new_operators_trained, 0);
//     const totalDefects = managementReviewData.reduce((sum, item) => sum + item.total_defects_msil + item.total_defects_tier1, 0);
//     const totalTrainingPlans = managementReviewData.reduce((sum, item) => sum + item.total_training_plans, 0);

//     return [
//       { title: 'Total Operators Joined', value: totalOperators, icon: Users, color: 'bg-blue-500' },
//       { title: 'Total Operators Trained', value: totalTrained, icon: TrendingUp, color: 'bg-green-500' },
//       { title: 'Total Defects', value: totalDefects, icon: BarChart3, color: 'bg-red-500' },
//       { title: 'Total Training Plans', value: totalTrainingPlans, icon: TrendingUp, color: 'bg-purple-500' },
//     ];
//   };

//   const renderTabContent = () => {
//     if (isLoading) {
//       return (
//         <div className="flex justify-center items-center p-20 bg-white rounded-2xl shadow-lg">
//           <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
//           <p className="ml-4 text-xl text-gray-700">Loading data from server...</p>
//         </div>
//       );
//     }
//     if (error) {
//       return (
//         <div className="text-center p-20 bg-red-50 border border-red-200 rounded-2xl shadow-lg">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-2xl font-bold text-red-800 mb-2">An Error Occurred</h3>
//           <p className="text-red-700">{error}</p>
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case 'overview':
//         return (
//           <div className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {getOverviewStats().map((stat, index) => {
//                 const IconComponent = stat.icon;
//                 return (
//                   <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
//                         <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//                       </div>
//                       <div className={`${stat.color} p-3 rounded-xl`}>
//                         <IconComponent className="h-6 w-6 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
//               <div className="space-y-4">
//                 {managementReviewData.slice(-3).reverse().map((item, index) => (
//                   <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
//                     <div className="bg-blue-100 p-2 rounded-lg mr-4">
//                       <Calendar className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium text-gray-800">{formatDate(item.month_year)} - {item.hq}</p>
//                       <p className="text-sm text-gray-600">{item.factory} - {item.department}</p>
//                       <p className="text-sm text-gray-600">{item.new_operators_joined} operators joined, {item.new_operators_trained} trained</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );

//       case 'add-data':
//         return (
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <div className="flex items-center mb-6">
//               <Plus className="h-6 w-6 text-blue-600 mr-3" />
//               <h2 className="text-2xl font-bold text-gray-800">Add New Entry</h2>
//             </div>
            
//             <form onSubmit={handleSubmit} className="space-y-8">
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <Building className="h-5 w-5 mr-2 text-blue-600" /> Organization Details
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {dropdownFields.map((field) => {
//                     const IconComponent = field.icon;
//                     return (
//                       <div key={field.id} className="space-y-2">
//                         <label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                           <IconComponent className="h-4 w-4 mr-2 text-gray-500" /> {field.label}
//                           {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <select
//                           id={field.id}
//                           value={formData[field.id as keyof ManagementReviewData] as string}
//                           onChange={(e) => handleInputChange(field.id as keyof ManagementReviewData, e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
//                           required={field.required}
//                         >
//                           <option value="">Select {field.label}</option>
//                           {field.options.map((option) => (
//                             <option key={option.id} value={option.name}>
//                               {option.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                   <BarChart3 className="h-5 w-5 mr-2 text-green-600" /> Performance Metrics
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {formFields.map((field) => {
//                     const IconComponent = field.icon;
//                     return (
//                       <div key={field.id} className="space-y-2">
//                         <label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                           <IconComponent className="h-4 w-4 mr-2 text-gray-500" /> {field.label}
//                           {field.required && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <input
//                           id={field.id} type={field.type}
//                           value={formData[field.id as keyof ManagementReviewData] as string | number}
//                           onChange={(e) => handleInputChange(field.id as keyof ManagementReviewData, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                           required={field.required} min={field.type === 'number' ? 0 : undefined}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="flex justify-end pt-6">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting ? (
//                     <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Submitting...</>
//                   ) : (
//                     <><Plus className="inline h-5 w-5 mr-2" /> Add Entry</>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         );

//       case 'upload':
//         return (
//           <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//             <div className="flex items-center mb-6">
//               <Upload className="h-6 w-6 text-green-600 mr-3" />
//               <h2 className="text-2xl font-bold text-gray-800">Upload Excel Data</h2>
//             </div>
            
//             <form onSubmit={handleExcelUpload} className="space-y-6">
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
//                 <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <div className="space-y-2">
//                   <label htmlFor="excel-upload" className="block text-lg font-medium text-gray-700"> Choose Excel File </label>
//                   <p className="text-sm text-gray-500">Upload .xlsx or .xls files</p>
//                   <input
//                     id="excel-upload" type="file" accept=".xlsx,.xls"
//                     onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
//                     className="block w-full text-sm text-gray-500 mt-4 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:transition-colors file:duration-200"
//                   />
//                 </div>
//               </div>
              
//               {uploadFile && (
//                 <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                   <div className="flex items-center">
//                     <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
//                     <span className="text-green-800 font-medium">{uploadFile.name}</span>
//                   </div>
//                 </div>
//               )}
              
//               <div className="flex justify-center">
//                 <button
//                   type="submit" disabled={!uploadFile || uploadLoading}
//                   className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg"
//                 >
//                   {uploadLoading ? (
//                     <><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" /> Uploading...</>
//                   ) : (
//                     <><Upload className="h-5 w-5 mr-2" /> Upload Excel</>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         );

//       case 'data-list':
//         return (
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center">
//                 <FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-800">Data Records</h2>
//                 <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
//                   {managementReviewData.length} entries
//                 </span>
//               </div>
//             </div>
            
//             {managementReviewData.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Joined</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Trained</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Plans</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Defects</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {managementReviewData.map((item) => (
//                       <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Building className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm font-medium text-gray-900">{item.hq}</span></div></td>
//                         <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Factory className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm text-gray-900">{item.factory}</span></div></td>
//                         <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Briefcase className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm text-gray-900">{item.department}</span></div></td>
//                         <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Calendar className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm font-medium text-gray-900">{formatDate(item.month_year)}</span></div></td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.new_operators_joined}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.new_operators_trained}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_training_plans}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_defects_msil + item.total_defects_tier1}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button onClick={() => handleDelete(item.id!)}
//                             className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200">
//                             <Trash2 className="h-4 w-4 mr-1" /> Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <p className="text-xl font-medium text-gray-900 mb-2">No data available</p>
//                 <p className="text-gray-500 mb-6">Start by adding your first entry.</p>
//                 <button onClick={() => setActiveTab('add-data')}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
//                   <Plus className="h-4 w-4 mr-2" /> Add Data
//                 </button>
//               </div>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Management Review Dashboard</h1>
//           <p className="text-lg text-gray-600">Track and manage your operational metrics efficiently</p>
//         </div>

//         <div className="mb-8">
//           <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
//             <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
//               {tabs.map((tab) => {
//                 const IconComponent = tab.icon;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`${
//                       activeTab === tab.id
//                         ? 'border-blue-500 text-blue-600 bg-blue-50'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center space-x-2`}
//                   >
//                     <IconComponent className="h-5 w-5" />
//                     <span>{tab.name}</span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         </div>

//         <div className="tab-content">
//           {renderTabContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagementSettings;







import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp, Calendar, BarChart3, Building, Factory, Briefcase, AlertCircle, Loader2 } from "lucide-react";

// NEW AND CORRECT
import { Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp, Calendar, BarChart3, Building, Factory, Briefcase, AlertCircle, Loader2, Download, XCircle, CheckCircle, RefreshCw } from "lucide-react";

// --- Configuration ---
// IMPORTANT: Replace with your Django API URL.
const API_BASE_URL = "http://127.0.0.1:8000/";

// --- Interfaces ---
interface ManagementReviewData {
  id?: number;
  hq: string;
  factory: string;
  department: string;
  month_year: string; // Format: "YYYY-MM"
  new_operators_joined: number;
  new_operators_trained: number;
  total_training_plans: number;
  total_trainings_actual: number;
  total_defects_msil: number;
  ctq_defects_msil: number;
  total_defects_tier1: number;
  ctq_defects_tier1: number;
  total_internal_rejection: number;
  ctq_internal_rejection: number;
}

// For options we build for the dropdowns
interface DropdownOption {
  id: number;
  name: string;
}

// For the raw data from /hierarchy-simple/
interface HierarchyItem {
  hq: number;
  hq_name: string;
  factory: number;
  factory_name: string;
  structure_data: {
    departments: {
      id: number;
      department_name: string;
    }[];
  };
}



interface UploadErrorDetail {
  row: number;
  errors: Record<string, string[]> | string;
}

interface UploadResult {
  message: string;
  successful_uploads: number;
  failed_uploads_count: number;
  errors: UploadErrorDetail[];
}



const ManagementSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [managementReviewData, setManagementReviewData] = useState<ManagementReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);


  // const [uploadFile, setUploadFile] = useState<File | null>(null);
  // const [uploadLoading, setUploadLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ManagementReviewData>({
    hq: '', factory: '', department: '', month_year: '',
    new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
    total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
    total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
    ctq_internal_rejection: 0,
  });

  const [hqOptions, setHqOptions] = useState<DropdownOption[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<DropdownOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>([]);

  const [nameToIdMap, setNameToIdMap] = useState<Record<string, Record<string, number>>>({ hq: {}, factory: {}, department: {} });
  const [idToNameMap, setIdToNameMap] = useState<Record<string, Record<number, string>>>({ hq: {}, factory: {}, department: {} });
  
  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'add-data', name: 'Add Data', icon: Plus },
    { id: 'upload', name: 'Upload Excel', icon: Upload },
    { id: 'data-list', name: 'Data Records', icon: FileSpreadsheet },
  ];

  // --- Data Fetching and Initialization ---
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch hierarchy and existing reviews data in parallel
        const [hierarchyRes, reviewsRes] = await Promise.all([
          axios.get<HierarchyItem[]>(`${API_BASE_URL}/hierarchy-simple/`),
          axios.get(`${API_BASE_URL}/management-reviews/`),
        ]);

        const hierarchyData = hierarchyRes.data;

        // --- Process hierarchy data to build unique dropdown lists ---
        const hqMap = new Map<number, string>();
        const factoryMap = new Map<number, string>();
        const departmentMap = new Map<number, string>();

        for (const structure of hierarchyData) {
            if (!hqMap.has(structure.hq)) {
                hqMap.set(structure.hq, structure.hq_name);
            }
            if (!factoryMap.has(structure.factory)) {
                factoryMap.set(structure.factory, structure.factory_name);
            }
            
            if (structure.structure_data?.departments) {
                for (const dept of structure.structure_data.departments) {
                    if (!departmentMap.has(dept.id)) {
                        departmentMap.set(dept.id, dept.department_name);
                    }
                }
            }
        }
        
        const fetchedHqs = Array.from(hqMap, ([id, name]) => ({ id, name }));
        const fetchedFactories = Array.from(factoryMap, ([id, name]) => ({ id, name }));
        const fetchedDepartments = Array.from(departmentMap, ([id, name]) => ({ id, name }));

        setHqOptions(fetchedHqs);
        setFactoryOptions(fetchedFactories);
        setDepartmentOptions(fetchedDepartments);
        
        // --- Create lookup maps for data transformation ---
        const createMaps = (options: DropdownOption[]) => {
            const nameToId = options.reduce((acc, item) => ({ ...acc, [item.name]: item.id }), {});
            const idToName = options.reduce((acc, item) => ({ ...acc, [item.id]: item.name }), {});
            return { nameToId, idToName };
        };
        
        const hqMaps = createMaps(fetchedHqs);
        const factoryMaps = createMaps(fetchedFactories);
        const departmentMaps = createMaps(fetchedDepartments);

        setNameToIdMap({ hq: hqMaps.nameToId, factory: factoryMaps.nameToId, department: departmentMaps.nameToId });
        const newIdToNameMap = { hq: hqMaps.idToName, factory: factoryMaps.idToName, department: departmentMaps.idToName };
        setIdToNameMap(newIdToNameMap);
        
        // --- Transform existing review data using the maps we just built ---
        const transformedData = reviewsRes.data.map((item: any) => ({
          ...item,
          hq: newIdToNameMap.hq[item.hq] || 'Unknown HQ',
          factory: newIdToNameMap.factory[item.factory] || 'Unknown Factory',
          department: newIdToNameMap.department[item.department] || 'Unknown Dept',
          month_year: `${item.year}-${String(item.month).padStart(2, '0')}`,
        }));
        
        setManagementReviewData(transformedData);
        
      } catch (err) {
        setError("Failed to fetch data. Please ensure the API is running and the /hierarchy-simple/ endpoint is available.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  // --- CRUD Operations ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const [year, month] = formData.month_year.split('-').map(Number);
    const payload = {
        ...formData,
        hq: nameToIdMap.hq[formData.hq],
        factory: nameToIdMap.factory[formData.factory],
        department: nameToIdMap.department[formData.department],
        year,
        month,
    };
    delete (payload as any).month_year;
    delete (payload as any).id;

    try {
        const response = await axios.post(`${API_BASE_URL}/management-reviews/`, payload);
        const newItemFromApi = response.data;
        
        const transformedNewItem = {
            ...newItemFromApi,
            hq: idToNameMap.hq[newItemFromApi.hq],
            factory: idToNameMap.factory[newItemFromApi.factory],
            department: idToNameMap.department[newItemFromApi.department],
            month_year: `${newItemFromApi.year}-${String(newItemFromApi.month).padStart(2, '0')}`,
        };
        
        setManagementReviewData(prev => [...prev, transformedNewItem]);
        setFormData({
            hq: '', factory: '', department: '', month_year: '',
            new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
            total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
            total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
            ctq_internal_rejection: 0,
        });
        
        alert('Data added successfully!');
        setActiveTab('data-list');
    } catch (err: any) {
        console.error("Failed to add entry:", err);
        const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Could not add the entry.';
        alert(`Error: ${errorMsg}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
        try {
            await axios.delete(`${API_BASE_URL}/management-reviews/${id}/`);
            setManagementReviewData(prev => prev.filter(item => item.id !== id));
            alert('Entry deleted successfully!');
        } catch(err) {
            console.error("Failed to delete entry:", err);
            alert('Error: Could not delete the entry.');
        }
    }
  };

   const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    setUploadLoading(true);
    setUploadResult(null);
    setUploadError(null);

    const formData = new FormData();
    formData.append('excel_file', uploadFile);

    try {
      const response = await axios.post<UploadResult>(`${API_BASE_URL}/upload-review/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResult(response.data);
      // Optional: Refresh data list if some uploads were successful
      if (response.data.successful_uploads > 0) {
        // You would typically re-fetch your main data list here
        // For simplicity, we'll just alert the user.
        alert(`${response.data.successful_uploads} records were added. The data list will be updated on the next refresh.`);
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      const errorMsg = err.response?.data?.error || 'An unexpected error occurred during upload.';
      setUploadError(errorMsg);
    } finally {
      setUploadLoading(false);
    }
  };


  const handleDownloadSample = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download-sample/`, {
        responseType: 'blob', // Important for file downloads
      });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'management_review_sample.xlsx'); // File name
      document.body.appendChild(link);
      link.click();
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download sample file:", err);
      alert("Could not download the sample file. Please check the console for errors.");
    }
  };

  const handleInputChange = (field: keyof ManagementReviewData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  const dropdownFields = [
    { id: 'hq', label: 'Headquarters', options: hqOptions, required: true, icon: Building },
    { id: 'factory', label: 'Factory', options: factoryOptions, required: true, icon: Factory },
    { id: 'department', label: 'Department', options: departmentOptions, required: true, icon: Briefcase },
  ];

  const formFields = [
    { id: 'month_year', label: 'Month/Year', type: 'month', required: true, icon: Calendar },
    { id: 'new_operators_joined', label: 'New Operators Joined', type: 'number', required: true, icon: Users },
    { id: 'new_operators_trained', label: 'New Operators Trained', type: 'number', required: true, icon: Users },
    { id: 'total_training_plans', label: 'Total Training Plans', type: 'number', required: true, icon: TrendingUp },
    { id: 'total_trainings_actual', label: 'Total Trainings Actual', type: 'number', required: true, icon: TrendingUp },
    { id: 'total_defects_msil', label: 'Total Defects MSIL', type: 'number', required: true, icon: BarChart3 },
    { id: 'ctq_defects_msil', label: 'CTQ Defects MSIL', type: 'number', required: true, icon: BarChart3 },
    { id: 'total_defects_tier1', label: 'Total Defects Tier1', type: 'number', required: true, icon: BarChart3 },
    { id: 'ctq_defects_tier1', label: 'CTQ Defects Tier1', type: 'number', required: true, icon: BarChart3 },
    { id: 'total_internal_rejection', label: 'Total Internal Rejection', type: 'number', required: true, icon: BarChart3 },
    { id: 'ctq_internal_rejection', label: 'CTQ Internal Rejection', type: 'number', required: true, icon: BarChart3 },
  ];

  const getOverviewStats = () => {
    if (!managementReviewData || managementReviewData.length === 0) {
      return [
        { title: 'Total Operators Joined', value: 0, icon: Users, color: 'bg-blue-500' },
        { title: 'Total Operators Trained', value: 0, icon: TrendingUp, color: 'bg-green-500' },
        { title: 'Total Defects', value: 0, icon: BarChart3, color: 'bg-red-500' },
        { title: 'Total Training Plans', value: 0, icon: TrendingUp, color: 'bg-purple-500' },
      ];
    }
    const totalOperators = managementReviewData.reduce((sum, item) => sum + item.new_operators_joined, 0);
    const totalTrained = managementReviewData.reduce((sum, item) => sum + item.new_operators_trained, 0);
    const totalDefects = managementReviewData.reduce((sum, item) => sum + item.total_defects_msil + item.total_defects_tier1, 0);
    const totalTrainingPlans = managementReviewData.reduce((sum, item) => sum + item.total_training_plans, 0);

    return [
      { title: 'Total Operators Joined', value: totalOperators, icon: Users, color: 'bg-blue-500' },
      { title: 'Total Operators Trained', value: totalTrained, icon: TrendingUp, color: 'bg-green-500' },
      { title: 'Total Defects', value: totalDefects, icon: BarChart3, color: 'bg-red-500' },
      { title: 'Total Training Plans', value: totalTrainingPlans, icon: TrendingUp, color: 'bg-purple-500' },
    ];
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-20 bg-white rounded-2xl shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="ml-4 text-xl text-gray-700">Loading data from server...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center p-20 bg-red-50 border border-red-200 rounded-2xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-800 mb-2">An Error Occurred</h3>
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getOverviewStats().map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {managementReviewData.slice(-3).reverse().map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{formatDate(item.month_year)} - {item.hq}</p>
                      <p className="text-sm text-gray-600">{item.factory} - {item.department}</p>
                      <p className="text-sm text-gray-600">{item.new_operators_joined} operators joined, {item.new_operators_trained} trained</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'add-data':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Plus className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Add New Entry</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" /> Organization Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dropdownFields.map((field) => {
                    const IconComponent = field.icon;
                    return (
                      <div key={field.id} className="space-y-2">
                        <label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <IconComponent className="h-4 w-4 mr-2 text-gray-500" /> {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                          id={field.id}
                          value={formData[field.id as keyof ManagementReviewData] as string}
                          onChange={(e) => handleInputChange(field.id as keyof ManagementReviewData, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          required={field.required}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option key={option.id} value={option.name}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" /> Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formFields.map((field) => {
                    const IconComponent = field.icon;
                    return (
                      <div key={field.id} className="space-y-2">
                        <label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <IconComponent className="h-4 w-4 mr-2 text-gray-500" /> {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                          id={field.id} type={field.type}
                          value={formData[field.id as keyof ManagementReviewData] as string | number}
                          onChange={(e) => handleInputChange(field.id as keyof ManagementReviewData, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required={field.required} min={field.type === 'number' ? 0 : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Submitting...</>
                  ) : (
                    <><Plus className="inline h-5 w-5 mr-2" /> Add Entry</>
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      // case 'upload':
      //   return (
      //     <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      //       <div className="flex items-center mb-6">
      //         <Upload className="h-6 w-6 text-green-600 mr-3" />
      //         <h2 className="text-2xl font-bold text-gray-800">Upload Excel Data</h2>
      //       </div>
            
      //       <form onSubmit={handleExcelUpload} className="space-y-6">
      //         <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
      //           <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      //           <div className="space-y-2">
      //             <label htmlFor="excel-upload" className="block text-lg font-medium text-gray-700"> Choose Excel File </label>
      //             <p className="text-sm text-gray-500">Upload .xlsx or .xls files</p>
      //             <input
      //               id="excel-upload" type="file" accept=".xlsx,.xls"
      //               onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
      //               className="block w-full text-sm text-gray-500 mt-4 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:transition-colors file:duration-200"
      //             />
      //           </div>
      //         </div>
              
      //         {uploadFile && (
      //           <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      //             <div className="flex items-center">
      //               <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
      //               <span className="text-green-800 font-medium">{uploadFile.name}</span>
      //             </div>
      //           </div>
      //         )}
              
      //         <div className="flex justify-center">
      //           <button
      //             type="submit" disabled={!uploadFile || uploadLoading}
      //             className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg"
      //           >
      //             {uploadLoading ? (
      //               <><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" /> Uploading...</>
      //             ) : (
      //               <><Upload className="h-5 w-5 mr-2" /> Upload Excel</>
      //             )}
      //           </button>
      //         </div>
      //       </form>
      //     </div>
      //   );

      case 'upload':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Upload className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Upload Excel Data</h2>
              </div>
              <button
                onClick={handleDownloadSample}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" /> Download Sample
              </button>
            </div>
            
            <form onSubmit={handleExcelUpload} className="space-y-6">
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
                 <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                 <div className="space-y-2">
                   <label htmlFor="excel-upload" className="block text-lg font-medium text-gray-700"> Choose Excel File </label>
                   <p className="text-sm text-gray-500">Upload .xlsx or .xls files</p>
                   <input
                    id="excel-upload" type="file" accept=".xlsx,.xls"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 mt-4 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:transition-colors file:duration-200"
                  />
                </div>
              </div>
              
              {uploadFile && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">{uploadFile.name}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  type="submit" disabled={!uploadFile || uploadLoading}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {uploadLoading ? (
                    <><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" /> Uploading...</>
                  ) : (
                    <><Upload className="h-5 w-5 mr-2" /> Upload Excel</>
                  )}
                </button>
              </div>
            </form>

            {/* --- ADDED: Section to display upload results --- */}
            {uploadLoading && (
              <div className="flex justify-center items-center p-6 bg-gray-50 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="ml-4 text-lg text-gray-700">Processing file...</p>
              </div>
            )}

            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                <div className="flex items-center font-bold">
                  <XCircle className="h-5 w-5 mr-2" /> Upload Failed
                </div>
                <p className="mt-2">{uploadError}</p>
              </div>
            )}
            
            {uploadResult && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">{uploadResult.message}</h3>
                  <div className="flex space-x-6">
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">{uploadResult.successful_uploads} Succeeded</span>
                    </div>
                    <div className="flex items-center text-red-700">
                      <XCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">{uploadResult.failed_uploads_count} Failed</span>
                    </div>
                  </div>
                </div>

                {uploadResult.errors.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-2">Error Details:</h4>
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {uploadResult.errors.map((err, index) => (
                        <li key={index} className="text-sm bg-white p-3 rounded-lg border border-red-200">
                          <p className="font-semibold text-red-600">Row {err.row} in Excel:</p>
                          <pre className="mt-1 text-xs text-gray-700 bg-red-50 p-2 rounded whitespace-pre-wrap">
                            {JSON.stringify(err.errors, null, 2)}
                          </pre>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="text-center pt-2">
                    <button
                        onClick={() => {
                            setUploadResult(null);
                            setUploadFile(null);
                            const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" /> Upload Another File
                    </button>
                </div>
              </div>
            )}
            
          </div>
        );

      case 'data-list':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Data Records</h2>
                <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                  {managementReviewData.length} entries
                </span>
              </div>
            </div>
            
            {managementReviewData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Joined</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Trained</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Plans</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Defects</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {managementReviewData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Building className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm font-medium text-gray-900">{item.hq}</span></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Factory className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm text-gray-900">{item.factory}</span></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Briefcase className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm text-gray-900">{item.department}</span></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><Calendar className="h-4 w-4 text-gray-400 mr-2" /><span className="text-sm font-medium text-gray-900">{formatDate(item.month_year)}</span></div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.new_operators_joined}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.new_operators_trained}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_training_plans}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_defects_msil + item.total_defects_tier1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleDelete(item.id!)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200">
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-900 mb-2">No data available</p>
                <p className="text-gray-500 mb-6">Start by adding your first entry.</p>
                <button onClick={() => setActiveTab('add-data')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Data
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Management Review Dashboard</h1>
          <p className="text-lg text-gray-600">Track and manage your operational metrics efficiently</p>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center space-x-2`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ManagementSettings;
