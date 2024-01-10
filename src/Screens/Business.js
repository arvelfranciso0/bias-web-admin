import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import {
  calculateTotalAccumalatedAmount,
  checkUseFundsCompletion,
  computerRemain,
} from "../Functions/utils";
import {
  Button,
  Nav,
  Dropdown,
  DropdownButton,
  Form,
  Navbar,
  Container,
  NavDropdown,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Css/navigation.css";
import SendAccumaltedAmount from "../Components/SendAccumaltedAmount";
import { encryptArray } from "../Functions/Encryption";
import { CheckBusinessDatesStatus } from "../Functions/CheckBusinessDate";
import Loader from "../Components/loader";
// import { encryptArray } from "../Functions/Encryption";
import { v4 as uuidv4 } from "uuid";
function Business(props) {
  const [listBusiness, setListBusiness] = useState([]);
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [typeStatus, settypeStatus] = useState("all");
  const [alertType, setalertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStatus, setalertStatus] = useState(false);
  const [showModalInvesttoApprove, setShowModalInvesttoApprove] =
    useState(false);
  const [investmentList, setinvestmentList] = useState([]);
  const [todayDate, setTodayDate] = useState("");
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_PAYPAL_CLIEN_SECRET_KEY;
  const accessToken = btoa(`${clientId}:${clientSecret}`);
  useEffect(() => {
    setShowLoader(true);
    axios
      .get(`${process.env.REACT_APP_NETWORK_ADD}/admin/listofbusiness`)
      .then((res) => {
        if (res.data.status) {
          const businessList = res.data.result;

          businessList.sort((current, next) => {
            if (
              current.buss_status === "cancel" &&
              next.buss_status !== "cancel"
            ) {
              return 1;
            } else if (
              current.buss_status !== "cancel" &&
              next.buss_status === "cancel"
            ) {
              return -1;
            } else {
              return 0;
            }
          });
          setListBusiness(businessList);
          setTodayDate(res.data.currentDate);
          setShowLoader(false);
          console.log(businessList);
        } else {
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

  const hanldeSendCapital = (
    investment,
    installmet,
    funds,
    buss_user_id,
    buss_id,
    paypalEmail
  ) => {
    const investStatus = investment.every(
      (item) => item.invst_status === "approved"
    );

    if (investStatus) {
      localStorage.setItem("useFunds", funds);
      localStorage.setItem("installments", installmet);
      navigate(
        `sendamount?user_id=${buss_user_id}&buss_id=${buss_id}&email=${paypalEmail}`
      );
    } else {
      const investmentHasReqeust = investment.filter(
        (item) => item.invst_status === "request"
      );

      setalertStatus(true);
      setalertType("danger");
      setAlertMsg("There are investment that are not yet approved.");
      setinvestmentList(investmentHasReqeust);
      setShowModalInvesttoApprove(true);
      // alert("There are investment that are not yet approved.");
    }
  };
  const handleClose = () => {
    setShowModalInvesttoApprove(false);
  };

  const handleCancelBusiness = async (
    investments,
    bussId,
    investmentData,
    entrepId
  ) => {
    //setShowLoader(true);

    // console.log(investmentData);

    let items = [];
    investmentData.forEach((item) => {
      items.push({
        recipient_type: "EMAIL",
        amount: {
          value: item.transac_amt,
          currency: "PHP",
        },
        note: "Thanks for your patronage!",
        sender_item_id: "id",
        receiver: item.transac_email,
        recipient_wallet: "PAYPAL",
      });
    });
    const sender_batch_id = `${uuidv4()}`;
    const payoutData = {
      sender_batch_header: {
        sender_batch_id: sender_batch_id,
        email_subject: "You have a recieve a refund from the investment.",
      },
      items: items,
      // items: [
      //   {
      //     recipient_type: "EMAIL",
      //     amount: {
      //       value: "amount",
      //       currency: "PHP",
      //     },
      //     note: "Thanks for your patronage!",
      //     sender_item_id: "id",
      //     receiver: "email",
      //     recipient_wallet: "PAYPAL",
      //   },
      // ],
    };
    // if (investments >= 0) {
    //   axios
    //     .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/cancelbusiness`, {
    //       bussId,
    //       investmentData,
    //       entrepId,
    //     })
    //     .then((res) => {
    //       if (res.data.status) {
    //         setalertStatus(true);
    //         setalertType("success");
    //         setAlertMsg(res.data.message);
    //         setShowLoader(false);
    //         window.location.reload();
    //       } else {
    //         setalertStatus(true);
    //         setalertType("success");
    //         setAlertMsg(res.data.message);
    //         setShowLoader(false);
    //       }
    //     });
    // } else {
    //   setShowLoader(false);
    // }

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/payments/payouts",
      JSON.stringify(payoutData),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${accessToken}`,
        },
      }
    );

    console.log(response.data);
    //const payout_batchId = response.data.batch_header.payout_batch_id;
    //console.log(payoutData);
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    const sortedData = listBusiness.sort((a, b) => {
      const dateA = new Date(a.buss_created_at);
      const dateB = new Date(b.buss_created_at);

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

    setListBusiness(sortedData);
  }, [startDate, endDate]);
  return (
    <div className="container-fluid mt-3">
      <ToastContainer position="top-center" className="p-3">
        <Toast
          className="d-inline-block m-1"
          bg={alertType}
          show={alertStatus}
          delay={2000}
          onClose={() => {
            setalertStatus(false);
          }}
          autohide
        >
          <Toast.Body className="primary text-light">{alertMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
      {showModalInvesttoApprove ? (
        <Modal show={true} size="lg" onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Users Investment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {investmentList ? (
              <table class="table align-middle text-center mb-0 bg-white">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Investors</th>
                    <th>Invest Amount</th>

                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investmentList.map((item) => (
                    <tr key={item.invst_id}>
                      <td>
                        <p class="fw-bold mb-1 pe-4">{item.invst_id}</p>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          {item.investor_profile ? (
                            <img
                              src={item.investor_profile}
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
                        <span
                          class={`badge rounded-pill text-dark ${
                            item.invst_status === "request"
                              ? "bg-success "
                              : item.invst_status === "approved"
                              ? "bg-secondary"
                              : item.status === "started"
                              ? "bg-primary"
                              : ""
                          }`}
                        >
                          {item.invst_status}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          as={NavLink}
                          to={`/admin/investments/approval?id=${item.invst_id}&user_id=${item.investor_id}`}
                          role="button"
                        >
                          Approved
                        </Button>{" "}
                        {/* <Button variant="primary">View</Button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto d-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Type
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => settypeStatus("all")}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => settypeStatus("pending")}>
                    Pending
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => settypeStatus("approved")}>
                    Approved
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => settypeStatus("start")}>
                    Start
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => settypeStatus("complete")}>
                    Complete
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => settypeStatus("cancel")}>
                    Cancel
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
      {/* <Navbar collapseOnSelect>
        <Container fluid>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav variant="pills" bg="dark" className="">
              <Nav>
                <DropdownButton
                  id="dropdown-button-dark-example1"
                  title="Business Category"
                  variant="dark"
                  size="sm"
                  data-bs-theme="dark"
                >
                  <Dropdown.Item href="#action/3.1">Retail</Dropdown.Item>
                  <Dropdown.Item href="#action/3.2">
                    Food and Beverage
                  </Dropdown.Item>
                  <Dropdown.Item href="#action/3.3">E-commerce</Dropdown.Item>
                  <Dropdown.Item href="#action/3.4"></Dropdown.Item>
                </DropdownButton>
              </Nav>

              <div className="d-flex align-items-center justify-content-between">
                <div class="d-flex ms-2  gap-2 align-items-center">
                  <label class="w-50 ">Start Date</label>
                  <input type="date" class="form-control w-75" />
                </div>
                <div class="d-flex   gap-2 align-items-center ms-2">
                  <label class="w-50">End Date</label>
                  <input type="date" class="form-control w-75" />
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
      <div className="overflow-auto" style={{ height: "78vh" }}>
        {showLoader ? (
          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ height: "78vh" }}
          >
            <Loader />
          </div>
        ) : (
          <table class="table align-middle mb-0 text-center bg-white mt-3 ">
            <thead className="table-dark">
              <tr>
                <th>Business Name</th>
                <th>Business Status</th>
                <th>Business Capital</th>
                <th>Accumalation Amount</th>
                <th>Accumalation Status</th>
                <th>Amount Return</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listBusiness.map((item, index) => (
                <tr
                  key={item.buss_id}
                  className={`${
                    item.buss_status === "cancel" ? "table-danger" : ""
                  }`}
                >
                  {typeStatus === "all" ? (
                    <>
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
                              src="https://i.pinimg.com/originals/d6/89/57/d6895790f9870b4597465a4e2b0b676a.png"
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
                        <span
                          class={`badge rounded-pill  ${
                            item.buss_status === "pending"
                              ? "bg-success  text-light "
                              : item.buss_status === "approved"
                              ? "bg-info text-dark"
                              : item.buss_status === "start"
                              ? "bg-primary text-dark"
                              : item.buss_status === "complete"
                              ? "bg-primary text-dark"
                              : item.buss_status === "cancel"
                              ? "bg-danger text-light"
                              : ""
                          }`}
                        >
                          {item.buss_status}
                        </span>
                      </td>
                      <td>
                        <p class="fw-normal mb-1">₱ {item.buss_capital}</p>
                      </td>
                      <td>
                        {calculateTotalAccumalatedAmount(item.investments) ? (
                          <p class="fw-normal mb-1">
                            ₱{" "}
                            {calculateTotalAccumalatedAmount(item.investments)}
                          </p>
                        ) : (
                          <p class="fw-normal mb-1">₱ 0</p>
                        )}
                      </td>
                      <td>
                        <p
                          class={`fw-normal rounded-pill text-center ${
                            calculateTotalAccumalatedAmount(
                              item.investments
                            ) === parseFloat(item.buss_capital)
                              ? "bg-success text-light"
                              : "bg-warning"
                          }`}
                        >
                          {calculateTotalAccumalatedAmount(item.investments) ===
                          parseFloat(item.buss_capital)
                            ? "Complete"
                            : "In Progress"}
                        </p>
                      </td>
                      <td>
                        <p class="fw-normal mb-1">₱ {item.buss_loan_return}</p>
                      </td>
                      <td>
                        {new Date(item.buss_created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {CheckBusinessDatesStatus(
                          new Date(item.buss_created_at),
                          new Date(todayDate)
                        ) &&
                        item.buss_status !== "start" &&
                        item.buss_status !== "complete" &&
                        item.buss_status !== "cancel" &&
                        calculateTotalAccumalatedAmount(item.investments) !==
                          parseFloat(item.buss_capital) ? (
                          <>
                            <Button
                              variant="danger"
                              // as={NavLink}
                              // to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                              role="button"
                              className="me-2"
                              onClick={() =>
                                handleCancelBusiness(
                                  calculateTotalAccumalatedAmount(
                                    item.investments
                                  ),
                                  item.buss_id,
                                  item.investments,
                                  item.buss_user_id
                                )
                              }
                            >
                              Cancel Business
                            </Button>
                          </>
                        ) : (
                          <>
                            {" "}
                            {item.buss_status === "pending" ? (
                              <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center">
                                <Button
                                  variant="success"
                                  as={NavLink}
                                  to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                  role="button"
                                  className="me-2"
                                >
                                  Approve
                                </Button>
                                <Button
                                  as={NavLink}
                                  variant="secondary"
                                  to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                >
                                  View
                                </Button>
                              </div>
                            ) : item.buss_status === "approved" &&
                              calculateTotalAccumalatedAmount(
                                item.investments
                              ) === parseFloat(item.buss_capital) ? (
                              <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center">
                                <Button
                                  variant="success"
                                  className="me-2"
                                  onClick={() => {
                                    hanldeSendCapital(
                                      item.investments,
                                      encryptArray(item.buss_installment),
                                      encryptArray(item.buss_useof_funds),
                                      item.buss_user_id,
                                      item.buss_id,
                                      item.buss_user_paypal_email
                                    );
                                    localStorage.setItem(
                                      "entrepEmail",
                                      item.user_email
                                    );
                                  }}
                                >
                                  Send Capital
                                </Button>
                                <Button
                                  as={NavLink}
                                  variant="secondary"
                                  to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                >
                                  View
                                </Button>
                              </div>
                            ) : item.buss_status === "approved" ? (
                              <Button
                                as={NavLink}
                                variant="secondary"
                                to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                              >
                                View
                              </Button>
                            ) : item.buss_status === "start" ? (
                              <Button
                                as={NavLink}
                                variant="secondary"
                                to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                              >
                                View
                              </Button>
                            ) : item.buss_status === "complete" ? (
                              <Button
                                as={NavLink}
                                variant="secondary"
                                to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                              >
                                View
                              </Button>
                            ) : CheckBusinessDatesStatus(
                                new Date(item.buss_created_at),
                                new Date(todayDate)
                              ) &&
                              item.buss_status !== "start" &&
                              item.buss_status !== "complete" &&
                              item.buss_status === "cancel" &&
                              calculateTotalAccumalatedAmount(
                                item.investments
                              ) !== parseFloat(item.buss_capital) ? (
                              <label className="fw-bold text-danger">
                                Business Cancel
                              </label>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      {item.buss_status === typeStatus ? (
                        <>
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
                                  src="https://i.pinimg.com/originals/d6/89/57/d6895790f9870b4597465a4e2b0b676a.png"
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
                            <span
                              class={`badge rounded-pill  ${
                                item.buss_status === "pending"
                                  ? "bg-success  text-light "
                                  : item.buss_status === "approved"
                                  ? "bg-info text-dark"
                                  : item.buss_status === "start"
                                  ? "bg-primary text-dark"
                                  : item.buss_status === "complete"
                                  ? "bg-primary text-dark"
                                  : item.buss_status === "cancel"
                                  ? "bg-danger text-light"
                                  : ""
                              }`}
                            >
                              {item.buss_status}
                            </span>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">₱ {item.buss_capital}</p>
                          </td>
                          <td>
                            {calculateTotalAccumalatedAmount(
                              item.investments
                            ) ? (
                              <p class="fw-normal mb-1">
                                ₱{" "}
                                {calculateTotalAccumalatedAmount(
                                  item.investments
                                )}
                              </p>
                            ) : (
                              <p class="fw-normal mb-1">₱ 0</p>
                            )}
                          </td>
                          <td>
                            <p
                              class={`fw-normal rounded-pill text-center ${
                                calculateTotalAccumalatedAmount(
                                  item.investments
                                ) === parseFloat(item.buss_capital)
                                  ? "bg-success text-light"
                                  : "bg-warning"
                              }`}
                            >
                              {calculateTotalAccumalatedAmount(
                                item.investments
                              ) === parseFloat(item.buss_capital)
                                ? "Complete"
                                : "In Progress"}
                            </p>
                          </td>
                          <td>
                            <p class="fw-normal mb-1">
                              ₱ {item.buss_loan_return}
                            </p>
                          </td>
                          <td>
                            {new Date(
                              item.buss_created_at
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            {CheckBusinessDatesStatus(
                              new Date(item.buss_created_at),
                              new Date(todayDate)
                            ) &&
                            item.buss_status !== "start" &&
                            item.buss_status !== "complete" &&
                            item.buss_status !== "cancel" &&
                            calculateTotalAccumalatedAmount(
                              item.investments
                            ) !== parseFloat(item.buss_capital) ? (
                              <>
                                {" "}
                                <Button
                                  variant="danger"
                                  // as={NavLink}
                                  // to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                  role="button"
                                  className="me-2"
                                  onClick={() =>
                                    handleCancelBusiness(
                                      calculateTotalAccumalatedAmount(
                                        item.investments
                                      ),
                                      item.buss_id,
                                      item.investments,
                                      item.buss_user_id
                                    )
                                  }
                                >
                                  Cancel Business
                                </Button>
                              </>
                            ) : (
                              <>
                                {" "}
                                {item.buss_status === "pending" ? (
                                  <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center">
                                    <Button
                                      variant="success"
                                      as={NavLink}
                                      to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                      role="button"
                                      className="me-2"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      as={NavLink}
                                      variant="secondary"
                                      to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                    >
                                      View
                                    </Button>
                                  </div>
                                ) : item.buss_status === "approved" &&
                                  calculateTotalAccumalatedAmount(
                                    item.investments
                                  ) === parseFloat(item.buss_capital) ? (
                                  <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center">
                                    <Button
                                      variant="success"
                                      className="me-2"
                                      onClick={() => {
                                        hanldeSendCapital(
                                          item.investments,
                                          encryptArray(item.buss_installment),
                                          encryptArray(item.buss_useof_funds),
                                          item.buss_user_id,
                                          item.buss_id,
                                          item.buss_user_paypal_email
                                        );
                                      }}
                                    >
                                      Send Capital
                                    </Button>
                                    <Button
                                      as={NavLink}
                                      variant="secondary"
                                      to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                    >
                                      View
                                    </Button>
                                  </div>
                                ) : item.buss_status === "approved" ? (
                                  <Button
                                    as={NavLink}
                                    variant="secondary"
                                    to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                  >
                                    View
                                  </Button>
                                ) : item.buss_status === "start" ? (
                                  <Button
                                    as={NavLink}
                                    variant="secondary"
                                    to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                  >
                                    View
                                  </Button>
                                ) : item.buss_status === "complete" ? (
                                  <Button
                                    as={NavLink}
                                    variant="secondary"
                                    to={`details?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                                  >
                                    View
                                  </Button>
                                ) : CheckBusinessDatesStatus(
                                    new Date(item.buss_created_at),
                                    new Date(todayDate)
                                  ) &&
                                  item.buss_status !== "start" &&
                                  item.buss_status !== "complete" &&
                                  item.buss_status === "cancel" &&
                                  calculateTotalAccumalatedAmount(
                                    item.investments
                                  ) !== parseFloat(item.buss_capital) ? (
                                  <label className="fw-bold text-danger">
                                    Business Cancel
                                  </label>
                                ) : (
                                  ""
                                )}
                              </>
                            )}
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Business;
