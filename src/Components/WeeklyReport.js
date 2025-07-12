import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useSession from "../Context/SessionContext";
import FetchData from "../Hooks/FetchData";
import Alert from "react-bootstrap/Alert";
import Select from "react-select";
import Card from "react-bootstrap/Card";

function WeeklyReport() {
  const [getSession] = useSession();
  const [selectedDay, setSelectedDay] = useState({
    value: -1,
    label: "Select a day",
  });
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [ccEmails, setCcEmails] = useState(Array(5).fill(""));

  const adminEmail = getSession()?.emailID;
  const schoolEmail = getSession()?.supervisorEmailID;

  const emailOptions = [
    { value: schoolEmail, label: `School Email (${schoolEmail})` },
    { value: adminEmail, label: `Admin Email (${adminEmail})` },
  ];

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

  // Fetch existing settings when component mounts
  useEffect(() => {
    const fetchSettings = () => {
      FetchData(`weekly-email-settings/${getSession()?.schoolID}/${getSession()?.userID}`, "get", null, (result) => {
        if (!result?.error && result?.data) {
          const settings = result.data;
          
          // Set day
          const dayOption = days.find(d => d.label === settings.DayOfWeek);
          if (dayOption) {
            setSelectedDay(dayOption);
          }

          // Set time
          const hour = String(settings.HourOfDay).padStart(2, '0');
          const minute = String(settings.MinuteOfDay).padStart(2, '0');
          setSelectedTime(`${hour}:${minute}`);

          // Set email
          setSelectedEmail(settings.SendToEmail || "");

          // Set CC emails
          const newCcEmails = [
            settings.CC1 || "",
            settings.CC2 || "",
            settings.CC3 || "",
            settings.CC4 || "",
            settings.CC5 || ""
          ];
          setCcEmails(newCcEmails);
        }
      });
    };

    if (getSession()?.schoolID && getSession()?.userID) {
      fetchSettings();
    }
  }, [getSession]);

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
    if (selectedDay.value === -1 || !selectedEmail) {
      setMessage("Please select both a day and an email");
      setAlertType("warning");
      return;
    }

    const [hour, minute] = selectedTime.split(":");

    // Create an object with individual cc fields
    const scheduleData = {
      schoolId: getSession()?.schoolID,
      adminId: getSession()?.userID,
      sendToEmail: selectedEmail,
      dayOfWeek: selectedDay.label,
      hourOfDay: parseInt(hour),
      minuteOfDay: parseInt(minute),
      cc1: ccEmails[0] || null,
      cc2: ccEmails[1] || null,
      cc3: ccEmails[2] || null,
      cc4: ccEmails[3] || null,
      cc5: ccEmails[4] || null
    };

    FetchData("weekly-email-settings", "post", scheduleData, (result) => {
      if (result?.error) {
        setMessage(result.message || "Failed to save schedule");
        setAlertType("danger");
      } else {
        setMessage("Schedule saved successfully");
        setAlertType("success");
      }
    });
  };

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
                              onChange={(option) => setSelectedDay(option)}
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

                          <div className="mb-4">
                            <label
                              className="form-label fw-bold mb-2"
                              style={{ color: "#012970" }}
                            >
                              Send Report To
                            </label>
                            <Select
                              styles={customStyles}
                              options={emailOptions}
                              value={emailOptions.find(
                                (e) => e.value === selectedEmail
                              )}
                              onChange={(option) =>
                                setSelectedEmail(option.value)
                              }
                              isSearchable={false}
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              className="form-label fw-bold mb-2"
                              style={{ color: "#012970" }}
                            >
                              CC Email Addresses
                            </label>
                            {[0, 1, 2, 3, 4].map((idx) => (
                              <input
                                key={idx}
                                type="email"
                                className="form-control form-control-md mb-2"
                                value={ccEmails[idx] || ""}
                                onChange={(e) => {
                                  const updated = [...ccEmails];
                                  updated[idx] = e.target.value;
                                  setCcEmails(updated);
                                }}
                                style={{ height: "45px" }}
                                placeholder={`CC Email ${idx + 1} (optional)`}
                              />
                            ))}
                            <div className="small text-muted">
                              Enter up to 5 different email addresses.
                            </div>
                          </div>

                          <div className="d-grid gap-2 mt-4">
                            <button
                              className="btn btn-md"
                              onClick={handleSubmit}
                              style={{
                                backgroundColor: "#34A85A",
                                color: "white",
                                border: "none",
                                borderRadius: "50px",
                                padding: "5px 10px",
                                boxShadow: "none",
                                width: "30%",
                                marginTop: "10px",
                                alignSelf: "center",
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
