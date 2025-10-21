// import React, { useEffect, useState } from "react";
// import LineGraph from "../../LineGraph/linegraph";
// import axios from "axios";

// interface DefectsRejectedProps {
//   selectedPlant: string;
// }

// interface DefectData {
//   id: number;
//   month: string;
//   total_defects: number;
//   ctq_defects: number;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const DefectsRejected: React.FC<DefectsRejectedProps> = ({ selectedPlant }) => {
//   const [data1, setData1] = useState<number[]>([]);
//   const [data2, setData2] = useState<number[]>([]);
//   const [labels, setLabels] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDefectsData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // console.log(`Fetching CTQ defects data for ${selectedPlant}`);
//         const response = await axios.get<DefectData[]>(`${API_BASE_URL}/ctq-defects-all-plants/`, {
//           params: {
//             plant: selectedPlant === "All Plants" ? "all" : selectedPlant
//           }
//         });

//         // console.log("CTQ Defects API Response:", response.data);

//         if (response.data && response.data.length > 0) {
//           // Sort data by month
//           const sortedData = response.data.sort((a, b) => 
//             new Date(a.month).getTime() - new Date(b.month).getTime()
//           );

//           // Format month labels
//           const monthLabels = sortedData.map(item => {
//             const date = new Date(item.month);
//             return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
//           });

//           // Extract defects data
//           const allStationsDefects = sortedData.map(item => item.total_defects);
//           const ctqStationsDefects = sortedData.map(item => item.ctq_defects);

//           setLabels(monthLabels);
//           setData1(allStationsDefects);
//           setData2(ctqStationsDefects);
//         } else {
//           console.log("No CTQ defects data available");
//           setLabels(["No data"]);
//           setData1([0]);
//           setData2([0]);
//         }
//       } catch (err) {
//         console.error("Error fetching CTQ defects data:", err);
//         setError("Failed to load CTQ defects data");
//         setLabels(["Error"]);
//         setData1([0]);
//         setData2([0]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDefectsData();
//   }, [selectedPlant]);

//   const title = selectedPlant === "All Plants" 
//     ? "CTQ Related Defects - All Plants" 
//     : `CTQ Related Defects - ${selectedPlant}`;

//   return (
//     <div style={{ width: "100%", height: "145px", margin: "auto" }}>
//       <h5 style={{
//         color: "black",
//         margin: "0 0 10px 0",
//         padding: "10px",
//         fontSize: "16px",
//         fontFamily: "Arial, sans-serif"
//       }}>
//         {title}
//       </h5>

//       {loading ? (
//         <div style={{ 
//           height: "100px", 
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "center",
//           color: "#666"
//         }}>
//           Loading CTQ defects data...
//         </div>
//       ) : error ? (
//         <div style={{ 
//           height: "100px", 
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "center",
//           color: "red"
//         }}>
//           {error}
//         </div>
//       ) : (
//         <LineGraph
//           labels={labels}
//           data1={data1}
//           data2={data2}
//           area={false}
//           showSecondLine={true}
//           label1="All Stations"
//           label2="CTQ Stations"
//         />
//       )}
//     </div>
//   );
// };

// export default DefectsRejected;


import React, { useEffect, useState } from "react";
import LineGraph from "../../LineGraph/linegraph";
import axios from "axios";

interface DefectData {
  month_year: string;
  total_internal_rejection: number;
  ctq_internal_rejection: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const DefectsRejected: React.FC = () => {
  const [data1, setData1] = useState<number[]>([]);
  const [data2, setData2] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse a YYYY-MM-DD string into a local Date to avoid timezone month shifts
  const parseISODateLocal = (s: string): Date => {
    const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
    const year = isNaN(y) ? new Date().getFullYear() : y;
    const month = isNaN(m) ? 1 : m; // 1-12
    const day = isNaN(d) ? 1 : d;
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    const fetchDefectsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch previous, current and next month in parallel.
        // If previous/next endpoints are unavailable, we'll still render current month.
        const endpoints = [
          `${API_BASE_URL}/previous-month/defects-data/`,
          `${API_BASE_URL}/current-month/defects-data/`,
          `${API_BASE_URL}/next-month/defects-data/`,
        ];

        const results = await Promise.allSettled(
          endpoints.map((url) => axios.get<DefectData>(url))
        );

        // Collect successful responses
        const items: DefectData[] = [];
        results.forEach((r) => {
          if (r.status === 'fulfilled' && r.value?.data) {
            items.push(r.value.data);
          }
        });

        // Ensure current month is included. If missing, fetch it explicitly.
        const now = new Date();
        const curY = now.getFullYear();
        const curM = now.getMonth(); // 0-11
        const hasCurrent = items.some((it) => {
          const d = parseISODateLocal(it.month_year);
          return d.getFullYear() === curY && d.getMonth() === curM;
        });
        if (!hasCurrent) {
          try {
            const current = await axios.get<DefectData>(`${API_BASE_URL}/current-month/defects-data/`);
            if (current.data) items.push(current.data);
          } catch {
            // ignore if current also missing; we'll render whatever we have
          }
        }

        // Always show three months: previous, current, next
        const makeKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const keyFromStr = (s: string) => makeKey(parseISODateLocal(s));
        const labelFromDate = (d: Date) => {
          const m = d.toLocaleString('default', { month: 'short' });
          const y = d.getFullYear().toString().slice(-2);
          return `${m} ${y}`;
        };

        const cur = new Date(curY, curM, 1);
        const prev = new Date(cur.getFullYear(), cur.getMonth() - 1, 1);
        const next = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);

        const targets = [prev, cur, next];

        // Index fetched items by YYYY-MM key
        const byKey = new Map<string, DefectData>();
        items.forEach((it) => byKey.set(keyFromStr(it.month_year), it));

        const labels3: string[] = [];
        const data1_3: number[] = [];
        const data2_3: number[] = [];

        targets.forEach((d) => {
          const k = makeKey(d);
          const found = byKey.get(k);
          labels3.push(labelFromDate(d));
          data1_3.push(found ? found.total_internal_rejection : 0);
          data2_3.push(found ? found.ctq_internal_rejection : 0);
        });

        setLabels(labels3);
        setData1(data1_3);
        setData2(data2_3);
      } catch (err) {
        console.error("Error fetching CTQ defects data:", err);
        setError("Failed to load CTQ defects data");
        setLabels(["Error loading data"]);
        setData1([0]);
        setData2([0]);
      } finally {
        setLoading(false);
      }
    };

    fetchDefectsData();
  }, []);

  const title = "Total Rejections - MSIL";

  return (
    <div style={{ width: "100%", height: "145px", margin: "auto" }}>
      <h5 style={{
        color: "black",
        margin: "0 0 10px 0",
        padding: "10px",
        fontSize: "16px",
        fontFamily: "Arial, sans-serif"
      }}>
        {title}
      </h5>

      {loading ? (
        <div style={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666"
        }}>
          Loading CTQ defects data...
        </div>
      ) : error ? (
        <div style={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red"
        }}>
          {error}
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          <LineGraph
            labels={labels}
            data1={data1}
            data2={data2}
            area={false}
            showSecondLine={true}
            label1="All Stations"
            label2="CTQ Stations"
          />
        </div>
      )}
    </div>
  );
};

export default DefectsRejected;