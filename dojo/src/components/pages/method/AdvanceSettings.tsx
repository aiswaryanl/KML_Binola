// import React, { useState, useEffect } from "react";
// import { Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp, Calendar, BarChart3, Building, Factory, Briefcase } from "lucide-react";

// interface AdvanceSettingsData {
//   id?: number;
//   hq: string;
//   factory: string;
//   department: string;
//   month_year: string;
//   total_stations_ctq: number;
//   operator_required_ctq: number;
//   operator_availability_ctq: number;
//   buffer_manpower_required_ctq: number;
//   buffer_manpower_availability_ctq: number;
//   attrition_trend_ctq: number;
//   absentee_trend_ctq: number;
//   planned_units_ctq: number;
//   actual_production_ctq: number;
// }

// const AdvanceSettings: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [advanceSettingsData, setAdvanceSettingsData] = useState<AdvanceSettingsData[]>([
//     {
//       id: 1,
//       hq: 'Mumbai HQ',
//       factory: 'Factory A',
//       department: 'Production',
//       month_year: '2024-01-01',
//       total_stations_ctq: 25,
//       operator_required_ctq: 50,
//       operator_availability_ctq: 45,
//       buffer_manpower_required_ctq: 8,
//       buffer_manpower_availability_ctq: 6,
//       attrition_trend_ctq: 12,
//       absentee_trend_ctq: 8,
//       planned_units_ctq: 1000,
//       actual_production_ctq: 950,
//     },
//     {
//       id: 2,
//       hq: 'Delhi HQ',
//       factory: 'Factory B',
//       department: 'Quality',
//       month_year: '2024-02-01',
//       total_stations_ctq: 30,
//       operator_required_ctq: 60,
//       operator_availability_ctq: 55,
//       buffer_manpower_required_ctq: 10,
//       buffer_manpower_availability_ctq: 8,
//       attrition_trend_ctq: 15,
//       absentee_trend_ctq: 10,
//       planned_units_ctq: 1200,
//       actual_production_ctq: 1150,
//     },
//   ]);
//   const [uploadFile, setUploadFile] = useState<File | null>(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [formData, setFormData] = useState<AdvanceSettingsData>({
//     hq: '',
//     factory: '',
//     department: '',
//     month_year: '',
//     total_stations_ctq: 0,
//     operator_required_ctq: 0,
//     operator_availability_ctq: 0,
//     buffer_manpower_required_ctq: 0,
//     buffer_manpower_availability_ctq: 0,
//     attrition_trend_ctq: 0,
//     absentee_trend_ctq: 0,
//     planned_units_ctq: 0,
//     actual_production_ctq: 0,
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

//     setAdvanceSettingsData(prev => [...prev, formattedData]);
    
//     setFormData({
//       hq: '',
//       factory: '',
//       department: '',
//       month_year: '',
//       total_stations_ctq: 0,
//       operator_required_ctq: 0,
//       operator_availability_ctq: 0,
//       buffer_manpower_required_ctq: 0,
//       buffer_manpower_availability_ctq: 0,
//       attrition_trend_ctq: 0,
//       absentee_trend_ctq: 0,
//       planned_units_ctq: 0,
//       actual_production_ctq: 0,
//     });
    
//     alert('Data added successfully!');
//     setActiveTab('data-list');
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm('Are you sure you want to delete this entry?')) {
//       setAdvanceSettingsData(prev => prev.filter(item => item.id !== id));
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

//   const handleInputChange = (field: keyof AdvanceSettingsData, value: string | number) => {
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
//     { id: 'total_stations_ctq', label: 'Total Stations', type: 'number', required: true, icon: BarChart3 },
//     { id: 'operator_required_ctq', label: 'Operators Required', type: 'number', required: true, icon: Users },
//     { id: 'operator_availability_ctq', label: 'Operators Available', type: 'number', required: true, icon: Users },
//     { id: 'buffer_manpower_required_ctq', label: 'Buffer Manpower Required', type: 'number', required: true, icon: Users },
//     { id: 'buffer_manpower_availability_ctq', label: 'Buffer Manpower Available', type: 'number', required: true, icon: Users },
//     { id: 'attrition_trend_ctq', label: 'Attrition Trend', type: 'number', required: true, icon: TrendingUp },
//     { id: 'absentee_trend_ctq', label: 'Absentee Trend', type: 'number', required: true, icon: TrendingUp },
//     { id: 'planned_units_ctq', label: 'Planned Units', type: 'number', required: true, icon: BarChart3 },
//     { id: 'actual_production_ctq', label: 'Actual Production', type: 'number', required: true, icon: BarChart3 },
//   ];

//   const getOverviewStats = () => {
//     const totalStations = advanceSettingsData.reduce((sum, item) => sum + item.total_stations_ctq, 0);
//     const totalOperatorsRequired = advanceSettingsData.reduce((sum, item) => sum + item.operator_required_ctq, 0);
//     const totalPlannedUnits = advanceSettingsData.reduce((sum, item) => sum + item.planned_units_ctq, 0);
//     const totalActualProduction = advanceSettingsData.reduce((sum, item) => sum + item.actual_production_ctq, 0);

//     return [
//       { title: 'Total Stations', value: totalStations, icon: BarChart3, color: 'bg-blue-500' },
//       { title: 'Operators Required', value: totalOperatorsRequired, icon: Users, color: 'bg-green-500' },
//       { title: 'Planned Units', value: totalPlannedUnits, icon: TrendingUp, color: 'bg-purple-500' },
//       { title: 'Actual Production', value: totalActualProduction, icon: BarChart3, color: 'bg-orange-500' },
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
//                 {advanceSettingsData.slice(-3).map((item, index) => (
//                   <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
//                     <div className="bg-blue-100 p-2 rounded-lg mr-4">
//                       <Calendar className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium text-gray-800">{formatDate(item.month_year)} - {item.hq}</p>
//                       <p className="text-sm text-gray-600">{item.factory} - {item.department}</p>
//                       <p className="text-sm text-gray-600">{item.total_stations_ctq} stations, {item.operator_required_ctq} operators required</p>
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
//                           value={formData[field.id as keyof AdvanceSettingsData] as string}
//                           onChange={(e) => handleInputChange(field.id as keyof AdvanceSettingsData, e.target.value)}
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
//                   CTQ Metrics
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
//                           value={formData[field.id as keyof AdvanceSettingsData] as string | number}
//                           onChange={(e) => handleInputChange(field.id as keyof AdvanceSettingsData, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
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
//                   {advanceSettingsData.length} entries
//                 </span>
//               </div>
//             </div>
            
//             {advanceSettingsData.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stations</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Required</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Available</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned Units</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Production</th>
//                       <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {advanceSettingsData.map((item, index) => (
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
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.total_stations_ctq}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.operator_required_ctq}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.operator_availability_ctq}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.planned_units_ctq}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.actual_production_ctq}</td>
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
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Advance Settings Dashboard</h1>
//           <p className="text-lg text-gray-600">Track and manage your CTQ operational metrics efficiently</p>
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

// export default AdvanceSettings;


import React, { useState, useEffect, useMemo } from "react";
import { Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp, Calendar, BarChart3, Building, Factory, Briefcase, TrendingDown, Download } from "lucide-react";

// --- API Service & Type Definitions ---
const API_BASE_URL = "http://127.0.0.1:8000/"; 

// --- Frontend & API Data Interfaces ---
interface AdvanceSettingsData {
  id?: number;
  hq: number | null;
  factory: number | null;
  department: number | null;
  month_year: string;
  total_stations_ctq: number;
  operator_required_ctq: number;
  operator_availability_ctq: number;
  buffer_manpower_required_ctq: number;
  buffer_manpower_availability_ctq: number;
  attrition_trend_ctq: number;
  absentee_trend_ctq: number;
}

interface ApiAdvanceManpowerData {
    id: number; hq: number | null; factory: number; department: number | null;
    month: number; year: number; total_stations: number; operators_required: number;
    operators_available: number; buffer_manpower_required: number; buffer_manpower_available: number;
    attrition_rate: string; absenteeism_rate: string;
}

// --- Interface for the Hierarchy API Response ---
interface HierarchyDepartment { id: number; department_name: string; }
interface HierarchyStructure {
    hq: number; hq_name: string;
    factory: number; factory_name: string;
    structure_data: {
        departments: HierarchyDepartment[];
    };
}

interface DropdownOption { id: number; name: string; }

// --- Data Transformation Functions ---
const apiToFrontend = (apiData: ApiAdvanceManpowerData): AdvanceSettingsData => ({
    id: apiData.id, hq: apiData.hq, factory: apiData.factory, department: apiData.department,
    month_year: `${apiData.year}-${apiData.month.toString().padStart(2, '0')}`,
    total_stations_ctq: apiData.total_stations, operator_required_ctq: apiData.operators_required,
    operator_availability_ctq: apiData.operators_available, buffer_manpower_required_ctq: apiData.buffer_manpower_required,
    buffer_manpower_availability_ctq: apiData.buffer_manpower_available, attrition_trend_ctq: parseFloat(apiData.attrition_rate),
    absentee_trend_ctq: parseFloat(apiData.absenteeism_rate),
});

const frontendToApi = (formData: Omit<AdvanceSettingsData, 'id'>) => {
    const [year, month] = formData.month_year.split('-').map(Number);
    return {
        hq: formData.hq, factory: formData.factory, department: formData.department, month, year,
        total_stations: formData.total_stations_ctq, operators_required: formData.operator_required_ctq,
        operators_available: formData.operator_availability_ctq, buffer_manpower_required: formData.buffer_manpower_required_ctq,
        buffer_manpower_available: formData.buffer_manpower_availability_ctq, attrition_rate: formData.attrition_trend_ctq.toFixed(2),
        absenteeism_rate: formData.absentee_trend_ctq.toFixed(2),
    };
};

// --- Main Component ---
const AdvanceSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [advanceSettingsData, setAdvanceSettingsData] = useState<AdvanceSettingsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for dynamic hierarchy and dropdowns
  const [hierarchyData, setHierarchyData] = useState<HierarchyStructure[]>([]);
  const [hqOptions, setHqOptions] = useState<DropdownOption[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<DropdownOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>([]);

  // State for data display maps
  const [allHqsMap, setAllHqsMap] = useState<Record<number, string>>({});
  const [allFactoriesMap, setAllFactoriesMap] = useState<Record<number, string>>({});
  const [allDepartmentsMap, setAllDepartmentsMap] = useState<Record<number, string>>({});

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const initialFormData: Omit<AdvanceSettingsData, 'id'> = {
    hq: null, factory: null, department: null,
    month_year: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
    total_stations_ctq: 0, operator_required_ctq: 0, operator_availability_ctq: 0,
    buffer_manpower_required_ctq: 0, buffer_manpower_availability_ctq: 0,
    attrition_trend_ctq: 0.00, absentee_trend_ctq: 0.00,
  };
  
  const [formData, setFormData] = useState<Omit<AdvanceSettingsData, 'id'>>(initialFormData);

  const fetchDashboardData = async () => {
    try {
        const dashboardRes = await fetch(`${API_BASE_URL}/advance-dashboard/`);
        if (!dashboardRes.ok) throw new Error(`Failed to fetch dashboard data: ${dashboardRes.statusText}`);
        const dashboardJson: ApiAdvanceManpowerData[] = await dashboardRes.json();
        setAdvanceSettingsData(dashboardJson.map(apiToFrontend));
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching dashboard data.');
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch both dashboard and hierarchy data in parallel
        await Promise.all([
          fetchDashboardData(),
          (async () => {
            const hierarchyRes = await fetch(`${API_BASE_URL}/hierarchy-simple/`);
            if (!hierarchyRes.ok) throw new Error(`Failed to fetch hierarchy data: ${hierarchyRes.statusText}`);
            const hierarchyJson: HierarchyStructure[] = await hierarchyRes.json();
            
            setHierarchyData(hierarchyJson);

            const uniqueHqs = [...new Map(hierarchyJson.map(item => [item.hq, { id: item.hq, name: item.hq_name }])).values()];
            setHqOptions(uniqueHqs);

            const hqsMap: Record<number, string> = {};
            const factoriesMap: Record<number, string> = {};
            const departmentsMap: Record<number, string> = {};
            hierarchyJson.forEach(item => {
                hqsMap[item.hq] = item.hq_name;
                factoriesMap[item.factory] = item.factory_name;
                item.structure_data.departments.forEach(dept => {
                    departmentsMap[dept.id] = dept.department_name;
                });
            });
            setAllHqsMap(hqsMap);
            setAllFactoriesMap(factoriesMap);
            setAllDepartmentsMap(departmentsMap);
          })(),
        ]);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleHqChange = (hqId: number | null) => {
    setFormData(prev => ({ ...prev, hq: hqId, factory: null, department: null }));
    if (hqId) {
        const filteredFactories = hierarchyData.filter(item => item.hq === hqId);
        const uniqueFactories = [...new Map(filteredFactories.map(item => [item.factory, { id: item.factory, name: item.factory_name }])).values()];
        setFactoryOptions(uniqueFactories);
    } else {
        setFactoryOptions([]);
    }
    setDepartmentOptions([]);
  };

  const handleFactoryChange = (factoryId: number | null) => {
    setFormData(prev => ({ ...prev, factory: factoryId, department: null }));
    if (factoryId && formData.hq) {
        const filteredDepts = hierarchyData
            .filter(item => item.hq === formData.hq && item.factory === factoryId)
            .flatMap(item => item.structure_data.departments);
        const uniqueDepts = [...new Map(filteredDepts.map(item => [item.id, { id: item.id, name: item.department_name }])).values()];
        setDepartmentOptions(uniqueDepts);
    } else {
        setDepartmentOptions([]);
    }
  };
  
  const handleDepartmentChange = (deptId: number | null) => {
    setFormData(prev => ({ ...prev, department: deptId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.factory) { alert("Factory is a required field."); return; }
    const apiPayload = frontendToApi(formData);
    try {
      const response = await fetch(`${API_BASE_URL}/advance-dashboard/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiPayload),
      });
      if (!response.ok) {
        const errorData = await response.json(); throw new Error(JSON.stringify(errorData));
      }
      const newApiData: ApiAdvanceManpowerData = await response.json();
      setAdvanceSettingsData(prev => [...prev, apiToFrontend(newApiData)]);
      setFormData(initialFormData);
      setFactoryOptions([]);
      setDepartmentOptions([]);
      alert('Data added successfully!');
      setActiveTab('data-list');
    } catch (err: any) {
      alert(`Failed to add entry: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/advance-dashboard/${id}/`, { method: 'DELETE' });
        if (response.status !== 204) throw new Error('Failed to delete entry.');
        setAdvanceSettingsData(prev => prev.filter(item => item.id !== id));
        alert('Entry deleted successfully!');
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/advance-dashboard/download-template/`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Updated filename to match backend
        a.download = 'manpower_upload_template_with_examples.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Could not download the template.');
    }
  };

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    setUploadLoading(true);

    const formData = new FormData();
    formData.append('file', uploadFile); // The key 'file' must match the Django backend

    try {
      const response = await fetch(`${API_BASE_URL}/advance-dashboard/upload-data/`, {
        method: 'POST',
        body: formData,
        // NOTE: Do NOT set 'Content-Type'. The browser will set it correctly for multipart/form-data.
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors from the backend
        let errorMessage = result.error || 'An unknown error occurred.';
        if (result.errors && Array.isArray(result.errors)) {
          errorMessage += '\nDetails:\n' + result.errors.join('\n');
        }
        throw new Error(errorMessage);
      }

      // Success
      alert(`Upload successful!\nCreated: ${result.records_created}\nUpdated: ${result.records_updated}`);
      await fetchDashboardData(); // Refresh the data list
      setActiveTab('data-list'); // Switch to the data list to see changes

    } catch (err: any) {
      alert(`Upload failed:\n${err.message}`);
    } finally {
      // Reset state regardless of success or failure
      setUploadLoading(false);
      setUploadFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  const getOverviewStats = () => {
    const totalStations = advanceSettingsData.reduce((sum, item) => sum + item.total_stations_ctq, 0);
    const totalOperatorsRequired = advanceSettingsData.reduce((sum, item) => sum + item.operator_required_ctq, 0);
    const totalOperatorsAvailable = advanceSettingsData.reduce((sum, item) => sum + item.operator_availability_ctq, 0);
    const operatorDeficit = totalOperatorsRequired - totalOperatorsAvailable;
    return [
      { title: 'Total Stations', value: totalStations, icon: BarChart3, color: 'bg-blue-500' },
      { title: 'Operators Required', value: totalOperatorsRequired, icon: Users, color: 'bg-green-500' },
      { title: 'Operators Available', value: totalOperatorsAvailable, icon: Users, color: 'bg-purple-500' },
      { title: 'Operator Deficit', value: operatorDeficit, icon: TrendingDown, color: 'bg-red-500' },
    ];
  };
  
  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 }, { id: 'add-data', name: 'Add Data', icon: Plus },
    { id: 'upload', name: 'Upload Excel', icon: Upload }, { id: 'data-list', name: 'Data Records', icon: FileSpreadsheet },
  ];

  const formFields = [
    { id: 'month_year', label: 'Month/Year', type: 'month' }, { id: 'total_stations_ctq', label: 'Total Stations', type: 'number' },
    { id: 'operator_required_ctq', label: 'Operators Required', type: 'number' }, { id: 'operator_availability_ctq', label: 'Operators Available', type: 'number' },
    { id: 'buffer_manpower_required_ctq', label: 'Buffer Manpower Required', type: 'number' }, { id: 'buffer_manpower_availability_ctq', label: 'Buffer Manpower Available', type: 'number' },
    { id: 'attrition_trend_ctq', label: 'Attrition Rate (%)', type: 'number' }, { id: 'absentee_trend_ctq', label: 'Absenteeism Rate (%)', type: 'number' },
  ];

  const renderTabContent = () => {
    if (loading) return <div className="text-center p-12 text-lg font-semibold text-gray-600">Loading data...</div>;
    if (error) return <div className="text-center p-12 text-lg font-semibold text-red-600">Error: {error}</div>;

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
                      <div><p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p><p className="text-3xl font-bold text-gray-900">{stat.value}</p></div>
                      <div className={`${stat.color} p-3 rounded-xl`}><IconComponent className="h-6 w-6 text-white" /></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {advanceSettingsData.slice(-3).reverse().map((item) => (
                  <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4"><Calendar className="h-5 w-5 text-blue-600" /></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{formatDate(item.month_year)} - {item.hq ? allHqsMap[item.hq] : 'N/A'}</p>
                      <p className="text-sm text-gray-600">{item.factory ? allFactoriesMap[item.factory] : 'N/A'} - {item.department ? allDepartmentsMap[item.department] : 'N/A'}</p>
                      <p className="text-sm text-gray-600">{item.total_stations_ctq} stations, {item.operator_required_ctq} operators required</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Plus className="h-6 w-6 mr-3 text-blue-600" />Add New Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Building className="h-5 w-5 mr-2 text-blue-600" />Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="hq" className="block text-sm font-medium text-gray-700 mb-2">Headquarters</label>
                    <select id="hq" value={formData.hq ?? ''} onChange={(e) => handleHqChange(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm">
                        <option value="">Select HQ</option>
                        {hqOptions.map(opt => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="factory" className="block text-sm font-medium text-gray-700 mb-2">Factory <span className="text-red-500">*</span></label>
                    <select id="factory" value={formData.factory ?? ''} onChange={(e) => handleFactoryChange(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm" disabled={!formData.hq}>
                        <option value="">Select Factory</option>
                        {factoryOptions.map(opt => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select id="department" value={formData.department ?? ''} onChange={(e) => handleDepartmentChange(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm" disabled={!formData.factory}>
                        <option value="">Select Department</option>
                        {departmentOptions.map(opt => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><BarChart3 className="h-5 w-5 mr-2 text-green-600" />Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formFields.map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">{field.label}<span className="text-red-500 ml-1">*</span></label>
                      <input id={field.id} type={field.type} value={formData[field.id as keyof typeof formData] as string | number}
                        onChange={(e) => setFormData(prev => ({...prev, [field.id]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm" required min={0} step={field.id.includes('trend') ? "0.01" : "1"} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-6">
                <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800"><Plus className="inline h-5 w-5 mr-2" />Add Entry</button>
              </div>
            </form>
          </div>
        );

      case 'upload':
         return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><Upload className="h-6 w-6 mr-3 text-green-600" />Upload Excel Data</h2>
                <button
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template with Examples
                </button>
            </div>
            <p className="text-gray-600 mb-6">
                Download the template to see the required format and example data. The file uses names (e.g., "Main Plant") instead of IDs. Fill it out and upload the completed file below.
            </p>
            <form onSubmit={handleExcelUpload} className="space-y-6">
              {/* The rest of the form JSX remains the same */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"><FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" /><label htmlFor="excel-upload" className="block text-lg font-medium text-gray-700">Choose Excel File</label><p className="text-sm text-gray-500">Upload .xlsx or .xls files</p><input id="excel-upload" type="file" accept=".xlsx,.xls" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 mt-4 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" /></div>
              {uploadFile && (<div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center"><FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" /><span className="text-green-800 font-medium">{uploadFile.name}</span></div>)}
              <div className="flex justify-center">
                <button type="submit" disabled={!uploadFile || uploadLoading} className="inline-flex items-center px-8 py-3 rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 disabled:opacity-50 transition-opacity">
                  {uploadLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Uploading...</>) : (<><Upload className="h-5 w-5 mr-2" />Upload & Process File</>)}
                </button>
              </div>
            </form>
          </div>
        );

      case 'data-list':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center"><FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3" /><h2 className="text-2xl font-bold text-gray-800">Data Records</h2><span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">{advanceSettingsData.length} entries</span></div>
            {advanceSettingsData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50"><tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">HQ</th><th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Factory</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Department</th><th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Month/Year</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Stations</th><th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Op. Required</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {advanceSettingsData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.hq ? allHqsMap[item.hq] : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.factory ? allFactoriesMap[item.factory] : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.department ? allDepartmentsMap[item.department] : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(item.month_year)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.total_stations_ctq}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.operator_required_ctq}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><button onClick={() => handleDelete(item.id!)} className="inline-flex items-center px-3 py-1 border border-red-300 text-sm rounded-lg text-red-700 bg-red-50 hover:bg-red-100"><Trash2 className="h-4 w-4 mr-1" />Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (<div className="text-center py-12"><FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" /><p className="text-xl font-medium text-gray-900 mb-2">No data available</p></div>)}
          </div>
        );
      default: return <div className="text-center p-12">Select a tab to view content.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Advance Manpower Dashboard</h1>
          <p className="text-lg text-gray-600">Track and manage your operational manpower metrics efficiently</p>
        </div>
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-sm">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`${activeTab === tab.id ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg flex items-center space-x-2`}>
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

export default AdvanceSettings; 