import React, { useEffect, useState } from 'react';
import { Users, Calendar, FileText, RefreshCw, ChevronDown, Building, GitBranch, Layers, Cpu } from 'lucide-react';
import type { SkillMatrix, Operation, Section, MonthlySkill, OperatorLevel, Month } from '../api/types';
import LevelBlock from './shapes/Levelblocks';
import PieChart from './shapes/piechart';
import axios from 'axios';

// Add interface for skill matrix API data
interface SkillMatrixApiData {
    station_id: number;
    id: number;
    employee_name: string;
    emp_id: string;
    doj: string;
    updated_at: string;
    employee: string;
    level: number;
    skill: number;
}

// Add interfaces for the new hierarchy structure
interface HierarchyStation {
    station_id: number;
    station_name: string;
}

interface HierarchySubline {
    subline_id: number;
    subline_name: string;
    stations: HierarchyStation[];
}

interface HierarchyLine {
    line_id: number;
    line_name: string;
    sublines: HierarchySubline[];
    stations: HierarchyStation[];
}

interface HierarchyDepartment {
    department_id: number;
    department_name: string;
    lines: HierarchyLine[];
    sublines: HierarchySubline[];
    stations: HierarchyStation[];
}

interface SkillMatrixTableProps {
    skillMatrices: SkillMatrix[];
    selectedMatrix: SkillMatrix | null;
    employees: any[];
    operations: Operation[];
    sections: Section[];
    monthlySkills: MonthlySkill[];
    operatorLevels: OperatorLevel[];
    months: Month[];
    isLoading: boolean;
    error: string | null;
    onMatrixChange: (matrix: SkillMatrix) => void;
    onRefresh: () => Promise<void>;
}

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({
    skillMatrices,
    selectedMatrix,
    operations,
    monthlySkills,
    operatorLevels,
    months,
    isLoading,
    error,
    onMatrixChange,
    onRefresh,
}) => {
    // ---- Updated cascading dropdown state using new hierarchy API ----
    const [hierarchyData, setHierarchyData] = useState<HierarchyDepartment[]>([]);
    const [availableLines, setAvailableLines] = useState<HierarchyLine[]>([]);
    const [availableSublines, setAvailableSublines] = useState<HierarchySubline[]>([]);
    const [availableStations, setAvailableStations] = useState<HierarchyStation[]>([]);

    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
    const [selectedSublineId, setSelectedSublineId] = useState<number | null>(null);
    const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

    // State for dynamic colors and shape
    const [levelColors, setLevelColors] = useState<{1: string; 2: string; 3: string; 4: string}>({
        1: '#ef4444',
        2: '#f59e0b', 
        3: '#10b981',
        4: '#3b82f6'
    });
    const [displayShape, setDisplayShape] = useState<'piechart' | 'levelblock'>('piechart');

    // State for skill matrix API data
    const [skillMatrixData, setSkillMatrixData] = useState<SkillMatrixApiData[]>([]);
    const [skillMatrixLoading, setSkillMatrixLoading] = useState(false);
    const [hierarchyError, setHierarchyError] = useState<string | null>(null);
    const [skillMatrixError, setSkillMatrixError] = useState<string | null>(null);

    // Load hierarchy from /api/hierarchy/all-departments/
    const API_BASE_URL = 'http://127.0.0.1:8000';

    // Load hierarchy data from the new API endpoint
    const loadHierarchyData = async () => {
        try {
            setHierarchyError(null);
            const response = await axios.get(`${API_BASE_URL}/hierarchy/all-departments/`);
            console.log('Hierarchy API Response:', response.data);
            setHierarchyData(response.data || []);
        } catch (err) {
            console.error('Failed to load hierarchy data:', err);
            setHierarchyError('Failed to load hierarchy data. Using fallback data.');
            // Set fallback empty data to prevent UI from breaking
            setHierarchyData([]);
        }
    };

    // Load skill matrix data from the API - Updated to use station filtering
    const loadSkillMatrixData = async (stationId?: number | null) => {
        try {
            setSkillMatrixLoading(true);
            setSkillMatrixError(null);
            let url = `${API_BASE_URL}/skill-matrix/`;
            
            // If station is selected, filter by station
            if (stationId) {
                url = `${API_BASE_URL}/skill-matrix/by_station/?station_id=${stationId}`;
            }
            
            const response = await axios.get(url);
            console.log('Skill Matrix API Response:', response.data);
            setSkillMatrixData(response.data || []);
        } catch (err) {
            console.error('Failed to load skill matrix data:', err);
            setSkillMatrixError('Failed to load skill matrix data. Using fallback data.');
            setSkillMatrixData([]);
        } finally {
            setSkillMatrixLoading(false);
        }
    };

    // Load hierarchy and skill matrix data when component mounts
    useEffect(() => {
        loadHierarchyData();
        loadSkillMatrixData();
    }, []);

    // Load skill matrix data when station selection changes
    useEffect(() => {
        if (selectedStationId) {
            loadSkillMatrixData(selectedStationId);
        } else {
            // Load all data when no station is selected
            loadSkillMatrixData();
        }
    }, [selectedStationId]);

    // Load colors and display shape from backend
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Load colors
                const colorsResponse = await axios.get(`${API_BASE_URL}/levelcolours/`);
                console.log('Colors API Response:', colorsResponse.data);
                if (colorsResponse.data && Array.isArray(colorsResponse.data)) {
                    const colorsFromBackend: {1?: string; 2?: string; 3?: string; 4?: string} = {};
                    colorsResponse.data.forEach((item: any) => {
                        if (item.level_number && [1, 2, 3, 4].includes(item.level_number)) {
                            colorsFromBackend[item.level_number as 1|2|3|4] = item.colour_code;
                        }
                    });
                    
                    // Update colors, keeping defaults for missing values
                    setLevelColors(prev => ({
                        1: colorsFromBackend[1] || prev[1],
                        2: colorsFromBackend[2] || prev[2],
                        3: colorsFromBackend[3] || prev[3],
                        4: colorsFromBackend[4] || prev[4]
                    }));
                }

                // Load display shape
                const shapeResponse = await axios.get(`${API_BASE_URL}/displaysetting/`);
                if (shapeResponse.data && shapeResponse.data.display_shape) {
                    setDisplayShape(shapeResponse.data.display_shape);
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
                // Continue with default settings
            }
        };

        loadSettings();
    }, []);

    // Sync selected department from selectedMatrix
    useEffect(() => {
        if (!selectedMatrix || hierarchyData.length === 0) return;
        
        const targetDepartment = (selectedMatrix.department || '').toString().trim().toLowerCase();
        const matchingDept = hierarchyData.find((dept) =>
            dept.department_name.toLowerCase().trim() === targetDepartment
        );
        
        if (matchingDept && matchingDept.department_id !== selectedDepartmentId) {
            setSelectedDepartmentId(matchingDept.department_id);
        }
    }, [selectedMatrix, hierarchyData]);

    // When department changes, update available lines and reset downstream selections
    useEffect(() => {
        if (!selectedDepartmentId) {
            setAvailableLines([]);
            setAvailableSublines([]);
            setAvailableStations([]);
            return;
        }

        const selectedDepartment = hierarchyData.find(dept => dept.department_id === selectedDepartmentId);
        if (selectedDepartment) {
            setAvailableLines(selectedDepartment.lines || []);
            // Reset downstream selections
            setSelectedLineId(null);
            setSelectedSublineId(null);
            setSelectedStationId(null);
            setAvailableSublines([]);
            setAvailableStations([]);
        }
    }, [selectedDepartmentId, hierarchyData]);

    // When line changes, update available sublines and stations
    useEffect(() => {
        if (!selectedLineId) {
            setAvailableSublines([]);
            setAvailableStations([]);
            return;
        }

        const selectedLine = availableLines.find(line => line.line_id === selectedLineId);
        if (selectedLine) {
            setAvailableSublines(selectedLine.sublines || []);
            // If no sublines, show line's direct stations
            if (!selectedLine.sublines || selectedLine.sublines.length === 0) {
                setAvailableStations(selectedLine.stations || []);
            } else {
                setAvailableStations([]);
            }
            setSelectedSublineId(null);
            setSelectedStationId(null);
        }
    }, [selectedLineId, availableLines]);

    // When subline changes, update available stations
    useEffect(() => {
        if (!selectedSublineId) {
            // If no subline is selected but we have a line, show line's stations
            if (selectedLineId) {
                const selectedLine = availableLines.find(line => line.line_id === selectedLineId);
                if (selectedLine && (!selectedLine.sublines || selectedLine.sublines.length === 0)) {
                    setAvailableStations(selectedLine.stations || []);
                }
            }
            return;
        }

        const selectedSubline = availableSublines.find(subline => subline.subline_id === selectedSublineId);
        if (selectedSubline) {
            setAvailableStations(selectedSubline.stations || []);
        }
        setSelectedStationId(null);
    }, [selectedSublineId, availableSublines, selectedLineId, availableLines]);

    // Helper function to get all relevant stations based on current selection
    const getRelevantStations = (): HierarchyStation[] => {
        // If a specific station is selected, show only that station
        if (selectedStationId) {
            const selectedStation = availableStations.find(st => st.station_id === selectedStationId);
            return selectedStation ? [selectedStation] : [];
        }

        if (selectedSublineId) {
            // Show stations from selected subline
            const selectedSubline = availableSublines.find(sl => sl.subline_id === selectedSublineId);
            return selectedSubline?.stations || [];
        } else if (selectedLineId) {
            // Show stations from selected line (both direct stations and from all sublines)
            const selectedLine = availableLines.find(l => l.line_id === selectedLineId);
            if (!selectedLine) return [];

            const lineStations = selectedLine.stations || [];
            const sublineStations = (selectedLine.sublines || []).flatMap(sl => sl.stations || []);
            
            // Combine and deduplicate stations
            const allStations = [...lineStations, ...sublineStations];
            const uniqueStations = allStations.filter((station, index, self) => 
                index === self.findIndex(s => s.station_id === station.station_id)
            );
            
            return uniqueStations;
        } else if (selectedDepartmentId) {
            // Show all stations from selected department
            const selectedDepartment = hierarchyData.find(d => d.department_id === selectedDepartmentId);
            if (!selectedDepartment) return [];

            const departmentStations = selectedDepartment.stations || [];
            const lineStations = (selectedDepartment.lines || []).flatMap(l => [
                ...(l.stations || []),
                ...(l.sublines || []).flatMap(sl => sl.stations || [])
            ]);
            const sublineStations = (selectedDepartment.sublines || []).flatMap(sl => sl.stations || []);

            // Combine and deduplicate all stations
            const allStations = [...departmentStations, ...lineStations, ...sublineStations];
            const uniqueStations = allStations.filter((station, index, self) => 
                index === self.findIndex(s => s.station_id === station.station_id)
            );
            
            return uniqueStations;
        }

        return [];
    };

    const stationHeaders = getRelevantStations();

    const getDepartmentEmployees = (): any[] => {
        if (!selectedMatrix) return [];

        // Get unique employees from skill matrix data
        const employeesFromSkillMatrix = skillMatrixData.reduce((acc: any[], current) => {
            if (!acc.find(emp => emp.emp_id === current.emp_id)) {
                acc.push({
                    employee_code: current.emp_id,
                    emp_id: current.emp_id,
                    full_name: current.employee_name,
                    date_of_join: current.doj,
                    department: selectedMatrix.department,
                    section: null
                });
            }
            return acc;
        }, []);

        // Also get employees who have OperatorLevel entries for this skill matrix department
        const employeesWithSkills = operatorLevels
            .filter(ol => ol.skill_matrix.department === selectedMatrix.department)
            .map(ol => ol.employee);

        // Create unique employee list from OperatorLevel data
        const employeesFromOperatorLevels = employeesWithSkills.reduce((acc: any[], current) => {
            if (!acc.find(emp => emp.employee_code === current.employee_code)) {
                acc.push({
                    employee_code: current.employee_code,
                    emp_id: current.employee_code,
                    full_name: current.full_name,
                    date_of_join: current.date_of_join,
                    department: selectedMatrix.department,
                    section: null
                });
            }
            return acc;
        }, []);

        // Merge both lists and deduplicate
        const allEmployees = [...employeesFromSkillMatrix, ...employeesFromOperatorLevels];
        const uniqueEmployees = allEmployees.reduce((acc: any[], current) => {
            if (!acc.find(emp => emp.employee_code === current.employee_code || emp.emp_id === current.emp_id)) {
                acc.push(current);
            }
            return acc;
        }, []);

        return uniqueEmployees;
    };

    const getEmployeeMonthlySkills = (employeeCode: string): MonthlySkill[] => {
        if (!selectedMatrix) return [];
        return monthlySkills.filter(ms =>
            ms.employee_code === employeeCode &&
            ms.department === selectedMatrix.department
        );
    };

    // Updated function to get skill level from API data
    const getOperatorSkillLevel = (employeeCode: string, stationId: number | string): number => {
        // First, try to find skill level from skill matrix API data
        const skillRecord = skillMatrixData.find(skill => 
            skill.emp_id === employeeCode && 
            skill.station_id === parseInt(stationId.toString())
        );
        
        if (skillRecord) {
            return skillRecord.level;
        }

        // Fallback: Check operatorLevels data
        const operatorLevel = operatorLevels.find(ol =>
            ol.employee.employee_code === employeeCode &&
            ol.operation.id.toString() === stationId.toString()
        );

        if (operatorLevel) {
            return parseInt(operatorLevel.level?.toString() || '0');
        }

        // Default to 0 if no data found
        return 0;
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB');
        } catch {
            return '-';
        }
    };

    // Dynamic Skill Display Component - Always show skill level with proper styling
    const SkillDisplay: React.FC<{ level: number }> = ({ level }) => {
        // Ensure level is between 0-4
        const safeLevel = Math.max(0, Math.min(4, level || 0));
        
        // Always show the chart with the specified display shape
        if (displayShape === 'levelblock') {
            return <LevelBlock level={safeLevel} colors={levelColors} />;
        }
        
        return <PieChart level={safeLevel} colors={levelColors} size={32} />;
    };

    // Enhanced refresh function to include skill matrix data
    const handleRefresh = async () => {
        setSkillMatrixLoading(true);
        await Promise.all([
            onRefresh(),
            loadSkillMatrixData(selectedStationId),
            loadHierarchyData()
        ]);
        setSkillMatrixLoading(false);
    };

    // Handle department selection
    const handleDepartmentChange = (departmentId: number | null) => {
        setSelectedDepartmentId(departmentId);
        if (departmentId) {
            const selectedDept = hierarchyData.find(d => d.department_id === departmentId);
            if (selectedDept) {
                // Find corresponding skill matrix
                const matrix = skillMatrices.find(m => 
                    (m.department || '').toString().trim().toLowerCase() === 
                    selectedDept.department_name.toLowerCase().trim()
                );
                if (matrix) {
                    onMatrixChange(matrix);
                }
            }
        }
    };

    // Handle station selection
    const handleStationChange = (stationId: number | null) => {
        setSelectedStationId(stationId);
        // loadSkillMatrixData will be called automatically via useEffect
    };

    const departmentEmployees = getDepartmentEmployees();

    // Show loading state only for initial load, not for data issues
    const showLoading = isLoading && skillMatrices.length === 0;
    
    // Show error banner if there are connection issues but still display the table
    const showErrorBanner = error || hierarchyError || skillMatrixError;

    if (showLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading skill matrix data...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-16">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Error Banner */}
                {showErrorBanner && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">
                                    {error || hierarchyError || skillMatrixError} Some data may be incomplete or unavailable.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="border-b-2 border-blue-200 p-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Skill Matrix & Skill Upgradation Plan
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            title="Refresh skill matrix data"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="text-md font-semibold mb-3 text-gray-700 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Legend
                    </div>
                    <div className="mb-3">
                        <div className="text-sm font-semibold mb-2 text-gray-600">Skill Level Scale:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="text-sm flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                                <SkillDisplay level={0} />
                                <span>0 = Beginner (just started within last week)</span>
                            </div>
                            <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                                <SkillDisplay level={1} />
                                <span>1 = Learner (under training)</span>
                            </div>
                            <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                                <SkillDisplay level={2} />
                                <span>2 = Practitioner (works independently per SOP)</span>
                            </div>
                            <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                                <SkillDisplay level={3} />
                                <span>3 = Expert (works independently)</span>
                            </div>
                            <div className="text-sm flex items-center space-x-1 bg-gray-100 p-2 rounded-md">
                                <SkillDisplay level={4} />
                                <span>4 = Master (can train others)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Matrix Info + Dropdown Row */}
                <div className="border-b border-gray-200 p-5 bg-white">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm">
                            <Building className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Department:</span>
                            <select
                                value={selectedDepartmentId ?? ''}
                                onChange={(e) => handleDepartmentChange(e.target.value ? Number(e.target.value) : null)}
                                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
                            >
                                <option value="">Select Department</option>
                                {hierarchyData.map((dept) => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.department_name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm">
                            <GitBranch className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Line:</span>
                            <select
                                value={selectedLineId ?? ''}
                                onChange={(e) => setSelectedLineId(e.target.value ? Number(e.target.value) : null)}
                                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
                                disabled={!selectedDepartmentId || availableLines.length === 0}
                            >
                                <option value="">Select Line</option>
                                {availableLines.map((line) => (
                                    <option key={line.line_id} value={line.line_id}>
                                        {line.line_name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm">
                            <Layers className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Sub Line:</span>
                            <select
                                value={selectedSublineId ?? ''}
                                onChange={(e) => setSelectedSublineId(e.target.value ? Number(e.target.value) : null)}
                                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
                                disabled={!selectedLineId || availableSublines.length === 0}
                            >
                                <option value="">
                                    {availableSublines.length === 0 ? 'No Sub Lines' : 'Select Sub Line'}
                                </option>
                                {availableSublines.map((subline) => (
                                    <option key={subline.subline_id} value={subline.subline_id}>
                                        {subline.subline_name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>

                        {/* Station Selection Dropdown */}
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm">
                            <Cpu className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Station:</span>
                            <select
                                value={selectedStationId ?? ''}
                                onChange={(e) => handleStationChange(e.target.value ? Number(e.target.value) : null)}
                                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
                                disabled={availableStations.length === 0}
                            >
                                <option value="">
                                    {availableStations.length === 0 ? 'No Stations Available' : 'All Stations'}
                                </option>
                                {availableStations.map((station) => (
                                    <option key={station.station_id} value={station.station_id}>
                                        {station.station_name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Current selection summary */}
                    <div className="mt-3 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                        {(() => {
                            const selectedDept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
                            const selectedLine = availableLines.find(l => l.line_id === selectedLineId);
                            const selectedSubline = availableSublines.find(sl => sl.subline_id === selectedSublineId);
                            const selectedStation = availableStations.find(st => st.station_id === selectedStationId);
                            
                            const depName = selectedDept?.department_name || '-';
                            const lineName = selectedLine?.line_name || '-';
                            const sublineName = selectedSubline?.subline_name || '-';
                            const stationName = selectedStation?.station_name || 'All Stations';
                            
                            return (
                                <div className="flex flex-wrap gap-4">
                                    <span className="flex items-center">
                                        <Cpu className="w-4 h-4 mr-1 text-blue-600" /> 
                                        <span className="font-semibold mr-1">Department:</span> {depName}
                                    </span>
                                    <span className="flex items-center">
                                        <GitBranch className="w-4 h-4 mr-1 text-blue-600" /> 
                                        <span className="font-semibold mr-1">Line:</span> {lineName}
                                    </span>
                                    <span className="flex items-center">
                                        <Layers className="w-4 h-4 mr-1 text-blue-600" /> 
                                        <span className="font-semibold mr-1">Sub Line:</span> {sublineName}
                                    </span>
                                    <span className="flex items-center">
                                        <Cpu className="w-4 h-4 mr-1 text-blue-600" /> 
                                        <span className="font-semibold mr-1">Station:</span> {stationName}
                                    </span>
                                    <span className="flex items-center ml-4 text-green-700">
                                        <span className="font-semibold mr-1">Showing:</span> {stationHeaders.length} station(s)
                                    </span>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Updated:</span>
                            <span className="text-gray-600">{selectedMatrix ? formatDate(selectedMatrix.updated_on) : '-'}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Next Review:</span>
                            <span className="text-gray-600">{selectedMatrix ? formatDate(selectedMatrix.next_review) : '-'}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Prepared By:</span>
                            <span className="text-gray-600">{selectedMatrix?.prepared_by || 'Department Manager'}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-700">Doc No:</span>
                            <span className="text-gray-600">{selectedMatrix?.doc_no || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Employee Count */}
                <div className="px-5 py-3 bg-blue-50 text-sm text-blue-700 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{departmentEmployees.length} employees</span> found in {selectedMatrix?.department || 'selected'} department
                    {skillMatrixData.length > 0 && (
                        <span className="ml-4 text-green-700">({skillMatrixData.length} skill records loaded)</span>
                    )}
                    {selectedStationId && (
                        <span className="ml-4 text-purple-700">(Filtered by station: {availableStations.find(s => s.station_id === selectedStationId)?.station_name})</span>
                    )}
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 w-12 bg-gray-100" rowSpan={3}>Sl. No.</th>
                                <th className="border border-gray-300 p-2 w-16 bg-gray-100" rowSpan={3}>CC No/EMP Code</th>
                                <th className="border border-gray-300 p-2 w-32 bg-gray-100" rowSpan={3}>Employee Name</th>
                                <th className="border border-gray-300 p-2 w-24 bg-gray-100" rowSpan={3}>DOJ</th>
                                <th
                                    className="border border-gray-300 p-2 text-center font-bold bg-blue-100"
                                    colSpan={stationHeaders.length}
                                >
                                    Training Points (Stations)
                                </th>
                                <th
                                    className="border border-gray-300 p-2 text-center font-bold bg-green-100"
                                    colSpan={months.length}
                                >
                                    Skill Matrix & Skill Upgradation Plan
                                </th>
                                <th className="border border-gray-300 p-2 text-center font-bold bg-gray-100" rowSpan={3}>
                                    Remarks
                                </th>
                            </tr>

                            <tr>
                                {stationHeaders.length > 0 && stationHeaders.map(st => (
                                    <th
                                        key={st.station_id}
                                        className="border border-gray-300 p-1 text-center text-xs font-bold bg-yellow-100"
                                    >
                                        {st.station_name}
                                    </th>
                                ))}
                                {selectedMatrix?.department !== 'Assembly' && (
                                    <th className="border border-gray-300 p-2 text-center font-bold bg-green-50" colSpan={months.length}>
                                        Monthly Plan
                                    </th>
                                )}
                            </tr>
                            <tr>
                                {stationHeaders.length > 0 ? (
                                    stationHeaders.map(st => (
                                        <th
                                            key={st.station_id}
                                            className="border border-gray-300 p-1 text-center text-xs font-bold h-20 bg-blue-50"
                                        >
                                            <div className="flex flex-col items-center justify-center h-full">
                                                {st.station_name}
                                            </div>
                                        </th>
                                    ))
                                ) : (
                                    <th className="border border-gray-300 p-1 text-center text-xs font-bold bg-gray-50 h-20">
                                        <div className="flex flex-col items-center justify-center h-full">
                                            No Stations Available
                                        </div>
                                    </th>
                                )}
                                {months.map(month => (
                                    <th
                                        key={month.id}
                                        className="border border-gray-300 p-1 text-center text-xs font-bold bg-green-50"
                                        style={{
                                            height: '80px',
                                            width: '24px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                writingMode: 'vertical-rl',
                                                transform: 'rotate(180deg)',
                                                textAlign: 'center',
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {month.displayName}
                                        </div>
                                    </th>
                                ))}
                            </tr>

                            <tr className="bg-gray-100">
                                <td className="border border-gray-300 p-2 text-center font-bold" colSpan={4}>Required Level</td>
                                {stationHeaders.length > 0 ? (
                                    stationHeaders.map(st => (
                                        <td key={st.station_id} className="border border-gray-300 p-1 text-center font-bold">
                                            <div className="flex items-center justify-center">
                                                <SkillDisplay level={3} />
                                            </div>
                                        </td>
                                    ))
                                ) : (
                                    <td className="border border-gray-300 p-1 text-center font-bold">-</td>
                                )}
                                <td className="border border-gray-300 p-1 text-center font-bold bg-gray-100" colSpan={months.length + 1}>
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {departmentEmployees.length > 0 ? (
                                departmentEmployees.map((employee, index) => {
                                    const employeeMonthlySkills = getEmployeeMonthlySkills(employee.employee_code || employee.emp_id);

                                    return (
                                        <tr key={employee.employee_code || employee.emp_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                            <td className="border border-gray-300 p-2 text-center font-mono">{employee.employee_code || employee.emp_id || '-'}</td>
                                            <td className="border border-gray-300 p-2">{employee.full_name || '-'}</td>
                                            <td className="border border-gray-300 p-2 text-center">{formatDate(employee.date_of_join)}</td>

                                            {stationHeaders.length > 0 ? (
                                                stationHeaders.map(st => {
                                                    const skillLevel = getOperatorSkillLevel(
                                                        employee.employee_code || employee.emp_id, 
                                                        st.station_id
                                                    );
                                                    
                                                    return (
                                                        <td 
                                                            key={st.station_id} 
                                                            className="border border-gray-300 p-1 text-center"
                                                            title={`${employee.full_name} - ${st.station_name}: Level ${skillLevel}`}
                                                        >
                                                            <div className="flex items-center justify-center">
                                                                <SkillDisplay level={skillLevel} />
                                                            </div>
                                                        </td>
                                                    );
                                                })
                                            ) : (
                                                <td className="border border-gray-300 p-1 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">No stations</span>
                                                    </div>
                                                </td>
                                            )}

                                            {months.map(month => {
                                                const monthMonthlySkills = employeeMonthlySkills.filter(ms => {
                                                    if (!ms.date) return false;
                                                    try {
                                                        const msDate = new Date(ms.date);
                                                        return msDate.getMonth() + 1 === month.id &&
                                                            msDate.getFullYear() === month.year;
                                                    } catch {
                                                        return false;
                                                    }
                                                });

                                                return (
                                                    <td
                                                        key={month.id}
                                                        className="border border-gray-300 p-1 text-center"
                                                        style={{ width: '24px' }}
                                                    >
                                                        {monthMonthlySkills.length > 0 ? (
                                                            <div className="flex flex-col items-center justify-center h-full space-y-1">
                                                                {monthMonthlySkills.map(ms => {
                                                                    const operation = operations.find(op =>
                                                                        op.id.toString() === ms.operation ||
                                                                        op.number === ms.operation_number
                                                                    );
                                                                    const operationNumber = operation?.number || ms.operation_number;
                                                                    const department = ms.department || selectedMatrix?.department || 'Assembly';
                                                                    const skillLevel = parseInt(ms.skill_level) || 0;

                                                                    const isCompleted = ms.status === 'completed';

                                                                    return (
                                                                        <div key={ms.id || `${ms.employee_code}-${ms.operation}-${ms.date}`}>
                                                                            {isCompleted ? (
                                                                                <div
                                                                                    className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold"
                                                                                    title={`${operation?.name || 'Unknown'} - Level ${skillLevel} - Completed`}
                                                                                >
                                                                                    ✓
                                                                                </div>
                                                                            ) : (
                                                                                // Use the proper shape components for monthly skills too
                                                                                <div 
                                                                                    className="flex items-center justify-center"
                                                                                    title={`${operation?.name || 'Unknown'} - Level ${skillLevel} - Scheduled`}
                                                                                >
                                                                                    {displayShape === 'levelblock' ? (
                                                                                        <LevelBlock level={skillLevel} colors={levelColors} />
                                                                                    ) : (
                                                                                        <PieChart level={skillLevel} colors={levelColors} size={24} />
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-gray-400">-</div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="border border-gray-300 p-2 text-xs">
                                                {employeeMonthlySkills.length > 0
                                                    ? employeeMonthlySkills[0].remarks || '-'
                                                    : '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                // Show empty table with message when no employees
                                <tr>
                                    <td colSpan={7 + stationHeaders.length + months.length} className="p-8 text-center text-gray-500">
                                        <div className="text-lg font-semibold mb-2">No Employees Found</div>
                                        <div className="text-sm">
                                            No employees found for the selected department. 
                                            Please check your selections or data configuration.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SkillMatrixTable;