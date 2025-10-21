// import { useState, useEffect } from "react";
// import CardProps from "./AdvanceCard/Cardprops";
// import Absenteeism from "./Graphs/Absenteeism/absenteeism";
// import AttritionTrendChart from "./Graphs/Attrition/attrition";
// import BufferManpowerAvailability from "./Graphs/BufferManpowerAvailability/BufferManpower";
// import OperatorStats from "./OperatorStats/OperatorStatsRedirect";
// import ManpowerTrendChart from "./Graphs/Manpower/Manpower";
// import ManpowerActions from "./ManpowerActions/ManpowerActions";

// // --- Data Structure Interfaces ---

// // Interfaces for state management (dropdowns)
// interface HQ {
// 	id: number;
// 	name: string;
// }

// interface Factory {
// 	id: number;
// 	name: string;
// }

// interface Department {
// 	id: number;
// 	name: string;
// }

// // Interfaces for the new API response structure from /hierarchy-simple/
// interface HierarchyDepartment {
// 	id: number;
// 	department_name: string;
// }

// interface StructureData {
// 	departments: HierarchyDepartment[];
// }

// interface HierarchyNode {
// 	hq: number;
// 	hq_name: string;
// 	factory: number;
// 	factory_name: string;
// 	structure_data: StructureData;
// }

// const Advance = () => {
// 	// State for the raw data from the API
// 	const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);

// 	// State for dropdown options
// 	const [hqs, setHqs] = useState<HQ[]>([]);
// 	const [factories, setFactories] = useState<Factory[]>([]);
// 	const [departments, setDepartments] = useState<Department[]>([]);

// 	// State for selected values
// 	const [selectedHQ, setSelectedHQ] = useState<number | null>(null);
// 	const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
// 	const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

// 	// Unified loading and error state
// 	const [loading, setLoading] = useState<boolean>(true);
// 	const [error, setError] = useState<string | null>(null);

// 	const [stationType, setStationType] = useState<string>("CTQ");

// 	// Effect 1: Fetch all hierarchy data on component mount
// 	useEffect(() => {
// 		const fetchHierarchyData = async () => {
// 			setLoading(true);
// 			setError(null);
// 			try {
// 				const response = await fetch(
// 					"http://127.0.0.1:8000/hierarchy-simple/"
// 				);
// 				if (!response.ok) {
// 					throw new Error(
// 						`HTTP error! status: ${response.status}`
// 					);
// 				}
// 				const data: HierarchyNode[] = await response.json();
// 				setHierarchyData(data);
// 			} catch (err) {
// 				if (err instanceof Error) {
// 					setError(`Failed to fetch data: ${err.message}`);
// 				} else {
// 					setError(
// 						"An unknown error occurred while fetching hierarchy data"
// 					);
// 				}
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchHierarchyData();
// 	}, []);

// 	// Effect 2: Derive HQs list from the fetched hierarchy data
// 	useEffect(() => {
// 		if (hierarchyData.length === 0) return;

// 		const uniqueHQs = new Map<number, HQ>();
// 		hierarchyData.forEach((item) => {
// 			if (!uniqueHQs.has(item.hq)) {
// 				uniqueHQs.set(item.hq, { id: item.hq, name: item.hq_name });
// 			}
// 		});

// 		const hqList = Array.from(uniqueHQs.values());
// 		setHqs(hqList);

// 		if (hqList.length > 0) {
// 			setSelectedHQ(hqList[0].id);
// 		}
// 	}, [hierarchyData]);

// 	// Effect 3: Derive Factories list based on selected HQ
// 	useEffect(() => {
// 		if (!selectedHQ || hierarchyData.length === 0) {
// 			setFactories([]);
// 			setSelectedFactory(null);
// 			return;
// 		}

// 		const relevantData = hierarchyData.filter(
// 			(item) => item.hq === selectedHQ
// 		);

// 		const uniqueFactories = new Map<number, Factory>();
// 		relevantData.forEach((item) => {
// 			if (!uniqueFactories.has(item.factory)) {
// 				uniqueFactories.set(item.factory, {
// 					id: item.factory,
// 					name: item.factory_name,
// 				});
// 			}
// 		});

// 		const factoryList = Array.from(uniqueFactories.values());
// 		setFactories(factoryList);
// 		setSelectedFactory(factoryList.length > 0 ? factoryList[0].id : null);
// 		// Reset department selection when factory list changes
// 		setDepartments([]);
// 		setSelectedDepartment(null);

// 	}, [selectedHQ, hierarchyData]);

// 	// Effect 4: Derive Departments list based on selected Factory
// 	useEffect(() => {
// 		if (!selectedFactory || hierarchyData.length === 0) {
// 			setDepartments([]);
// 			setSelectedDepartment(null);
// 			return;
// 		}

// 		const relevantData = hierarchyData.filter(
// 			(item) => item.factory === selectedFactory
// 		);

// 		const uniqueDepartments = new Map<number, Department>();
// 		relevantData.forEach((item) => {
// 			item.structure_data.departments.forEach((dept) => {
// 				if (!uniqueDepartments.has(dept.id)) {
// 					uniqueDepartments.set(dept.id, {
// 						id: dept.id,
// 						name: dept.department_name,
// 					});
// 				}
// 			});
// 		});

// 		const departmentList = Array.from(uniqueDepartments.values());
// 		setDepartments(departmentList);

// 		if (departmentList.length > 0) {
// 			const firstDept = departmentList[0];
// 			setSelectedDepartment(firstDept.id);
// 			setStationType(firstDept.name.includes("PDI") ? "PDI" : "CTQ");
// 		} else {
//             setSelectedDepartment(null);
//         }
// 	}, [selectedFactory, hierarchyData]);

// 	// --- Event Handlers ---
// 	const handleHQChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		const hqId = e.target.value ? parseInt(e.target.value) : null;
// 		setSelectedHQ(hqId);
// 	};

// 	const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		const factoryId = e.target.value ? parseInt(e.target.value) : null;
// 		setSelectedFactory(factoryId);
// 	};

// 	const handleDepartmentChange = (
// 		e: React.ChangeEvent<HTMLSelectElement>
// 	) => {
// 		if (e.target.value === "all") {
// 			setSelectedDepartment(null);
// 		} else {
// 			const deptId = parseInt(e.target.value);
// 			setSelectedDepartment(deptId);
// 			const selectedDept = departments.find((dept) => dept.id === deptId);
// 			if (selectedDept) {
// 				setStationType(
// 					selectedDept.name.includes("PDI") ? "PDI" : "CTQ"
// 				);
// 			}
// 		}
// 	};

// 	// --- Helper Functions ---
// 	const buildUrl = () => {
// 		if (selectedFactory && selectedDepartment) {
// 			return `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${selectedFactory}&department_id=${selectedDepartment}`;
// 		}
// 		if (selectedFactory) {
// 			return `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${selectedFactory}`;
// 		}
// 		return "";
// 	};

// 	const getCardTitle = () => {
// 		if (!selectedDepartment) {
// 			return "Total Stations"; // When "All Departments" is selected
// 		}
// 		return `Total ${stationType} Stations`; // When specific department is selected
// 	};

// 	const manpowerShortageActions = [
// 		"Buffer manpower planning",
// 		"Salary revision",
// 		"Special perks",
// 	];

// 	const renderDropdown = (
// 		id: string,
// 		label: string,
// 		value: number | string,
// 		onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
// 		options: { id: number; name: string }[],
// 		{
// 			disabled = false,
// 			loading = false,
// 			defaultOptionText = "Select...",
// 			noOptionsText = "No options available",
// 			disabledText = "Please make a selection above",
// 			allOption = false,
// 		}
// 	) => (
// 		<div>
// 			<label
// 				htmlFor={id}
// 				className='block text-sm font-medium text-gray-700 mb-1'
// 			>
// 				{label}
// 			</label>
// 			{loading ? (
// 				<div className='w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-100 animate-pulse'>
// 					Loading...
// 				</div>
// 			) : (
// 				<select
// 					id={id}
// 					className='w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400'
// 					onChange={onChange}
// 					value={value}
// 					disabled={disabled || options.length === 0}
// 				>
// 					{disabled && !loading && options.length === 0 ? (
// 						<option value=''>{disabledText}</option>
// 					) : options.length === 0 ? (
// 						<option value=''>{noOptionsText}</option>
// 					) : (
// 						<>
// 							{allOption ? (
// 								<option value='all'>All Departments</option>
// 							) : (
// 								<option value=''>{defaultOptionText}</option>
// 							)}
// 							{options.map((option) => (
// 								<option key={option.id} value={option.id}>
// 									{option.name}
// 								</option>
// 							))}
// 						</>
// 					)}
// 				</select>
// 			)}
// 		</div>
// 	);

// 	// The filter section UI, extracted for reuse in mobile and desktop layouts
// 	const FilterSection = () => (
// 		<div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200'>
// 			<div className='flex flex-col gap-3 sm:gap-4'>
// 				{error && (
// 					<div className='text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded-md'>
// 						{error}
// 					</div>
// 				)}
// 				{renderDropdown("hq", "HQ", selectedHQ || "", handleHQChange, hqs, {
// 					loading: loading,
// 					defaultOptionText: "Select an HQ",
// 					noOptionsText: "No HQs found",
// 				})}
// 				{renderDropdown(
// 					"factory", "Factory", selectedFactory || "", handleFactoryChange, factories,
// 					{
// 						disabled: !selectedHQ,
// 						defaultOptionText: "Select a factory",
// 						noOptionsText: "No factories found",
// 						disabledText: "Select an HQ first",
// 					}
// 				)}
// 				{renderDropdown(
// 					"department", "Department", selectedDepartment || "all", handleDepartmentChange, departments,
// 					{
// 						disabled: !selectedFactory,
// 						defaultOptionText: "Select a department",
// 						noOptionsText: "No departments found",
// 						disabledText: "Select a factory first",
// 						allOption: true,
// 					}
// 				)}
// 			</div>
// 		</div>
// 	);

// 	return (
// 		<>
// 			<div className='w-full mx-auto flex flex-col'>
// 				<div>
// 					<div className='bg-black mb-4 md:mb-6 mt-3'>
// 						<h4 className='text-2xl md:text-3xl font-bold text-white text-center py-5'>
// 							Advanced Manpower Planning Dashboard
// 						</h4>
// 					</div>
// 				</div>

// 				<div className='w-full mx-auto flex flex-col px-2 sm:px-4'>
// 					{/* Mobile Layout - Column */}
// 					<div className='flex flex-col lg:hidden gap-4'>
// 						<div className='w-full'>
// 							<CardProps
// 								getUrl={buildUrl()}
// 								subtopics={[
// 									{ dataKey: "total_stations_ctq", displayText: getCardTitle() },
// 									{ dataKey: "operator_required_ctq", displayText: "Operators Required" },
// 									{ dataKey: "operator_availability_ctq", displayText: "Operators Available" },
// 									{ dataKey: "buffer_manpower_required_ctq", displayText: "Buff Manpower Required" },
// 									{ dataKey: "buffer_manpower_availability_ctq", displayText: "Buff Manpower Available" },
// 								]}
// 								cardColors={["#1f1f1f", "#0056b3", "#0056b3", "#1f1f1f", "#1f1f1f"]}
// 							/>
// 						</div>
// 						<FilterSection />
// 						<div className='flex-1'>
// 							<OperatorStats factoryId={selectedFactory} departmentId={selectedDepartment} />
// 						</div>
// 						<div className='flex flex-col gap-4'>
// 							<ManpowerTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} />
// 							<AttritionTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} />
// 							<BufferManpowerAvailability factoryId={selectedFactory} departmentId={selectedDepartment} />
// 							<Absenteeism factoryId={selectedFactory} departmentId={selectedDepartment} />
// 						</div>
// 					</div>
// 					{/* Desktop Layout - Row */}
// 					<div className='hidden lg:flex flex-row gap-4 md:gap-6 p-2'>
// 						<div className='flex-1 flex flex-col gap-4 md:gap-6 min-w-[60%]'>
// 							<div className='w-full'>
// 								<CardProps
// 									getUrl={buildUrl()}
// 									subtopics={[
// 										{ dataKey: "total_stations_ctq", displayText: getCardTitle() },
// 										{ dataKey: "operator_required_ctq", displayText: "Operators Required" },
// 										{ dataKey: "operator_availability_ctq", displayText: "Operators Available" },
// 										{ dataKey: "buffer_manpower_required_ctq", displayText: "Buff Manpower Required" },
// 										{ dataKey: "buffer_manpower_availability_ctq", displayText: "Buff Manpower Available" },
// 									]}
// 									cardColors={["#6B7280", "#0056b3", "#0056b3", "#1f1f1f", "#1f1f1f"]}
// 								/>
// 							</div>
// 							<div className='flex flex-col gap-4 md:gap-6 min-w-0 overflow-x-auto'>
// 								<div className='flex flex-col xl:flex-row gap-4 md:gap-6 min-w-[800px] xl:min-w-0'>
// 									<div className='w-full xl:w-1/2'>
// 										<ManpowerTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} />
// 									</div>
// 									<div className='w-full xl:w-1/2'>
// 										<AttritionTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} />
// 									</div>
// 								</div>
// 								<div className='flex flex-col xl:flex-row gap-4 md:gap-6 min-w-[800px] xl:min-w-0'>
// 									<div className='w-full xl:w-1/2'>
// 										<BufferManpowerAvailability factoryId={selectedFactory} departmentId={selectedDepartment} />
// 									</div>
// 									<div className='w-full xl:w-1/2'>
// 										<Absenteeism factoryId={selectedFactory} departmentId={selectedDepartment} />
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 						<div className='w-[20%] min-w-[300px] flex flex-col gap-4 sm:gap-6'>
// 							<FilterSection />
// 							<div className='flex-1'>
// 								<OperatorStats factoryId={selectedFactory} departmentId={selectedDepartment} />
// 							</div>
// 							<div className='flex-1'>
// 								<ManpowerActions
// 									title='Actions Planned for Manpower Shortage'
// 									data={manpowerShortageActions}
// 								/>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Advance;




import { useState, useEffect } from "react";
import CardProps from "./AdvanceCard/Cardprops";
import Absenteeism from "./Graphs/Absenteeism/absenteeism";
import AttritionTrendChart from "./Graphs/Attrition/attrition";
import BufferManpowerAvailability from "./Graphs/BufferManpowerAvailability/BufferManpower";
import OperatorStats from "./OperatorStats/OperatorStatsRedirect";
import ManpowerTrendChart from "./Graphs/Manpower/Manpower";
import ManpowerActions from "./ManpowerActions/ManpowerActions";

// --- Data Structure Interfaces ---

// Interfaces for state management (dropdowns)
interface HQ { id: number; name: string; }
interface Factory { id: number; name: string; }
interface Department { id: number; name: string; }

// Interfaces for the API response from /hierarchy-simple/
interface HierarchyDepartment { id: number; department_name: string; }
interface StructureData { departments: HierarchyDepartment[]; }
interface HierarchyNode {
	hq: number;
	hq_name: string;
	factory: number;
	factory_name: string;
	structure_data: StructureData;
}

// Interface for the card data from /advance-dashboard/
interface CardData {
    id: number;
    month: number;
    year: number;
    total_stations: number;
    operators_required: number;
    operators_available: number;
    buffer_manpower_required: number;
    buffer_manpower_available: number;
    attrition_rate: string;
    absenteeism_rate: string;
    hq: number;
    factory: number;
    department: number;
}


const Advance = () => {
	// --- State for Hierarchy & Dropdowns ---
	const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
	const [hqs, setHqs] = useState<HQ[]>([]);
	const [factories, setFactories] = useState<Factory[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [selectedHQ, setSelectedHQ] = useState<number | null>(null);
	const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
	const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
	const [hierarchyLoading, setHierarchyLoading] = useState<boolean>(true);
	const [hierarchyError, setHierarchyError] = useState<string | null>(null);
	
    // --- State for Dashboard/Card Data ---
    const [cardData, setCardData] = useState<CardData | null>(null);
    const [isCardDataLoading, setIsCardDataLoading] = useState<boolean>(true);
    const [cardDataError, setCardDataError] = useState<string | null>(null);

	// --- State for UI Display ---
	const [stationType, setStationType] = useState<string>("CTQ");

	// --- Effects for Data Fetching & State Derivation ---

	// Effect 1: Fetch all hierarchy data on component mount
	useEffect(() => {
		const fetchHierarchyData = async () => {
			setHierarchyLoading(true);
			setHierarchyError(null);
			try {
				const response = await fetch("http://127.0.0.1:8000/hierarchy-simple/");
				if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
				const data: HierarchyNode[] = await response.json();
				setHierarchyData(data);
			} catch (err) {
                const message = err instanceof Error ? err.message : "An unknown error occurred";
				setHierarchyError(`Failed to fetch hierarchy filters: ${message}`);
			} finally {
				setHierarchyLoading(false);
			}
		};
		fetchHierarchyData();
	}, []);

	// Effect 2: Derive HQs list from hierarchy data
	useEffect(() => {
		if (hierarchyData.length === 0) return;
		const uniqueHQs = Array.from(new Map(hierarchyData.map(item => [item.hq, { id: item.hq, name: item.hq_name }])).values());
		setHqs(uniqueHQs);
		if (uniqueHQs.length > 0) setSelectedHQ(uniqueHQs[0].id);
	}, [hierarchyData]);

	// Effect 3: Derive Factories list based on selected HQ
	useEffect(() => {
		if (!selectedHQ) {
			setFactories([]);
			setSelectedFactory(null);
			return;
		}
		const relevantData = hierarchyData.filter(item => item.hq === selectedHQ);
		const uniqueFactories = Array.from(new Map(relevantData.map(item => [item.factory, { id: item.factory, name: item.factory_name }])).values());
		setFactories(uniqueFactories);
		setSelectedFactory(uniqueFactories.length > 0 ? uniqueFactories[0].id : null);
	}, [selectedHQ, hierarchyData]);

	// Effect 4: Derive Departments list based on selected Factory
	useEffect(() => {
		if (!selectedFactory) {
			setDepartments([]);
			setSelectedDepartment(null);
			return;
		}
		const relevantData = hierarchyData.filter(item => item.factory === selectedFactory);
		const allDepartments = relevantData.flatMap(item => item.structure_data.departments);
		const uniqueDepartments = Array.from(new Map(allDepartments.map(dept => [dept.id, { id: dept.id, name: dept.department_name }])).values());
		setDepartments(uniqueDepartments);
        // Default to "All Departments" when factory changes
        setSelectedDepartment(null);
	}, [selectedFactory, hierarchyData]);


    // Effect 5: Fetch card/dashboard data whenever filters change
    useEffect(() => {
        const fetchDashboardData = async () => {
            // Don't fetch if a factory hasn't been selected yet
            if (!selectedFactory) {
                setCardData(null);
                return;
            };

            setIsCardDataLoading(true);
            setCardDataError(null);
            const url = buildDashboardUrl();

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: CardData[] = await response.json();
                
                // API returns an array, take the first/most recent entry
                setCardData(data && data.length > 0 ? data[0] : null);
            } catch (err) {
                 const message = err instanceof Error ? err.message : "An unknown error occurred";
				 setCardDataError(`Failed to fetch dashboard data: ${message}`);
            } finally {
                setIsCardDataLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedFactory, selectedDepartment]); // Re-run this effect when these filters change

	// --- Event Handlers ---
	const handleHQChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedHQ(parseInt(e.target.value));
	const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFactory(parseInt(e.target.value));
	// Inside Advance.tsx

	// A simpler version for debugging

	const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		console.log("--- Department Changed ---");
		console.log("Value from dropdown:", value);

		if (value === "all") {
			console.log("ACTION: Setting selectedDepartment to null");
			setSelectedDepartment(null);
		} else {
			const deptId = parseInt(value);
			console.log("Parsed ID:", deptId);

			if (isNaN(deptId)) {
				console.error("ERROR: The value is not a valid number!");
				return;
			}

			console.log("ACTION: Setting selectedDepartment to:", deptId);
			setSelectedDepartment(deptId);
		}
	};

	// --- Helper Functions ---
	const buildDashboardUrl = () => {
		const base = "http://127.0.0.1:8000/advance-dashboard/";
		const params = new URLSearchParams();
		if (selectedFactory) params.append("factory", selectedFactory.toString());
		if (selectedDepartment) params.append("department", selectedDepartment.toString());
		
		return `${base}?${params.toString()}`;
	};

	const getCardTitle = () => selectedDepartment ? `Total ${stationType} Stations` : "Total Stations";

	const manpowerShortageActions = ["Buffer manpower planning", "Salary revision", "Special perks"];

	const renderDropdown = (
		id: string,
		label: string,
		value: number | string,
		onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
		options: { id: number; name: string }[],
		{
			disabled = false,
			loading = false,
			defaultOptionText = "Select...",
			noOptionsText = "No options available",
			disabledText = "Please make a selection above",
			allOption = false,
		}
	) => (
		<div>
			<label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
			{loading ? (
				<div className='w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-100 animate-pulse'>Loading...</div>
			) : (
				<select
					id={id}
					className='w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400'
					onChange={onChange}
					value={value}
					disabled={disabled || options.length === 0}
				>
					{disabled && !loading && options.length === 0 ? (
						<option value=''>{disabledText}</option>
					) : options.length === 0 ? (
						<option value=''>{noOptionsText}</option>
					) : (
						<>
							{allOption ? <option value='all'>All Departments</option> : <option value=''>{defaultOptionText}</option>}
							{options.map((option) => (<option key={option.id} value={option.id}>{option.name}</option>))}
						</>
					)}
				</select>
			)}
		</div>
	);

	const FilterSection = () => (
		<div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200'>
			<div className='flex flex-col gap-3 sm:gap-4'>
				{hierarchyError && <div className='text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded-md'>{hierarchyError}</div>}
				{renderDropdown("hq", "HQ", selectedHQ || "", handleHQChange, hqs, { loading: hierarchyLoading, defaultOptionText: "Select an HQ", noOptionsText: "No HQs found" })}
				{renderDropdown("factory", "Factory", selectedFactory || "", handleFactoryChange, factories, { disabled: !selectedHQ, defaultOptionText: "Select a factory", noOptionsText: "No factories found", disabledText: "Select an HQ first" })}
				{renderDropdown(
                "department", 
                "Department", 
                selectedDepartment || "all", 
                handleDepartmentChange, // <--- CHECK THIS LINE
                departments, 
                { 
                    disabled: !selectedFactory, 
                    defaultOptionText: "Select a department", 
                    noOptionsText: "No departments found", 
                    disabledText: "Select a factory first", 
                    allOption: true 
                }
            )}
				
			</div>
		</div>
	);

	return (
		<>
			<div className='w-full mx-auto flex flex-col'>
				<div>
					<div className='bg-black mb-4 md:mb-6 mt-3'>
						<h4 className='text-2xl md:text-3xl font-bold text-white text-center py-5'>Advanced Manpower Planning Dashboard</h4>
					</div>
				</div>

				<div className='w-full mx-auto flex flex-col px-2 sm:px-4'>
					{/* Mobile Layout */}
					<div className='flex flex-col lg:hidden gap-4'>
						<div className='w-full'>
							<CardProps
								data={cardData}
								loading={isCardDataLoading}
								error={cardDataError}
								subtopics={[
									{ dataKey: "total_stations", displayText: getCardTitle() },
									{ dataKey: "operators_required", displayText: "Operators Required" },
									{ dataKey: "operators_available", displayText: "Operators Available" },
									{ dataKey: "buffer_manpower_required", displayText: "Buff Manpower Required" },
									{ dataKey: "buffer_manpower_available", displayText: "Buff Manpower Available" },
								]}
								cardColors={["#1f1f1f", "#0056b3", "#0056b3", "#1f1f1f", "#1f1f1f"]}
							/>
						</div>
						<FilterSection />
						<div className='flex-1'><OperatorStats factoryId={selectedFactory} departmentId={selectedDepartment} /></div>
						<div className='flex flex-col gap-4'>
							<ManpowerTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} />
							<AttritionTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} />
							<BufferManpowerAvailability factoryId={selectedFactory} departmentId={selectedDepartment} />
							<Absenteeism factoryId={selectedFactory} departmentId={selectedDepartment} />
						</div>
					</div>
					{/* Desktop Layout */}
					<div className='hidden lg:flex flex-row gap-4 md:gap-6 p-2'>
						<div className='flex-1 flex flex-col gap-4 md:gap-6 min-w-[60%]'>
							<div className='w-full'>
								<CardProps
									data={cardData}
                                    loading={isCardDataLoading}
                                    error={cardDataError}
									subtopics={[
										{ dataKey: "total_stations", displayText: getCardTitle() },
										{ dataKey: "operators_required", displayText: "Operators Required" },
										{ dataKey: "operators_available", displayText: "Operators Available" },
										{ dataKey: "buffer_manpower_required", displayText: "Buff Manpower Required" },
										{ dataKey: "buffer_manpower_available", displayText: "Buff Manpower Available" },
									]}
									cardColors={["#6B7280", "#0056b3", "#0056b3", "#1f1f1f", "#1f1f1f"]}
								/>
							</div>
							<div className='flex flex-col gap-4 md:gap-6 min-w-0 overflow-x-auto'>
								<div className='flex flex-col xl:flex-row gap-4 md:gap-6 min-w-[800px] xl:min-w-0'>

									<div className='w-full xl:w-1/2'><ManpowerTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} /></div>
									<div className='w-full xl:w-1/2'><AttritionTrendChart factoryId={selectedFactory} departmentId={selectedDepartment} /></div>
								</div>
								<div className='flex flex-col xl:flex-row gap-4 md:gap-6 min-w-[800px] xl:min-w-0'>
									<div className='w-full xl:w-1/2'><BufferManpowerAvailability factoryId={selectedFactory} departmentId={selectedDepartment} /></div>
									<div className='w-full xl:w-1/2'><Absenteeism factoryId={selectedFactory} departmentId={selectedDepartment} /></div>
								</div>
							</div>
						</div>
						<div className='w-[20%] min-w-[300px] flex flex-col gap-4 sm:gap-6'>
							<FilterSection />
							<div className='flex-1'><OperatorStats factoryId={selectedFactory} departmentId={selectedDepartment} /></div>
							<div className='flex-1'><ManpowerActions title='Actions Planned for Manpower Shortage' data={manpowerShortageActions} /></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Advance;

