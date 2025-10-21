import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Settings } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface Level {
  level_id: number;
  level_name: string;
}

interface Department {
  department_id: number;
  department_name: string;
  lines?: Array<{
    line_id: number;
    line_name: string;
    department: number;
    sublines: Array<{
      subline_id: number;
      subline_name: string;
      line: number;
      stations: Array<{
        station_id: number;
        station_name: string;
        subline: number;
      }>;
    }>;
  }>;
}

interface Station {
  station_id: number;
  station_name: string;
}

interface Topic {
  id?: number;
  slno: number;
  cycle_topics: string;
  level: number;
  department: number;
  station: number | null;
  is_active: boolean;
}

interface SubTopic {
  id?: number;
  topic: number;
  sub_topic: string;
  score_required: number;
  is_active: boolean;
}

interface Day {
  id?: number;
  day_name: string;
  sequence_order: number;
  level: number;
  department: number;
  station: number | null;
  is_active: boolean;
}

interface PassingCriteria {
  id?: number;
  level: number;
  department: number;
  station: number | null;
  passing_percentage: number;
  is_active: boolean;
}

const TenCyclePage: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [passingPercentage, setPassingPercentage] = useState(60);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<{ [topicIndex: number]: SubTopic[] }>({});
  const [days, setDays] = useState<Day[]>([]);
  const [editingTopic, setEditingTopic] = useState<number | null>(null);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editingSubtopic, setEditingSubtopic] = useState<{ topicIndex: number; subtopicIndex: number } | null>(null);

  const [deletedTopicIds, setDeletedTopicIds] = useState<number[]>([]);
  const [deletedSubtopicIds, setDeletedSubtopicIds] = useState<number[]>([]);
  const [deletedDayIds, setDeletedDayIds] = useState<number[]>([]);


  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch(`${API_BASE_URL}/departments/`);
        if (res.ok) {
          const data = await res.json();
          setDepartments(data || []);
        }
      } catch (e) {
        console.error("Error fetching departments:", e);
      }
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    async function fetchLevels() {
      try {
        const res = await fetch(`${API_BASE_URL}/levels/`);
        if (res.ok) {
          const data = await res.json();
          setLevels(data || []);
        }
      } catch (e) {
        console.error("Error fetching levels:", e);
      }
    }
    fetchLevels();
  }, []);

  // Extract stations from selected department
  // useEffect(() => {
  //   if (!selectedDepartment) {
  //     setStations([]);
  //     return;
  //   }
    
  //   const dept = departments.find((d) => d.department_id === selectedDepartment);
  //   if (!dept || !dept.lines) {
  //     setStations([]);
  //     return;
  //   }

  //   // Flatten stations from lines > sublines > stations
  //   const flattenedStations: Station[] = [];
  //   dept.lines.forEach((line) => {
  //     line.sublines.forEach((subline) => {
  //       subline.stations.forEach((station) => {
  //         flattenedStations.push({
  //           station_id: station.station_id,
  //           station_name: station.station_name,
  //         });
  //       });
  //     });
  //   });
  //   setStations(flattenedStations);
  // }, [selectedDepartment, departments]);
  useEffect(() => {
  if (!selectedDepartment) {
    console.log("No department selected → clearing stations");
    setStations([]);
    return;
  }

  console.log("Fetching stations for department:", selectedDepartment);

  fetch(`http://127.0.0.1:8000/hierarchy/by-department/?department_id=${selectedDepartment}`)
    .then(res => res.json())
    .then(data => {
      console.log("API response:", data);

      // stations directly under the department
      const deptStations = data.stations || [];
      console.log("Direct dept stations:", deptStations);

      // collect stations under lines/sublines
      const nestedStations: Station[] = [];
      if (data.lines?.length) {
        data.lines.forEach((line: any) => {
          line.sublines?.forEach((subline: any) => {
            subline.stations?.forEach((station: any) => {
              nestedStations.push({
                station_id: station.station_id,
                station_name: station.station_name,
              });
            });
          });
          line.stations?.forEach((station: any) => {
            nestedStations.push({
              station_id: station.station_id,
              station_name: station.station_name,
            });
          });
        });
      }

      console.log("Nested stations:", nestedStations);

      // combine both direct and nested stations
      const allStations = [...deptStations, ...nestedStations];
      console.log("Final stations list:", allStations);

      setStations(allStations);
    })
    .catch(err => {
      console.error("Error fetching stations:", err);
      setStations([]);
    });
}, [selectedDepartment]);


  const fetchConfiguration = async (
    levelId: number,
    departmentId: number,
    stationId?: number | null
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        level_id: levelId.toString(),
        department_id: departmentId.toString(),
      });
      
      if (stationId) {
        params.append('station_id', stationId.toString());
      }

      const daysRes = await fetch(`${API_BASE_URL}/tencycle-days/get-configuration/?${params}`);
      if (daysRes.ok) {
        const daysData = await daysRes.json();
        setDays(daysData || []);
      }

      const topicsRes = await fetch(`${API_BASE_URL}/tencycle-topics/get-configuration/?${params}`);
      if (topicsRes.ok) {
        const topicsData = await topicsRes.json();
        setTopics(topicsData || []);
        

        const subtopicsMap: { [topicIndex: number]: SubTopic[] } = {};
        for (let i = 0; i < topicsData.length; i++) {
          const topic = topicsData[i];
          try {
            const subtopicsRes = await fetch(`${API_BASE_URL}/tencycle-topics/${topic.id}/subtopics/`);
            if (subtopicsRes.ok) {
              const subtopicsData = await subtopicsRes.json();
              subtopicsMap[i] = subtopicsData || [];
            }
          } catch (e) {
            console.error(`Error fetching subtopics for topic ${topic.id}:`, e);
            subtopicsMap[i] = [];
          }
        }
        setSubtopics(subtopicsMap);
      }

      const criteriaRes = await fetch(`${API_BASE_URL}/tencycle-passingcriteria/get-configuration/?${params}`);
      if (criteriaRes.ok) {
        const criteriaData = await criteriaRes.json();
        setPassingPercentage(criteriaData?.passing_percentage || 60);
      } else {
        setPassingPercentage(60);
      }

    } catch (e) {
      console.error("Error fetching configuration", e);
      setDays([]);
      setTopics([]);
      setSubtopics({});
      setPassingPercentage(60);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (departmentId: number) => {
    setSelectedDepartment(departmentId);
    setSelectedStation(null);
    setSelectedLevel(null);
    resetConfiguration();
  };

  const handleStationChange = (stationId: number) => {
    setSelectedStation(stationId);
    setSelectedLevel(null);
    resetConfiguration();
  };

  const handleLevelChange = (levelId: number) => {
    setSelectedLevel(levelId);
    if (selectedDepartment && selectedStation) {
      fetchConfiguration(levelId, selectedDepartment, selectedStation);
    }
  };

  const resetConfiguration = () => {
    setDays([]);
    setTopics([]);
    setSubtopics({});
    setPassingPercentage(60);
    // Clear editing states
    setEditingDay(null);
    setEditingTopic(null);
    setEditingSubtopic(null);
  };

  // Topics management
  const addTopic = () => {
    if (!selectedLevel || !selectedDepartment || !selectedStation) return;
    
    const newTopic: Topic = {
      slno: topics.length + 1,
      cycle_topics: "",
      level: selectedLevel,
      department: selectedDepartment,
      station: selectedStation,
      is_active: true,
    };
    setTopics([...topics, newTopic]);
    setSubtopics({ ...subtopics, [topics.length]: [] });
    setEditingTopic(topics.length);
  };

  const updateTopic = (index: number, field: keyof Topic, value: any) => {
    const tmp = [...topics];
    tmp[index] = { ...tmp[index], [field]: value };
    setTopics(tmp);
  };

  const deleteTopic = (index: number) => {
  const topicToDelete = topics[index];
  if (topicToDelete.id) {
    setDeletedTopicIds((prev) => [...prev, topicToDelete.id!]);

    // track all related subtopics ids for deletion
    const subtopicsForTopic = subtopics[index] || [];
    const subtopicIdsToDelete = subtopicsForTopic
      .filter((st) => st.id !== undefined)
      .map((st) => st.id!) 
    setDeletedSubtopicIds((prev) => [...prev, ...subtopicIdsToDelete]);
  }

  const tmp = topics.filter((_, i) => i !== index);
  tmp.forEach((t, i) => (t.slno = i + 1));
  setTopics(tmp);

  // Remove subtopics for this topic and reindex
  const newSubtopics: { [topicIndex: number]: SubTopic[] } = {};
  Object.keys(subtopics).forEach((key) => {
    const idx = parseInt(key);
    if (idx < index) {
      newSubtopics[idx] = subtopics[idx];
    } else if (idx > index) {
      newSubtopics[idx - 1] = subtopics[idx];
    }
  });
  setSubtopics(newSubtopics);

  setEditingTopic(null); 
};


  // Subtopics management
  const addSubtopic = (topicIndex: number) => {
    const newSubtopic: SubTopic = {
      topic: topicIndex, 
      sub_topic: "",
      score_required: 1,
      is_active: true,
    };
    const currentSubtopics = subtopics[topicIndex] || [];
    setSubtopics({
      ...subtopics,
      [topicIndex]: [...currentSubtopics, newSubtopic]
    });
    setEditingSubtopic({ topicIndex, subtopicIndex: currentSubtopics.length });
  };

  const updateSubtopic = (topicIndex: number, subtopicIndex: number, field: keyof SubTopic, value: any) => {
    const currentSubtopics = [...(subtopics[topicIndex] || [])];
    currentSubtopics[subtopicIndex] = { ...currentSubtopics[subtopicIndex], [field]: value };
    setSubtopics({
      ...subtopics,
      [topicIndex]: currentSubtopics
    });
  };

  const deleteSubtopic = (topicIndex: number, subtopicIndex: number) => {
  const subtopicToDelete = subtopics[topicIndex]?.[subtopicIndex];
  if (subtopicToDelete?.id) {
    setDeletedSubtopicIds((prev) => [...prev, subtopicToDelete.id]);
  }

  const currentSubtopics = (subtopics[topicIndex] || []).filter((_, i) => i !== subtopicIndex);
  setSubtopics({
    ...subtopics,
    [topicIndex]: currentSubtopics,
  });
  setEditingSubtopic(null); 
};


  // Days management
  const addDay = () => {
    if (!selectedLevel || !selectedDepartment || !selectedStation) return;
    
    const newDay: Day = {
      day_name: `Day ${days.length + 1}`,
      sequence_order: days.length + 1,
      level: selectedLevel,
      department: selectedDepartment,
      station: selectedStation,
      is_active: true,
    };
    setDays([...days, newDay]);
    setEditingDay(days.length);
  };

  const updateDay = (index: number, field: keyof Day, value: any) => {
    const tmp = [...days];
    tmp[index] = { ...tmp[index], [field]: value };
    setDays(tmp);
  };

  const deleteDay = (index: number) => {
  const dayToDelete = days[index];
  if (dayToDelete.id) {
    setDeletedDayIds((prev) => [...prev, dayToDelete.id!]);
  }
  const tmp = days.filter((_, i) => i !== index);
  tmp.forEach((d, i) => (d.sequence_order = i + 1));
  setDays(tmp);
  setEditingDay(null); // Clear editing state
};


  const saveConfiguration = async () => {
  if (!selectedLevel || !selectedDepartment || !selectedStation) {
    alert("Please select Department, Station, and Level");
    return;
  }
  if (topics.length === 0) {
    alert("Add at least one topic.");
    return;
  }
  if (days.length === 0) {
    alert("Add at least one day.");
    return;
  }

  setLoading(true);
  try {
    
    for (const id of deletedSubtopicIds) {
      await fetch(`${API_BASE_URL}/tencycle-subtopics/${id}/`, { method: "DELETE" });
    }
    setDeletedSubtopicIds([]);

    for (const id of deletedTopicIds) {
      await fetch(`${API_BASE_URL}/tencycle-topics/${id}/`, { method: "DELETE" });
    }
    setDeletedTopicIds([]);

    for (const id of deletedDayIds) {
      await fetch(`${API_BASE_URL}/tencycle-days/${id}/`, { method: "DELETE" });
    }
    setDeletedDayIds([]);

    // Save passing criteria (use PATCH if id exists, else POST)
    const criteriaPayload = {
      level: selectedLevel,
      department: selectedDepartment,
      station: selectedStation,
      passing_percentage: passingPercentage,
      is_active: true,
    };

    await fetch(`${API_BASE_URL}/tencycle-passingcriteria/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(criteriaPayload),
    });

    // Save days - update or create
    for (const day of days) {
      const dayPayload = {
        level: selectedLevel,
        department: selectedDepartment,
        station: selectedStation,
        day_name: day.day_name,
        sequence_order: day.sequence_order,
        is_active: day.is_active,
      };

      if (day.id) {
        await fetch(`${API_BASE_URL}/tencycle-days/${day.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dayPayload),
        });
      } else {
        await fetch(`${API_BASE_URL}/tencycle-days/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dayPayload),
        });
      }
    }

    // Save topics and subtopics
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const topicPayload = {
        level: selectedLevel,
        department: selectedDepartment,
        station: selectedStation,
        slno: topic.slno,
        cycle_topics: topic.cycle_topics,
        is_active: topic.is_active,
      };

      let topicResponse;
      if (topic.id) {
        topicResponse = await fetch(`${API_BASE_URL}/tencycle-topics/${topic.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(topicPayload),
        });
      } else {
        topicResponse = await fetch(`${API_BASE_URL}/tencycle-topics/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(topicPayload),
        });
      }

      if (topicResponse.ok) {
        const savedTopic = await topicResponse.json();
        const topicSubtopics = subtopics[i] || [];

        // Save subtopics (update or create)
        for (const subtopic of topicSubtopics) {
          const subtopicPayload = {
            topic: savedTopic.id,
            sub_topic: subtopic.sub_topic,
            score_required: subtopic.score_required,
            is_active: subtopic.is_active,
          };

          if (subtopic.id) {
            await fetch(`${API_BASE_URL}/tencycle-subtopics/${subtopic.id}/`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(subtopicPayload),
            });
          } else {
            await fetch(`${API_BASE_URL}/tencycle-subtopics/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(subtopicPayload),
            });
          }
        }
      }
    }

    alert("Configuration saved successfully!");
    fetchConfiguration(selectedLevel, selectedDepartment, selectedStation);

  } catch (e) {
    console.error("Save error:", e);
    alert("Save error occurred");
  } finally {
    setLoading(false);
  }
};


  const resetToDefaults = () => {
    resetConfiguration();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-6">
            <div className="flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  10 Cycle Method Configuration
                </h1>
                <p className="text-blue-100">
                  Configure topics, subtopics, days, and passing criteria
                </p>
              </div>
            </div>
          </div>

          {/* Selections */}
          <div className="p-8 bg-gray-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Department
              </label>
              <select
                className="w-full p-2 border rounded"
                value={selectedDepartment ?? ""}
                onChange={(e) => handleDepartmentChange(+e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Station */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Station
              </label>
              <select
                className="w-full p-2 border rounded"
                disabled={!selectedDepartment}
                value={selectedStation ?? ""}
                onChange={(e) => handleStationChange(+e.target.value)}
              >
                <option value="">Select Station</option>
                {stations.map((s) => (
                  <option key={s.station_id} value={s.station_id}>
                    {s.station_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Level
              </label>
              <select
                className="w-full p-2 border rounded"
                disabled={!selectedStation}
                value={selectedLevel ?? ""}
                onChange={(e) => handleLevelChange(+e.target.value)}
              >
                <option value="">Select Level</option>
                {levels.map((l) => (
                  <option key={l.level_id} value={l.level_id}>
                    {l.level_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedLevel && selectedDepartment && selectedStation && (
          <>
            {/* Passing Criteria */}
            <div className="bg-white rounded p-6 shadow mb-8 border border-slate-200">
              <h3 className="text-xl font-semibold mb-4">Passing Criteria</h3>
              <label className="block mb-2 font-medium text-gray-700">
                Minimum Passing Percentage (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(+e.target.value)}
                className="border p-2 rounded w-24"
              />
            </div>

            {/* Days */}
            <div className="bg-white rounded p-6 shadow mb-8 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Evaluation Days</h3>
                <button
                  onClick={addDay}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded inline-flex items-center"
                >
                  <Plus className="mr-2" /> Add Day
                </button>
              </div>
              {days.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No days configured. Add some.
                </p>
              )}
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="border rounded p-4 mb-3 flex flex-wrap items-center"
                >
                  {editingDay === idx ? (
                    <>
                      <input
                        className="p-2 border rounded mr-4 mb-2"
                        value={day.day_name}
                        onChange={(e) =>
                          updateDay(idx, "day_name", e.target.value)
                        }
                        placeholder="Day Name"
                      />
                      <input
                        type="number"
                        className="p-2 border rounded mr-4 mb-2 w-20"
                        value={day.sequence_order}
                        onChange={(e) =>
                          updateDay(idx, "sequence_order", +e.target.value)
                        }
                        placeholder="Order"
                        min={1}
                      />
                      <button
                        onClick={() => setEditingDay(null)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded mr-2 inline-flex items-center"
                      >
                        <Save className="w-4 h-4 mr-1" /> Save
                      </button>
                      <button
                        onClick={() => deleteDay(idx)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="flex-1">
                        <strong>{day.day_name}</strong> (Order:{" "}
                        {day.sequence_order})
                      </p>
                      <button
                        onClick={() => setEditingDay(idx)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Topics and Subtopics */}
            <div className="bg-white rounded p-6 shadow mb-8 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Evaluation Topics & Subtopics</h3>
                <button
                  onClick={addTopic}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded inline-flex items-center"
                >
                  <Plus className="mr-2" /> Add Topic
                </button>
              </div>
              {topics.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No topics configured. Add some.
                </p>
              )}
              {topics.map((topic, idx) => (
                <div key={idx} className="border rounded p-4 mb-4">
                  {/* Topic */}
                  <div className="flex flex-wrap items-center mb-4">
                    {editingTopic === idx ? (
                      <>
                        <input
                          type="number"
                          className="p-2 border rounded mr-4 mb-2 w-20"
                          value={topic.slno}
                          onChange={(e) =>
                            updateTopic(idx, "slno", +e.target.value)
                          }
                          min={1}
                          placeholder="Sl No."
                        />
                        <input
                          type="text"
                          className="p-2 border rounded mr-4 mb-2 flex-grow"
                          value={topic.cycle_topics}
                          onChange={(e) =>
                            updateTopic(idx, "cycle_topics", e.target.value)
                          }
                          placeholder="Topic"
                        />
                        <button
                          onClick={() => setEditingTopic(null)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded mr-2 inline-flex items-center"
                        >
                          <Save className="w-4 h-4 mr-1" /> Save
                        </button>
                        <button
                          onClick={() => deleteTopic(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <strong>{topic.slno}. {topic.cycle_topics || "Untitled Topic"}</strong>
                        </div>
                        <button
                          onClick={() => setEditingTopic(idx)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded mr-2 inline-flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit Topic
                        </button>
                        <button
                          onClick={() => addSubtopic(idx)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded inline-flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Subtopic
                        </button>
                      </>
                    )}
                  </div>

                  {/* Subtopics */}
                  <div className="ml-4 border-l-2 border-gray-200 pl-4">
                    {(subtopics[idx] || []).map((subtopic, subIdx) => (
                      <div key={subIdx} className="border rounded p-2 mb-2 bg-gray-50">
                        {editingSubtopic?.topicIndex === idx && editingSubtopic?.subtopicIndex === subIdx ? (
                          <div className="flex flex-wrap items-center">
                            <input
                              type="text"
                              className="p-2 border rounded mr-2 mb-2 flex-grow"
                              value={subtopic.sub_topic}
                              onChange={(e) =>
                                updateSubtopic(idx, subIdx, "sub_topic", e.target.value)
                              }
                              placeholder="Subtopic"
                            />
                            <input
                              type="number"
                              min={1}
                              className="p-2 border rounded mr-2 mb-2 w-24"
                              value={subtopic.score_required}
                              onChange={(e) =>
                                updateSubtopic(idx, subIdx, "score_required", +e.target.value)
                              }
                              placeholder="Max Score"
                            />
                            <button
                              onClick={() => setEditingSubtopic(null)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2 text-sm inline-flex items-center"
                            >
                              <Save className="w-3 h-3 mr-1" /> Save
                            </button>
                            <button
                              onClick={() => deleteSubtopic(idx, subIdx)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm inline-flex items-center"
                            >
                              <Trash2 className="w-3 h-3 mr-1" /> Delete
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="flex-1">
                              <span className="text-sm">
                                {subtopic.sub_topic || "Untitled Subtopic"} 
                                <span className="text-gray-600"> (Max Score: {subtopic.score_required})</span>
                              </span>
                            </div>
                            <button
                              onClick={() => setEditingSubtopic({ topicIndex: idx, subtopicIndex: subIdx })}
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm inline-flex items-center"
                            >
                              <Edit className="w-3 h-3 mr-1" /> Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!subtopics[idx] || subtopics[idx].length === 0) && (
                      <p className="text-gray-400 text-sm py-2">No subtopics added yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center space-x-6 mb-8">
              <button
                onClick={resetToDefaults}
                disabled={loading}
                className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 inline-flex items-center"
              >
                <X className="w-5 h-5 mr-2" /> Reset to Defaults
              </button>
              <button
                onClick={saveConfiguration}
                disabled={
                  loading ||
                  topics.length === 0 ||
                  days.length === 0 ||
                  !selectedLevel ||
                  !selectedDepartment ||
                  !selectedStation
                }
                className={`${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-3 rounded inline-flex items-center`}
              >
                {loading ? (
                  <span className="animate-spin inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full mr-2"></span>
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                {loading ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TenCyclePage;


