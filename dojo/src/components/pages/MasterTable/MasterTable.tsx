// import { useState, useEffect } from "react";

// import { ErrorMessage } from "../../molecules/ErrorMessage/ErrorMessage";
// import { Button } from "../../atoms/Buttons/Button";
// import axios from "axios";
// import type { Employee } from "../../constants/types";
// import { fetchEmployees } from "../../hooks/ServiceApis";
// import { API_ENDPOINTS } from "../../constants/api";

// interface Operator {
//     id: number;
//     name: string;
//     card_no: string;
// }

// // Helper function to get department name
// const getDepartmentName = (employee: Employee): string => {
//     return employee.department_name || "N/A";
// };

// // Atomic Components
// const PageHeader = ({ title }: { title: string }) => (
//     <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-center">
//         {title}
//     </h1>
// );

// const LoadingState = () => (
//     <div className="p-4 text-center">Loading employee data...</div>
// );

// const FilterSelect = ({ 
//     value, 
//     onChange, 
//     options, 
//     className = "" 
// }: {
//     value: string;
//     onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
//     options: string[];
//     className?: string;
// }) => (
//     <select
//         value={value}
//         onChange={onChange}
//         className={`p-2 rounded-lg border border-gray-300 bg-white text-xs md:text-sm w-full md:w-48 outline-none shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 ${className}`}
//     >
//         {options.map((option) => (
//             <option key={option} value={option}>{option}</option>
//         ))}
//     </select>
// );

// const SearchInput = ({ 
//     value, 
//     onChange, 
//     placeholder 
// }: {
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     placeholder: string;
// }) => (
//     <input
//         type="text"
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full p-2 rounded-lg border border-gray-300 bg-white text-xs md:text-sm outline-none shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
//     />
// );

// const FilterControls = ({
//     selectedDepartment,
//     selectedSex,
//     searchQuery,
//     departmentOptions,
//     sexOptions,
//     onDepartmentChange,
//     onSexChange,
//     onSearchChange,
// }: {
//     selectedDepartment: string;
//     selectedSex: string;
//     searchQuery: string;
//     departmentOptions: string[];
//     sexOptions: string[];
//     onDepartmentChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
//     onSexChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
//     onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }) => (
//     <div className="flex flex-col md:flex-row justify-between gap-2 mb-3 md:mb-4">
//         <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
//             <FilterSelect
//                 value={selectedDepartment}
//                 onChange={onDepartmentChange}
//                 options={departmentOptions}
//             />
//             <FilterSelect
//                 value={selectedSex}
//                 onChange={onSexChange}
//                 options={sexOptions}
//             />
//         </div>
//         <div className="w-full md:w-64">
//             <SearchInput
//                 value={searchQuery}
//                 onChange={onSearchChange}
//                 placeholder="Search name, emp ID, email, phone"
//             />
//         </div>
//     </div>
// );

// const TableHeader = ({ columns }: { columns: Array<{ key: string; header: string }> }) => (
//     <thead>
//         <tr className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
//             {columns.map(col => (
//                 <th key={col.key} className="p-2 text-center text-xs md:text-sm font-bold border-r border-gray-600 last:border-r-0">
//                     {col.header}
//                 </th>
//             ))}
//         </tr>
//     </thead>
// );

// const MobileTableRow = ({ 
//     employee, 
//     columns 
// }: { 
//     employee: Employee; 
//     columns: Array<{ key: string; header: string }> 
// }) => (
//     <tr
//         key={`employee-mobile-${employee.emp_id}`}
//         className="hover:bg-gray-50 even:bg-amber-50 border-b border-gray-200 last:border-b-0"
//     >
//         {columns.map(col => (
//             <td key={`${employee.emp_id}-${col.key}`} className="border-r border-gray-200 p-2 text-center text-xs last:border-r-0">
//                 {col.key === 'emp_id' && employee.emp_id}
//                 {col.key === 'name' && `${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
//                 {col.key === 'department' && getDepartmentName(employee)}
//                 {col.key === 'sex' && (employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : employee.sex || 'N/A')}
//                 {col.key === 'birth_date' && (employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : 'N/A')}
//             </td>
//         ))}
//     </tr>
// );

// const DesktopTableRow = ({ employee }: { employee: Employee }) => (
//     <tr
//         key={`employee-${employee.emp_id}`}
//         className="hover:bg-gray-50 even:bg-amber-50 border-b border-gray-200 last:border-b-0"
//     >
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm">{employee.emp_id}</td>
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm">
//             {`${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
//         </td>
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm">
//             {getDepartmentName(employee)}
//         </td>
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm">
//             {new Date(employee.date_of_joining).toLocaleDateString()}
//         </td>
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm">
//             {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : 'N/A'}
//         </td>
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm">
//             {employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : employee.sex || 'N/A'}
//         </td>
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm">{employee.email}</td>
//         <td className="border-r border-gray-200 p-2 text-center text-xs md:text-sm last:border-r-0">{employee.phone}</td>
//     </tr>
// );

// const DesktopTableColumns = [
//     { key: 'emp_id', header: 'Employee ID' },
//     { key: 'name', header: 'Name' },
//     { key: 'department', header: 'Department' },
//     { key: 'date_of_joining', header: 'Join Date' },
//     { key: 'birth_date', header: 'Birth Date' },
//     { key: 'sex', header: 'Gender' },
//     { key: 'email', header: 'Email' },
//     { key: 'phone', header: 'Phone' }
// ];

// const EmployeeTable = ({ 
//     employees, 
//     isMobile 
// }: { 
//     employees: Employee[]; 
//     isMobile: boolean; 
// }) => {
//     const mobileColumns = [
//         { key: 'emp_id', header: 'Emp ID' },
//         { key: 'name', header: 'Name' },
//         { key: 'department', header: 'Dept' },
//         { key: 'birth_date', header: 'DOB' },
//         { key: 'sex', header: 'Gender' }
//     ];

//     return (
//         <div className="mt-2 md:mt-4 w-full rounded-lg overflow-hidden shadow-sm md:shadow-lg">
//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse font-sans">
//                     <TableHeader columns={isMobile ? mobileColumns : DesktopTableColumns} />
//                     <tbody>
//                         {employees.map((emp) => (
//                             isMobile ? (
//                                 <MobileTableRow key={`mobile-${emp.emp_id}`} employee={emp} columns={mobileColumns} />
//                             ) : (
//                                 <DesktopTableRow key={`desktop-${emp.emp_id}`} employee={emp} />
//                             )
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // Main Component
// const MasterTable = () => {
//     const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
//     const [selectedSex, setSelectedSex] = useState("All Genders");
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [isMobile, setIsMobile] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");

//     // Check screen size on mount and resize
//     useEffect(() => {
//         const checkScreenSize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };
        
//         checkScreenSize();
//         window.addEventListener('resize', checkScreenSize);
        
//         return () => window.removeEventListener('resize', checkScreenSize);
//     }, []);

//     // Fetch employees data from API
//     useEffect(() => {
//         const loadEmployees = async () => {
//             try {
//                 const employeeData = await fetchEmployees();
//                 console.log('Fetched employees:', employeeData); // Debug log
//                 setEmployees(employeeData);
//                 setLoading(false);
//             } catch (err: any) {
//                 console.error('Error loading employees:', err);
//                 setError(err.message || "Failed to load employee data");
//                 setLoading(false);
//             }
//         };

//         loadEmployees();
//     }, []);

//     const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedDepartment(event.target.value);
//     };

//     const handleSexChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedSex(event.target.value);
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//     };

//     // Get department options from the actual employee data
//     const departmentOptions = ["All Departments", ...Array.from(new Set(
//         Array.isArray(employees) ? employees
//             .map((emp) => getDepartmentName(emp))
//             .filter((dept): dept is string => dept !== null && dept.trim() !== '' && dept !== 'N/A')
//         : []
//     ))];

//     // Gender options
//     const sexOptions = ["All Genders", "Male", "Female", "Other"];

//     // Filter employees based on selected criteria
//     const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => {
//         const departmentName = getDepartmentName(emp);
//         const departmentMatch = (selectedDepartment === "All Departments" || departmentName === selectedDepartment);
        
//         let sexMatch = true;
//         if (selectedSex !== "All Genders") {
//             if (selectedSex === "Male") sexMatch = emp.sex === 'M';
//             else if (selectedSex === "Female") sexMatch = emp.sex === 'F';
//             else if (selectedSex === "Other") sexMatch = emp.sex === 'O' || !emp.sex;
//         }
        
//         if (!departmentMatch || !sexMatch) return false;

//         const q = searchQuery.trim().toLowerCase();
//         if (!q) return true;

//         const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
//         const haystack = [
//             fullName,
//             emp.emp_id,
//             emp.email,
//             emp.phone,
//             departmentName || ''
//         ].filter(Boolean).join(" ").toLowerCase();

//         return haystack.includes(q);
//     }) : [];

//     const handleRefresh = () => {
//         setLoading(true);
//         setError("");
//         const fetchEmployees = async () => {
//             try {
//                 const apiUrl = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EMPLOYEES}`;
//                 console.log('Making API call to:', apiUrl); // Debug log
//                 console.log('API_ENDPOINTS:', API_ENDPOINTS); // Debug log
                
//                 const response = await axios.get(apiUrl);
//                 console.log('API Response Status:', response.status); // Debug log
//                 console.log('API Response Headers:', response.headers); // Debug log
//                 console.log('API Response:', response.data); // Debug log
                
//                 // Handle different response structures
//                 let employeeData = response.data;
//                 if (employeeData && typeof employeeData === 'object') {
//                     // If response is wrapped in an object, extract the array
//                     if (Array.isArray(employeeData.data)) {
//                         employeeData = employeeData.data;
//                     } else if (Array.isArray(employeeData.employees)) {
//                         employeeData = employeeData.employees;
//                     } else if (!Array.isArray(employeeData)) {
//                         // If it's a single object, wrap it in an array
//                         employeeData = [employeeData];
//                     }
//                 }
                
//                 // Ensure we have an array
//                 if (!Array.isArray(employeeData)) {
//                     console.error('Expected array but got:', typeof employeeData, employeeData);
//                     setError("Invalid data format received from server");
//                     setLoading(false);
//                     return;
//                 }
                
//                 setEmployees(employeeData);
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error fetching employees:', err);
//                 setError("Failed to load employee data");
//                 setLoading(false);
//             }
//         };
//         fetchEmployees();
//     };

//     if (loading) return <LoadingState />;
    
//     if (error) return (
//         <div className="p-4">
//             <ErrorMessage message={error} />
//             <div className="text-center">
//                 <Button 
//                     onClick={handleRefresh}
//                     variant="primary"
//                 >
//                     Retry
//                 </Button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="p-2 md:p-4">
//             <PageHeader title="Employee Master" />
            
//             <FilterControls
//                 selectedDepartment={selectedDepartment}
//                 selectedSex={selectedSex}
//                 searchQuery={searchQuery}
//                 departmentOptions={departmentOptions}
//                 sexOptions={sexOptions}
//                 onDepartmentChange={handleDepartmentChange}
//                 onSexChange={handleSexChange}
//                 onSearchChange={handleSearchChange}
//             />

//             <EmployeeTable 
//                 employees={filteredEmployees} 
//                 isMobile={isMobile} 
//             />

//             {filteredEmployees.length === 0 && (
//                 <div className="text-center mt-8 p-4">
//                     <p className="text-gray-500">No employees found matching your criteria.</p>
//                     <Button 
//                         onClick={() => {
//                             setSelectedDepartment("All Departments");
//                             setSelectedSex("All Genders");
//                             setSearchQuery("");
//                         }}
//                         variant="secondary"
//                         className="mt-2"
//                     >
//                         Clear Filters
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MasterTable;



import { useState, useEffect } from "react";

import { ErrorMessage } from "../../molecules/ErrorMessage/ErrorMessage";
import { Button } from "../../atoms/Buttons/Button";
import axios from "axios";
import type { Employee } from "../../constants/types";
import { fetchEmployees } from "../../hooks/ServiceApis";
import { API_ENDPOINTS } from "../../constants/api";

interface Operator {
    id: number;
    name: string;
    card_no: string;
}

// Helper function to get department name
const getDepartmentName = (employee: Employee): string => {
    return employee.department_name || "N/A";
};

// Atomic Components
const PageHeader = ({ title }: { title: string }) => (
    <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        {title}
    </h1>
);

const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
            </div>
            <p className="text-lg text-gray-600">Loading employee data...</p>
        </div>
    </div>
);

const FilterSelect = ({ 
    value, 
    onChange, 
    options, 
    className = "" 
}: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    className?: string;
}) => (
    <select
        value={value}
        onChange={onChange}
        className={`px-4 py-3 rounded-xl border-2 border-purple-200 bg-white text-sm md:text-base w-full md:w-56 outline-none shadow-lg hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${className}`}
    >
        {options.map((option) => (
            <option key={option} value={option}>{option}</option>
        ))}
    </select>
);

const SearchInput = ({ 
    value, 
    onChange, 
    placeholder 
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}) => (
    <div className="relative">
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-blue-200 bg-white text-sm md:text-base outline-none shadow-lg hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
        />
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </div>
);

const FilterControls = ({
    selectedDepartment,
    selectedSex,
    searchQuery,
    departmentOptions,
    sexOptions,
    onDepartmentChange,
    onSexChange,
    onSearchChange,
}: {
    selectedDepartment: string;
    selectedSex: string;
    searchQuery: string;
    departmentOptions: string[];
    sexOptions: string[];
    onDepartmentChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSexChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <FilterSelect
                    value={selectedDepartment}
                    onChange={onDepartmentChange}
                    options={departmentOptions}
                />
                <FilterSelect
                    value={selectedSex}
                    onChange={onSexChange}
                    options={sexOptions}
                />
            </div>
            <div className="w-full md:w-80">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search name, emp ID, email, phone"
                />
            </div>
        </div>
    </div>
);

const TableHeader = ({ columns }: { columns: Array<{ key: string; header: string }> }) => (
    <thead>
        <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            {columns.map(col => (
                <th key={col.key} className="p-4 text-center text-sm md:text-base font-semibold border-r border-purple-500 last:border-r-0">
                    {col.header}
                </th>
            ))}
        </tr>
    </thead>
);

const MobileTableRow = ({ 
    employee, 
    columns 
}: { 
    employee: Employee; 
    columns: Array<{ key: string; header: string }> 
}) => (
    <tr
        key={`employee-mobile-${employee.emp_id}`}
        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 even:bg-gradient-to-r even:from-purple-50/50 even:to-blue-50/50 border-b border-purple-100 last:border-b-0 transition-all duration-300"
    >
        {columns.map(col => (
            <td key={`${employee.emp_id}-${col.key}`} className="border-r border-purple-100 p-3 text-center text-sm last:border-r-0">
                {col.key === 'emp_id' && employee.emp_id}
                {col.key === 'name' && `${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
                {col.key === 'department' && getDepartmentName(employee)}
                {col.key === 'sex' && (employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : employee.sex || 'N/A')}
                {col.key === 'birth_date' && (employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : 'N/A')}
            </td>
        ))}
    </tr>
);

const DesktopTableRow = ({ employee }: { employee: Employee }) => (
    <tr
        key={`employee-${employee.emp_id}`}
        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 even:bg-gradient-to-r even:from-purple-50/50 even:to-blue-50/50 border-b border-purple-100 last:border-b-0 transition-all duration-300"
    >
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base font-medium text-purple-700">{employee.emp_id}</td>
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base">
            {`${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
        </td>
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base">
            <span className="text-purple-700 text-sm">
                {getDepartmentName(employee)}
            </span>
        </td>
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base">
            {new Date(employee.date_of_joining).toLocaleDateString()}
        </td>
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base">
            {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : 'N/A'}
        </td>
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base">
            <span className={` text-sm ${
                employee.sex === 'M' ? 'text-blue-700' : 
                employee.sex === 'F' ? 'text-purple-700' : 
                'bg-gray-100 text-gray-700'
            }`}>
                {employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : employee.sex || 'N/A'}
            </span>
        </td>
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base text-blue-600">{employee.email}</td>
        <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base last:border-r-0">{employee.phone}</td>
    </tr>
);

const DesktopTableColumns = [
    { key: 'emp_id', header: 'Employee ID' },
    { key: 'name', header: 'Name' },
    { key: 'department', header: 'Department' },
    { key: 'date_of_joining', header: 'Join Date' },
    { key: 'birth_date', header: 'Birth Date' },
    { key: 'sex', header: 'Gender' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' }
];

const EmployeeTable = ({ 
    employees, 
    isMobile 
}: { 
    employees: Employee[]; 
    isMobile: boolean; 
}) => {
    const mobileColumns = [
        { key: 'emp_id', header: 'Emp ID' },
        { key: 'name', header: 'Name' },
        { key: 'department', header: 'Dept' },
        { key: 'birth_date', header: 'DOB' },
        { key: 'sex', header: 'Gender' }
    ];

    return (
        <div className="mt-4 md:mt-6 w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse font-sans">
                    <TableHeader columns={isMobile ? mobileColumns : DesktopTableColumns} />
                    <tbody>
                        {employees.map((emp) => (
                            isMobile ? (
                                <MobileTableRow key={`mobile-${emp.emp_id}`} employee={emp} columns={mobileColumns} />
                            ) : (
                                <DesktopTableRow key={`desktop-${emp.emp_id}`} employee={emp} />
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Component
const MasterTable = () => {
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [selectedSex, setSelectedSex] = useState("All Genders");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Fetch employees data from API
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employeeData = await fetchEmployees();
                console.log('Fetched employees:', employeeData); // Debug log
                setEmployees(employeeData);
                setLoading(false);
            } catch (err: any) {
                console.error('Error loading employees:', err);
                setError(err.message || "Failed to load employee data");
                setLoading(false);
            }
        };

        loadEmployees();
    }, []);

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartment(event.target.value);
    };

    const handleSexChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSex(event.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Get department options from the actual employee data
    const departmentOptions = ["All Departments", ...Array.from(new Set(
        Array.isArray(employees) ? employees
            .map((emp) => getDepartmentName(emp))
            .filter((dept): dept is string => dept !== null && dept.trim() !== '' && dept !== 'N/A')
        : []
    ))];

    // Gender options
    const sexOptions = ["All Genders", "Male", "Female", "Other"];

    // Filter employees based on selected criteria
    const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => {
        const departmentName = getDepartmentName(emp);
        const departmentMatch = (selectedDepartment === "All Departments" || departmentName === selectedDepartment);
        
        let sexMatch = true;
        if (selectedSex !== "All Genders") {
            if (selectedSex === "Male") sexMatch = emp.sex === 'M';
            else if (selectedSex === "Female") sexMatch = emp.sex === 'F';
            else if (selectedSex === "Other") sexMatch = emp.sex === 'O' || !emp.sex;
        }
        
        if (!departmentMatch || !sexMatch) return false;

        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;

        const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
        const haystack = [
            fullName,
            emp.emp_id,
            emp.email,
            emp.phone,
            departmentName || ''
        ].filter(Boolean).join(" ").toLowerCase();

        return haystack.includes(q);    }) : [];

    const handleRefresh = () => {
        setLoading(true);
        setError("");
        const fetchEmployees = async () => {
            try {
                const apiUrl = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EMPLOYEES}`;
                console.log('Making API call to:', apiUrl); // Debug log
                console.log('API_ENDPOINTS:', API_ENDPOINTS); // Debug log
                
                const response = await axios.get(apiUrl);
                console.log('API Response Status:', response.status); // Debug log
                console.log('API Response Headers:', response.headers); // Debug log
                console.log('API Response:', response.data); // Debug log
                
                // Handle different response structures
                let employeeData = response.data;
                if (employeeData && typeof employeeData === 'object') {
                    // If response is wrapped in an object, extract the array
                    if (Array.isArray(employeeData.data)) {
                        employeeData = employeeData.data;
                    } else if (Array.isArray(employeeData.employees)) {
                        employeeData = employeeData.employees;
                    } else if (!Array.isArray(employeeData)) {
                        // If it's a single object, wrap it in an array
                        employeeData = [employeeData];
                    }
                }
                
                // Ensure we have an array
                if (!Array.isArray(employeeData)) {
                    console.error('Expected array but got:', typeof employeeData, employeeData);
                    setError("Invalid data format received from server");
                    setLoading(false);
                    return;
                }
                
                setEmployees(employeeData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError("Failed to load employee data");
                setLoading(false);
            }
        };
        fetchEmployees();
    };

    if (loading) return <LoadingState />;
    
    if (error) return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <ErrorMessage message={error} />
                    <Button 
                        onClick={handleRefresh}
                        variant="primary"
                        className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="w-full px-4 md:px-8 py-4 md:py-8">
                <PageHeader title="Employee Master" />
                
                <FilterControls
                    selectedDepartment={selectedDepartment}
                    selectedSex={selectedSex}
                    searchQuery={searchQuery}
                    departmentOptions={departmentOptions}
                    sexOptions={sexOptions}
                    onDepartmentChange={handleDepartmentChange}
                    onSexChange={handleSexChange}
                    onSearchChange={handleSearchChange}
                />

                <div className="mb-4 flex items-center justify-between">
                    <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {filteredEmployees.length} {filteredEmployees.length === 1 ? 'Employee' : 'Employees'} Found
                    </p>
                    <Button
                        onClick={handleRefresh}
                        variant="secondary"
                        className="bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-200 px-6 py-2 rounded-xl font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:border-purple-400"
                    >
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </Button>
                </div>

                <EmployeeTable 
                    employees={filteredEmployees} 
                    isMobile={isMobile} 
                />

                {filteredEmployees.length === 0 && (
                    <div className="text-center mt-12 p-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
                            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-600 mb-6">No employees found matching your criteria.</p>
                        <Button 
                            onClick={() => {
                                setSelectedDepartment("All Departments");
                                setSelectedSex("All Genders");
                                setSearchQuery("");
                            }}
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
                        >
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MasterTable;


