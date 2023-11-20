import React, { useEffect, useRef, useState } from "react";
import "../Css/modal.css";
import { useNavigate, useParams } from "react-router-dom";
import CredentialsPDF from "./credentialsPDF";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { pdfjs } from "react-pdf";
import { Button, Nav, Modal } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
function ApproveBusinessModal() {
  const [bussinesToApprove, setBussinesToAppove] = useState([]);
  const [businessCredentials, setbusinessCredentials] = useState([]);
  const [show, setShow] = useState(false);
  const [year, setYear] = useState("");
  const [percent, setpercent] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();
  const searchLocation = new URLSearchParams(location.search);
  const business = searchLocation.get("id");
  const user_id = searchLocation.get("user_id");
  const bussiDetailRef = useRef(null);
  const bussCredRef = useRef(null);
  const entrepInfoRef = useRef(null);
  // const { id } = useParams();
  // const businessId = id;
  const navigate = useNavigate();
  useEffect(() => {
    if (business) {
      axios
        .post("http://localhost:3006/admin/approveBusiness", {
          businessId: business,
        })
        .then((res) => {
          if (res.data.status) {
            setBussinesToAppove(res.data.result);
            setbusinessCredentials(
              JSON.parse(res.data.result[0].buss_credentials)
            );
            console.log(res.data.result);
          } else {
            alert(res.data.message);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Business not have credentials");
    }
  }, [business]);

  const handleApprove = () => {
    axios
      .post("http://localhost:3006/admin/approveuserbusiness", {
        buss_id: business,
        year: year,
        percent: percent,
        user_id: user_id,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
          handleClose();
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const scrollToDiv = (divRef) => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Loan Term and Interest Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="mb-3">
            <label class="form-label">Months</label>
            <input
              type="number"
              class="form-control"
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Percent</label>
            <input
              type="number"
              class="form-control"
              onChange={(e) => setpercent(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleApprove}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* {bussinesToApprove ? (
        <>
          {bussinesToApprove.map((item, index) => (
            <div className="modal-content" key={index}>
              <div className="modal-details">
                <h3>Business Details :{item.buss_details}</h3>
                <div>
                  Business Image
                  <img src={item.buss_photo} />
                </div>
                <h2>Business Name</h2>
                <p>Business Type</p>
                <p>Business Description</p>
                <p>Business Capital</p>

                <h3>Entrepreneur Information</h3>
                <p>Entrep Complete name</p>
                <p>Address</p>
                <p>Birthdate</p>
                <p>Age</p>
              </div>
              <div className="personal-credentials"></div>

              {item.buss_cred_bir_regis === null ||
              item.buss_cred_brgy_clearance === null ||
              item.buss_cred_mayor_permit === null ? (
                <div>
                  <h1>Not credentials uploaded</h1>
                  <p>Click here to notify the user</p>
                  <button>Notify</button>
                </div>
              ) : (
                <>
                  <div className="btn-appove-decline">
                    <button onClick={handleShow}>Approve</button>
                    <button>Decline</button>
                  </div>
                  <div className="business-credentials">
                    <h3>Entrepreneur Credentials Information</h3>
                    {businessCredentials ? (
                      <>
                        {" "}
                        {businessCredentials.map((item, index) => (
                          <>
                            {" "}
                            <CredentialsPDF pdfLInk={item} key={index} />
                            <br />
                          </>
                        ))}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              )}
              <button id="close-btn" onClick={() => navigate(-1)}>
                Close
              </button>
            </div>
          ))}
        </>
      ) : (
        <div className="modal-content">
          <h1>Details for this business</h1>
          <p>Click here to notify the user</p>
          <button>Notify</button>
          <button id="close-btn" onClick={() => navigate(-1)}>
            Close
          </button>
        </div>
      )} */}

      <div className="d-flex flex-column mt-3 p-3 gap-3">
        {bussinesToApprove.map((item, index) => (
          <div key={index} className="container-fluid w-100">
            <div className="d-flex justify-content-end align-items-center gap-3 ">
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleShow}
              >
                Approve
              </button>
              <button type="button" class="btn btn-secondary">
                Decline
              </button>
            </div>
            <img
              src={item.buss_photo}
              className="rounded mx-auto d-block "
              alt="..."
              style={{ width: "15rem", height: "15rem" }}
            />
            <div className="d-flex gap-4">
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
                <label className="form-label fw-bold">Business Location</label>
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
                  ) : (
                    item.buss_station ===
                    "yes"(<FontAwesomeIcon icon={faSquareCheck} />)
                  )}
                </label>
                <div className="d-flex gap-2 flex-wrap w-50">
                  <span className="border p-2 ">{item.buss_station_name}</span>
                </div>
              </div>
              <div class="mb-3">
                <label className="form-label fw-bold">Business Capital</label>
                <input
                  type="text"
                  class="form-control"
                  readOnly
                  value={`₱ ${item.buss_capital}`}
                />
              </div>
              <div class="mb-3">
                <label className="form-label fw-bold">Business Interest</label>
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
                  <span className="border p-2 "> {item.buss_type_name}</span>
                </div>
              </div>
              <div class="mb-3">
                <label className="form-label fw-bold">Business Summary</label>
                <div className="border p-2 w-100 ">{item.buss_summary}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Business Installment
                </label>
                <table class=" table align-middle text-center mb-0 bg-white mt-2">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">Amount</th>
                      <th scope="col">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(item.buss_installment).map((item, index) => (
                      <tr key={index}>
                        <td class="fw-normal mb-1">Php {item.installment}</td>
                        <td class="fw-normal mb-1">
                          {item.mindate} - {item.maxdate}
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
                    {JSON.parse(item.buss_useof_funds).map((item, index) => (
                      <tr key={index}>
                        <td class="fw-normal mb-1">{index + 1}</td>
                        <td class="fw-normal mb-1">{item.product}</td>
                        <td class="fw-normal mb-1">{item.amount}</td>
                      </tr>
                    ))}
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
                <label className="form-label fw-bold">Entrepreneur Name</label>
                <input
                  type="text"
                  class="form-control"
                  readOnly
                  value={`${item.user_fname} ${item.user_mname} ${item.user_lname}`}
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
                <label className="form-label fw-bold">Entrepreneur Age</label>
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
                      {" "}
                      <CredentialsPDF pdfLInk={item} key={index} />
                      <br />
                    </>
                  ))}
                </>
              ) : (
                ""
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApproveBusinessModal;
