import { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useSession from "../Context/SessionContext";
import FetchData from "../Hooks/FetchData";
import Alert from "react-bootstrap/Alert";
import Select from "react-select";
import Card from "react-bootstrap/Card";


function WeeklyReport() {
  const [getSession, setSession] = useSession();
  const [selectedDay, setSelectedDay] = useState({
    value: -1,
    label: "Select a day",
  });
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const days = [
    { value: -1, label: "Select a day" },
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 45,
      minHeight: 45,
      borderRadius: "4px",
      borderColor: "#ced4da",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#80bdff",
      },
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#012970" : isFocused ? "#f6f9ff" : "white",
      color: isSelected ? "white" : "#012970",
      ":active": {
        backgroundColor: "#012970",
        color: "white",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#012970",
    }),
  };


  const handleSubmit = () => {
    if (selectedDay.value === -1) {
      setMessage("Please select a day");
      setAlertType("warning");
      return;
    }

    const scheduleData = {
      day: selectedDay.label,
      time: selectedTime,
      schoolId: getSession()?.schoolID,
    };

    FetchData("weekly-report-schedule", "post", scheduleData, (result) => {
      if (result?.error) {
        setMessage(result.message || "Failed to save schedule");
        setAlertType("danger");
      } else {
        setMessage("Schedule saved successfully");
        setAlertType("success");
      }
    });
  };

  // Load existing schedule if any
  // useEffect(() => {
  //     FetchData(`weekly-report-schedule/${getSession()?.schoolID}`, 'get', null, (result) => {
  //         if (result?.data) {
  //             const schedule = result.data;
  //             setSelectedTime(schedule.time);
  //             const dayId = days.find(d => d.label === schedule.day)?.value;
  //             if (dayId !== undefined) {
  //                 setSelectedDay({ value: dayId, label: schedule.day });
  //             }
  //         }
  //     });
  // }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <Card>
                <Card.Header className="card-header bg-white">
                  <div className="row align-items-center">
                    <div className="col">
                      <h4
                        className="card-title mb-0"
                        style={{ color: "#012970" }}
                      >
                        Weekly Report Schedule
                      </h4>
                      <div className="small text-muted">
                        Configure when your weekly reports will be sent
                      </div>
                    </div>
                  </div>
                </Card.Header>
                {message && (
                  <Alert variant={alertType} className="m-3">
                    {message}
                  </Alert>
                )}
                <Card.Body className="pt-4">
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <Card className="shadow-sm">
                        <Card.Body className="p-4">
                          <div className="mb-4">
                            <label
                              className="form-label fw-bold mb-2"
                              style={{ color: "#012970" }}
                            >
                              Select Day
                            </label>
                            <Select
                              styles={customStyles}
                              options={days}
                              value={selectedDay}
                              onChange={(e) => setSelectedDay(e.target.value)}
                              isSearchable={false}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="form-label fw-bold mb-2"
                              style={{ color: "#012970" }}
                            >
                              Select Time
                            </label>
                            <input
                              type="time"
                              className="form-control form-control-md"
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              style={{ height: "45px" }}
                            />
                          </div>
                          <div className="d-grid gap-2 mt-4">
                            <button
                              className="btn btn-md"
                              onClick={handleSubmit}
                              style={{ 
                                  backgroundColor: '#34A85A',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50px',
                                  padding: '5px 10px',
                                  boxShadow: 'none',
                                  width : "30%",
                                  marginTop : "10px",
                                  alignSelf : "center"
                              }}
                            >
                              Save Schedule
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default WeeklyReport;
