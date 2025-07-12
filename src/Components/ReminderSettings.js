import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useSession from "../Context/SessionContext";
import FetchData from "../Hooks/FetchData";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Select from "react-select";

function ReminderSettings() {
  const [getSession] = useSession();
  const [daysUntilFirst, setDaysUntilFirst] = useState({ value: 7, label: "7" });
  const [reminderFrequency, setReminderFrequency] = useState({ value: 1, label: "1" });
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Options for dropdowns
  const daysOptions = Array.from({ length: 7 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  const frequencyOptions = Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  // Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = () => {
      FetchData(
        `reminder-settings/${getSession()?.schoolID}/${getSession()?.userID}`,
        "get",
        null,
        (result) => {
          if (!result?.error && result?.data) {
            const settings = result.data;
            // console.log("settings from reminder settings --> ", settings);
            if (settings.DaysUntilFirstReminder) {
              setDaysUntilFirst(
                daysOptions.find((d) => d.value === settings.DaysUntilFirstReminder) || daysOptions[6]
              );
            }
            if (settings.ReminderFrequency) {
              setReminderFrequency(
                frequencyOptions.find((f) => f.value === settings.ReminderFrequency
              ) || frequencyOptions[0]
              );
            }
          }
        }
      );
    };

    if (getSession()?.schoolID && getSession()?.userID) {
      fetchSettings();
    }
    // eslint-disable-next-line
  }, []);

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
    if (!daysUntilFirst.value || !reminderFrequency.value) {
      setMessage("Please select both settings.");
      setAlertType("warning");
      return;
    }

    const data = {
      SchoolID: getSession()?.schoolID,
      AdminUserID: getSession()?.userID,
      DaysUntilFirstReminder: daysUntilFirst.value,
      ReminderFrequency: reminderFrequency.value,
    };

    FetchData("reminder-settings", "post", data, (result) => {
      if (result?.error) {
        setMessage(result.message || "Failed to save settings");
        setAlertType("danger");
      } else {
        setMessage("Reminder settings saved successfully");
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
                      <h4 className="card-title mb-0" style={{ color: "#012970" }}>
                        Reminder Settings
                      </h4>
                      <div className="small text-muted">
                        Configure when and how often reminders are sent
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
                              Days Until First Reminder
                            </label>
                            <Select
                              styles={customStyles}
                              options={daysOptions}
                              value={daysUntilFirst}
                              onChange={(option) => setDaysUntilFirst(option)}
                              isSearchable={false}
                            />
                            <div className="small text-muted">
                              Number of days after which the first reminder will be sent (1-7).
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              className="form-label fw-bold mb-2"
                              style={{ color: "#012970" }}
                            >
                              Frequency of Reminder After First Reminder (days)
                            </label>
                            <Select
                              styles={customStyles}
                              options={frequencyOptions}
                              value={reminderFrequency}
                              onChange={(option) => setReminderFrequency(option)}
                              isSearchable={false}
                            />
                            <div className="small text-muted">
                              How often to send reminders after the first one (1-30 days).
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
                              Save Settings
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

export default ReminderSettings;
