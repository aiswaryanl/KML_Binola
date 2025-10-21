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

// interface AbsenteeData {
//   month: string;
//   absentee_trend_ctq: number;
// }

// interface Props {
//   factoryId: number | null;
//   departmentId: number | null;
// }

// const AbsenteeTrendChart: React.FC<Props> = ({ factoryId, departmentId }) => {
//   const [data, setData] = useState<AbsenteeData[]>([]);
//   const [containerWidth, setContainerWidth] = useState<number>(560);

//   useEffect(() => {
//     const handleResize = () => {
//       const container = document.getElementById('absentee-chart-container');
//       if (container) {
//         setContainerWidth(container.clientWidth);
//       }
//     };

//     handleResize();
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
//         const trend = json.absentee_trend || [];
//         setData(trend);
//       })
//       .catch((err) => {
//         console.error('Error fetching absentee data:', err);
//       });
//   }, [factoryId, departmentId]);

//   const formatMonth = (value: string) => {
//     if (containerWidth < 400) {
//       return value.split(' ')[0].substring(0, 3);
//     }
//     return value.split(' ')[0];
//   };

//   const CustomLegend = () => (
//     <div className="text-xs sm:text-sm text-gray-600 text-center mt-3">
//       <span className="inline-flex items-center gap-1 sm:gap-2">
//         <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#007bff]" />
//         Absenteeism Rate Trend
//       </span>
//     </div>
//   );

//   const labelFontSize = containerWidth < 500 ? 10 : 12;
//   const tickFontSize = containerWidth < 500 ? 10 : 12;

//   return (
//     <div 
//       id="absentee-chart-container"
//       className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4"
//       style={{ minWidth: '300px' }}
//     >
//       <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
//         Absenteeism Rate Trend
//       </h2>
//       <ResponsiveContainer width="100%" height="90%">
//         <AreaChart 
//           data={data} 
//           margin={{ 
//             top: 20, 
//             right: containerWidth < 500 ? 5 : 10, 
//             left: 0, 
//             bottom: 5 
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
//           <Legend 
//             verticalAlign="bottom" 
//             height={40} 
//             content={<CustomLegend />} 
//           />
//           <Tooltip
//             formatter={(value: number) => [`${value}%`, 'Absentee Rate']}
//             contentStyle={{
//               backgroundColor: '#f8f9fa',
//               border: '1px solid #dee2e6',
//               borderRadius: '4px',
//               fontSize: labelFontSize,
//             }}
//           />
//           <Area
//             type="linear"
//             dataKey="absentee_trend_ctq"
//             stroke="#007bff"
//             strokeWidth={2}
//             fill="rgba(0, 123, 255, 0.4)"
//             fillOpacity={1}
//             dot={{
//               stroke: '#007bff',
//               strokeWidth: 1,
//               fill: '#fff',
//               r: containerWidth < 500 ? 3 : 4
//             }}
//             activeDot={{
//               r: containerWidth < 500 ? 5 : 6,
//               stroke: '#007bff',
//               strokeWidth: 2
//             }}
//           >
//             <LabelList
//               dataKey="absentee_trend_ctq"
//               position="top"
//               fontSize={labelFontSize}
//               fill="#333"
//               offset={5}
//               formatter={(value: number) => value ? `${value}%` : ''}
//             />
//           </Area>
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default AbsenteeTrendChart;



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
  absentee_trend_ctq: number;
}

// This interface represents the raw data from the API.
interface ApiData {
    month: number;
    year: number;
    absenteeism_rate: string;
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

const Absenteeism: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(560);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('absentee-chart-container');
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
        // Transform API data into the format our chart needs
        const transformedData = apiData.map(item => ({
            month: `${monthNames[item.month - 1]} ${item.year}`,
            absentee_trend_ctq: parseFloat(item.absenteeism_rate), // Convert string to number
        }));

        const cleaned = transformedData.filter(item => !isNaN(item.absentee_trend_ctq));
        setData(cleaned);
      })
      .catch((err) => {
        console.error('Error fetching absentee data:', err);
        setError('Failed to load absenteeism data.');
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
    <div className="text-xs sm:text-sm text-gray-600 text-center mt-3">
      <span className="inline-flex items-center gap-1 sm:gap-2">
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff4d4d]" />
        Absenteeism Rate
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
        return <div className="flex items-center justify-center h-full text-gray-500">No absenteeism data available for the selected filters.</div>;
    }
    
    return (
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart 
                data={data} 
                margin={{ top: 20, right: containerWidth < 500 ? 5 : 10, left: 0, bottom: 5 }}
            >
                <XAxis dataKey="month" tick={{ fontSize: tickFontSize }} axisLine={false} tickLine={false} tickFormatter={formatMonth} />
                <YAxis tick={false} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 2']} />
                <Legend verticalAlign="bottom" height={40} content={<CustomLegend />} />
                <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Absentee Rate']}
                    contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: labelFontSize }}
                />
                <defs>
                    <linearGradient id="colorAbsentee" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="absentee_trend_ctq"
                    stroke="#ff4d4d"
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAbsentee)"
                    dot={{ stroke: '#ff4d4d', strokeWidth: 1, fill: '#fff', r: containerWidth < 500 ? 3 : 4 }}
                    activeDot={{ r: containerWidth < 500 ? 5 : 6, stroke: '#ff4d4d', strokeWidth: 2 }}
                >
                    <LabelList
                        dataKey="absentee_trend_ctq"
                        position="top"
                        fontSize={labelFontSize}
                        fill="#333"
                        offset={5}
                        formatter={(value: number) => value > 0 ? `${value}%` : ''}
                    />
                </Area>
            </AreaChart>
        </ResponsiveContainer>
    );
  }

  return (
    <div 
      id="absentee-chart-container"
      className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4"
      style={{ minWidth: '300px' }}
    >
      <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
        Absenteeism Rate Trend
      </h2>
      {renderChartContent()}
    </div>
  );
};

export default Absenteeism;