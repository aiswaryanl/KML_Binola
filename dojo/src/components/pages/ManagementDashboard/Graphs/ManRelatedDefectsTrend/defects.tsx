// import React, { useEffect, useState } from "react";
// import LineGraph from "../../LineGraph/linegraph";
// import axios from "axios";

// interface DefectsProps {
//     selectedPlant: string;
// }

// interface DefectData {
//     id: number;
//     month: string;
//     total_defects: number;
//     ctq_defects: number;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const Defects: React.FC<DefectsProps> = ({ selectedPlant }) => {
//     const [data1, setData1] = useState<number[]>([]);
//     const [data2, setData2] = useState<number[]>([]);
//     const [labels, setLabels] = useState<string[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchDefectsData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
                
//                 // console.log("Fetching defects data for plant:", selectedPlant);
//                 const response = await axios.get<DefectData[]>(`${API_BASE_URL}/msil-defects/`, {
//                     params: {
//                         plant: selectedPlant === "All Plants" ? "all" : selectedPlant
//                     }
//                 });

//                 // console.log("Defects API Response:", response.data);

//                 if (response.data && response.data.length > 0) {
//                     // Sort data by month
//                     const sortedData = response.data.sort((a, b) => 
//                         new Date(a.month).getTime() - new Date(b.month).getTime()
//                     );

//                     // Format month labels
//                     const monthLabels = sortedData.map(item => {
//                         const date = new Date(item.month);
//                         return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
//                     });

//                     // Extract defects data
//                     const overallDefects = sortedData.map(item => item.total_defects);
//                     const ctqDefects = sortedData.map(item => item.ctq_defects);

//                     setLabels(monthLabels);
//                     setData1(overallDefects);
//                     setData2(ctqDefects);
//                 } else {
//                     console.log("No defects data available");
//                     setLabels(["No data"]);
//                     setData1([0]);
//                     setData2([0]);
//                 }
//             } catch (err) {
//                 console.error("Error fetching defects data:", err);
//                 setError("Failed to load defects data");
//                 setLabels(["Error"]);
//                 setData1([0]);
//                 setData2([0]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDefectsData();
//     }, [selectedPlant]);

//     const title = selectedPlant === "All Plants"
//         ? "Man Related Defects Trend at MSIL"
//         : `Man Related Defects Trend at MSIL - ${selectedPlant}`;

//     return (
//         <div style={{ width: "100%", height: "145px", margin: "auto" }}>
//             <h5 style={{
//                 color: "black",
//                 margin: "0 0 10px 0",
//                 padding: "10px",
//                 fontSize: "16px",
//                 fontFamily: "Arial, sans-serif"
//             }}>
//                 {title}
//             </h5>

//             {loading ? (
//                 <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <p>Loading defects data...</p>
//                 </div>
//             ) : error ? (
//                 <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
//                     <p>{error}</p>
//                 </div>
//             ) : (
//                 <LineGraph
//                     labels={labels}
//                     data1={data1}
//                     data2={data2}
//                     area={false}
//                     showSecondLine={true}
//                     label1="Overall Defects"
//                     label2="Defect from CTQ Stations"
//                 />
//             )}
//         </div>
//     );
// };

// export default Defects;



import React, { useEffect, useState } from "react";
import LineGraph from "../../LineGraph/linegraph";
import axios from "axios";

interface DefectData {
    id: number;
    month_year: string;
    defects_msil: number;
    ctq_defects_msil: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const Defects: React.FC = () => {
    const [data1, setData1] = useState<number[]>([]);
    const [data2, setData2] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sample data for development and fallback
    const generateSampleData = () => {
        const months = [];
        const currentDate = new Date();
        
        // Generate labels for last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear().toString().slice(-2);
            months.push(`${month} ${year}`);
        }

        // Generate sample data
        const overallDefects = months.map(() => Math.floor(Math.random() * 100) + 50);
        const ctqDefects = overallDefects.map(value => Math.floor(value * (0.1 + Math.random() * 0.3)));

        return { months, overallDefects, ctqDefects };
    };

    useEffect(() => {
        const fetchDefectsData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get<DefectData[]>(`${API_BASE_URL}/chart/defects-msil/`);
                console.log("Fetched Data:", response.data); 
                
                if (response.data && response.data.length > 0) {
                    // Sort data by month_year
                    const sortedData = response.data.sort((a, b) => 
                        new Date(a.month_year).getTime() - new Date(b.month_year).getTime()
                    );

                    // Format month_year labels as 'Aug 25' (short month_year + 2-digit year)
                    const month_yearLabels = sortedData.map(item => {
                        const date = new Date(item.month_year);
                        const month_yearShort = date.toLocaleString('default', {month: 'short' });
                        const yearShort = date.getFullYear().toString().slice(-2);
                        return `${month_yearShort} ${yearShort}`;
                    });

                    // Extract defects data
                    const overallDefects = sortedData.map(item => item.defects_msil);
                    const ctqDefects = sortedData.map(item => item.ctq_defects_msil);

                    setLabels(month_yearLabels);
                    setData1(overallDefects);
                    setData2(ctqDefects);
                } else {
                    // Fallback to sample data when no data is available
                    console.log("No data from API, using sample data");
                    const sampleData = generateSampleData();
                    setLabels(sampleData.months);
                    setData1(sampleData.overallDefects);
                    setData2(sampleData.ctqDefects);
                }
            } catch (err) {
                console.error("Error fetching defects data, using sample data:", err);
                setError("Using sample data (API failed to load)");
                const sampleData = generateSampleData();
                setLabels(sampleData.months);
                setData1(sampleData.overallDefects);
                setData2(sampleData.ctqDefects);
            } finally {
                setLoading(false);
            }
        };

        fetchDefectsData();
    }, []);

    const title = "Man Related Defects Trend at MSIL";

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
                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p>Loading defects data...</p>
                </div>
            ) : error ? (
                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
                    <p>{error}</p>
                </div>
            ) : (
                <LineGraph
                    labels={labels}
                    data1={data1}
                    data2={data2}
                    area={false}
                    showSecondLine={true}
                    label1="Overall Defects"
                    label2="Defect from CTQ Stations"
                />
            )}
        </div>
    );
};

export default Defects;