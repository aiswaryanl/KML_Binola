

// import React, { useState, useEffect } from 'react';

// // Simplified state to hold the aggregated stats
// type TotalStats = {
//   required: number;
//   available: number;
// };

// // The API response structure for a single item from /advance-dashboard/
// type AdvanceDashboardRecord = {
//   id: number;
//   operators_required: number;
//   operators_available: number;
//   factory: number;
//   department: number;
//   // ... other fields are available but not used in this component
// };

// interface Props {
//   factoryId: number | null;
//   departmentId: number | null; // Can be null for "All Departments"
// }

// const OperatorStatsRedirect: React.FC<Props> = ({ factoryId, departmentId }) => {
//   const [stats, setStats] = useState<TotalStats | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Reset state when filters change
//     setStats(null);
//     setError(null);
    
//     // Do not fetch if factoryId is not selected
//     if (!factoryId) {
//       return;
//     }

//     // Construct the URL. It works with just factoryId, and can be refined with departmentId.
//     let url = `http://127.0.0.1:8000/advance-dashboard/?factory=${factoryId}`;
//     if (departmentId) {
//       url += `&department=${departmentId}`;
//     }
    
//     setLoading(true);

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data: AdvanceDashboardRecord[]) => {
//         if (data.length === 0) {
//             // If no data, display zeros
//             setStats({ required: 0, available: 0 });
//             return;
//         }

//         // Aggregate the stats from all returned records
//         const totalRequired = data.reduce((sum, item) => sum + item.operators_required, 0);
//         const totalAvailable = data.reduce((sum, item) => sum + item.operators_available, 0);
        
//         setStats({ required: totalRequired, available: totalAvailable });
//       })
//       .catch((err) => {
//         console.error("Error fetching operator stats:", err);
//         setError("Failed to load operator stats.");
//         setStats(null); // Clear stats on error
//       })
//       .finally(() => setLoading(false));
//   }, [factoryId, departmentId]);

//   const getStatus = (available: number, required: number) => {
//     if (required === 0) {
//         return { text: 'N/A', color: '#6B7280' }; // Gray for no requirement
//     }
//     if (available === required) {
//       return { text: 'Optimal', color: '#12c53b' };
//     }
//     if (available > required) {
//       return { text: 'Surplus', color: '#948dffff' };
//     }
//     if (available / required >= 0.95) {
//       return { text: 'Near Optimal', color: '#e6e603' };
//     }
//     return { text: 'Shortage', color: '#ee583e' };
//   };

//   const renderContent = () => {
//     if (loading) {
//       return <div className="text-center p-8 text-gray-500">Loading Stats...</div>;
//     }
//     if (error) {
//       return <div className="text-center p-8 text-red-500">{error}</div>;
//     }
//     if (!stats) {
//       return <div className="text-center p-8 text-gray-500">Select a factory to see stats.</div>;
//     }

//     const status = getStatus(stats.available, stats.required);
    
//     return (
//       <div className="space-y-3 sm:space-y-4">
//         <div className="flex gap-2 justify-center">
//           <div
//             className="rounded-lg p-3 sm:p-4 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.2)] flex-1 max-w-[150px]"
//             style={{ backgroundColor: status.color }}
//           >
//             <h3 className="text-xl sm:text-2xl font-bold text-white">{stats.required}</h3>
//             <p className="text-xs sm:text-sm text-white">Operators Required</p>
//           </div>
//           <div
//             className="rounded-lg p-3 sm:p-4 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.2)] flex-1 max-w-[150px]"
//             style={{ backgroundColor: status.color }}
//           >
//             <h3 className="text-xl sm:text-2xl font-bold text-white">{stats.available}</h3>
//             <p className="text-xs sm:text-sm text-white">Operators Available</p>
//           </div>
//         </div>
//         <p className="text-center text-sm font-semibold text-gray-700 mt-2">
//             Status: {status.text}
//         </p>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-[200px]">
//       <h2 className="sm:text-xl font-bold text-center text-gray-600 mb-4 sm:mb-6 bg-white p-2 sm:p-3 shadow">
//         Operators Required Vs Available
//       </h2>
//       {renderContent()}
//     </div>
//   );
// };

// export default OperatorStatsRedirect;



import React, { useState, useEffect } from 'react';

// Interfaces remain the same
type OperatorStats = {
  id: number;
  level: number;
  operator_required: number;
  operator_available: number;
};

type ApiData = {
  bifurcation_plan_l1?: number;
  bifurcation_plan_l2?: number;
  bifurcation_plan_l3?: number;
  bifurcation_plan_l4?: number;
  bifurcation_actual_l1?: number;
  bifurcation_actual_l2?: number;
  bifurcation_actual_l3?: number;
  bifurcation_actual_l4?: number;
};

type Employee = {
  id: number;
  name: string;
  level: number;
  advancementDate?: string;
};

interface Props {
  factoryId: number | null;
  departmentId: number | null;
}

const OperatorStatsRedirect: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<OperatorStats[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OperatorStats | null>(null);

  useEffect(() => {
    if (!factoryId) {
        setData([]);
        return;
    }

    const params = new URLSearchParams();
    params.append('factory', factoryId.toString());
    if (departmentId) {
        params.append('department', departmentId.toString());
    }
    const url = `http://127.0.0.1:8000/production-data/?${params.toString()}`;
    
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((apiResponse: ApiData[]) => { // <-- STEP 1: Expect an ARRAY of ApiData
        
        console.log("RAW DATA RECEIVED FROM API:", apiResponse);
        
        // --- THIS IS THE FIX ---
        // Get the first object from the array. If the array is empty, use an empty object.
        const apiData = apiResponse[0] || {}; 
        // ----------------------

        const transformedData: OperatorStats[] = [];
        for (let i = 1; i <= 4; i++) {
          const required = apiData[`bifurcation_plan_l${i}` as keyof ApiData] as number || 0;
          const available = apiData[`bifurcation_actual_l${i}` as keyof ApiData] as number || 0;

          if (required > 0 || available > 0) {
            transformedData.push({
              id: i,
              level: i,
              operator_required: required,
              operator_available: available,
            });
          }
        }
        
        console.log("Transformed Bifurcation Data:", transformedData);
        setData(transformedData);
      })
      .catch((err) => {
        console.error("Error fetching production data:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [factoryId, departmentId]);


  // ... The rest of the component remains exactly the same ...


  const fetchEmployees = async (level: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/employees/?level=${level}`);
      const emps = await res.json();
      setEmployees(emps);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    }
  };

  const handleClick = (stat: OperatorStats) => {
    setSelected(stat);
    fetchEmployees(stat.level);
  };

  const getStatus = (available: number, required: number) => {
    if (required === 0 && available > 0) return { text: 'Surplus', color: '#948dffff' };
    if (required === 0) return { text: 'Optimal', color: '#12c53b' };
    if (available === required) return { text: 'Optimal', color: '#12c53b' };
    if (available > required) return { text: 'Surplus', color: '#948dffff' };
    if (available / required >= 0.95) return { text: 'Near Optimal', color: '#e6e603' };
    return { text: 'Shortage', color: '#ee583e' };
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-[300px]">
      <h2 className="sm:text-xl font-bold text-center text-gray-600 mb-4 sm:mb-6 bg-white p-2 sm:p-3 shadow">
        Bifurcation Plan Vs Actual
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {data.length === 0 && !loading && (
            <p className="text-center text-gray-500 pt-8">No data available for this selection.</p>
        )}
        {data.map((stat) => {
          const status = getStatus(stat.operator_available, stat.operator_required);
          return (
            <div
              key={stat.id}
              className="flex gap-2 cursor-pointer justify-center"
              onClick={() => handleClick(stat)}
            >
              <div
                className="rounded-lg p-3 sm:p-4 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.2)] flex-1 max-w-[150px]"
                style={{ backgroundColor: status.color }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white">{stat.operator_required}</h3>
                <p className="text-xs sm:text-sm text-white">L{stat.level} Plan</p>
              </div>
              <div
                className="rounded-lg p-3 sm:p-4 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.2)] flex-1 max-w-[150px]"
                style={{ backgroundColor: status.color }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white">{stat.operator_available}</h3>
                <p className="text-xs sm:text-sm text-white">L{stat.level} Actual</p>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-2 right-4 text-xl">&times;</button>
            <h3 className="text-lg font-bold mb-2 text-center">
              L{selected.level} Operator Details
            </h3>
            <div className="flex justify-between mb-4">
              <div className="w-1/2 text-center shadow-xl rounded p-4">
                <p className="font-bold">{selected.operator_required}</p>
                <p className="text-sm">Plan</p>
              </div>
              <div className="w-1/2 text-center shadow-xl rounded p-4">
                <p className="font-bold">{selected.operator_available}</p>
                <p className="text-sm">Actual</p>
              </div>
            </div>
            <p className="text-center font-semibold mb-3">
              Status: {getStatus(selected.operator_available, selected.operator_required).text}
            </p>
            <h4 className="font-bold text-sm mb-2">Employees:</h4>
            <div className="space-y-2">
              {employees.length === 0 ? (
                <p className="text-sm text-center text-gray-500">No employees found</p>
              ) : (
                employees.map((emp) => (
                  <div key={emp.id} className="bg-gray-100 p-2 rounded">
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-xs text-gray-600">
                      {emp.advancementDate ? `Exam: ${emp.advancementDate}` : 'No exam date'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorStatsRedirect;