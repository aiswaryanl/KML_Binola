// import React from "react";
// import styles from "./trainingcard.module.css";

// interface BoxProps {
//   number: number;
//   text: string;
//   bgColor: string;
// }

// interface TrainingSummaryCardProps {
//   title: string;
//   data: BoxProps[];
// }

// const TrainingSummaryCard: React.FC<TrainingSummaryCardProps> = ({ title, data }) => {
//   return (
//     <div className={styles.card}>
//       <h2 className={styles.heading}>{title}</h2>
//       <div className={styles.boxContainer}>
//         {data.map((item, index) => (
//           <div
//             key={index}
//             className={styles.box}
//             style={{ backgroundColor: item.bgColor }}
//           >
//             <span className={styles.number}>{item.number}</span>
//             <span className={styles.text}>{item.text}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrainingSummaryCard;


import React, { useState, useEffect } from "react";
import styles from "./trainingcard.module.css";

// interface BoxData {
//   number: number;
//   text: string;
// }

interface TrainingSummaryCardProps {
  title: string;
  getUrl: string;
  subtopics: {
    dataKey: string;
    displayText: string;
  }[];
  cardColors: string[];
}

const TrainingSummaryCard: React.FC<TrainingSummaryCardProps> = ({ 
  title, 
  getUrl,
  subtopics,
  cardColors 
}) => {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getUrl);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getUrl]);

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.boxContainer}>
        {subtopics.map((subtopic, index) => (
          <div
            key={subtopic.dataKey}
            className={styles.box}
            style={{ backgroundColor: cardColors[index] }}
          >
            <span className={styles.number}>{data[subtopic.dataKey] || 0}</span>
            <span className={styles.text}>{subtopic.displayText}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingSummaryCard;


