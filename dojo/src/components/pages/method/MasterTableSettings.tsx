import React, { useState, useEffect } from "react";
import { Upload, Plus, Trash2, FileSpreadsheet, Users, Mail, Phone, Calendar, User, Building2 } from "lucide-react";

interface EmployeeData {
  emp_id: string;
  first_name: string;
  last_name: string;
  department: number | null;
  department_name?: string;
  date_of_joining: string;
  birth_date: string;
  sex: string;
  email: string;
  phone: string;
}

interface Department {
  department_id: number;
  department_name: string;
}

const MasterTableSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeData>({
    emp_id: '',
    first_name: '',
    last_name: '',
    department: null,
    date_of_joining: '',
    birth_date: '',
    sex: '',
    email: '',
    phone: '',
  });

  const API_BASE_URL = 'http://127.0.0.1:8000'; // Adjust to match your API URL

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Users },
    { id: 'add-data', name: 'Add Employee', icon: Plus },
    { id: 'upload', name: 'Upload Excel', icon: Upload },
    { id: 'employee-list', name: 'Employee Records', icon: FileSpreadsheet },
  ];

  const formFields = [
    { id: 'emp_id', label: 'Employee ID', type: 'text', required: true, icon: User },
    { id: 'first_name', label: 'First Name', type: 'text', required: true, icon: User },
    { id: 'last_name', label: 'Last Name', type: 'text', required: false, icon: User },
    { id: 'department', label: 'Department', type: 'select', required: true, icon: Building2 },
    { id: 'date_of_joining', label: 'Join Date', type: 'date', required: true, icon: Calendar },
    { id: 'birth_date', label: 'Birth Date', type: 'date', required: false, icon: Calendar },
    { id: 'sex', label: 'Gender', type: 'select', required: false, icon: User, options: [
      { value: 'M', label: 'Male' },
      { value: 'F', label: 'Female' },
      { value: 'O', label: 'Other' }
    ]},
    { id: 'email', label: 'Email Address', type: 'email', required: true, icon: Mail },
    { id: 'phone', label: 'Phone Number', type: 'tel', required: false, icon: Phone },
  ];

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/mastertable/`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployeeData(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to load employees. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/`); // Adjust endpoint as needed
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Set fallback departments if API fails
      setDepartments([
        { department_id: 1, department_name: 'Engineering' },
        { department_id: 2, department_name: 'Human Resources' },
        { department_id: 3, department_name: 'Marketing' },
        { department_id: 4, department_name: 'Sales' },
        { department_id: 5, department_name: 'Finance' },
      ]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = formFields.filter(field => field.required);
    for (const field of requiredFields) {
      if (!formData[field.id as keyof EmployeeData]) {
        alert(`Please fill in ${field.label}`);
        return;
      }
    }
    
    setLoading(true);
    try {
      // Prepare form data for API (using FormData instead of JSON)
      const submitFormData = new FormData();
      submitFormData.append('emp_id', formData.emp_id);
      submitFormData.append('first_name', formData.first_name);
      submitFormData.append('last_name', formData.last_name || '');
      if (formData.department) {
        submitFormData.append('department', formData.department.toString());
      }
      submitFormData.append('date_of_joining', formData.date_of_joining);
      if (formData.birth_date) {
        submitFormData.append('birth_date', formData.birth_date);
      }
      if (formData.sex) {
        submitFormData.append('sex', formData.sex);
      }
      submitFormData.append('email', formData.email);
      if (formData.phone) {
        submitFormData.append('phone', formData.phone);
      }

      const response = await fetch(`${API_BASE_URL}/mastertable/`, {
        method: 'POST',
        body: submitFormData, // No Content-Type header needed for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Failed to add employee:\n';
        
        if (errorData.emp_id) {
          errorMessage += `Employee ID: ${errorData.emp_id.join(', ')}\n`;
        }
        if (errorData.email) {
          errorMessage += `Email: ${errorData.email.join(', ')}\n`;
        }
        if (errorData.phone) {
          errorMessage += `Phone: ${errorData.phone.join(', ')}\n`;
        }
        if (errorData.detail) {
          errorMessage += `${errorData.detail}\n`;
        }
        
        throw new Error(errorMessage);
      }

      const newEmployee = await response.json();
      
      // Reset form
      setFormData({
        emp_id: '',
        first_name: '',
        last_name: '',
        department: null,
        date_of_joining: '',
        birth_date: '',
        sex: '',
        email: '',
        phone: '',
      });
      
      // Refresh employee list
      await fetchEmployees();
      
      alert('Employee added successfully!');
      setActiveTab('employee-list');
    } catch (error: any) {
      alert(error.message || 'Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (empId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/mastertable/${empId}/`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }

        // Refresh employee list
        await fetchEmployees();
        alert('Employee deleted successfully!');
      } catch (error) {
        alert('Failed to delete employee. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExcelUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploadLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('file', uploadFile);

      const response = await fetch(`${API_BASE_URL}/mastertable/upload_excel/`, {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful upload with detailed feedback
        let successMessage = `✅ Upload Completed Successfully!\n\n`;
        successMessage += `📊 Summary:\n`;
        successMessage += `• Employees Created: ${data.created_count || 0}\n`;
        successMessage += `• Employees Updated: ${data.updated_count || 0}\n`;
        
        if (data.error_count && data.error_count > 0) {
          successMessage += `• Errors Encountered: ${data.error_count}\n\n`;
          
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            successMessage += `❌ Error Details:\n`;
            data.errors.forEach((error: any, index: number) => {
              if (typeof error === 'string') {
                successMessage += `${index + 1}. ${error}\n`;
              } else if (error.error) {
                successMessage += `${index + 1}. Row ${error.row}: ${error.error}\n`;
              } else {
                successMessage += `${index + 1}. ${JSON.stringify(error)}\n`;
              }
            });
          }
        } else {
          successMessage += `\n🎉 All employees were processed without errors!`;
        }

        alert(successMessage);
        
        // Refresh employee list after upload
        await fetchEmployees();
      } else {
        // Handle upload failure with detailed error message
        let errorMessage = `❌ Upload Failed!\n\n`;
        
        if (data.error) {
          errorMessage += `Error: ${data.error}\n`;
        }
        
        alert(errorMessage);
      }
    } catch (error: any) {
      // Handle network or other errors
      let errorMessage = `❌ Upload Failed - Network Error!\n\n`;
      
      if (error.message) {
        errorMessage += `Error Message: ${error.message}\n`;
      }
      
      alert(errorMessage);
    } finally {
      setUploadLoading(false);
      setUploadFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mastertable/download_template/`);
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_template.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      alert('✅ Template downloaded successfully!');
      
    } catch (error: any) {
      alert('❌ Template Download Failed!');
    }
  };

  const handleInputChange = (field: keyof EmployeeData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'department' ? (value ? parseInt(value) : null) : value 
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDepartmentName = (departmentId: number | null) => {
    if (!departmentId) return 'N/A';
    const dept = departments.find(d => d.department_id === departmentId);
    return dept ? dept.department_name : 'Unknown';
  };

  const getDepartmentStats = () => {
    const departmentCounts = employeeData.reduce((acc, emp) => {
      const deptName = emp.department_name || getDepartmentName(emp.department);
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCounts).map(([dept, count]) => ({ department: dept, count }));
  };

  const getOverviewStats = () => {
    const totalEmployees = employeeData.length;
    const departmentSet = new Set(employeeData.map(emp => emp.department_name || getDepartmentName(emp.department)));
    const departmentCount = departmentSet.size;
    const maleCount = employeeData.filter(emp => emp.sex === 'M').length;
    const femaleCount = employeeData.filter(emp => emp.sex === 'F').length;

    return [
      { title: 'Total Employees', value: totalEmployees, icon: Users, color: 'bg-blue-500' },
      { title: 'Departments', value: departmentCount, icon: Building2, color: 'bg-green-500' },
      { title: 'Male Employees', value: maleCount, icon: User, color: 'bg-purple-500' },
      { title: 'Female Employees', value: femaleCount, icon: User, color: 'bg-pink-500' },
    ];
  };

  const getGenderDisplay = (sex: string) => {
    switch(sex) {
      case 'M': return 'Male';
      case 'F': return 'Female';
      case 'O': return 'Other';
      default: return 'N/A';
    }
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Department Distribution</h3>
                <div className="space-y-3">
                  {getDepartmentStats().map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">{dept.department}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                        {dept.count} employees
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Additions</h3>
                <div className="space-y-4">
                  {employeeData.slice(-3).map((employee, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{`${employee.first_name} ${employee.last_name}`.trim()}</p>
                        <p className="text-sm text-gray-600">{employee.department_name || getDepartmentName(employee.department)} • {employee.emp_id}</p>
                      </div>
                    </div>
                  ))}
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
              <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields.map((field) => {
                  const IconComponent = field.icon;
                  return (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          id={field.id}
                          value={formData[field.id as keyof EmployeeData] as string || ''}
                          onChange={(e) => handleInputChange(field.id as keyof EmployeeData, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select {field.label}</option>
                          {field.id === 'department' 
                            ? departments.map((dept) => (
                                <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
                              ))
                            : field.options?.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                        </select>
                      ) : (
                        <input
                          id={field.id}
                          type={field.type}
                          value={formData[field.id as keyof EmployeeData] as string || ''}
                          onChange={(e) => handleInputChange(field.id as keyof EmployeeData, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="inline h-5 w-5 mr-2" />
                      Add Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Upload className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Upload Employee Excel Data</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
                <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <label htmlFor="excel-upload" className="block text-lg font-medium text-gray-700">
                    Choose Excel File
                  </label>
                  <p className="text-sm text-gray-500">Upload .xlsx or .xls files with employee data</p>
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

              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleExcelUpload}
                  disabled={!uploadFile || uploadLoading}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {uploadLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Excel
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Download Template
                </button>
              </div>

              {uploadFile && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">{uploadFile.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'employee-list':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Employee Records</h2>
                <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                  {employeeData.length} employees
                </span>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading employees...</p>
              </div>
            ) : employeeData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeeData.map((employee, index) => (
                      <tr key={employee.emp_id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{employee.emp_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{`${employee.first_name} ${employee.last_name}`.trim()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department_name || getDepartmentName(employee.department)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(employee.date_of_joining)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getGenderDisplay(employee.sex)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.email}</div>
                          <div className="text-sm text-gray-500">{employee.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(employee.emp_id)}
                            disabled={loading}
                            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-900 mb-2">No employees found</p>
                <p className="text-gray-500 mb-6">Start by adding your first employee or uploading an Excel file</p>
                <div className="space-x-4">
                  <button
                    onClick={() => setActiveTab('add-data')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Master Table Settings</h1>
          <p className="text-lg text-gray-600">Manage employee data and records efficiently</p>
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

export default MasterTableSettings;