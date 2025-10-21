// import React from 'react';
import LineGraph from '../../LineGraph/linegraph';
import React, { useState, useEffect } from 'react';


interface TrainingProps {
  hqId: string;
  factoryId: string;
  departmentId: string;
}


const Training: React.FC<TrainingProps> = ({ hqId, factoryId, departmentId }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [labels, setLabels] = useState<string[]>([]);
    const [data1, setData1] = useState<number[]>([]);
    const [data2, setData2] = useState<number[]>([]);

    // Sample data to use if API fails
    
    
    useEffect(() => {
        const fetchTrainingData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // --- DYNAMIC API CALL ---
                // 1. Base URL for the operators chart data
                const baseUrl = 'http://127.0.0.1:8000/chart/operators/';

                // 2. Build query parameters based on the selected filters
                const params = new URLSearchParams();
                if (hqId) params.append('hq', hqId);
                if (factoryId) params.append('factory', factoryId);
                if (departmentId) params.append('department', departmentId);

                // 3. Construct the final URL
                const apiUrl = `${baseUrl}?${params.toString()}`;

                // 4. Fetch data from the live API
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                const data = await response.json();

                // If the API returns no data, show an empty state or message
                if (!data || data.length === 0) {
                    setLabels([]);
                    setData1([]);
                    setData2([]);
                    // Optional: You could set a specific message here
                    // setError("No data available for the selected filters.");
                    return; // Exit the function early
                }

                // The rest of the logic is the same, just using the live 'data'
                const sortedData = [...data].sort((a, b) =>
                    new Date(a.month_year).getTime() - new Date(b.month_year).getTime()
                );

                const months = sortedData.map(item => {
                    const date = new Date(item.month_year);
                    const monthShort = date.toLocaleString('default', { month: 'short' });
                    const yearShort = date.getFullYear().toString().slice(-2);
                    return `${monthShort} ${yearShort}`;
                });
                
                // The serializer for this chart renames the fields
                const joined = sortedData.map(item => item.operators_joined);
                const trained = sortedData.map(item => item.operators_trained);
                
                setLabels(months);
                setData1(joined);
                setData2(trained);
                
            } catch (err: any) {
                console.error("Error fetching training data:", err);
                setError(`Failed to load data: ${err.message}`);
                // Clear out old data on error
                setLabels([]);
                setData1([]);
                setData2([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingData();
    }, [hqId, factoryId, departmentId]); // NEW: Dependency array ensures this runs on filter changes

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 text-sm mt-2">Loading data...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    <p className="text-sm text-gray-500">Showing sample data instead</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <div className="bg-white h-full flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 p-4 pb-2">Operators Training - Joined vs Trained</h3>
                <div className="flex-1 w-full px-2">
                    <LineGraph
                        labels={labels}
                        data1={data1} 
                        data2={data2}  
                        area={true}
                        showSecondLine={true}
                        label1="Operators Joined"
                        label2="Operators Trained"
                        line1Color="#4f46e5"
                        line2Color="#10b981"
                        area1Color="rgba(79, 70, 229, 0.1)"
                        area2Color="rgba(16, 185, 129, 0.1)"
                        height="100%"
                        maintainAspectRatio={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default Training;