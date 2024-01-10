import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { Button, Card } from "react-bootstrap";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import logo from "../Images/logo.jpg";
import Loader from "../Components/loader";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
function Reports(props) {
  const navigate = useNavigate();
  const [listofUser, setListOfUsers] = useState([]);
  const [listOfInvestment, setListofInvestment] = useState([]);
  const [listOfBusiness, setListOfBusiess] = useState([]);
  const reportsRef = useRef();
  const investmentRef = useRef();
  const businessRef = useRef();
  const [showLoader, setShowLoader] = useState(false);
  const [formattedDate, setFormattedDate] = useState();
  const [category, setCategory] = useState("");
  useEffect(() => {
    setShowLoader(true);
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/alllist`)
      .then((res) => {
        if (res.data.status) {
          const {
            result,
            userRes,
            BusinessRes,
            invesRes,
            transacRes,
            formattedDate,
          } = res.data;
          setListOfUsers(userRes);
          setListofInvestment(invesRes);
          setListOfBusiess(BusinessRes);
          setFormattedDate(formattedDate);
          setShowLoader(false);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          navigate("/server-error");
        } else if (error.request) {
          navigate("/error");
        } else {
          navigate("/somethingwrong");
        }
      });
  }, []);
  const handleGenerateReportPdf = (ref, filename) => {
    setShowLoader(true);
    generatePDF(ref, {
      filename: `${filename}`,
      canvas: { mimeType: "image/png", qualityRatio: 1 },
      page: { margin: Margin.SMALL, orientation: "landscape" },
      overrides: {
        pdf: {
          compress: true,
        },

        canvas: {
          useCORS: true,
        },
      },
    });
    setShowLoader(false);
  };
  return (
    <div className="container-fluid">
      {showLoader ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "70vh" }}
        >
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-2">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Filter Reports
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setCategory("users")}>
                  List of Users
                </Dropdown.Item>

                <Dropdown.Item onClick={() => setCategory("investment")}>
                  List of Investments
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCategory("business")}>
                  List of Business
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {category === "users" ? (
            <div className="border  mt-3  shadow rounded">
              <div
                className="bg-light w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                style={{ height: "3rem" }}
              >
                <label className="fw-bold text-danger">List of Users</label>{" "}
                <Button
                  variant="danger"
                  onClick={() =>
                    handleGenerateReportPdf(reportsRef, "userreports.pdf")
                  }
                >
                  <FontAwesomeIcon icon={faFileExport} className="me-2" />
                  Generate List of Users
                </Button>
              </div>
              <div className="" ref={reportsRef}>
                <div
                  className="w-100 d-flex align-items-center   ps-2 pe-2"
                  style={{ height: "6rem", backgroundColor: "#79118d" }}
                >
                  <img
                    src={logo}
                    alt="bias logo"
                    style={{ height: "5rem", width: "5rem" }}
                    className="rounded-circle shadow-lg"
                  />
                  <div className="d-flex align-items-center justify-content-center w-75 ms-5">
                    <h1 className="text-center  text-light ">List of Users</h1>
                  </div>
                </div>

                <div className="mb-2 d-flex justify-content-end align-items-end  w-100 gap-3 pe-4">
                  <label className="fw-bold ">Date/Time: </label>
                  <label>{formattedDate}</label>
                </div>
                <table className="table  table-sm align-middle text-center mb-0 bg-white ">
                  <thead className="table-dark">
                    <tr className="rounded">
                      <th>User ID</th>
                      <th>Name</th>
                      <th>User Type</th>
                      <th>Age</th>
                      <th>Birthdate</th>
                      <th>Gender</th>
                      <th>Address</th>
                      <th>Contact Number</th>

                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listofUser.map((item, index) => (
                      <tr key={item.user_id}>
                        <td>{item.user_id}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            {item.user_profile ? (
                              <img
                                src={item.user_profile}
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
                                {item.user_fname} {item.user_lname}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            class={`badge rounded-pill text-dark ${
                              item.user_type === "entrepreneur"
                                ? "bg-success "
                                : item.user_type === "investor"
                                ? "bg-secondary"
                                : ""
                            }`}
                          >
                            {item.user_type}
                          </span>
                        </td>
                        <td>{item.user_age}</td>
                        <td>
                          {new Date(item.user_bdate).toLocaleDateString()}
                        </td>
                        <td>{item.user_gender}</td>{" "}
                        <td>
                          <p class="fw-normal mb-1">
                            {item.user_barangay}, {item.user_city},{" "}
                            {item.user_province}
                          </p>
                        </td>
                        <td>{item.user_contact_num}</td>
                        <td>
                          <span
                            class={`badge rounded-pill  ${
                              item.user_status === "basic"
                                ? "bg-danger "
                                : item.user_status === "semi"
                                ? "bg-warning"
                                : item.user_status === "verified"
                                ? "bg-info"
                                : ""
                            }`}
                          >
                            {item.user_status}
                          </span>
                        </td>
                        <td>
                          {new Date(item.user_created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 d-flex gap-3">
                  <label className="fw-bold ">Prepared by: </label>
                  <label>biascapstone@gmail.com</label>
                </div>
              </div>
            </div>
          ) : category === "investment" ? (
            <div className="border  mt-3  shadow rounded">
              <div
                className="bg-light bg-primary w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                style={{ height: "3rem" }}
              >
                <label className="fw-bold text-dark">List of Investments</label>{" "}
                <Button
                  variant="dark"
                  onClick={() =>
                    handleGenerateReportPdf(
                      investmentRef,
                      "investmentsreports.pdf"
                    )
                  }
                >
                  <FontAwesomeIcon icon={faFileExport} className="me-2" />
                  Generate List of Investments
                </Button>
              </div>

              <div className="" ref={investmentRef}>
                <div
                  className="w-100 d-flex align-items-center   ps-2 pe-2"
                  style={{ height: "6rem", backgroundColor: "#79118d" }}
                >
                  <img
                    src={logo}
                    alt="bias logo"
                    style={{ height: "5rem", width: "5rem" }}
                    className="rounded-circle shadow-lg"
                  />
                  <div className="d-flex align-items-center justify-content-center w-75 ms-5">
                    <h1 className="text-center  text-light ">
                      List of Investments
                    </h1>
                  </div>
                </div>

                <div className="mb-2 d-flex justify-content-end align-items-end  w-100 gap-3 pe-4">
                  <label className="fw-bold ">Date/Time: </label>
                  <label>{formattedDate}</label>
                </div>
                <table class="table align-middle text-center mb-0 bg-white">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Investors</th>
                      <th>Invest Amount</th>
                      <th>Interest Rate</th>
                      <th>Months</th>
                      <th>Total Interest</th>
                      <th>Total Return</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listOfInvestment.map((item) => (
                      <tr key={item.invst_id}>
                        <td>
                          <p class="fw-bold mb-1 pe-4">{item.invst_id}</p>
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            {item.user_profile ? (
                              <img
                                src={item.user_profile}
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
                                {item.user_fname} {item.user_lname}
                              </p>
                              <p class="text-muted mb-0">{item.user_email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">₱ {item.invst_amt}</p>
                        </td>

                        <td>
                          <p class="fw-normal mb-1">{item.invst_interest}%</p>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">{item.invst_num_month}</p>
                        </td>

                        <td>
                          <p class="fw-normal mb-1">
                            ₱ {item.invst_interest_sum}
                          </p>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">
                            ₱ {item.invst_returned_amt}
                          </p>
                        </td>
                        <td>
                          <span
                            class={`badge rounded-pill text-dark ${
                              item.invst_status === "request"
                                ? "bg-success "
                                : item.invst_status === "approved"
                                ? "bg-secondary"
                                : item.invst_status === "started"
                                ? "bg-warning"
                                : item.invst_status === "complete"
                                ? "bg-primary"
                                : item.invst_status === "cancel"
                                ? "bg-danger"
                                : ""
                            }`}
                          >
                            {item.invst_status}
                          </span>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">
                            {new Date(item.invst_created_at).toDateString()}
                          </p>
                        </td>

                        {/* <td>
                <button
                  type="button"
                  class="btn btn-link btn-rounded btn-sm fw-bold"
                  data-mdb-ripple-color="dark"
                >
                  Edit
                </button>
              </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 d-flex gap-3">
                  <label className="fw-bold ">Prepared by: </label>
                  <label>biascapstone@gmail.com</label>
                </div>
              </div>
            </div>
          ) : category === "business" ? (
            <div className="border  mt-3  shadow rounded">
              <div
                className="bg-light bg-primary w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                style={{ height: "3rem" }}
              >
                <label className="fw-bold text-dark">List of Business</label>{" "}
                <Button
                  variant="dark"
                  onClick={() =>
                    handleGenerateReportPdf(businessRef, "businessReports.pdf")
                  }
                >
                  <FontAwesomeIcon icon={faFileExport} className="me-2" />
                  Generate List of Business
                </Button>
              </div>

              <div className="" ref={businessRef}>
                <div
                  className="w-100 d-flex align-items-center   ps-2 pe-2"
                  style={{ height: "6rem", backgroundColor: "#79118d" }}
                >
                  <img
                    src={logo}
                    alt="bias logo"
                    style={{ height: "5rem", width: "5rem" }}
                    className="rounded-circle shadow-lg"
                  />
                  <div className="d-flex align-items-center justify-content-center w-75 ms-5">
                    <h1 className="text-center  text-light ">
                      List of Business
                    </h1>
                  </div>
                </div>

                <div className="mb-2 d-flex justify-content-end align-items-end  w-100 gap-3 pe-4">
                  <label className="fw-bold ">Date/Time: </label>
                  <label>{formattedDate}</label>
                </div>
                <table class="table align-middle text-center mb-0 bg-white">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Business</th>
                      <th>Return Loan</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listOfBusiness.map((item) => (
                      <tr key={item.buss_id}>
                        <td>
                          <p class="fw-bold mb-1 pe-4">{item.buss_id}</p>
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            {item.buss_photo ? (
                              <img
                                src={item.buss_photo}
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
                              <p class="fw-bold mb-1">{item.buss_name}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">
                            ₱ {item.buss_loan_return}
                          </p>
                        </td>
                        <td>
                          <span
                            class={`badge rounded-pill text-dark ${
                              item.buss_status === "request"
                                ? "bg-success "
                                : item.buss_status === "approved"
                                ? "bg-secondary"
                                : item.buss_status === "started"
                                ? "bg-warning"
                                : item.buss_status === "complete"
                                ? "bg-primary"
                                : item.buss_status === "cancel"
                                ? "bg-danger"
                                : ""
                            }`}
                          >
                            {item.buss_status}
                          </span>
                        </td>
                        <td>
                          <p class="fw-normal mb-1">
                            {new Date(item.buss_created_at).toDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 d-flex gap-3">
                  <label className="fw-bold ">Prepared by: </label>
                  <label>biascapstone@gmail.com</label>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="border  mt-3  shadow rounded">
                <div
                  className="bg-light bg-primary w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                  style={{ height: "3rem" }}
                >
                  <label className="fw-bold text-dark">
                    List of Investments
                  </label>{" "}
                  <Button
                    variant="dark"
                    onClick={() =>
                      handleGenerateReportPdf(
                        investmentRef,
                        "investmentsreports.pdf"
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faFileExport} className="me-2" />
                    Generate List of Investments
                  </Button>
                </div>

                <div className="" ref={investmentRef}>
                  <div
                    className="w-100 d-flex align-items-center   ps-2 pe-2"
                    style={{ height: "6rem", backgroundColor: "#79118d" }}
                  >
                    <img
                      src={logo}
                      alt="bias logo"
                      style={{ height: "5rem", width: "5rem" }}
                      className="rounded-circle shadow-lg"
                    />
                    <div className="d-flex align-items-center justify-content-center w-75 ms-5">
                      <h1 className="text-center  text-light ">
                        List of Investments
                      </h1>
                    </div>
                  </div>

                  <div className="mb-2 d-flex justify-content-end align-items-end  w-100 gap-3 pe-4">
                    <label className="fw-bold ">Date/Time: </label>
                    <label>{formattedDate}</label>
                  </div>
                  <table class="table align-middle text-center mb-0 bg-white">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Investors</th>
                        <th>Invest Amount</th>
                        <th>Interest Rate</th>
                        <th>Months</th>
                        <th>Total Interest</th>
                        <th>Total Return</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listOfInvestment.map((item) => (
                        <tr key={item.invst_id}>
                          <td>
                            <p class="fw-bold mb-1 pe-4">{item.invst_id}</p>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              {item.user_profile ? (
                                <img
                                  src={item.user_profile}
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
                                  {item.user_fname} {item.user_lname}
                                </p>
                                <p class="text-muted mb-0">{item.user_email}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">₱ {item.invst_amt}</p>
                          </td>

                          <td>
                            <p class="fw-normal mb-1">{item.invst_interest}%</p>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">{item.invst_num_month}</p>
                          </td>

                          <td>
                            <p class="fw-normal mb-1">
                              ₱ {item.invst_interest_sum}
                            </p>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              ₱ {item.invst_returned_amt}
                            </p>
                          </td>
                          <td>
                            <span
                              class={`badge rounded-pill text-dark ${
                                item.invst_status === "request"
                                  ? "bg-success "
                                  : item.invst_status === "approved"
                                  ? "bg-secondary"
                                  : item.invst_status === "started"
                                  ? "bg-warning"
                                  : item.invst_status === "complete"
                                  ? "bg-primary"
                                  : item.invst_status === "cancel"
                                  ? "bg-danger"
                                  : ""
                              }`}
                            >
                              {item.invst_status}
                            </span>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              {new Date(item.invst_created_at).toDateString()}
                            </p>
                          </td>

                          {/* <td>
                <button
                  type="button"
                  class="btn btn-link btn-rounded btn-sm fw-bold"
                  data-mdb-ripple-color="dark"
                >
                  Edit
                </button>
              </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 d-flex gap-3">
                    <label className="fw-bold ">Prepared by: </label>
                    <label>biascapstone@gmail.com</label>
                  </div>
                </div>
              </div>
              <div className="border  mt-3  shadow rounded">
                <div
                  className="bg-light bg-primary w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                  style={{ height: "3rem" }}
                >
                  <label className="fw-bold text-dark">List of Business</label>{" "}
                  <Button
                    variant="dark"
                    onClick={() =>
                      handleGenerateReportPdf(
                        businessRef,
                        "businessReports.pdf"
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faFileExport} className="me-2" />
                    Generate List of Business
                  </Button>
                </div>

                <div className="" ref={businessRef}>
                  <div
                    className="w-100 d-flex align-items-center   ps-2 pe-2"
                    style={{ height: "6rem", backgroundColor: "#79118d" }}
                  >
                    <img
                      src={logo}
                      alt="bias logo"
                      style={{ height: "5rem", width: "5rem" }}
                      className="rounded-circle shadow-lg"
                    />
                    <div className="d-flex align-items-center justify-content-center w-75 ms-5">
                      <h1 className="text-center  text-light ">
                        List of List of Business
                      </h1>
                    </div>
                  </div>

                  <div className="mb-2 d-flex justify-content-end align-items-end  w-100 gap-3 pe-4">
                    <label className="fw-bold ">Date/Time: </label>
                    <label>{formattedDate}</label>
                  </div>
                  <table class="table align-middle text-center mb-0 bg-white">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Business</th>
                        <th>Return Loan</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listOfBusiness.map((item) => (
                        <tr key={item.buss_id}>
                          <td>
                            <p class="fw-bold mb-1 pe-4">{item.buss_id}</p>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              {item.buss_photo ? (
                                <img
                                  src={item.buss_photo}
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
                                <p class="fw-bold mb-1">{item.buss_name}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              ₱ {item.buss_loan_return}
                            </p>
                          </td>
                          <td>
                            <span
                              class={`badge rounded-pill text-dark ${
                                item.buss_status === "request"
                                  ? "bg-success "
                                  : item.buss_status === "approved"
                                  ? "bg-secondary"
                                  : item.buss_status === "started"
                                  ? "bg-warning"
                                  : item.buss_status === "complete"
                                  ? "bg-primary"
                                  : item.buss_status === "cancel"
                                  ? "bg-danger"
                                  : ""
                              }`}
                            >
                              {item.buss_status}
                            </span>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              {new Date(item.buss_created_at).toDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 d-flex gap-3">
                    <label className="fw-bold ">Prepared by: </label>
                    <label>biascapstone@gmail.com</label>
                  </div>
                </div>
              </div>{" "}
              <div className="border  mt-3  shadow rounded">
                <div
                  className="bg-light w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                  style={{ height: "3rem" }}
                >
                  <label className="fw-bold text-danger">List of Users</label>{" "}
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleGenerateReportPdf(reportsRef, "userreports.pdf")
                    }
                  >
                    <FontAwesomeIcon icon={faFileExport} className="me-2" />
                    Generate List of Users
                  </Button>
                </div>
                <div className="" ref={reportsRef}>
                  <div
                    className="w-100 d-flex align-items-center   ps-2 pe-2"
                    style={{ height: "6rem", backgroundColor: "#79118d" }}
                  >
                    <img
                      src={logo}
                      alt="bias logo"
                      style={{ height: "5rem", width: "5rem" }}
                      className="rounded-circle shadow-lg"
                    />
                    <div className="d-flex align-items-center justify-content-center w-75 ms-5">
                      <h1 className="text-center  text-light ">
                        List of Users
                      </h1>
                    </div>
                  </div>

                  <div className="mb-2 d-flex justify-content-end align-items-end  w-100 gap-3 pe-4">
                    <label className="fw-bold ">Date/Time: </label>
                    <label>{formattedDate}</label>
                  </div>
                  <table className="table  table-sm align-middle text-center mb-0 bg-white ">
                    <thead className="table-dark">
                      <tr className="rounded">
                        <th>User ID</th>
                        <th>Name</th>
                        <th>User Type</th>
                        <th>Age</th>
                        <th>Birthdate</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Contact Number</th>

                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listofUser.map((item, index) => (
                        <tr key={item.user_id}>
                          <td>{item.user_id}</td>
                          <td>
                            <div class="d-flex align-items-center">
                              {item.user_profile ? (
                                <img
                                  src={item.user_profile}
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
                                  {item.user_fname} {item.user_lname}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              class={`badge rounded-pill text-dark ${
                                item.user_type === "entrepreneur"
                                  ? "bg-success "
                                  : item.user_type === "investor"
                                  ? "bg-secondary"
                                  : ""
                              }`}
                            >
                              {item.user_type}
                            </span>
                          </td>
                          <td>{item.user_age}</td>
                          <td>
                            {new Date(item.user_bdate).toLocaleDateString()}
                          </td>
                          <td>{item.user_gender}</td>{" "}
                          <td>
                            <p class="fw-normal mb-1">
                              {item.user_barangay}, {item.user_city},{" "}
                              {item.user_province}
                            </p>
                          </td>
                          <td>{item.user_contact_num}</td>
                          <td>
                            <span
                              class={`badge rounded-pill  ${
                                item.user_status === "basic"
                                  ? "bg-danger "
                                  : item.user_status === "semi"
                                  ? "bg-warning"
                                  : item.user_status === "verified"
                                  ? "bg-info"
                                  : ""
                              }`}
                            >
                              {item.user_status}
                            </span>
                          </td>
                          <td>
                            {new Date(
                              item.user_created_at
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 d-flex gap-3">
                    <label className="fw-bold ">Prepared by: </label>
                    <label>biascapstone@gmail.com</label>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
