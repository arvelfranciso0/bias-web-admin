import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faCoins,
  faComments,
  faUsers,
  faStore,
  faBusinessTime,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import Loader from "../Components/loader";
import Chart from "chart.js/auto";
import ChartComponent from "../Components/ChartsComponent";
import { useNavigate } from "react-router-dom";
import CharstForEarnings from "../Components/CharstForEarnings";
function Dashboard() {
  const [listReports, setListReports] = useState([]);
  const [userCount, setUserCount] = useState("");
  const [BusinessRes, setBusinessRes] = useState("");
  const [invesRes, setinvesRes] = useState("");
  const [transacRes, settransacRes] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const reportsRef = useRef();
  const navigate = useNavigate();
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
            earningSum,
          } = res.data;
          setUserCount(userRes.length);
          setBusinessRes(BusinessRes.length);
          setinvesRes(invesRes.length);
          settransacRes(transacRes.length);
          setListReports(result);
          setEarnings(earningSum);
          setShowLoader(false);
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

  const handleGenerateReportPdf = () => {
    generatePDF(reportsRef, {
      filename: "report.pdf",
      canvas: { mimeType: "image/png", qualityRatio: 1 },
      page: { margin: Margin.LARGE, orientation: "landscape" },
      overrides: {
        pdf: {
          compress: true,
        },

        canvas: {
          useCORS: true,
        },
      },
    });
  };

  return (
    <div className="container-fluid">
      {showLoader ? (
        <div
          className="d-flex align-items-center justify-content-center "
          style={{ height: "90vh" }}
        >
          <Loader />
        </div>
      ) : (
        <>
          {" "}
          <div className="d-flex justify-content-end w-100 mt-2">
            {/* <Button variant="primary">
          <FontAwesomeIcon icon={faFileExport} className="me-2" />
          Generate Earning
        </Button> */}
          </div>
          <div className="d-flex justify-content-between w-100 mt-2 flex-wrap gap-5">
            <div
              className="border border-primary border-2 d-flex rounded shadow ps-3 pe-3 justify-content-between align-items-center"
              style={{ width: "15rem", height: "6rem" }}
            >
              <div className=" d-flex ps-3 justify-content-center flex-column ">
                <label
                  className="fw-bold text-primary"
                  style={{ fontSize: ".8rem" }}
                >
                  EARNINGS
                </label>
                <label className="fw-bold text-secondary fs-4">
                  {earnings ? <> ₱ {earnings.toFixed(2)}</> : 0.0}
                </label>
              </div>

              <FontAwesomeIcon
                icon={faCoins}
                size="2xl"
                style={{ color: "#a3a3a3" }}
              />
            </div>
            <div
              className="border border-success border-2 d-flex rounded shadow ps-3 pe-3 justify-content-between align-items-center"
              style={{ width: "15rem", height: "6rem" }}
            >
              <div className=" d-flex ps-3 justify-content-center flex-column ">
                <label
                  className="fw-bold text-success"
                  style={{ fontSize: ".8rem" }}
                >
                  USERS
                </label>
                <label className="fw-bold text-secondary fs-4">
                  {userCount}
                </label>
              </div>

              <FontAwesomeIcon
                icon={faUsers}
                size="2xl"
                style={{ color: "#a3a3a3" }}
              />
            </div>
            <div
              className="border border-danger border-2 d-flex rounded shadow ps-3 pe-3 justify-content-between align-items-center"
              style={{ width: "15rem", height: "6rem" }}
            >
              <div className=" d-flex ps-3 justify-content-center flex-column ">
                <label
                  className="fw-bold text-danger"
                  style={{ fontSize: ".8rem" }}
                >
                  BUSINESS
                </label>
                <label className="fw-bold text-secondary fs-4">
                  {BusinessRes}
                </label>
              </div>

              <FontAwesomeIcon
                icon={faStore}
                size="2xl"
                style={{ color: "#a3a3a3" }}
              />
            </div>
            <div
              className="border border-warning border-2 d-flex rounded shadow ps-3 pe-3 justify-content-between align-items-center"
              style={{ width: "15rem", height: "6rem" }}
            >
              <div className=" d-flex ps-3 justify-content-center flex-column ">
                <label
                  className="fw-bold text-warning"
                  style={{ fontSize: ".8rem" }}
                >
                  INVESTMENT
                </label>
                <label className="fw-bold text-secondary fs-4">
                  {invesRes}
                </label>
              </div>

              <FontAwesomeIcon
                icon={faBusinessTime}
                size="2xl"
                style={{ color: "#a3a3a3" }}
              />
            </div>
          </div>
          {/* <div
            ref={chartContainerRef}
            style={{ width: "400px", height: "200px" }}
          ></div> */}
          <div className="d-flex mt-5 flex-wrap justify-content-evenly w-100 ">
            <div
              className="border p-2  shadow rounded"
              style={{ height: "60vh", width: "40%" }}
            >
              <div
                className="bg-light w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                style={{ height: "3rem" }}
              >
                <label className="fw-bold text-primary">User Summary</label>{" "}
              </div>
              <div
                className=" d-flex align-items-center justify-content-center"
                style={{ height: "50vh", width: "100%" }}
                // ref={chartRef}
              >
                <ChartComponent />
                {/* <table
                  className="table  table-sm align-middle text-center mb-0 bg-white "
                  ref={reportsRef}
                >
                  <thead className="table-primary">
                    <tr className="rounded">
                      <th>Business</th>
                      <th>Entreprenuer</th>
                      <th>Laon Return</th>
                      <th>Investor</th>
                      <th>Return Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listReports.map((item, index) => (
                      <tr key={index}>
                        <td>{item.buss_name}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="ms-3">
                              <p class="fw-bold mb-1">
                                {item.user_fname} {item.user_lname}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{item.buss_loan_return}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="ms-3">
                              <p class="fw-bold mb-1">
                                {item.invstFname} {item.invstLname}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{item.invst_returned_amt}</td>
                        <td>
                          {new Date(item.invst_created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
              </div>
            </div>
            <div
              className="border  p-2  shadow rounded"
              style={{ height: "60vh", width: "40%" }}
            >
              <div
                className="bg-light w-100 justify-content-between pe-2 d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                style={{ height: "3rem" }}
              >
                <label className="fw-bold text-primary">Earnings Summary</label>{" "}
              </div>
              <div
                className=" d-flex align-items-center justify-content-center"
                style={{ height: "50vh", width: "100%" }}
                // ref={chartRef}
              >
                <CharstForEarnings />
                {/* <table
                  className="table  table-sm align-middle text-center mb-0 bg-white "
                  ref={reportsRef}
                >
                  <thead className="table-primary">
                    <tr className="rounded">
                      <th>Business</th>
                      <th>Entreprenuer</th>
                      <th>Laon Return</th>
                      <th>Investor</th>
                      <th>Return Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listReports.map((item, index) => (
                      <tr key={index}>
                        <td>{item.buss_name}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="ms-3">
                              <p class="fw-bold mb-1">
                                {item.user_fname} {item.user_lname}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{item.buss_loan_return}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="ms-3">
                              <p class="fw-bold mb-1">
                                {item.invstFname} {item.invstLname}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{item.invst_returned_amt}</td>
                        <td>
                          {new Date(item.invst_created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
              </div>
            </div>
            {/* <div
              className="border  mt-3  shadow rounded"
              style={{ height: "67vh", width: "30%" }}
            >
              <div
                className="bg-light w-100  d-flex align-items-center ps-2  border border-top-0 border-end-0 border-start-0"
                style={{ height: "3rem" }}
              >
                <label className="fw-bold text-primary">Earnings</label>
              </div>
              <div className="p-4">
                <table className="table  table-sm align-middle text-center mb-0 bg-white ">
                  <thead className="table-primary">
                    <tr className="rounded">
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>₱ 100.00</td>
                      <td>November 23, 2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
          {/* <canvas ref={chartRef} width="400" height="200"></canvas> */}
        </>
      )}
    </div>
  );
}

export default Dashboard;
