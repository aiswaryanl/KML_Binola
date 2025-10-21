// import React, { useState, useEffect } from "react";

// interface Subtopic {
//   dataKey: string;
//   displayText: string;
// }

// interface CardProps {
//   subtopics: Subtopic[];
//   getUrl: string;
//   cardColors: string[];
// }

// interface ApiResponse {
//   current_month?: Array<{
//     [key: string]: any;
//   }>;
//   operator_trend?: Array<{
//     [key: string]: any;
//   }>;
//   buffer_trend?: Array<{
//     [key: string]: any;
//   }>;
//   absentee_trend?: Array<{
//     [key: string]: any;
//   }>;
//   attrition_trend?: Array<{
//     [key: string]: any;
//   }>;
// }

// const CardProps: React.FC<CardProps> = ({ subtopics, getUrl, cardColors }) => {
//   const [data, setData] = useState<Record<string, number>>({});
//   const [apiData, setApiData] = useState<ApiResponse>({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!getUrl) return;

//         const response = await fetch(getUrl);
//         const result: ApiResponse = await response.json();
//         setApiData(result);

//         if (result.current_month && result.current_month.length > 0) {
//           setData(result.current_month[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching card data:", error);
//       }
//     };

//     fetchData();
//   }, [getUrl]);

//   const getValue = (dataKey: string): number => {
//     if (data[dataKey] !== undefined) {
//       return data[dataKey] ?? 0;
//     }
//     if (dataKey.includes('operator')) {
//       return apiData.operator_trend?.[0]?.[dataKey] ?? 0;
//     }
//     if (dataKey.includes('buffer')) {
//       return apiData.buffer_trend?.[0]?.[dataKey] ?? 0;
//     }
//     if (dataKey.includes('absentee')) {
//       return apiData.absentee_trend?.[0]?.[dataKey] ?? 0;
//     }
//     if (dataKey.includes('attrition')) {
//       return apiData.attrition_trend?.[0]?.[dataKey] ?? 0;
//     }
//     return 0;
//   };

//   const getCardColor = (dataKey: string, index: number): string => {
//     if (dataKey === "operator_availability_ctq" || dataKey === "operator_required_ctq") {
//       const available = getValue("operator_availability_ctq");
//       const required = getValue("operator_required_ctq");
      
//       if (available === required) return "#12c53b";
//       if (available > required) return "#948dffff";
//       if (available / required >= 0.95) return "#e6e603";
//       return "#ee583e";
//     }
    
//     if (dataKey === "buffer_manpower_availability_ctq" || dataKey === "buffer_manpower_required_ctq") {
//       const available = getValue("buffer_manpower_availability_ctq");
//       const required = getValue("buffer_manpower_required_ctq");
      
//       if (available === required) return "#12c53b";
//       if (available > required) return "#948dffff";
//       if (available / required >= 0.95) return "#e6e603";
//       return "#ee583e";
//     }
    
//     return cardColors[index] || "#4CAF50";
//   };

//   return (
//     <div className="w-full mx-auto">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//         {subtopics.map((subtopic, index) => {
//           const value = getValue(subtopic.dataKey);
//           const backgroundColor = getCardColor(subtopic.dataKey, index);

//           return (
//             <div
//               key={subtopic.dataKey}
//               className="w-full aspect-[4/3] =rounded-lg shadow-md flex flex-col justify-center items-center text-white p-2"
//               style={{ backgroundColor }}
//             >
//               <span className="text-2xl md:text-3xl font-bold">{value}</span>
//               <span className="text-xs sm:text-sm mt-1 text-center">{subtopic.displayText}</span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CardProps;


import React from 'react';

// --- Interfaces ---

// This interface defines the shape of the data object passed from the parent.
// It should match the keys from your /advance-dashboard/ API endpoint.
interface CardData {
    [key: string]: any; // Allows indexing with a string (e.g., data[dataKey])
    total_stations: number;
    operators_required: number;
    operators_available: number;
    buffer_manpower_required: number;
    buffer_manpower_available: number;
}

// Defines the shape for a single card's configuration
interface Subtopic {
    dataKey: keyof CardData; // Ensures dataKey is a valid key of CardData
    displayText: string;
}

// Defines the component's props
interface Props {
    data: CardData | null;
    loading: boolean;
    error: string | null;
    subtopics: Subtopic[];
    cardColors: string[];
}

const CardProps: React.FC<Props> = ({ data, loading, error, subtopics, cardColors }) => {
    
    // This function contains the business logic for dynamic card colors.
    // It's updated to use the new, simpler data keys.
    const getCardColor = (dataKey: keyof CardData, index: number): string => {
        // If there's no data, return the default color
        if (!data) {
            return cardColors[index] || '#333';
        }

        // Logic for Operator Availability card color
        if (dataKey === "operators_available" || dataKey === "operators_required") {
            const available = data.operators_available;
            const required = data.operators_required;
            
            // Handle edge case where required is 0
            if (required === 0) return available === 0 ? "#12c53b" : "#948dffff"; // Green if 0/0, Surplus if >0/0
            
            if (available === required) return "#12c53b"; // Green (Perfect)
            if (available > required) return "#948dffff";   // Purple (Surplus)
            if (available / required >= 0.95) return "#e6e603"; // Yellow (Warning)
            return "#ee583e"; // Red (Critical)
        }
        
        // Logic for Buffer Manpower card color
        if (dataKey === "buffer_manpower_available" || dataKey === "buffer_manpower_required") {
            const available = data.buffer_manpower_available;
            const required = data.buffer_manpower_required;

            if (required === 0) return available === 0 ? "#12c53b" : "#948dffff";

            if (available === required) return "#12c53b"; // Green
            if (available > required) return "#948dffff"; // Purple
            if (available / required >= 0.95) return "#e6e603"; // Yellow
            return "#ee583e"; // Red
        }
        
        // Fallback to the default color provided in props
        return cardColors[index] || "#4CAF50";
    };

    // --- RENDER LOGIC ---

    // 1. Loading State
    if (loading) {
        return (
            <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {subtopics.map((subtopic) => (
                    <div
                        key={subtopic.dataKey}
                        className="w-full aspect-[4/3] rounded-lg bg-gray-200 animate-pulse flex flex-col justify-center items-center p-2"
                    >
                        <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className="w-full mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow col-span-full">
                <p className="font-bold text-center">Could not load card data.</p>
                <p className="text-sm text-center">{error}</p>
            </div>
        );
    }
    
    // 3. No Data State
    if (!data) {
        return (
            <div className="w-full mx-auto p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg shadow col-span-full">
                <p className="font-bold text-center">No data available for the selected filters.</p>
            </div>
        );
    }

    // 4. Success State
    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {subtopics.map((subtopic, index) => {
                    // Get value directly from the data prop
                    const value = data[subtopic.dataKey] ?? "N/A";
                    // Get color using the preserved logic function
                    const backgroundColor = getCardColor(subtopic.dataKey, index);

                    return (
                        <div
                            key={subtopic.dataKey}
                            className="w-full aspect-[4/3] rounded-lg shadow-md flex flex-col justify-center items-center text-white p-2"
                            style={{ backgroundColor }}
                        >
                            <span className="text-2xl md:text-3xl font-bold">{value}</span>
                            <span className="text-xs sm:text-sm mt-1 text-center font-medium">{subtopic.displayText}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardProps;