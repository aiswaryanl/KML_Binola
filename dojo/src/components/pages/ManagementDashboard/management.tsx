// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import TrainingSummaryCard from "./Card/Cardprops";
// import Training from "./Graphs/OprTraining-JoinedvsTrained/train";
// import Plan from "./Graphs/NoOftrainingPlanvsActual/plan";
// import Defects from "./Graphs/ManRelatedDefectsTrend/defects";
// import DefectsRejected from "./Graphs/ManRelatedDefectsInternal/defectsRejected";
// import MyTable from "./Graphs/ActionPlanned/mytable";
// import PlanTwo from "./Graphs/NoOftrainingPlanvsActual2/plan2";
// // import Nav from "../HomeNav/nav";

// const Management: React.FC = () => {
//   const [selectedHQ, setSelectedHQ] = useState<string>("");
//   const [selectedFactory, setSelectedFactory] = useState<string>("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");

//   // Sample data - replace with your actual data source
//   const hqs: string[] = ["HQ 1", "HQ 2", "HQ 3"];
//   const factories: string[] = ["Factory 1", "Factory 2", "Factory 3"];
//   const departments: string[] = ["All Departments", "Production", "Quality", "Maintenance"];

//   const location = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location]);

//   return (
//     <>
//       {/* <Nav /> */}
//       <div className="w-full min-h-screen p-2 sm:p-4 box-border pt-16 bg-gray-50">
//         <div className="w-full mx-auto flex flex-col px-2 sm:px-4">
//           <div className="bg-black mb-4 md:mb-6">
//             <h4 className="text-2xl md:text-3xl font-bold text-white py-5 text-center">
//               Management Review Dashboard
//             </h4>
//           </div>


//           {/* Main content area */}
//           <div className="w-full flex flex-col gap-3 md:gap-4">

//             <div className="flex flex-col lg:flex-row w-full gap-3 md:gap-4">
//               <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col gap-3 md:gap-4">
//                 {/* First row of graphs */}
//                 <div className="flex flex-col sm:flex-row w-full gap-5 md:gap-4">
//                   <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <Training />
//                   </div>
//                   <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <Plan />
//                   </div>
//                 </div>

//                 {/* Second row of graphs */}
//                 <div className="flex flex-col sm:flex-row w-full gap-5 md:gap-4">
//                   <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <Defects />
//                   </div>
//                   <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <DefectsRejected />
//                   </div>
//                 </div>

//                 {/* Third row of graphs */}
//                 <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
//                 <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <MyTable />
//                   </div>
//                   <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <PlanTwo />
//                   </div>
//                 </div>
//               </div>

//               {/* Right column - Summary Cards */}
//               <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-5 md:gap-4">
//                 {/* Dropdown Filters */}
//               <div className="w-full p-4 bg-white rounded-lg shadow-md">
//                 <div className="grid grid-cols-1 gap-4">
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Select HQ</label>
//                     <select
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       value={selectedHQ}
//                       onChange={(e) => setSelectedHQ(e.target.value)}
//                     >
//                       <option value="">All HQs</option>
//                       {hqs.map((hq) => (
//                         <option key={hq} value={hq}>
//                           {hq}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Select Factory</label>
//                     <select
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       value={selectedFactory}
//                       onChange={(e) => setSelectedFactory(e.target.value)}
//                     >
//                       <option value="">All Factories</option>
//                       {factories.map((factory) => (
//                         <option key={factory} value={factory}>
//                           {factory}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="w-full">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
//                     <select
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       value={selectedDepartment}
//                       onChange={(e) => setSelectedDepartment(e.target.value)}
//                     >
//                       {departments.map((dept) => (
//                         <option key={dept} value={dept}>
//                           {dept}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   </div>
//                 </div>

//                 <div className="w-full">
//                   <TrainingSummaryCard
//                     title="Training Summary"
//                     getUrl="http://127.0.0.1:8000/current-month/training-data/"
//                     cardColors={["#3498db", "#3498db", "#8e44ad", "#8e44ad"]}
//                     subtopics={[
//                       { dataKey: "new_operators_joined", displayText: "New Operators Joined" },
//                       { dataKey: "new_operators_trained", displayText: "New Opr. Trained" },
//                       { dataKey: "total_training_plans", displayText: "Total Trainings Plan" },
//                       { dataKey: "total_trainings_actual", displayText: "Total Trainings Act" }
//                     ]} />
//                 </div>
//                 <div className="w-full">
//                   <TrainingSummaryCard
//                     title="Man Related Defects"
//                     getUrl="http://127.0.0.1:8000/current-month/defects-data/"
//                     cardColors={["#143555", "#143555", "#6c6714", "#6c6714", "#5d255d", "#5d255d"]}
//                     subtopics={[
//                       { dataKey: "total_defects_msil", displayText: "Total Defects at MSIL" },
//                       { dataKey: "ctq_defects_msil", displayText: "CTQ Defects at MSIL" },
//                       { dataKey: "total_defects_tier1", displayText: "Total Defects at Tier-1" },
//                       { dataKey: "ctq_defects_tier1", displayText: "CTQ Defects at Tier-1" },
//                       { dataKey: "total_internal_rejection", displayText: "Total Internal Rejection" },
//                       { dataKey: "ctq_internal_rejection", displayText: "CTQ Internal Rejection" }
//                     ]} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Management;



import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TrainingSummaryCard from "./Card/Cardprops";
import Training from "./Graphs/OprTraining-JoinedvsTrained/train";
import Plan from "./Graphs/NoOftrainingPlanvsActual/plan";
import Defects from "./Graphs/ManRelatedDefectsTrend/defects";
import DefectsRejected from "./Graphs/ManRelatedDefectsInternal/defectsRejected";
import MyTable from "./Graphs/ActionPlanned/mytable";
import PlanTwo from "./Graphs/NoOftrainingPlanvsActual2/plan2";
// import Nav from "../HomeNav/nav";

// --- NEW: Define types for our data for better code quality ---
interface SelectOption {
  id: number;
  name: string;
}

interface HierarchyNode {
  hq: number;
  hq_name: string;
  factory: number;
  factory_name: string;
  structure_data: {
    departments: Array<{ id: number; department_name: string }>;
  };
}

const Management: React.FC = () => {
  const location = useLocation();

  // --- STATE FOR SELECTED VALUES (No change here) ---
  const [selectedHQ, setSelectedHQ] = useState<string>("");
  const [selectedFactory, setSelectedFactory] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  // --- NEW: STATE TO HOLD DYNAMIC DROPDOWN OPTIONS ---
  // We will store the full API response here
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
  // State for the options in each dropdown
  const [hqOptions, setHqOptions] = useState<SelectOption[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<SelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<SelectOption[]>([]);

  // --- NEW: useEffect to fetch data when component mounts ---
  useEffect(() => {
    const fetchHierarchyData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/hierarchy-simple/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: HierarchyNode[] = await response.json();
        setHierarchyData(data); // Store the full data

        // Process the data to get a unique list of HQs for the first dropdown
        const uniqueHQs = new Map<number, string>();
        data.forEach(item => {
          uniqueHQs.set(item.hq, item.hq_name);
        });

        const hqDropdownOptions = Array.from(uniqueHQs, ([id, name]) => ({ id, name }));
        setHqOptions(hqDropdownOptions);

      } catch (error) {
        console.error("Failed to fetch hierarchy data:", error);
      }
    };

    fetchHierarchyData();
  }, []); // The empty array [] means this effect runs only once

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // --- NEW: Handler for when an HQ is selected ---
  const handleHqChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hqId = parseInt(e.target.value);
    setSelectedHQ(e.target.value);

    // Reset factory and department selections
    setSelectedFactory("");
    setSelectedDepartment("");
    setDepartmentOptions([]);

    // Find all factories associated with the selected HQ
    const uniqueFactories = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === hqId)
      .forEach(item => {
        uniqueFactories.set(item.factory, item.factory_name);
      });

    const factoryDropdownOptions = Array.from(uniqueFactories, ([id, name]) => ({ id, name }));
    setFactoryOptions(factoryDropdownOptions);
  };

  // --- NEW: Handler for when a Factory is selected ---
  const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const factoryId = parseInt(e.target.value);
    setSelectedFactory(e.target.value);

    // Reset department selection
    setSelectedDepartment("");

    // Use .filter() to get ALL structures for the selected HQ and Factory
    const relevantStructures = hierarchyData.filter(
      item => item.hq === parseInt(selectedHQ) && item.factory === factoryId
    );

    // Now, we collect departments from all matching structures
    // A Map is used to ensure we only get unique departments, even if they appear in multiple structures
    const uniqueDepartments = new Map<number, string>();

    relevantStructures.forEach(structure => {
      if (structure.structure_data && structure.structure_data.departments) {
        structure.structure_data.departments.forEach(dept => {
          uniqueDepartments.set(dept.id, dept.department_name);
        });
      }
    });

    // Convert the Map of unique departments into an array for the dropdown
    const departmentDropdownOptions = Array.from(uniqueDepartments, ([id, name]) => ({ id, name }));

    if (departmentDropdownOptions.length > 0) {
      setDepartmentOptions(departmentDropdownOptions);
    } else {
      setDepartmentOptions([]);
    }
  };


  return (
    <>
      {/* <Nav /> */}
      <div className="w-full min-h-screen p-2 sm:p-4 box-border pt-16 bg-gray-50">
        <div className="w-full mx-auto flex flex-col px-2 sm:px-4">
          <div className="bg-black mb-4 md:mb-6">
            <h4 className="text-2xl md:text-3xl font-bold text-white py-5 text-center">
              Management Review Dashboard
            </h4>
          </div>

          {/* Main content area */}
          <div className="w-full flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col lg:flex-row w-full gap-3 md:gap-4">
              <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col gap-3 md:gap-4">
                {/* Graph components remain the same */}
                <div className="flex flex-col sm:flex-row w-full gap-5 md:gap-4">
                  <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1"><Training
                    hqId={selectedHQ}
                    factoryId={selectedFactory}
                    departmentId={selectedDepartment}
                  /></div>
                  <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1"><Plan /></div>
                </div>
                <div className="flex flex-col sm:flex-row w-full gap-5 md:gap-4">
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1"><Defects /></div>
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1"><DefectsRejected /></div>
                </div>
                <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1"><MyTable /></div>
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1"><PlanTwo /></div>
                </div>
              </div>

              <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-5 md:gap-4">
                {/* --- UPDATED: Dropdown Filters --- */}
                <div className="w-full p-4 bg-white rounded-lg shadow-md">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select HQ</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedHQ}
                        onChange={handleHqChange} // Use our new handler
                      >
                        <option value="">All HQs</option>
                        {hqOptions.map((hq) => (
                          <option key={hq.id} value={hq.id}> {/* Use ID for value */}
                            {hq.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Factory</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedFactory}
                        onChange={handleFactoryChange} // Use our new handler
                        disabled={!selectedHQ} // Disable until an HQ is selected
                      >
                        <option value="">All Factories</option>
                        {factoryOptions.map((factory) => (
                          <option key={factory.id} value={factory.id}>
                            {factory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        disabled={!selectedFactory} // Disable until a factory is selected
                      >
                        <option value="">All Departments</option>
                        {departmentOptions.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <TrainingSummaryCard
                    title="Training Summary"
                    getUrl="http://127.0.0.1:8000/current-month/training-data/"
                    cardColors={["#3498db", "#3498db", "#8e44ad", "#8e44ad"]}
                    subtopics={[
                      { dataKey: "new_operators_joined", displayText: "New Operators Joined" },
                      { dataKey: "new_operators_trained", displayText: "New Opr. Trained" },
                      { dataKey: "total_training_plans", displayText: "Total Trainings Plan" },
                      { dataKey: "total_trainings_actual", displayText: "Total Trainings Act" }
                    ]} />
                </div>
                <div className="w-full">
                  <TrainingSummaryCard
                    title="Man Related Defects"
                    getUrl="http://127.0.0.1:8000/current-month/defects-data/"
                    cardColors={["#143555", "#143555", "#6c6714", "#6c6714", "#5d255d", "#5d255d"]}
                    subtopics={[
                      { dataKey: "total_defects_msil", displayText: "Total Defects at MSIL" },
                      { dataKey: "ctq_defects_msil", displayText: "CTQ Defects at MSIL" },
                      { dataKey: "total_defects_tier1", displayText: "Total Defects at Tier-1" },
                      { dataKey: "ctq_defects_tier1", displayText: "CTQ Defects at Tier-1" },
                      { dataKey: "total_internal_rejection", displayText: "Total Internal Rejection" },
                      { dataKey: "ctq_internal_rejection", displayText: "CTQ Internal Rejection" }
                    ]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Management;

