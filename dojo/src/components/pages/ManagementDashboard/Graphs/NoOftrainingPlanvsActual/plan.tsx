import React, { useEffect, useState } from "react";
import BarChart from "../../Barchart/barchart";
import axios from "axios";

interface TrainingData {
  id: number;
  month_year: string;
  new_operators_joined: number;
  new_operators_trained: number;
  training_plans: number;
  trainings_actual: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const Plan: React.FC = () => {
  const [plannedData, setPlannedData] = useState<number[]>([]);
  const [actualData, setActualData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get<TrainingData[]>(`${API_BASE_URL}/chart/training-plans/`);
        //  console.log("Fetched Planned Data:", response.data);    
        if (response.data && response.data.length > 0) {
          // Sort data by month
          const sortedData = response.data.sort((a, b) => 
            new Date(a.month_year).getTime() - new Date(b.month_year).getTime()
          );

          // Format labels as 'Aug 25' (short month + 2-digit year)
          const monthLabels = sortedData.map(item => {
            const date = new Date(item.month_year);
            const monthShort = date.toLocaleString('default', { month: 'short' });
            const yearShort = date.getFullYear().toString().slice(-2);
            return `${monthShort} ${yearShort}`;
          });

          // Extract planned and actual training numbers
          const planned = sortedData.map(item => item.training_plans);
          const actual = sortedData.map(item => item.trainings_actual);

          setLabels(monthLabels);
          setPlannedData(planned);
          setActualData(actual);
        } else {
          // Handle empty response
          setLabels(["No data"]);
          setPlannedData([0]);
          setActualData([0]);
        }
      } catch (err) {
        console.error("Error fetching training data:", err);
        setError("Failed to load training data");
        setLabels(["Error"]);
        setPlannedData([0]);
        setActualData([0]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  const title = "No of Trainings Plan vs Actual";
  
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="w-full h-36 flex items-center justify-center">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : error ? (
          <div className="w-full h-36 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="w-full h-36">
            <BarChart
              labels={labels}
              data1={plannedData}
              data2={actualData}
              groupLabels={["Plan", "Actual"]}  
              title=""
              color1="rgba(52, 152, 219, 0.8)"
              color2="rgba(13, 32, 160, 0.8)" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;