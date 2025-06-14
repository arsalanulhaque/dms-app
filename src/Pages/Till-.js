import React, { useContext, useEffect, useState, useRef } from "react";
import SessionContext from "../Context/SessionContext";
import FetchData from "../Hooks/FetchData";
import Header from "../Components/Header";
import Alert from "react-bootstrap/Alert";
import "../style.css";
import { Link } from "react-router-dom";

function Till() {
  const { session } = useContext(SessionContext);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    let intervalID = setInterval(() => {
      inputRef.current.focus();
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
  };

  const reload = (api, method, body) => {
    FetchData(api, method, body, (response) => {
      if (response?.error) {
        setAlertType("danger");
        setMessage(response?.data?.message);
      } else if (
        response?.data?.length > 0 ||
        response?.data?.data?.length > 0
      ) {
        let arr = response?.data;
        let isExists = results.findIndex(
          (item) => item.AssetID === arr[0].AssetID
        );
        if (isExists === -1) {
          let spreaded = [...arr, ...results];
          spreaded = [...new Set(spreaded)];
          setResults(spreaded);

          setAlertType("success");
          setMessage("");
        }
      }
    });
    inputRef.current.value = "";
  };

  const onScanItem = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (results.length === 0) {
        reload(
          `device/barcode/${inputRef.current.value}/schoolID/${
            getSession()?.schoolID
          }`,
          "get",
          undefined
        );
        findItemInList();
      } else if (results.length > 0) {
        findItemInList();
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="d-flex justify-content-md-center align-items-center search">
          <div className="row w-75 ">
            <form onSubmit={onSubmit}>
              <div className="d-flex rounded justify-content-md-center align-items-center">
                <div className="input-group input-group-lg">
                  <Link to="/managedevicestatus">Show Devices</Link>
                  <input
                    type="text"
                    ref={inputRef}
                    onKeyDown={onScanItem}
                    className="hidden-form-control"
                    name="search"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        {isLoader === true ? (
          <div className="d-flex rounded justify-content-md-center align-items-center w-100 mt-5 mr-5">
            <div className="row h-50 d-inline-block">
              <div className="col-12">
                <div
                  className="spinner-border text-primary spinner-big"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {message?.length > 0 ? (
          <div className=" d-flex justify-content-md-center align-items-center search">
            <div className="row w-50">
              <Alert key={alertType} variant={alertType} className="w-100">
                {message}
              </Alert>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {isLoader === false ? (
        <div className="container-fluid mt-5">
          <div className="row">
            {results?.map((prod) => (
              <div key={prod.AssetID} className="col-4">
                <div className="card border border-2 rounded">
                  <div className="card-body">
                    <div className="row card-title bottom border-1 border-bottom">
                      <div className="col text-primary">
                        <h5>Asset# {prod.AssetID}</h5>
                      </div>
                      <div className="col-5">
                        {/* {prod.IsIssued === 0 ? <span className="btn-bookNow fs-6 float-end fw-bold text-warning" onClick={() => onBookDevice(prod)}>Book Now</span> : ''}
                                                        {prod.IsIssued === 1 && prod.FKUserID === getSession()?.userID ?
                                                            <span className="btn-bookNow fs-6 float-end fw-bold text-danger" onClick={() => onReturnDevice(prod)}>Return Now</span> : ''} */}
                        {prod.IsIssued === 1 &&
                        prod.FKUserID !== getSession()?.userID ? (
                          <span className="btn-already-booked fs-6 float-end fw-bold">
                            Already Booked
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="row">
                          <div className="col-6 card-text">
                            Device Name: {prod.DeviceName}
                          </div>
                          <div className="col-6 card-text">
                            Model: {prod.Model}
                          </div>
                          <div className="col-6 card-text">
                            Staff:{" "}
                            {prod.Username === "" ? (
                              "NA"
                            ) : (
                              <span className="fw-bold text-danger">
                                {prod.Username}
                              </span>
                            )}{" "}
                          </div>
                          <div className="col-6 card-text">
                            Taken On:{" "}
                            {prod.Username === "" ? (
                              "NA"
                            ) : (
                              <span className="fw-bold text-danger">
                                {prod.IssuedDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Till;
