import React from "react";
import styles from "./table.module.css";

interface TableProps {
  headers: string[];
  rows: string[];
}

const TableComponent: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.headerRow}>
            {headers.map((header, index) => (
              <th key={index} className={styles.th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {rows.map((row, index) => (
            <tr key={index} className={styles.row}>
              <td className={styles.td}>{row}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
