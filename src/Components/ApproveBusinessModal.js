import React, { useEffect, useRef, useState } from "react";
import "../Css/modal.css";
import { useNavigate, useParams } from "react-router-dom";
import CredentialsPDF from "./credentialsPDF";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { pdfjs } from "react-pdf";
import { Button, Nav, Modal, ToastContainer, Toast } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Loader from "./loader";
import CancelBusinessModal from "./CancelBusinessModal";
function ApproveBusinessModal() {
  const [bussinesToApprove, setBussinesToAppove] = useState([]);
  const [businessCredentials, setbusinessCredentials] = useState([]);
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(12);
  const [percent, setpercent] = useState(3);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();
  const searchLocation = new URLSearchParams(location.search);
  const business = searchLocation.get("id");
  const user_id = searchLocation.get("user_id");
  const bussiDetailRef = useRef(null);
  const bussCredRef = useRef(null);
  const entrepInfoRef = useRef(null);
  const bussinesInstallment = useRef(null);
  const [returnLoanDatas, setReturnLoandDatas] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const businessInvestors = useRef();
  const [alertType, setAlertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showCancelModal, setCancelModal] = useState(false);
  // const { id } = useParams();
  // const businessId = id;
  const navigate = useNavigate();
  useEffect(() => {
    setShowLoader(true);
    if (business) {
      axios
        .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/approveBusiness`, {
          businessId: business,
        })
        .then((res) => {
          if (res.data.status) {
            setBussinesToAppove(res.data.result);
            setbusinessCredentials(
              JSON.parse(res.data.result[0].buss_credentials)
            );

            const funds = JSON.parse(res.data.result[0].buss_useof_funds);

            const businessReturnFund = res.data.resultBusinessFunds;

            const installmentData = JSON.parse(
              res.data.result[0].buss_installment
            );
            const returnData = res.data.returnLoanData;

            if (returnData.length > 0) {
              returnData.forEach((returndata) => {
                const indexFindInstallData = installmentData.findIndex(
                  (item) => item.id === returndata.returnLoan_id
                );

                if (indexFindInstallData !== -1) {
                  const datePaid = new Date(returndata.returnLoan_created_at);
                  const mindate = new Date(
                    installmentData[indexFindInstallData].mindate
                  );
                  const maxdate = new Date(
                    installmentData[indexFindInstallData].maxdate
                  );

                  if (datePaid >= mindate && datePaid <= maxdate) {
                    const status = {
                      status: "paid",
                      amountPaid: returndata.returnLoan_amt,
                      datePaid: returndata.returnLoan_created_at,
                    };

                    // Use splice to update the array at the found index
                    installmentData[indexFindInstallData] = {
                      ...installmentData[indexFindInstallData],
                      ...status,
                    };
                  } else {
                    const status = {
                      status: "missed",
                      amountPaid: returndata.returnLoan_amt,
                      datePaid: returndata.returnLoan_created_at,
                    };

                    // Use splice to update the array at the found index
                    installmentData[indexFindInstallData] = {
                      ...installmentData[indexFindInstallData],
                      ...status,
                    };
                  }

                  setReturnLoandDatas(installmentData);
                }
              });
            } else {
              setReturnLoandDatas(
                JSON.parse(res.data.result[0].buss_installment)
              );
            }
            setShowLoader(false);
          } else {
            setShowLoader(false);
            alert(res.data.message);
          }
        })
        .catch((error) => {
          setShowLoader(false);
          alert(error.message);
        });
    } else {
      alert("Business not have credentials");
    }
  }, [business]);

  const handleApprove = () => {
    if (percent > 0 && year > 0) {
      axios
        .post(
          `${process.env.REACT_APP_NETWORK_ADD}/admin/approveuserbusiness`,
          {
            buss_id: business,
            year: year,
            percent: percent,
            user_id: user_id,
          }
        )
        .then((res) => {
          if (res.data.status) {
            setAlertMsg(res.data.message);
            setAlertType("success");
            setShowAlert(true);
            window.location.reload();
            handleClose();
          } else {
            setAlertMsg(res.data.message);
            setAlertType("danger");
            setShowAlert(true);
            window.location.reload();
          }
        })
        .catch((error) => {
          // alert(error);
        });
    } else {
      alert("Percent must not be less than 0");
    }
  };

  const scrollToDiv = (divRef) => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayBusinessStation = (stationname) => {
    try {
      return JSON.parse(stationname).map((item) => (
        <span
          className="border p-2 hover"
          title={`${item.address ? item.address : ""}`}
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </span>
      ));
    } catch (error) {
      return (
        <span className="border p-2 hover" style={{ cursor: "pointer" }}>
          {stationname}
        </span>
      );
    }
  };
  const handleCancelBusiness = () => {
    setCancelModal(!showCancelModal);
    // axios
    //   .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/cancelbusinessentrep`, {
    //     business,
    //     user_id,
    //   })
    //   .then((res) => {
    //     if (res.data.status) {
    //       setAlertMsg(res.data.message);
    //       setAlertType("success");
    //       setShowAlert(true);
    //       window.location.reload();
    //     } else {
    //       setAlertMsg(res.data.message);
    //       setAlertType("danger");
    //       setShowAlert(true);
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       navigate("/server-error");
    //     } else if (error.request) {
    //       navigate("/error");
    //     } else {
    //       navigate("/somethingwrong");
    //     }
    //   });
  };
  return (
    <>
      {showCancelModal ? (
        <CancelBusinessModal
          handleCancelBusiness={handleCancelBusiness}
          type={setAlertType}
          msg={setAlertMsg}
          alertShow={setShowAlert}
        />
      ) : (
        ""
      )}

      {showAlert ? (
        <ToastContainer position="top-center" className="p-3">
          <Toast
            className="d-inline-block m-1"
            bg={alertType}
            show={setShowAlert}
            delay={3000}
            onClose={() => setShowAlert(false)}
            autohide
          >
            <Toast.Body className="primary text-light">{alertMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
      ) : (
        ""
      )}

      {showLoader ? (
        <div
          className="d-flex align-items-center justify-content-center "
          style={{ height: "90vh" }}
        >
          <Loader />
        </div>
      ) : (
        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Invest Term and Interest Configuration</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="mb-3">
                <label class="form-label">Months</label>
                <input
                  type="number"
                  class="form-control"
                  value={12}
                  disabled
                  // onChange={(e) => setYear(12)}
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Percent</label>
                <input
                  type="number"
                  class="form-control"
                  value={3}
                  disabled
                  // onChange={(e) => setpercent(3)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleApprove}>
                Approved and Start Business
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="d-flex flex-column mt-3 p-3 gap-3">
            {bussinesToApprove.map((item, index) => (
              <div key={index} className="container-fluid w-100">
                {bussinesToApprove[0].buss_status === "pending" ? (
                  <div className="d-flex justify-content-end align-items-center gap-3 ">
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={handleShow}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      onClick={handleCancelBusiness}
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  ""
                )}

                <img
                  src={item.buss_photo}
                  className="rounded mx-auto d-block "
                  alt="..."
                  style={{ width: "15rem", height: "15rem" }}
                />
                <div className="d-flex gap-4 mt-3">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    onClick={() => scrollToDiv(bussiDetailRef)}
                  >
                    Business Details
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    onClick={() => scrollToDiv(bussinesInstallment)}
                  >
                    Business Installments
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    onClick={() => scrollToDiv(bussCredRef)}
                  >
                    Business Credintials
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    onClick={() => scrollToDiv(entrepInfoRef)}
                  >
                    Entrepreneur Information
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    onClick={() => scrollToDiv(businessInvestors)}
                  >
                    Business Investors
                  </button>
                </div>
                <div
                  className="border mt-2 p-3 bg-secondary text-light fs-5 w-100"
                  ref={bussiDetailRef}
                >
                  Business Details
                </div>
                <span className="ps-3">
                  <div class="mb-3">
                    <label className="form-label fw-bold">Business Name</label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={item.buss_name}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Business Location
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={item.buss_address}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Business Traffic Area{" "}
                      {item.buss_station === "no" ? (
                        <FontAwesomeIcon
                          icon={faSquareXmark}
                          style={{ color: "#ff0000" }}
                        />
                      ) : item.buss_station === "yes" ? (
                        <FontAwesomeIcon icon={faSquareCheck} />
                      ) : (
                        ""
                      )}
                    </label>
                    <div className="d-flex gap-2 flex-wrap w-100">
                      {displayBusinessStation(item.buss_station_name)}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Business Capital
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={`₱ ${item.buss_capital}`}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Business Interest
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={`${item.buss_interest}%`}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Business Number of Months
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={`${item.buss_no_of_months}`}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Business Loan Return
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={`₱ ${item.buss_loan_return}`}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Business Type</label>
                    <div className="d-flex gap-2 flex-wrap w-50">
                      <span className="border p-2 ">{item.buss_type}</span>
                      {JSON.parse(item.buss_type_name).map((data) => (
                        <span className="border p-2 "> {data}</span>
                      ))}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Business Summary
                    </label>
                    <div className="border p-2 w-100 ">{item.buss_summary}</div>
                  </div>
                  <div className="mb-3" ref={bussinesInstallment}>
                    <label className="form-label fw-bold">
                      Business Installment
                    </label>
                    <table class=" table align-middle text-center mb-0 bg-white mt-2">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">Amount</th>
                          <th scope="col">Status</th>
                          <th scope="col">Due Date</th>
                          <th scope="col">Paid Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnLoanDatas.map((item, index) => (
                          <tr key={index}>
                            <td class="fw-normal mb-1">
                              Php{" "}
                              {item.amountPaid
                                ? `${item.amountPaid}`
                                : `${item.installment}`}
                            </td>
                            <td>
                              {item.status ? (
                                <span
                                  class={`badge rounded-pill  ${
                                    item.status === "paid"
                                      ? "bg-success  text-light "
                                      : item.status === "missed"
                                      ? "bg-info text-dark"
                                      : ""
                                  }`}
                                >
                                  {item.status}
                                </span>
                              ) : (
                                ""
                              )}
                            </td>
                            <td class="fw-normal mb-1">
                              {item.mindate} - {item.maxdate}
                            </td>
                            <td class="fw-normal mb-1">
                              {item.datePaid
                                ? new Date(item.datePaid).toDateString()
                                : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Business Funds</label>
                    <table class=" table align-middle text-center mb-0 bg-white mt-2">
                      <thead className="table-dark">
                        <tr>
                          <th>No.</th>
                          <th>Products</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(item.buss_useof_funds).map(
                          (item, index) => (
                            <tr key={index}>
                              <td class="fw-normal mb-1">{index + 1}</td>
                              <td class="fw-normal mb-1">{item.products}</td>
                              <td class="fw-normal mb-1">{item.amount}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </span>
                <div
                  className="border mt-3 p-3 bg-secondary text-light fs-5"
                  ref={entrepInfoRef}
                >
                  Entrepreneur Details
                </div>
                <img
                  src={item.user_profile}
                  className="rounded mx-auto d-block "
                  alt="..."
                  style={{ width: "15rem", height: "15rem" }}
                />
                <span className="ps-3">
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Entrepreneur Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={`${item.user_fname} ${item.user_mname} ${item.user_lname}`}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Entrepreneur Email
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={item.user_email}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Entrepreneur Contact Number
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={item.user_contact_num}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Entrepreneur Address
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={`${item.user_province}, ${item.user_city}, ${item.user_barangay}`}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Entrepreneur Birthdate
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={new Date(item.user_bdate).toLocaleDateString()}
                    />
                  </div>
                  <div class="mb-3">
                    <label className="form-label fw-bold">
                      Entrepreneur Age
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={item.user_age}
                    />
                  </div>
                </span>
                <div
                  className="border mt-3 p-3 bg-secondary text-light fs-5"
                  ref={businessInvestors}
                >
                  Business Investors
                </div>
                <div className="mb-3">
                  <table class="table align-middle mt-3 bg-white">
                    <thead className="table-dark">
                      <tr>
                        <th>Name</th>
                        <th>Amount Invest</th>
                        <th>Investment Return</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.investments.map((investor) => (
                        <tr key={investor.investor_id}>
                          <td>
                            <div class="d-flex align-items-center">
                              {investor.investor_profile ? (
                                <img
                                  src={investor.investor_profile}
                                  class="rounded-circle"
                                  alt=""
                                  style={{ width: "45px", height: "45px" }}
                                />
                              ) : (
                                <img
                                  src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                                  class="rounded-circle"
                                  alt=""
                                  style={{ width: "45px", height: "45px" }}
                                />
                              )}

                              <div class="ms-3">
                                <p class="fw-bold mb-1">
                                  {investor.investor_fname}{" "}
                                  {investor.investor_lname}
                                </p>
                                <p class="text-muted mb-0">
                                  {investor.investor_email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              {investor.invest_amount}
                            </p>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              {investor.invst_returned_amt}
                            </p>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              {new Date(
                                investor.invest_date
                              ).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="border mt-5 p-3 bg-secondary text-light fs-5"
                  ref={bussCredRef}
                >
                  Business Credentials
                </div>
                <span>
                  {businessCredentials ? (
                    <>
                      {" "}
                      {businessCredentials.map((item, index) => (
                        <>
                          <label className="form-label fw-bold"></label>
                          <CredentialsPDF
                            pdfLInk={item}
                            key={index}
                            title={"Business Permit/s"}
                          />
                          <br />
                        </>
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                </span>
                <div className="mt-5">
                  <label className="form-label fw-bold"></label>
                  {JSON.parse(item.buss_proof_of_residence).map(
                    (data, index) => (
                      <CredentialsPDF
                        pdfLInk={data}
                        key={index}
                        title={"Business Proof of Residence"}
                      />
                    )
                  )}
                </div>
                <label className="form-label fw-bold"></label>
                {JSON.parse(item.buss_support_doc).map((data, index) => (
                  <CredentialsPDF
                    pdfLInk={data}
                    key={index}
                    title={"Business Support Documents"}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ApproveBusinessModal;
