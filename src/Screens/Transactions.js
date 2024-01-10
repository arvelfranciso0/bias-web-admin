import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Nav,
  NavDropdown,
  Navbar,
  Dropdown,
} from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Loader from "../Components/loader";
function Transactions(props) {
  const [selectValue, setSelectValue] = useState("All");
  const [showLoader, setShowLoader] = useState(false);
  const [showTypeTransaction, setShowTypeTransaction] = useState("");
  const [listoftransactions, setListofTransactions] = useState([]);
  const [totalInvestamount, setTotalInvestAmount] = useState(0);
  const [totalWithdrawAmount, setTotalWithdrawAmount] = useState(0);
  const [totalReturnLoan, setTotalReturnLoan] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSendCapita, setTotalSendCapital] = useState(0);
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    setShowLoader(true);
    axios
      .get(`${process.env.REACT_APP_NETWORK_ADD}/admin/listoftransactions`)
      .then((res) => {
        if (res) {
          if (res.data.status) {
            const data = res.data.result;

            const invest = data.filter((item) => {
              if (item.transac_type === "invest") {
                return item;
              }
            });
            const withdraw = data.filter((item) => {
              if (item.transac_type === "withdraw") {
                return item;
              }
            });
            const returnLoan = data.filter((item) => {
              if (item.transac_type === "returnloan") {
                return item;
              }
            });
            const sendfund = data.filter((item) => {
              if (item.transac_type === "sendcapital") {
                return item;
              }
            });
            const totalInvest = invest.reduce((accumaltor, currentValue) => {
              return (accumaltor += parseFloat(currentValue.transac_amt));
            }, 0);
            const totalWithdraw = withdraw.reduce(
              (accumaltor, currentValue) => {
                return (accumaltor += parseFloat(currentValue.transac_amt));
              },
              0
            );
            const totalreturnLoan = returnLoan.reduce(
              (accumaltor, currentValue) => {
                return (accumaltor += parseFloat(currentValue.transac_amt));
              },
              0
            );
            const totalsendfunds = sendfund.reduce(
              (accumaltor, currentValue) => {
                return (accumaltor += parseFloat(currentValue.transac_amt));
              },
              0
            );

            setTotalEarnings(res.data.earningSum);
            setTotalSendCapital(totalsendfunds);
            setTotalWithdrawAmount(totalWithdraw);
            setTotalInvestAmount(totalInvest);
            setListofTransactions(data);
            setTotalReturnLoan(totalreturnLoan);
            setShowLoader(false);
          }
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

  useEffect(() => {
    const sortedData = listoftransactions.sort((a, b) => {
      const dateA = new Date(a.transac_created_at);
      const dateB = new Date(b.transac_created_at);

      if (dateA >= new Date(startDate) && dateA <= new Date(endDate)) {
        if (dateB >= new Date(startDate) && dateB <= new Date(endDate)) {
          return dateA - dateB;
        } else {
          return -1; // 'a' is within the range, but 'b' is not, so 'a' comes first
        }
      } else if (dateB >= new Date(startDate) && dateB <= new Date(endDate)) {
        return 1; // 'b' is within the range, but 'a' is not, so 'b' comes first
      } else {
        return 0; // both 'a' and 'b' are outside the range, their order doesn't matter
      }
    });

    setListofTransactions(sortedData);
  }, [startDate, endDate]);

  // useEffect(() => {}, [listoftransactions, category]);

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
          <div className="contianer border p-2 mt-2 d-flex justify-content-between">
            <div className="d-flex flex-column ">
              <label className="fw-bold fs-3">Total Earnings</label>

              {totalEarnings ? (
                <label className="fs-4">₱ {totalEarnings.toFixed(2)}</label>
              ) : (
                <label
                  className="fw-bold text-danger"
                  style={{ fontSize: ".7rem" }}
                >
                  No Complete Investment yet
                </label>
              )}
            </div>
            <div className="d-flex flex-column w-50  align-items-end">
              <div className="w-50 d-flex justify-content-between   ">
                <label className="fw-bold">Invest</label>
                <label>₱ {totalInvestamount.toFixed(2)}</label>
              </div>
              <div className="w-50 d-flex justify-content-between   ">
                <label className="fw-bold"> Withdraw</label>
                <label>₱ {totalWithdrawAmount.toFixed(2)}</label>
              </div>
              <div className="w-50 d-flex justify-content-between   ">
                <label className="fw-bold"> Send Capital</label>
                <label>₱ {totalSendCapita.toFixed(2)}</label>
              </div>
              <div className="w-50 d-flex justify-content-between   ">
                <label className="fw-bold"> Return Amount</label>
                <label>₱ {totalReturnLoan.toFixed(2)}</label>
              </div>
            </div>
          </div>
          <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container fluid>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto" variant="pills">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Type
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setCategory("all")}>
                        All
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setCategory("invest")}>
                        Invest
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setCategory("returnloan")}>
                        Return Loan
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setCategory("withdraw")}>
                        Withdraw
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setCategory("sendcapital")}>
                        Send Capital
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
                <Form className="d-flex align-items-center gap-2">
                  <label className="w-50">Start Date</label>
                  <Form.Control
                    type="date"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form>
                <Form className="d-flex align-items-center gap-2">
                  <label className="w-50">End Date</label>
                  <Form.Control
                    type="date"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <div className="overflow-auto" style={{ height: "62vh" }}>
            {" "}
            <table class="table align-middle mb-0 bg-white mt-4">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Email</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {listoftransactions.map((item) => (
                  <tr key={item.transac_id}>
                    {category === item.transac_type ? (
                      <>
                        {" "}
                        <td>{item.transac_id}</td>
                        <td>
                          {" "}
                          <div class="d-flex align-items-center">
                            {item.user_profile ? (
                              <img
                                src={item.user_profile}
                                class="rounded-circle"
                                alt=""
                                style={{
                                  width: "45px",
                                  height: "45px",
                                }}
                              />
                            ) : (
                              <img
                                src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                                class="rounded-circle"
                                alt=""
                                style={{
                                  width: "45px",
                                  height: "45px",
                                }}
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
                          <span
                            class={`badge rounded-pill  ${
                              item.transac_type === "invest"
                                ? "bg-success  text-light "
                                : item.transac_type === "withdraw"
                                ? "bg-info text-dark"
                                : item.transac_type === "returnloan"
                                ? "bg-primary text-dark"
                                : item.transac_type === "invest_update"
                                ? "bg-secondary text-dark"
                                : item.transac_type === "sendcapital"
                                ? "bg-primary"
                                : item.transac_type === "refund"
                                ? "bg-dark"
                                : ""
                            }`}
                          >
                            {item.transac_type}
                          </span>
                        </td>
                        <td>{item.transac_amt}</td>
                        <td>{item.transac_email}</td>
                        <td>
                          {new Date(
                            item.transac_created_at
                          ).toLocaleDateString()}
                        </td>
                      </>
                    ) : category === "all" ? (
                      <>
                        {" "}
                        <td>{item.transac_id}</td>
                        <td>
                          {" "}
                          <div class="d-flex align-items-center">
                            {item.user_profile ? (
                              <img
                                src={item.user_profile}
                                class="rounded-circle"
                                alt=""
                                style={{
                                  width: "45px",
                                  height: "45px",
                                }}
                              />
                            ) : (
                              <img
                                src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                                class="rounded-circle"
                                alt=""
                                style={{
                                  width: "45px",
                                  height: "45px",
                                }}
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
                          <span
                            class={`badge rounded-pill  ${
                              item.transac_type === "invest"
                                ? "bg-success  text-light "
                                : item.transac_type === "withdraw"
                                ? "bg-info text-dark"
                                : item.transac_type === "returnloan"
                                ? "bg-primary text-dark"
                                : item.transac_type === "invest_update"
                                ? "bg-secondary text-dark"
                                : item.transac_type === "sendcapital"
                                ? "bg-primary"
                                : ""
                            }`}
                          >
                            {item.transac_type}
                          </span>
                        </td>
                        <td>{item.transac_amt}</td>
                        <td>{item.transac_email}</td>
                        <td>
                          {new Date(
                            item.transac_created_at
                          ).toLocaleDateString()}
                        </td>
                      </>
                    ) : (
                      ""
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Transactions;
