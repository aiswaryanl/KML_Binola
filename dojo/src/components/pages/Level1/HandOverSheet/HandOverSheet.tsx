import React, { useState, useMemo, useEffect } from "react";

// --- Interfaces for our data structures ---

interface ApiScoreData {
  id: number;
  employee_details: string; // e.g., "John Doe (EMP123)"
  skill_name: string;
  marks: number;
  percentage: number;
  created_at: string;
}

interface EmployeeMasterData {
  emp_id: string;
  first_name: string;
  last_name: string;
  department_name: string;
  date_of_joining: string;
}

interface HandoverFormData {
  name: string;
  industrialExperience: string;
  kpaplExperience: string;
  currentDepartment: string;
  distributedDepartment: string;
  handoverDate: string;
  contractorName: string;
  pAndAName: string;
  qaHodName: string;
  isTrainingCompleted: "yes" | "no" | "";
  gojoInchargeName: string;
}

interface HandOverFormModalProps {
  scoreData: ApiScoreData;
  departments: string[];
  onClose: () => void;
  onSubmit: (formData: HandoverFormData) => void;
  employeeDetails: EmployeeMasterData | null;
  isLoading: boolean;
  error: string | null;
  initialFormData: HandoverFormData | null;
}

// --- Modal Component ---
const HandOverFormModal: React.FC<HandOverFormModalProps> = ({
  scoreData,
  departments,
  onClose,
  onSubmit,
  employeeDetails,
  isLoading,
  error,
  initialFormData,
}) => {
  const [formData, setFormData] = useState<HandoverFormData>(
    initialFormData || {
      name: "",
      industrialExperience: "",
      kpaplExperience: "",
      currentDepartment: "",
      distributedDepartment: "",
      handoverDate: new Date().toISOString().split("T")[0],
      contractorName: "",
      pAndAName: "",
      qaHodName: "",
      isTrainingCompleted: "",
      gojoInchargeName: "",
    }
  );

  // When initialFormData changes (switching employee), reset form
  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);

  useEffect(() => {
    if (employeeDetails && !initialFormData) {
      setFormData((prevData) => ({
        ...prevData,
        name: `${employeeDetails.first_name} ${employeeDetails.last_name}`,
        requiredDepartment: employeeDetails.department_name || "N/A",
      }));
    }
  }, [employeeDetails, initialFormData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const modalStyles: { [key: string]: React.CSSProperties } = {
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(17, 24, 39, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    content: {
      backgroundColor: "white",
      padding: "30px 40px",
      borderRadius: "20px",
      width: "90%",
      maxWidth: "700px",
      minHeight: "400px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    },
    closeButton: {
      position: "absolute",
      top: "15px",
      right: "20px",
      background: "transparent",
      border: "none",
      fontSize: "28px",
      cursor: "pointer",
      color: "#9ca3af",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "20px",
    },
    title: { fontSize: "22px", fontWeight: "700", color: "#1f2937" },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "25px",
    },
    formField: { display: "flex", flexDirection: "column" as const },
    label: {
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
    },
    input: {
      padding: "10px 12px",
      fontSize: "14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    readOnlyInput: {
      backgroundColor: "#f3f4f6",
      cursor: "not-allowed",
      color: "#4b5563",
    },
    submitButton: {
      gridColumn: "1 / -1",
      marginTop: "20px",
      padding: "12px 20px",
      fontSize: "16px",
      fontWeight: "600",
      color: "#ffffff",
      background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 10px rgba(124, 58, 237, 0.2)",
    },
    centeredStatus: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "#6b7280",
    },
  };

  return (
    <div style={modalStyles.backdrop} onClick={onClose}>
      <div
        style={modalStyles.content}
        onClick={(e) => e.stopPropagation()} // Prevent closing if inside form
      >
        <button style={modalStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Dojo Handover Form</h2>
        </div>

        {isLoading && (
          <div style={modalStyles.centeredStatus}>
            Loading Employee Details...
          </div>
        )}
        {error && (
          <div style={{ ...modalStyles.centeredStatus, color: "red" }}>
            {error}
          </div>
        )}
        {!isLoading && !error && employeeDetails && (
          <form onSubmit={handleSubmit}>
            <div style={modalStyles.formGrid}>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  style={{
                    ...modalStyles.input,
                    ...modalStyles.readOnlyInput,
                  }}
                  readOnly
                />
              </div>
              {/* <div style={modalStyles.formField}>
                <label style={modalStyles.label}>Current Department</label>
                <input
                  type="text"
                  name="requiredDepartment"
                  value={formData.currentDepartment}
                  style={{
                    ...modalStyles.input,
                    ...modalStyles.readOnlyInput,
                  }}
                  readOnly
                />
              </div> */}
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>
                  Industrial Experience / Dept
                </label>
                <input
                  type="text"
                  name="industrialExperience"
                  value={formData.industrialExperience}
                  onChange={handleChange}
                  style={modalStyles.input}
                  required
                />
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>
                  KPAPL Experience / Dept
                </label>
                <input
                  type="text"
                  name="kpaplExperience"
                  value={formData.kpaplExperience}
                  onChange={handleChange}
                  style={modalStyles.input}
                  required
                />
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>
                  Distributed Department (Post-Dojo)
                </label>
                <select
                  name="distributedDepartment"
                  value={formData.distributedDepartment}
                  onChange={handleChange}
                  style={modalStyles.input as React.CSSProperties}
                  required
                >
                  <option value="" disabled>
                    Select a department
                  </option>
                  {departments.map((deptName) => (
                    <option key={deptName} value={deptName}>
                      {deptName}
                    </option>
                  ))}
                </select>
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>Date</label>
                <input
                  type="date"
                  name="handoverDate"
                  value={formData.handoverDate}
                  onChange={handleChange}
                  style={modalStyles.input}
                  required
                />
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>Contractor Name</label>
                <input
                  type="text"
                  name="contractorName"
                  value={formData.contractorName}
                  onChange={handleChange}
                  style={modalStyles.input}
                  required
                />
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>P & A Name</label>
                <input
                  type="text"
                  name="pAndAName"
                  value={formData.pAndAName}
                  onChange={handleChange}
                  style={modalStyles.input}
                  required
                />
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>QA HOD Name</label>
                <input
                  type="text"
                  name="qaHodName"
                  value={formData.qaHodName}
                  onChange={handleChange}
                  style={modalStyles.input}
                  required
                />
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>Is Training Completed?</label>
                <select
                  name="isTrainingCompleted"
                  value={formData.isTrainingCompleted}
                  onChange={handleChange}
                  style={modalStyles.input as React.CSSProperties}
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div style={modalStyles.formField}>
                <label style={modalStyles.label}>Dojo Incharge Name</label>
                <input
                  type="text"
                  name="gojoInchargeName"
                  value={formData.gojoInchargeName}
                  onChange={handleChange}
                  style={modalStyles.input}
                  required
                />
              </div>
            </div>
            <button type="submit" style={modalStyles.submitButton}>
              Submit Handover
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const HandOverSheet: React.FC = () => {
  const [scores, setScores] = useState<ApiScoreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedScore, setSelectedScore] = useState<ApiScoreData | null>(null);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] =
    useState<EmployeeMasterData | null>(null);
  const [initialFormData, setInitialFormData] =
    useState<HandoverFormData | null>(null);

  // Fetch initial lists (scores and all departments for dropdown)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [scoresResponse, deptsResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/scores/passed/level-1/"),
          fetch("http://127.0.0.1:8000/departments/"),
        ]);

        if (!scoresResponse.ok)
          throw new Error(`Scores API failed: ${scoresResponse.status}`);
        if (!deptsResponse.ok)
          throw new Error(`Departments API failed: ${deptsResponse.status}`);

        const scoresData: ApiScoreData[] = await scoresResponse.json();
        const deptsData: { department_name: string }[] =
          await deptsResponse.json();

        setScores(scoresData);
        setDepartments(deptsData.map((dept) => dept.department_name));
        setError(null);
      } catch (err) {
        if (err instanceof Error)
          setError(`Failed to fetch data: ${err.message}`);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized calculations for filtering and sorting
  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    scores.forEach((score) => months.add(score.created_at.substring(0, 7)));
    return Array.from(months).sort().reverse();
  }, [scores]);

  useEffect(() => {
    if (uniqueMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(uniqueMonths[0]);
    }
  }, [uniqueMonths, selectedMonth]);

  const filteredEmployees = useMemo(() => {
    let employees = [...scores];
    if (selectedMonth && selectedMonth !== "all") {
      employees = employees.filter((emp) =>
        emp.created_at.startsWith(selectedMonth)
      );
    }
    if (searchTerm.trim() !== "") {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      employees = employees.filter(
        (emp) =>
          emp.employee_details.toLowerCase().includes(lowercasedSearchTerm) ||
          String(emp.id).includes(searchTerm)
      );
    }
    return employees.sort((a, b) => b.percentage - a.percentage);
  }, [scores, selectedMonth, searchTerm]);

  const handleOpenModal = async (score: ApiScoreData) => {
    setIsModalOpen(true);
    setSelectedScore(score);
    setIsModalLoading(true);
    setModalError(null);
    setSelectedEmployeeDetails(null);

    try {
      const empId =
        score.employee_details.split("(").pop()?.replace(")", "") || null;

      if (!empId) {
        throw new Error(
          `Could not parse Employee ID from the string: "${score.employee_details}"`
        );
      }

      // Fetch employee details
      const response = await fetch(
        `http://127.0.0.1:8000/mastertable/${empId}/`
      );
      if (!response.ok) {
        if (response.status === 404)
          throw new Error(
            `Employee with ID '${empId}' not found in Master Table.`
          );
        throw new Error(
          `Failed to fetch employee details (Status: ${response.status})`
        );
      }
      const data: EmployeeMasterData = await response.json();
      setSelectedEmployeeDetails(data);

      // Fetch existing handover data if any
      const handResp = await fetch(
        `http://127.0.0.1:8000/handovers/employee/${empId}/`
      );
      if (handResp.ok) {
        const handData = await handResp.json();
        setInitialFormData({
          name: `${data.first_name} ${data.last_name}`,
          industrialExperience: handData.industrial_experience || "",
          kpaplExperience: handData.kpapl_experience || "",
          currentDepartment:
            handData.required_department_at_handover ||
            data.department_name ||
            "",
          distributedDepartment:
            handData.distributed_department_after_dojo?.department_name || "",
          handoverDate:
            handData.handover_date ||
            new Date().toISOString().split("T")[0],
          contractorName: handData.contractor_name || "",
          pAndAName: handData.p_and_a_name || "",
          qaHodName: handData.qa_hod_name || "",
          isTrainingCompleted: handData.is_training_completed ? "yes" : "no",
          gojoInchargeName: handData.gojo_incharge_name || "",
        });
      } else {
        // No handover exists yet (new)
        setInitialFormData({
          name: `${data.first_name} ${data.last_name}`,
          industrialExperience: "",
          kpaplExperience: "",
          currentDepartment: data.department_name || "",
          distributedDepartment: "",
          handoverDate: new Date().toISOString().split("T")[0],
          contractorName: "",
          pAndAName: "",
          qaHodName: "",
          isTrainingCompleted: "",
          gojoInchargeName: "",
        });
      }
    } catch (err) {
      if (err instanceof Error) setModalError(err.message);
      else setModalError("An unknown error occurred.");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScore(null);
    setSelectedEmployeeDetails(null);
    setModalError(null);
    setInitialFormData(null);
  };

  const handleFormSubmit = async (formData: HandoverFormData) => {
    if (!selectedEmployeeDetails) {
      alert("Error: Employee details are not loaded. Cannot submit.");
      return;
    }

    const payload = {
      emp_id: selectedEmployeeDetails.emp_id,
      industrial_experience: formData.industrialExperience,
      kpapl_experience: formData.kpaplExperience,
      required_department_at_handover: formData.currentDepartment,
      distributed_department_name: formData.distributedDepartment,
      handover_date: formData.handoverDate,
      contractor_name: formData.contractorName,
      p_and_a_name: formData.pAndAName,
      qa_hod_name: formData.qaHodName,
      is_training_completed: formData.isTrainingCompleted,
      gojo_incharge_name: formData.gojoInchargeName,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/handovers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          Object.values(errorData).flat().join(" ") ||
          `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }
      alert("Handover form submitted successfully!");
      handleCloseModal();
    } catch (error) {
      if (error instanceof Error) alert(`Error: ${error.message}`);
      else alert("An unknown error occurred during submission.");
    }
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const formatMonthForDisplay = (monthStr: string): string => {
    const [year, month] = monthStr.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };
  const getScoreBarWidth = (percentage: number): string => `${percentage}%`;

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#ffffffff",
      padding: "40px 20px",
    },
    header: { textAlign: "center" as const, marginBottom: "50px" },
    title: {
      fontSize: "32px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "10px",
    },
    subtitle: { fontSize: "18px", color: "#6b7280", fontWeight: "400" },
    controlsContainer: {
      maxWidth: "1000px",
      margin: "0 auto 40px",
      display: "flex",
      gap: "20px",
      justifyContent: "space-between",
    },
    searchInput: {
      flex: 1,
      padding: "12px 16px",
      fontSize: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      outline: "none",
      transition: "all 0.2s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    monthSelect: {
      padding: "12px 16px",
      fontSize: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      backgroundColor: "white",
      cursor: "pointer",
      outline: "none",
      transition: "all 0.2s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    resultsContainer: { maxWidth: "1000px", margin: "0 auto" },
    noResults: {
      textAlign: "center",
      padding: "50px",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      color: "#6b7280",
      fontSize: "18px",
      boxShadow:
        "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    },
    resultCard: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "30px",
      marginBottom: "20px",
      boxShadow:
        "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      border: "1px solid #f3f4f6",
      display: "flex",
      alignItems: "center",
      gap: "25px",
      transition: "all 0.3s ease",
    },
    resultCardHover: {
      boxShadow: "0 10px 25px rgba(124, 58, 237, 0.1)",
      borderColor: "#e0e7ff",
      transform: "translateY(-2px)",
    },
    rankCircle: {
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "700",
      flexShrink: 0,
      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
    },
    mainInfo: { flex: 1 },
    name: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "8px",
    },
    details: {
      display: "flex",
      gap: "15px",
      color: "#6b7280",
      fontSize: "14px",
      marginBottom: "15px",
      flexWrap: "wrap" as const,
    },
    scoreSection: { marginTop: "15px" },
    scoreBar: {
      width: "100%",
      height: "10px",
      backgroundColor: "#f3f4f6",
      borderRadius: "10px",
      overflow: "hidden",
      marginBottom: "8px",
    },
    scoreProgress: {
      height: "100%",
      background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
      borderRadius: "10px",
      transition: "width 1s ease",
      boxShadow: "0 2px 4px rgba(124, 58, 237, 0.2)",
    },
    scoreText: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "13px",
      color: "#6b7280",
    },
    badge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: "#f3f4f6",
      color: "#4b5563",
      border: "1px solid #e5e7eb",
    },
    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
    detailsButton: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#ffffff",
      background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 10px rgba(124, 58, 237, 0.2)",
    },
  };

  if (loading)
    return (
      <div
        style={{ ...styles.container, textAlign: "center", fontSize: "20px" }}
      >
        Loading...
      </div>
    );
  if (error)
    return (
      <div
        style={{
          ...styles.container,
          textAlign: "center",
          fontSize: "20px",
          color: "red",
        }}
      >
        Error: {error}
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Level 1 Passed Users</h1>
        <p style={styles.subtitle}>Employee Assessment Outcomes</p>
      </div>

      <div style={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Search by Employee ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={styles.monthSelect}
        >
          <option value="all">All Months</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {formatMonthForDisplay(month)}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.resultsContainer}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((score, index) => (
            <div
              key={score.id}
              style={{
                ...styles.resultCard,
                ...(hoveredCard === score.id ? styles.resultCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(score.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.rankCircle}>{index + 1}</div>
              <div style={styles.mainInfo}>
                <h3 style={styles.name}>{score.employee_details}</h3>
                <div style={styles.details}>
                  <span>{score.skill_name}</span>
                  <span>•</span>
                  <span style={styles.badge}>{score.skill_name}</span>
                  <span>•</span>
                  <span>{formatDate(score.created_at)}</span>
                  <span>•</span>
                  <span style={styles.statusPill}>
                    <span>✓</span>
                    <span>Passed</span>
                  </span>
                </div>
                <div style={styles.scoreSection}>
                  <div style={styles.scoreBar}>
                    <div
                      style={{
                        ...styles.scoreProgress,
                        width: getScoreBarWidth(score.percentage),
                      }}
                    />
                  </div>
                  <div style={styles.scoreText}>
                    <span style={{ fontWeight: "600", color: "#4b5563" }}>
                      Score: {score.percentage.toFixed(1)}%
                    </span>
                    <span>Minimum Required: 80%</span>
                  </div>
                </div>
              </div>
              <button
                style={styles.detailsButton}
                onClick={() => handleOpenModal(score)}
              >
                Create Handover
              </button>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <p>No employees found matching your criteria.</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedScore && (
        <HandOverFormModal
          scoreData={selectedScore}
          departments={departments}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          isLoading={isModalLoading}
          error={modalError}
          employeeDetails={selectedEmployeeDetails}
          initialFormData={initialFormData}
        />
      )}
    </div>
  );
};

export default HandOverSheet;