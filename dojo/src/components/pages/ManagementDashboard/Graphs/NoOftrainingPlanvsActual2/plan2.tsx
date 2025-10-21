// import React, { useEffect, useState } from "react";
// import BarChart from "../../Barchart/barchart";
// import axios from "axios";

// interface PlanProps {
//   selectedPlant: string;
// }

// interface DefectReport {
//   id: number;
//   month: string;
//   category: string;
//   total_defects: number;
//   ctq_defects: number;
//   total_internal_rejection: number;
//   ctq_internal_rejection: number;
//   tier1_total_defects: number;
//   tier1_ctq_defects: number;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const PlanTwo: React.FC<PlanProps> = ({ selectedPlant }) => {
//   const [plannedData, setPlannedData] = useState<number[]>([]);
//   const [actualData, setActualData] = useState<number[]>([]);
//   const [labels, setLabels] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDefectReports = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         console.log(`Fetching defect reports for ${selectedPlant}`);
//         const response = await axios.get<DefectReport[]>(`${API_BASE_URL}/unified-defect-reports/`, {
//           params: {
//             category: selectedPlant === "All Plants" ? "All Plants" : "MSIL"
//           }
//         });

//         console.log("Defect Reports API Response:", response.data);

//         if (response.data && response.data.length > 0) {
//           // Sort data by month
//           const sortedData = response.data.sort((a, b) => 
//             new Date(a.month).getTime() - new Date(b.month).getTime()
//           );

//           // Get the last 12 months of data (or all if less than 12)
//           const recentData = sortedData.slice(-12);

//           // Format month labels
//           const monthLabels = recentData.map(item => {
//             const date = new Date(item.month);
//             return date.toLocaleString('default', { month: 'short' });
//           });

//           // Extract planned and actual defects
//           // For this example, we'll use:
//           // Planned = total_defects (could be targets or expected values)
//           // Actual = total_internal_rejection (actual defects found)
//           const plannedDefects = recentData.map(item => item.total_defects);
//           const actualDefects = recentData.map(item => item.total_internal_rejection);

//           setLabels(monthLabels);
//           setPlannedData(plannedDefects);
//           setActualData(actualDefects);
//         } else {
//           console.log("No defect report data available");
//           setLabels(["No data"]);
//           setPlannedData([0]);
//           setActualData([0]);
//         }
//       } catch (err) {
//         console.error("Error fetching defect reports:", err);
//         setError("Failed to load defect data");
//         setLabels(["Error"]);
//         setPlannedData([0]);
//         setActualData([0]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDefectReports();
//   }, [selectedPlant]);

//   // Dynamic title based on selection
//   const title = selectedPlant === "All Plants" 
//     ? "Total Defects - All Plants" 
//     : `Total Defects - ${selectedPlant}`;

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       {loading ? (
//         <div style={{ 
//           height: "100%", 
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "center",
//           color: "#666"
//         }}>
//           Loading defect data...
//         </div>
//       ) : error ? (
//         <div style={{ 
//           height: "100%", 
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "center",
//           color: "red"
//         }}>
//           {error}
//         </div>
//       ) : (
//         <BarChart
//           labels={labels}
//           data1={plannedData}
//           data2={actualData}
//           groupLabels={["Target", "Actual"]}
//           title={title}
//           color1="rgba(52, 152, 219, 0.8)" // Blue
//           color2="rgba(13, 32, 160, 0.8)" // Dark Blue
//         />
//       )}
//     </div>
//   );
// };

// export default PlanTwo;



import React, { useEffect, useState } from "react";
import BarChart from "../../Barchart/barchart";
import axios from "axios";

interface DefectReport {
  month_year: string;
  total_defects_msil: number;
  total_defects_tier1: number;
  ctq_defects_msil: number;
  ctq_defects_tier1: number;
  total_internal_rejection: number;
  ctq_internal_rejection: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const PlanTwo: React.FC = () => {
  const [combinedDefectsData, setCombinedDefectsData] = useState<number[]>([]);
  const [combinedCTQDefectsData, setCombinedCTQDefectsData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefectReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<DefectReport>(`${API_BASE_URL}/current-month/defects-data/`);
        console.log("API Response:", response.data);
        
        if (response.data) {
          // Convert single object to array with one element
          const dataArray = [response.data];
          
          // Format month label as 'Jul 25' (short month + 2-digit year)
          const date = new Date(dataArray[0].month_year);
          const monthShort = date.toLocaleString('default', { month: 'short' });
          const yearShort = date.getFullYear().toString().slice(-2);
          const monthLabel = `${monthShort} ${yearShort}`;

          // Combine total_defects_msil + total_defects_tier1
          const combinedDefects = [
            dataArray[0].total_defects_msil + (dataArray[0].total_defects_tier1 || 0)
          ];

          // Combine ctq_defects_msil + ctq_defects_tier1
          const combinedCTQDefects = [
            dataArray[0].ctq_defects_msil + (dataArray[0].ctq_defects_tier1 || 0)
          ];

          setLabels([monthLabel]);
          setCombinedDefectsData(combinedDefects);
          setCombinedCTQDefectsData(combinedCTQDefects);
        } else {
          setLabels(["No data"]);
          setCombinedDefectsData([0]);
          setCombinedCTQDefectsData([0]);
        }
      } catch (err) {
        console.error("Error fetching defect reports:", err);
        setError("Failed to load defect data");
        setLabels(["Error"]);
        setCombinedDefectsData([0]);
        setCombinedCTQDefectsData([0]);
      } finally {
        setLoading(false);
      }
    };

    fetchDefectReports();
  }, []);

  const title = "Combined Defects Analysis - Current Month";

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {loading ? (
        <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666"
        }}>
          Loading defect data...
        </div>
      ) : error ? (
        <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red"
        }}>
          {error}
        </div>
      ) : (
        <BarChart
          labels={labels}
          data1={combinedDefectsData}
          data2={combinedCTQDefectsData}
          groupLabels={["Total Defects", "CTQ Defects"]}
          title={title}
          color1="rgba(52, 152, 219, 0.8)" // Blue
          color2="rgba(13, 32, 160, 0.8)" // Dark Blue
        />
      )}
    </div>
  );
};

export default PlanTwo;