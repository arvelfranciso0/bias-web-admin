import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  calculateTotalAccumalatedAmount,
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
} from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

import "../Css/navigation.css";
import SendAccumaltedAmount from "../Components/SendAccumaltedAmount";
import { encryptArray } from "../Functions/Encryption";
// import { encryptArray } from "../Functions/Encryption";

function Business(props) {
  const [listBusiness, setListBusiness] = useState([]);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const buss_id = searchParams.get("buss_id");
  console.log(buss_id);
  useEffect(() => {
    axios
      .get("http://localhost:3006/admin/listofbusiness")
      .then((res) => {
        if (res.data.status) {
          console.log(res.data.result);
          setListBusiness(res.data.result);
        } else {
          console.log("No data");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  return (
    <div className="container-fluid mt-3">
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
                  <Dropdown.Item href="#/action-1">All</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Request</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Approved</Dropdown.Item>
                  <Dropdown.Item href="#/action-3"> In Porgress</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Capital Accumalation
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Fully Returned
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
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
              </Dropdown>
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

      <table class="table align-middle mb-0 text-center bg-white mt-3">
        <thead className="table-dark">
          <tr>
            <th>Business Name</th>
            <th>Business Status</th>
            <th>Business Capital</th>
            <th>Accumalation Amount</th>
            <th>Accumalation Status</th>
            <th>Amount Return</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listBusiness.map((item, index) => (
            <tr key={item.buss_id}>
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
                    ₱ {calculateTotalAccumalatedAmount(item.investments)}
                  </p>
                ) : (
                  <p class="fw-normal mb-1">₱ 0</p>
                )}
              </td>
              <td>
                <p
                  class={`fw-normal rounded-pill text-center ${
                    calculateTotalAccumalatedAmount(item.investments) ===
                    parseFloat(item.buss_capital)
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
                {item.buss_status === "pending" ? (
                  <Button
                    variant="success"
                    as={NavLink}
                    to={`approved?id=${item.buss_id}&user_id=${item.buss_user_id}`}
                    role="button"
                  >
                    Approve
                  </Button>
                ) : item.buss_status === "approved" &&
                  calculateTotalAccumalatedAmount(item.investments) ===
                    parseFloat(item.buss_capital) ? (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      as={NavLink}
                      onClick={() => {
                        localStorage.setItem(
                          "useFunds",
                          encryptArray(item.buss_useof_funds)
                        );
                        localStorage.setItem(
                          "installments",
                          encryptArray(item.buss_installment)
                        );
                      }}
                      to={`sendamount?user_id=${item.buss_user_id}&buss_id=${item.buss_id}`}
                    >
                      Send Capital
                    </Button>
                    <Button variant="secondary">View</Button>
                  </>
                ) : item.buss_status === "approved" ? (
                  <Button variant="secondary">View</Button>
                ) : item.buss_status === "start" ? (
                  <Button variant="secondary">View</Button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Business;
