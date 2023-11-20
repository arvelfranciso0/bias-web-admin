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
} from "react-bootstrap";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { decryptArray } from "../Functions/Encryption";
import { UpdateInstallments } from "../Functions/InstallmentsDate";
import { checkUseFundsCompletion } from "../Functions/utils";
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
  //const data = hashParams.get("#data");
  const [todayDate, setTodayDate] = useState("");
  const buss_id = searchParams.get("buss_id");
  const user_id = searchParams.get("user_id");
  const useFunds = JSON.parse(data);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [product, setProduct] = useState("");
  const [filterUseFunds, setFilterUseFunds] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptURL, setReceiptURL] = useState("");
  const clientId =
    "AdoQUb986Cigyd6JiPQYo8h9S7Rh3TIwvQiAE4_4VAUJYHOZ25Fnfa2xC2FhxKwqfxMcx5X12x021RXJ";
  const clientSecret =
    "EGTcUMEpfiTSPrY3VmLP9UGMVVT1gJbcLAi8uNu6MWc45aWYX1tzC4xpPl4iTPaFgeuKp3GeDe_7PHe9";
  const accessToken = btoa(`${clientId}:${clientSecret}`);
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
      .post("http://localhost:3006/businessfunds", { buss_id: buss_id })
      .then((res) => {
        if (res.data.status) {
          const InitialsendBusinessFundsData = res.data.result;
          setTodayDate(res.data.todayDate);
          const dataSendBusinessFunds = InitialsendBusinessFundsData.map(
            (item) => ({
              bussFundsId: item.bussFunds_id,
              paypalBatchId: item.bussFunds_paypal_batch_id,
              bussFunds_reciept: item.bussFunds_reciept,
              bussFunds_reciept_status: item.bussFunds_reciept_status,
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
              };
            } else {
              return { ...item, status: "not send" };
            }
          });
          console.log(filterUseFundData);
          setFilterUseFunds(filterUseFundData);
        } else {
          console.log(res.data.message);
        }
      });
  }, []);

  const handlePayout = async () => {
    const todayYear = new Date().getFullYear();
    const sender_batch_id = `${uuidv4()}`;

    console.log(sender_batch_id);
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
        .post("http://localhost:3006/paypal-api", {
          payout_batchId: payout_batchId,
          amount: amount,
          product: product,
          recieveStatus: "pending",
          buss_id: buss_id,
          user_id: user_id,
          useFundId: id,
        })
        .then((res) => {
          if (res.data.status) {
            alert(res.data.message);
          } else {
            alert(res.data.message);
          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
    // axios
    //   .get("http://localhost:3006/admin/getCountFundLogPaypal")
    //   .then((res) => {
    //     if (res.data.status) {
    //       PayoutToPaypal(sender_batch_id, email, amount, id);
    //     }
    //   });
  };

  const handleGetPaypalStatus = async (payoutBacthId) => {
    const response = await axios.get(
      `https://api-m.sandbox.paypal.com/v1/payments/payouts/${payoutBacthId}?page=1&page_size=5&total_required=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${accessToken}`,
        },
      }
    );
    console.log(response.data.batch_header.batch_status);
  };

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

  const handleViewReceipt = (url, id) => {
    setShowReceipt(true);
    setId(id);
    setReceiptURL(url);
  };

  const handleApporveReceipt = (status) => {
    axios
      .post("http://localhost:3006/updateReceiptStatus", {
        id: id,
        status: status,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleStartTheBusiness = () => {
    console.log(installments);

    const allAreTrue = checkUseFundsCompletion(filterUseFunds);

    if (allAreTrue) {
      const updateReturnsWithDate = UpdateInstallments(todayDate, installments);

      axios
        .post("http://localhost:3006/startBusiness", {
          installments: JSON.stringify(updateReturnsWithDate),
          buss_id: buss_id,
          todayDate: new Date(todayDate).toISOString().slice(0, 10),
        })
        .then((res) => {
          if (res.data.status) {
            alert(res.data.message);
          } else {
            alert(res.data.message);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert(
        "We cannot start the business becuase it has pending or not approved status."
      );
    }
  };
  return (
    <>
      {showReceipt ? (
        <Modal show={showReceipt} onHide={handleCloseReceipt}>
          <Modal.Header closeButton>
            <Modal.Title>Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <img src={receiptURL} class="rounded mx-auto d-block" alt="..." />
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
              Receipt Approved
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
            ID : {id}
            Are you sure to send the amount{" "}
            <label className="fw-bold">₱ {amount}</label> for the product/item
            of <label className="fw-bold">{product}</label>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePayout}>
              Send
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
              <Button
                variant="primary"
                // onClick={handleShowModal}
                onClick={() => handleStartTheBusiness()}
                // as={NavLink}
                // to={`approved?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                role="button"
              >
                Start Business
              </Button>
              {/* <div className="class-form d-flex gap-3 align-items-center">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="">Mark All</label>
            </div> */}
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
              <th>Actions</th>
              <th>Paypal Status</th>
            </tr>
          </thead>
          <tbody>
            {filterUseFunds.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
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
                        handleViewReceipt(item.bussFunds_reciept, item.id)
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
                          "sb-p5csl26926732@personal.example.com",
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
                <td>
                  {item.batchID ? (
                    <>
                      {" "}
                      <label
                        onClick={() => handleGetPaypalStatus(item.batchID)}
                      >
                        {" "}
                        View Status
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SendAccumaltedAmount;
