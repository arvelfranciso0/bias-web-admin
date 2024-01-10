import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
function Investments(props) {
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_PAYPAL_CLIEN_SECRET_KEY;
  const accessToken = btoa(`${clientId}:${clientSecret}`);
  const [investmentList, setInvestmentList] = useState([]);
  const navigate = useNavigate();
  const [alertType, setalertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStatus, setalertStatus] = useState(false);
  const [category, setCategory] = useState("all");
  const adminID = localStorage.getItem("admin_id");
  const handleSendRefuns = async (email, id, amount, userId) => {
    const sender_batch_id = `${uuidv4()}`;

    try {
      const payoutData = {
        sender_batch_header: {
          sender_batch_id: sender_batch_id,
          email_subject: "When send you a refund from your investment",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: amount,
              currency: "PHP",
            },
            note: "Thanks for your patronage!",
            sender_item_id: id,
            receiver: email,
            recipient_wallet: "PAYPAL",
          },
        ],
      };

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
      const transac_email = "biascapstone@gmail.com";
      axios
        .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/sendrefund`, {
          transac_email,
          payPalDataLog: JSON.stringify(response.data),
          amount,
          adminID,
        })
        .then((res) => {
          if (res.data.status) {
            setalertStatus(true);
            setalertType("success");
            setAlertMsg(res.data.message);
            window.location.reload();
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_NETWORK_ADD}/admin/listofInvestment`)
      .then((res) => {
        if (res.data.status) {
          setInvestmentList(res.data.result);

          console.log(res.data.result);
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

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    const sortedData = investmentList.sort((a, b) => {
      const dateA = new Date(a.invst_created_at);
      const dateB = new Date(b.invst_created_at);

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

    // console.log(sortedData);
    setInvestmentList(sortedData);
  }, [startDate, endDate]);

  const handleDeclineInvestment = (invstId, userId, amount) => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/cancelUserInvestment`, {
        invstId,
        userId,
      })
      .then((res) => {
        if (res.data.status) {
          const email = res.data.email;
          handleSendRefuns(email, invstId, amount, userId);
          alert(res.data.message);
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
  };
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
            navigate("/investor/feeds/list/all/category/all");
          }}
          autohide
        >
          <Toast.Body className="primary text-light">{alertMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" variant="pills">
              {" "}
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Type
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setCategory("all")}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCategory("request")}>
                    Request
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCategory("approved")}>
                    Approved
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCategory("started")}>
                    Started
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCategory("cancel")}>
                    Cancelled
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setCategory("complete")}>
                    Complete
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
      <div className="overflow-auto container-fluid" style={{ height: "75vh" }}>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investmentList.map((item) => (
              <tr key={item.invst_id}>
                <>
                  {category === "all" ? (
                    <>
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
                      <td>
                        {item.invst_status === "request" ? (
                          <div className="d-flex gap-1">
                            {" "}
                            <Button
                              variant="success"
                              as={NavLink}
                              to={`approval?id=${item.invst_id}&user_id=${item.invst_user_id}`}
                              role="button"
                            >
                              Approved
                            </Button>
                            {/* <Button
                              variant="danger"
                              // as={NavLink}
                              // to={`approval?id=${item.invst_id}&user_id=${item.invst_user_id}`}
                              onClick={() =>
                                handleDeclineInvestment(
                                  item.invst_id,
                                  item.invst_user_id,
                                  item.invst_amt
                                )
                              }
                              role="button"
                            >
                              Declined
                            </Button> */}
                          </div>
                        ) : item.invst_status === "approved" ||
                          item.invst_status === "started" ? (
                          <Button
                            variant="primary"
                            as={NavLink}
                            to={`approval?id=${item.invst_id}&user_id=${item.invst_user_id}`}
                          >
                            View
                          </Button>
                        ) : (
                          ""
                        )}
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
                    </>
                  ) : item.invst_status === category ? (
                    <>
                      {" "}
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
                      <td>
                        {item.invst_status === "request" ? (
                          <div className="d-flex gap-1">
                            {" "}
                            <Button
                              variant="success"
                              as={NavLink}
                              to={`approval?id=${item.invst_id}&user_id=${item.invst_user_id}`}
                              role="button"
                            >
                              Approved
                            </Button>
                            <Button
                              variant="danger"
                              // as={NavLink}
                              // to={`approval?id=${item.invst_id}&user_id=${item.invst_user_id}`}
                              role="button"
                            >
                              Declined
                            </Button>
                          </div>
                        ) : item.invst_status === "approved" ||
                          item.invst_status === "started" ? (
                          <Button variant="primary">View</Button>
                        ) : (
                          ""
                        )}
                      </td>
                    </>
                  ) : (
                    ""
                  )}
                </>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Investments;
