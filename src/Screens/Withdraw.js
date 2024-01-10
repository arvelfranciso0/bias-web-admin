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
  Modal,
} from "react-bootstrap";

import { v4 as uuidv4 } from "uuid";
import { NavLink } from "react-router-dom";
import {
  PaypalResponseCode,
  PaypalResponseCodeMassage,
} from "../Functions/PaypalResponseCodeStatus";
import Loader from "../Components/loader";
import { useNavigate } from "react-router-dom";
function Withdraw(props) {
  const navigate = useNavigate();
  const [withdrawlist, setWithdrawList] = useState([]);
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState("");
  const [withdrawID, setWithdrawID] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_PAYPAL_CLIEN_SECRET_KEY;
  const accessToken = btoa(`${clientId}:${clientSecret}`);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_NETWORK_ADD}/admin/listofWithdraw`)
      .then((res) => {
        if (res.data.status) {
          setWithdrawList(res.data.result);
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
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (amount, email, user_id, withdrawId) => {
    setAmount(amount);
    setEmail(email);
    setUserId(user_id);
    setWithdrawID(withdrawId);
    setShow(true);
  };

  const handleSendWithdraw = async () => {
    setShowLoader(true);
    const sender_batch_id = `${uuidv4()}`;

    try {
      const payoutData = {
        sender_batch_header: {
          sender_batch_id: sender_batch_id,
          email_subject:
            "We send you your withdrawal amount. Thank you for using BiaS",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: amount,
              currency: "PHP",
            },
            note: "Thanks for your patronage!",
            sender_item_id: userId,
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

      console.log(response.data);

      const status = PaypalResponseCode(response.status);

      if (status) {
        //const payout_batchId = response.data.batch_header.payout_batch_id;
        const payapalDataLog = response.data;
        axios
          .post(`${process.env.REACT_APP_NETWORK_ADD}/sendwithdrawalamount`, {
            email,
            amount,
            type: "withdraw",
            userId,
            adminID: 10,
            paypalDataLog: JSON.stringify(payapalDataLog),
            withdrawID,
          })
          .then((res) => {
            if (res.data.status) {
              alert(res.data.message);
              setShowLoader(false);
              window.location.reload();
            } else {
              alert(res.data.message);
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
      } else {
        alert(PaypalResponseCodeMassage(response.status));
      }

      //if()
    } catch (error) {}
  };
  return (
    <div className="container-fluid mt-3">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send Withdraw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">
              Recipient Email{" "}
            </label>
            <input
              type="email"
              class="form-control"
              id="exampleFormControlInput1"
              readOnly
              value={email}
            />
          </div>
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">
              Withdraw Amount
            </label>
            <input
              type="number"
              class="form-control"
              id="exampleFormControlInput1"
              readOnly
              value={amount}
            />
          </div>
          <div className="w-100 d-flex align-items-center justify-content-center">
            <Button
              variant="primary"
              className="w-50"
              onClick={handleSendWithdraw}
              disabled={showLoader}
            >
              {showLoader ? <Loader /> : " Send Withdrawal"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" variant="pills">
              <Nav.Link eventKey="1" href="#/home" className="text-dark">
                All
              </Nav.Link>
              <Nav.Link eventKey="2" title="Item" className="text-dark">
                Request
              </Nav.Link>
              <Nav.Link eventKey="3" title="Item" className="text-dark">
                Send
              </Nav.Link>
              <Nav.Link eventKey="4" title="Item" className="text-dark">
                Recieve
              </Nav.Link>
              <Nav.Link eventKey="5" title="Item" className="text-dark">
                Cancelled
              </Nav.Link>
            </Nav>
            <Form className="d-flex align-items-center gap-2">
              <label className="w-50">Start Date</label>
              <Form.Control
                type="date"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
            </Form>
            <Form className="d-flex align-items-center gap-2">
              <label className="w-50">End Date</label>
              <Form.Control
                type="date"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <table class="table align-middle text-center mb-0 bg-white">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Investor</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Investemnt ID</th>
            <th>Paypal Email</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawlist.map((item) => (
            <tr key={item.withdraw_id}>
              <td>
                <p class="fw-bold mb-1 pe-4">{item.withdraw_id}</p>
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
                <p class="fw-normal mb-1">₱ {item.withdraw_amt}</p>
              </td>
              <td>
                <span
                  class={`badge rounded-pill text-dark ${
                    item.withdraw_status === "request"
                      ? "bg-success "
                      : item.withdraw_status === "send"
                      ? "bg-secondary"
                      : item.withdraw_status === "receive"
                      ? "bg-primary"
                      : item.withdraw_status === "cancel"
                      ? "bg-danger"
                      : ""
                  }`}
                >
                  {item.withdraw_status}
                </span>
              </td>
              <td>
                <p class="fw-bold mb-1 pe-4">{item.invst_id}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{item.wihtdraw_email_add}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">
                  {new Date(item.withdraw_created_at).toDateString()}
                </p>
              </td>
              <td>
                {item.withdraw_status === "request" ? (
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      as={NavLink}
                      // to={`approval?id=${item.invst_id}&user_id=${item.invst_user_id}`}
                      role="button"
                      onClick={() =>
                        handleShow(
                          item.withdraw_amt,
                          item.wihtdraw_email_add,
                          item.user_id,
                          item.withdraw_id
                        )
                      }
                    >
                      Send
                    </Button>
                    <Button
                      variant="primary"
                      as={NavLink}
                      to={`/admin/withdraw-details?id=${item.withdraw_id}`}
                      role="button"
                    >
                      View
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    as={NavLink}
                    to={`/admin/withdraw-details?id=${item.withdraw_id}`}
                    role="button"
                  >
                    View
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Withdraw;
