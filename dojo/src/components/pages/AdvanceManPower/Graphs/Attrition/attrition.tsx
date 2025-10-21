// import React, { useEffect, useState } from 'react';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LabelList,
//   Legend,
// } from 'recharts';

// interface AttritionData {
//   month: string;
//   attrition_trend_ctq: number;
// }

// interface Props {
//   factoryId: number | null;
//   departmentId: number | null;
// }

// const AttritionTrendChart: React.FC<Props> = ({ factoryId, departmentId }) => {
//   const [data, setData] = useState<AttritionData[]>([]);
//   const [containerWidth, setContainerWidth] = useState<number>(560); // Default width

//   useEffect(() => {
//     const handleResize = () => {
//       const container = document.getElementById('attrition-chart-container');
//       if (container) {
//         setContainerWidth(container.clientWidth);
//       }
//     };

//     handleResize(); // Set initial width
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (!factoryId || !departmentId) return;

//     const url = `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${factoryId}&department_id=${departmentId}`;
    
//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to fetch data');
//         return res.json();
//       })
//       .then((json) => {
//         const trend = json.attrition_trend || [];
//         const cleaned = trend.filter((item: AttritionData) =>
//           item.month && typeof item.attrition_trend_ctq === 'number' && !isNaN(item.attrition_trend_ctq)
//         );
//         setData(cleaned);
//       })
//       .catch((err) => {
//         console.error('Error fetching attrition data:', err);
//       });
//   }, [factoryId, departmentId]);

//   const formatMonth = (value: string) => {
//     // On small screens, show only first 3 letters of month
//     if (containerWidth < 400) {
//       return value.split(' ')[0].substring(0, 3);
//     }
//     return value.split(' ')[0];
//   };

//   const CustomLegend = () => (
//     <div className="text-sm text-gray-600 text-center mt-3">
//       <span className="inline-flex items-center gap-2">
//         <div className="w-3 h-3 rounded-full bg-[#007bff]" />
//         Attrition Rate
//       </span>
//     </div>
//   );

//   // Adjust font sizes based on container width
//   const labelFontSize = containerWidth < 500 ? 10 : 12;
//   const tickFontSize = containerWidth < 500 ? 10 : 12;

//   return (
//     <div 
//       id="attrition-chart-container"
//       className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4"
//       style={{ minWidth: '300px' }} // Minimum width to prevent squishing
//     >
//       <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
//         Attrition Rate Trend
//       </h2>
//       <ResponsiveContainer width="100%" height="90%">
//         <AreaChart
//           data={data}
//           margin={{ 
//             top: 20, 
//             right: containerWidth < 500 ? 5 : 10, 
//             left: 0, 
//             bottom: 0 
//           }}
//         >
//           <XAxis
//             dataKey="month"
//             tick={{ fontSize: tickFontSize }}
//             axisLine={false}
//             tickLine={false}
//             tickFormatter={formatMonth}
//           />
//           <YAxis
//             tick={false}
//             axisLine={false}
//             tickLine={false}
//             domain={['dataMin - 5', 'dataMax + 10']}
//           />
//           <Tooltip
//             formatter={(value: number) => [`${value}%`, 'Attrition Rate']}
//             contentStyle={{
//               backgroundColor: '#f8f9fa',
//               border: '1px solid #dee2e6',
//               borderRadius: '4px',
//               fontSize: labelFontSize,
//             }}
//           />
//           <Legend verticalAlign="bottom" height={36} content={<CustomLegend />} />

//           <Area
//             type="monotone"
//             dataKey="attrition_trend_ctq"
//             stroke="#007bff"
//             strokeWidth={2}
//             fill="rgba(0, 123, 255, 0.4)"
//             dot={{ 
//               stroke: '#007bff', 
//               strokeWidth: 2, 
//               fill: '#fff', 
//               r: containerWidth < 500 ? 3 : 4 
//             }}
//             activeDot={{ r: containerWidth < 500 ? 4 : 6, stroke: '#007bff', strokeWidth: 2 }}
//           >
//             <LabelList
//               dataKey="attrition_trend_ctq"
//               position="top"
//               fontSize={labelFontSize}
//               fill="#333"
//               offset={5}
//               formatter={(value: number) => value || ''} // Don't show 0 values
//             />
//           </Area>
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default AttritionTrendChart;


import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts';

// This interface represents the data structure the CHART needs, after transformation.
interface ChartData {
  month: string;
  attrition_trend_ctq: number;
}

// This interface represents the raw data from the API.
interface ApiData {
    month: number;
    year: number;
    attrition_rate: string;
}

interface Props {
  factoryId: number | null;
  departmentId: number | null; // Can be null for "All Departments"
}

// Helper to convert month number to name
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AttritionTrendChart: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(560); // Default width

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('attrition-chart-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Clear previous data and errors when filters change
    setData([]);
    setError(null);

    if (!factoryId) {
        setLoading(false);
        return;
    }
    
    setLoading(true);

    let url = `http://127.0.0.1:8000/advance-dashboard/?factory=${factoryId}`;
    if (departmentId) {
      url += `&department=${departmentId}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        return res.json();
      })
      .then((apiData: ApiData[]) => {
        // Transform API data to the format our chart needs
        const transformedData = apiData.map(item => ({
          month: `${monthNames[item.month - 1]} ${item.year}`,
          attrition_trend_ctq: parseFloat(item.attrition_rate), // Convert string to number
        }));

        // Filter out any entries that resulted in NaN
        const cleaned = transformedData.filter(item => !isNaN(item.attrition_trend_ctq));
        setData(cleaned);
      })
      .catch((err) => {
        console.error('Error fetching attrition data:', err);
        setError('Failed to load attrition trend data.');
      })
      .finally(() => {
          setLoading(false);
      });
  }, [factoryId, departmentId]);

  const formatMonth = (value: string) => {
    if (containerWidth < 400) {
      return value.split(' ')[0].substring(0, 3);
    }
    return value.split(' ')[0];
  };

  const CustomLegend = () => (
    <div className="text-sm text-gray-600 text-center mt-3">
      <span className="inline-flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#007bff]" />
        Attrition Rate
      </span>
    </div>
  );

  const labelFontSize = containerWidth < 500 ? 10 : 12;
  const tickFontSize = containerWidth < 500 ? 10 : 12;

  const renderChartContent = () => {
    if (loading) {
        return <div className="flex items-center justify-center h-full text-gray-500">Loading Chart...</div>;
    }
    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No attrition data available for the selected filters.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart
                data={data}
                margin={{ top: 20, right: containerWidth < 500 ? 5 : 10, left: 0, bottom: 0 }}
            >
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: tickFontSize }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatMonth}
                />
                <YAxis
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 1', 'dataMax + 2']} // Adjusted domain for better spacing
                />
                <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Attrition Rate']}
                    contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: labelFontSize }}
                />
                <Legend verticalAlign="bottom" height={36} content={<CustomLegend />} />
                <defs>
                    <linearGradient id="colorAttrition" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007bff" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#007bff" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="attrition_trend_ctq"
                    stroke="#007bff"
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAttrition)"
                    dot={{ stroke: '#007bff', strokeWidth: 2, fill: '#fff', r: containerWidth < 500 ? 3 : 4 }}
                    activeDot={{ r: containerWidth < 500 ? 4 : 6, stroke: '#007bff', strokeWidth: 2 }}
                >
                    <LabelList
                        dataKey="attrition_trend_ctq"
                        position="top"
                        fontSize={labelFontSize}
                        fill="#333"
                        offset={5}
                        formatter={(value: number) => value > 0 ? `${value}%` : ''} // Show % and hide 0
                    />
                </Area>
            </AreaChart>
        </ResponsiveContainer>
    );
  }

  return (
    <div
      id="attrition-chart-container"
      className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4"
      style={{ minWidth: '300px' }}
    >
      <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
        Attrition Rate Trend
      </h2>
      {renderChartContent()}
    </div>
  );
};

export default AttritionTrendChart;