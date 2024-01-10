import axios from "axios";
import React, { useEffect, useState } from "react";
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
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { decryptArray } from "../Functions/Encryption";
import { UpdateInstallments } from "../Functions/InstallmentsDate";
import { checkUseFundsCompletion } from "../Functions/utils";
import Loader from "./loader";
// import { decryptArray } from "../Functions/Encryption";
function SendAccumaltedAmount() {
  const navigate = useNavigate();
  const location = useLocation();
  const encryptData = localStorage.getItem("useFunds");
  const data = decryptArray(encryptData);
  const encryptInstallments = localStorage.getItem("installments");
  const installments = JSON.parse(decryptArray(encryptInstallments));

  const hashParams = new URLSearchParams(location.hash);
  const searchParams = new URLSearchParams(location.search);
  const adminID = localStorage.getItem("admin_id");
  const [todayDate, setTodayDate] = useState("");
  const buss_id = searchParams.get("buss_id");
  const user_id = searchParams.get("user_id");
  const paypalEmail = searchParams.get("email");
  const useFunds = JSON.parse(data);
  const [showModal, setShowModal] = useState(false);
  const [showloader, setShowLoader] = useState(false);
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [product, setProduct] = useState("");
  const [filterUseFunds, setFilterUseFunds] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptURL, setReceiptURL] = useState("");
  const [indexSize, setIndexSize] = useState("");
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_PAYPAL_CLIEN_SECRET_KEY;
  const accessToken = btoa(`${clientId}:${clientSecret}`);
  const [showPaypalStatus, setPaypalStatus] = useState(false);
  const [paypalData, setPaypalData] = useState([]);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStatus, setalertStatus] = useState(false);
  // const handleSendInvestmentToEntrep = (user_id, amt) => {
  //   const adminEmail = "admin@gmail.com";
  //   const typeWallet = "sendCapital";
  //   axios
  //     .post("http://localhost:3006/admin/sendCapital", {
  //       amt: amt,
  //       adminEmail: adminEmail,
  //       wallet_user_id: user_id,
  //       typeWallet: typeWallet,
  //     })
  //     .then((res) => {
  //       if (res.data.status) {
  //         alert(res.data.message);
  //       } else {
  //         alert(res.data.message);
  //       }
  //     });
  // };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/businessfunds`, {
        buss_id: buss_id,
      })
      .then((res) => {
        if (res.data.status) {
          const InitialsendBusinessFundsData = res.data.result;
          setTodayDate(res.data.currentDate);
          const dataSendBusinessFunds = InitialsendBusinessFundsData.map(
            (item) => ({
              bussFundsId: item.bussFunds_id,
              paypalBatchId: item.bussFunds_paypal_batch_id,
              bussFunds_reciept: item.bussFunds_reciept,
              bussFunds_reciept_status: item.bussFunds_reciept_status,
              bussFunds_amount_recieve_status:
                item.bussFunds_amount_recieve_status,
            })
          );

          const filterUseFundData = useFunds.map((item) => {
            const matchingFund = dataSendBusinessFunds.find(
              (fund) => fund.bussFundsId === item.id
            );

            if (matchingFund) {
              return {
                ...item,
                status: "send",
                batchID: matchingFund.paypalBatchId,
                bussFunds_reciept: matchingFund.bussFunds_reciept,
                bussFunds_reciept_status: matchingFund.bussFunds_reciept_status,
                bussFunds_amount_recieve_status:
                  matchingFund.bussFunds_amount_recieve_status,
              };
            } else {
              return { ...item, status: "not send" };
            }
          });

          setFilterUseFunds(filterUseFundData);
        } else {
          console.log(res.data.message);
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

  const handlePayout = async () => {
    setShowLoader(true);

    const sender_batch_id = `${uuidv4()}`;

    try {
      const payoutData = {
        sender_batch_header: {
          sender_batch_id: sender_batch_id,
          email_subject: "You have a payout!",
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

      console.log(response.data);
      const payout_batchId = response.data.batch_header.payout_batch_id;
      axios
        .post(`${process.env.REACT_APP_NETWORK_ADD}/paypal-api`, {
          payout_batchId: payout_batchId,
          amount: amount,
          product: product,
          recieveStatus: "pending",
          buss_id: buss_id,
          user_id: user_id,
          useFundId: id,
          adminID,
          paypalyDataLog: JSON.stringify(response.data),
        })
        .then((res) => {
          if (res.data.status) {
            setalertStatus(true);
            setalertType("success");
            setAlertMsg(res.data.message);
            setShowLoader(false);
            window.location.reload();
          } else {
            setalertStatus(true);
            setalertType("danger");
            setAlertMsg(res.data.message);
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
    } catch (error) {
      if (error.response) {
        navigate("/server-error");
      } else if (error.request) {
        navigate("/error");
      } else {
        navigate("/somethingwrong");
      }
    }
    // axios
    //   .get("http://localhost:3006/admin/getCountFundLogPaypal")
    //   .then((res) => {
    //     if (res.data.status) {
    //       PayoutToPaypal(sender_batch_id, email, amount, id);
    //     }
    //   });
  };

  // const handleGetPaypalStatus = async (payoutBacthId) => {
  //   const response = await axios.get(
  //     `https://api-m.sandbox.paypal.com/v1/payments/payouts/${payoutBacthId}?page=1&page_size=5&total_required=true`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Basic ${accessToken}`,
  //       },
  //     }
  //   );
  //   setPaypalData(JSON.parse(response.data.batch_header));
  //   setPaypalStatus(true);
  //   console.log(response.data);
  // };

  // const PayoutToPaypal = async (sender_batch_id, email, amount, id) => {

  // };
  const handleShowModal = (amount, email, id, product) => {
    setShowModal(true);
    setAmount(amount);
    setEmail(email);
    setId(id);
    setProduct(product);
  };
  const handleClose = () => {
    setShowModal(false);
    setAmount("");
    setEmail("");
    setId("");
    setProduct("");
  };
  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setId("");
    setReceiptURL("");
  };

  const handleViewReceipt = (url, id, index) => {
    setShowReceipt(true);
    setId(id);
    setReceiptURL(url);
    setIndexSize(index);
  };

  const handleApporveReceipt = async (status) => {
    console.log(indexSize === filterUseFunds.length - 1);
    setShowLoader(true);

    const lengthUseFunds = filterUseFunds.length - 1;
    if (parseInt(indexSize) === parseInt(lengthUseFunds)) {
      axios
        .post(`${process.env.REACT_APP_NETWORK_ADD}/updateReceiptStatus`, {
          id: id,
          status: status,
        })
        .then((res) => {
          if (res.data.status) {
            const updateReturnsWithDate = UpdateInstallments(
              todayDate,
              installments
            ).updateReturnsWithDate;
            const enddate = UpdateInstallments(todayDate, installments).endDate;
            const startDate = UpdateInstallments(
              todayDate,
              installments
            ).startDate;
            console.log(enddate);

            const entrepEmail = localStorage.getItem("entrepEmail");
            axios
              .post(`${process.env.REACT_APP_NETWORK_ADD}/startBusiness`, {
                installments: JSON.stringify(updateReturnsWithDate),
                buss_id: buss_id,

                todayDate: new Date(startDate).toISOString().slice(0, 10),
                enddate: new Date(enddate).toISOString().slice(0, 10),
              })
              .then((res) => {
                if (res.data.status) {
                  axios
                    .post(
                      `${process.env.REACT_APP_NETWORK_ADD}/sendEmailUser`,
                      {
                        entrepEmail,
                      }
                    )
                    .then((res) => {
                      if (res.data.status) {
                        setalertStatus(true);
                        setalertType("success");
                        setAlertMsg(res.data.message);
                        setShowLoader(false);
                        window.location.reload();
                      } else {
                        setalertStatus(true);
                        setalertType("danger");
                        setAlertMsg(res.data.message);
                        setShowLoader(false);
                        window.location.reload();
                      }
                    });

                  // console.log("I been here in UpdateInstallments");
                } else {
                  setalertStatus(true);
                  setalertType("danger");
                  setAlertMsg(res.data.message);
                  setShowLoader(false);
                  alert(res.data.message);
                }
              });
          }
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_NETWORK_ADD}/updateReceiptStatus`, {
          id: id,
          status: status,
        })
        .then((res) => {
          if (res.data.status) {
            setalertStatus(true);
            setalertType("success");
            setAlertMsg(res.data.message);
            window.location.reload();
            setShowLoader(false);
            console.log("I been here in approve receipt 3");
          }
        });
    }
    // if (indexSize === filterUseFunds.length - 1) {

    //   // handleUpdateApproveReceipt(status);
    // } else {
    //   axios
    //     .post("http://localhost:3006/updateReceiptStatus", {
    //       id: id,
    //       status: status,
    //     })
    //     .then((res) => {
    //       if (res.data.status) {
    //         setShowLoader(false);
    //         console.log("I been here in approve receipt 2");
    //       }
    //     });
    // }
  };
  const handleStartTheBusiness = async () => {};

  const handleUpdateApproveReceipt = async (status) => {};
  const handleClosePaypalStatus = () => {
    setPaypalStatus(false);
  };
  return (
    <>
      <div>
        <ToastContainer position="top-center" className="p-3">
          <Toast
            className="d-inline-block m-1"
            bg={alertType}
            show={alertStatus}
            delay={3000}
            onClose={() => {
              setalertStatus(false);
              // navigate("/investor/feeds/list/all/category/all");
            }}
            autohide
          >
            <Toast.Body className="primary text-light">{alertMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
        {/* {showPaypalStatus ? (
          <Modal show={showPaypalStatus} onHide={handleClosePaypalStatus}>
            <Modal.Header closeButton>
              <Modal.Title>Receipt</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {paypalData ? (
                <div>
                  {paypalData.map((item, index) => (
                    <div key={index}></div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </Modal.Body>
           
          </Modal>
        ) : (
          ""
        )} */}
      </div>

      {showReceipt ? (
        <Modal show={showReceipt} onHide={handleCloseReceipt}>
          <Modal.Header closeButton>
            <Modal.Title>Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <img
                src={receiptURL}
                class="rounded mx-auto d-block"
                alt="..."
                style={{ width: "20rem", height: "20rem" }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={() => handleApporveReceipt("declined")}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              onClick={() => handleApporveReceipt("approved")}
            >
              {showloader ? <Loader /> : "Receipt Approve"}
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}
      {showModal ? (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Send the Accumalted Amount</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                User Paypal Email address
              </label>
              <input
                type="email"
                class="form-control"
                id="exampleFormControlInput1"
                placeholder="name@example.com"
                readOnly
                value={paypalEmail}
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Items/Products
              </label>
              <input
                type="email"
                class="form-control"
                id="exampleFormControlInput1"
                placeholder="name@example.com"
                readOnly
                value={product}
              />
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                Amount
              </label>
              <input
                type="email"
                class="form-control"
                id="exampleFormControlInput1"
                placeholder="name@example.com"
                readOnly
                value={amount}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePayout}
              disabled={showloader}
            >
              {showloader ? <Loader /> : "Send"}
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        ""
      )}
      <div className="container-fluid">
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto d-flex gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Status of Funds
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">All</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Not Said</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Send</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">
                      {" "}
                      With Reciept
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-3">No Reciept</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Business Category
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Retail</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Food and Beverage
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3"> E-commerce</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    {" "}
                    E-commerce Street Vendors
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Capital Accumalation
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Fully Returned
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <table class="table align-middle  mb-0 bg-white mt-2">
          <thead className="table-dark">
            <tr>
              <th>No.</th>
              <th>Products</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Reciept</th>
              <th>Receive</th>
              <th>Actions</th>
              {/* <th>Paypal Status</th> */}
            </tr>
          </thead>
          <tbody>
            {filterUseFunds.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <p class="fw-normal mb-1">{item.products}</p>
                </td>

                <td>
                  <p class="fw-normal mb-1">{item.amount}</p>
                </td>
                <td>
                  <span
                    className={`badge rounded-pill ${
                      item.status === "send" ? "bg-success" : ""
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.bussFunds_reciept &&
                  item.bussFunds_reciept_status === "pending" ? (
                    <Button
                      variant="success"
                      // onClick={handleShowModal}
                      onClick={() =>
                        handleViewReceipt(
                          item.bussFunds_reciept,
                          item.id,
                          index
                        )
                      }
                      // as={NavLink}
                      // to={`approved?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                      role="button"
                    >
                      View Receipt
                    </Button>
                  ) : item.bussFunds_reciept &&
                    item.bussFunds_reciept_status === "approved" ? (
                    <span className="badge rounded-pill bg-success ">
                      Appoved
                    </span>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <label
                    className={`rounded-pill badge p-1 ${
                      item.bussFunds_amount_recieve_status === "pending"
                        ? "bg-warning"
                        : item.bussFunds_amount_recieve_status === "recieve"
                        ? "bg-success"
                        : item.bussFunds_amount_recieve_status === "not recieve"
                        ? "bg-danger"
                        : ""
                    }`}
                  >
                    {item.bussFunds_amount_recieve_status}
                  </label>
                </td>

                {/* <td className="text-center">
                <div class=" text-center">
                  <input
                    class="form-check-input  border border-dark"
                    type="checkbox"
                    value={index}
                    id="flexCheckDefault"
                  />
                </div>
              </td> */}
                <td>
                  {item.status === "send" && !item.bussFunds_reciept ? (
                    <label>Waiting for the reciept.</label>
                  ) : item.status === "send" && !item.bussFunds_reciept ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ color: "#00eb10" }}
                    />
                  ) : item.status === "not send" && !item.bussFunds_reciept ? (
                    <Button
                      variant="success"
                      // onClick={handleShowModal}
                      onClick={() =>
                        handleShowModal(
                          item.amount,
                          paypalEmail,
                          item.id,
                          item.products
                        )
                      }
                      // as={NavLink}
                      // to={`approved?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                      role="button"
                    >
                      Send
                    </Button>
                  ) : (
                    ""
                  )}
                </td>
                {/* <td>
                  {item.batchID ? (
                    <>
                      {" "}
                      <Button
                        variant="outline-primary"
                        onClick={() => handleGetPaypalStatus(item.batchID)}
                      >
                        {" "}
                        View Status
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SendAccumaltedAmount;
