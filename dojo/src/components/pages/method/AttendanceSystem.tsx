import React, { useState } from "react";
import { Upload, Plus, Eye, FileSpreadsheet, Users, Clock, Building, Briefcase, Calendar, Search, Filter, Trash2, Download, BarChart3 } from "lucide-react";

// Define table fields as constants
const fields = [
  { key: "srNo", label: "Sr.No.", type: "number", icon: BarChart3 },
  { key: "payCode", label: "PayCode", type: "text", icon: Users },
  { key: "cardNo", label: "Card No", type: "text", icon: Users },
  { key: "employeeName", label: "Employee Name", type: "text", icon: Users },
  { key: "department", label: "Department", type: "text", icon: Building },
  { key: "designation", label: "Designation", type: "text", icon: Briefcase },
  { key: "shift", label: "Shift", type: "text", icon: Clock },
  { key: "start", label: "Start", type: "time", icon: Clock },
  { key: "in", label: "In", type: "time", icon: Clock },
  { key: "out", label: "Out", type: "time", icon: Clock },
  { key: "hrsWorks", label: "Hrs Works", type: "time", icon: Clock },
  { key: "status", label: "Status", type: "text", icon: BarChart3 },
  { key: "earlyArriv", label: "Early Arriv.", type: "time", icon: Clock },
  { key: "lateArriv", label: "Late Arriv.", type: "time", icon: Clock },
  { key: "shiftEarly", label: "Shift Early", type: "time", icon: Clock },
  { key: "excessLunch", label: "Excess Lunch", type: "time", icon: Clock },
  { key: "ot", label: "OT", type: "time", icon: Clock },
  { key: "otAmount", label: "OT Amount", type: "number", icon: BarChart3 },
  { key: "manual", label: "Manual", type: "text", icon: BarChart3 },
];

interface AttendanceRecord {
  [key: string]: string | number;
  srNo: number;
  payCode: string;
  cardNo: string;
  employeeName: string;
  department: string;
  designation: string;
  shift: string;
  start: string;
  in: string;
  out: string;
  hrsWorks: string;
  status: string;
  earlyArriv: string;
  lateArriv: string;
  shiftEarly: string;
  excessLunch: string;
  ot: string;
  otAmount: number;
  manual: string;
}

const AttendanceSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<AttendanceRecord[]>([
    {
      srNo: 1,
      payCode: "EMP001",
      cardNo: "C001",
      employeeName: "John Doe",
      department: "IT",
      designation: "Software Engineer",
      shift: "Day",
      start: "09:00",
      in: "09:15",
      out: "18:00",
      hrsWorks: "08:45",
      status: "Present",
      earlyArriv: "",
      lateArriv: "00:15",
      shiftEarly: "",
      excessLunch: "",
      ot: "01:00",
      otAmount: 500,
      manual: ""
    },
    {
      srNo: 2,
      payCode: "EMP002",
      cardNo: "C002",
      employeeName: "Jane Smith",
      department: "HR",
      designation: "HR Manager",
      shift: "Day",
      start: "09:00",
      in: "08:50",
      out: "17:30",
      hrsWorks: "08:40",
      status: "Present",
      earlyArriv: "00:10",
      lateArriv: "",
      shiftEarly: "00:30",
      excessLunch: "",
      ot: "",
      otAmount: 0,
      manual: ""
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [newRecord, setNewRecord] = useState<Partial<AttendanceRecord>>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Filter data based on search and department
  const filteredData = data.filter(row => {
    const matchesSearch = Object.values(row).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDepartment = !filterDepartment || row.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(data.map(row => row.department).filter(Boolean))];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'add-data', name: 'Add Record', icon: Plus },
    { id: 'upload', name: 'Upload Excel', icon: Upload },
    { id: 'data-list', name: 'View Records', icon: Eye },
  ];

  // Handle Excel file upload (simulated)
  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    
    setUploadLoading(true);
    // Simulate file processing
    setTimeout(() => {
      // Sample data for demonstration
      const sampleData: AttendanceRecord[] = [
        {
          srNo: data.length + 1,
          payCode: "EMP003",
          cardNo: "C003",
          employeeName: "Mike Johnson",
          department: "Finance",
          designation: "Accountant",
          shift: "Day",
          start: "09:00",
          in: "09:10",
          out: "18:15",
          hrsWorks: "09:05",
          status: "Present",
          earlyArriv: "",
          lateArriv: "00:10",
          shiftEarly: "",
          excessLunch: "",
          ot: "00:15",
          otAmount: 200,
          manual: ""
        }
      ];
      setData(prev => [...prev, ...sampleData]);
      setUploadLoading(false);
      setUploadFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      alert("Excel data uploaded successfully!");
    }, 2000);
  };

  // Export data
  const exportData = () => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Add new record
  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRecord.employeeName || !newRecord.department) {
      alert("Please fill in required fields (Employee Name and Department)");
      return;
    }
    
    const record: AttendanceRecord = {
      srNo: data.length + 1,
      payCode: String(newRecord.payCode || ''),
      cardNo: String(newRecord.cardNo || ''),
      employeeName: String(newRecord.employeeName || ''),
      department: String(newRecord.department || ''),
      designation: String(newRecord.designation || ''),
      shift: String(newRecord.shift || ''),
      start: String(newRecord.start || ''),
      in: String(newRecord.in || ''),
      out: String(newRecord.out || ''),
      hrsWorks: String(newRecord.hrsWorks || ''),
      status: String(newRecord.status || ''),
      earlyArriv: String(newRecord.earlyArriv || ''),
      lateArriv: String(newRecord.lateArriv || ''),
      shiftEarly: String(newRecord.shiftEarly || ''),
      excessLunch: String(newRecord.excessLunch || ''),
      ot: String(newRecord.ot || ''),
      otAmount: Number(newRecord.otAmount) || 0,
      manual: String(newRecord.manual || '')
    };
    
    setData([...data, record]);
    setNewRecord({});
    alert("Record added successfully!");
    setActiveTab('data-list');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setData(prev => prev.filter(item => item.srNo !== id));
      alert('Entry deleted successfully!');
    }
  };

  const handleInputChange = (field: keyof AttendanceRecord, value: string | number) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const getOverviewStats = () => {
    const totalEmployees = data.length;
    const presentEmployees = data.filter(item => item.status === "Present").length;
    const totalOT = data.reduce((sum, item) => sum + item.otAmount, 0);
    const totalDepartments = departments.length;

    return [
      { title: 'Total Employees', value: totalEmployees, icon: Users, color: 'bg-blue-500' },
      { title: 'Present Today', value: presentEmployees, icon: Clock, color: 'bg-green-500' },
      { title: 'Total OT Amount', value: `₹${totalOT}`, icon: BarChart3, color: 'bg-purple-500' },
      { title: 'Departments', value: totalDepartments, icon: Building, color: 'bg-orange-500' },
    ];
  };

  const renderTabContent = () => {
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {data.slice(-3).map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.employeeName}</p>
                        <p className="text-sm text-gray-600">{item.department} - {item.status}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.in} - {item.out}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Department Distribution</h3>
                <div className="space-y-3">
                  {departments.map((dept, index) => {
                    const count = data.filter(item => item.department === dept).length;
                    const percentage = ((count / data.length) * 100).toFixed(1);
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-12">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'add-data':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Plus className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Add New Attendance Record</h2>
            </div>
            
            <form onSubmit={handleAddRecord} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.slice(1).map((field) => {
                  const IconComponent = field.icon;
                  const isRequired = field.key === 'employeeName' || field.key === 'department';
                  return (
                    <div key={field.key} className="space-y-2">
                      <label htmlFor={field.key} className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
                        {field.label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        id={field.key}
                        type={field.type}
                        value={newRecord[field.key] as string | number || ""}
                        onChange={(e) => handleInputChange(field.key as keyof AttendanceRecord, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Enter ${field.label}`}
                        required={isRequired}
                        min={field.type === 'number' ? 0 : undefined}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Plus className="inline h-5 w-5 mr-2" />
                  Add Record
                </button>
              </div>
            </form>
          </div>
        );

      case 'upload':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Upload className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Upload Excel Data</h2>
            </div>
            
            <form onSubmit={handleExcelUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
                <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <label htmlFor="excel-upload" className="block text-lg font-medium text-gray-700">
                    Choose Excel File
                  </label>
                  <p className="text-sm text-gray-500">Upload .xlsx or .xls files</p>
                  <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 mt-4
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100 file:transition-colors file:duration-200"
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
                  type="submit"
                  disabled={!uploadFile || uploadLoading}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {uploadLoading ? (
                    <>
                      <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Excel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case 'data-list':
        return (
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="min-w-48">
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={exportData}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Eye className="h-6 w-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
                  <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                    {filteredData.length} of {data.length} entries
                  </span>
                </div>
              </div>
              
              {filteredData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {fields.slice(0, 8).map((field) => (
                          <th key={field.key} scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {field.label}
                          </th>
                        ))}
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((row, index) => (
                        <tr key={row.srNo} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          {fields.slice(0, 8).map((field) => (
                            <td key={field.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {field.key === 'employeeName' ? (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="font-medium">{row[field.key] || '-'}</span>
                                </div>
                              ) : field.key === 'status' ? (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  row.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {row[field.key] || '-'}
                                </span>
                              ) : (
                                row[field.key] || '-'
                              )}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDelete(row.srNo)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-900 mb-2">No records found</p>
                  <p className="text-gray-500 mb-6">
                    {data.length === 0 ? "Start by adding your first attendance record" : "Try adjusting your search or filters"}
                  </p>
                  <div className="space-x-4">
                    <button
                      onClick={() => setActiveTab('add-data')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance Management System</h1>
          <p className="text-lg text-gray-600">Track and manage employee attendance records efficiently</p>
        </div>

        {/* Tab Navigation */}
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

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;