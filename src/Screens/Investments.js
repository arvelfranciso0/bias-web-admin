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
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
function Investments(props) {
  const [investmentList, setInvestmentList] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3006/admin/listofInvestment")
      .then((res) => {
        if (res.data.status) {
          setInvestmentList(res.data.result);
          console.log(res.data.result);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  return (
    <div className="container-fluid mt-3">
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
                Approved
              </Nav.Link>
              <Nav.Link eventKey="4" title="Item" className="text-dark">
                In Porgress
              </Nav.Link>
              <Nav.Link eventKey="5" title="Item" className="text-dark">
                Cancelled
              </Nav.Link>
              <Nav.Link eventKey="5" title="Item" className="text-dark">
                Fully Returned
              </Nav.Link>
              <NavDropdown
                title=" Business Category"
                id="collapsible-nav-dropdown"
                menuVariant="dark"
              >
                <NavDropdown.Item href="#action/3.2">Retail</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Food and Beverage
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  E-commerce
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  E-commerce Street Vendors
                </NavDropdown.Item>
              </NavDropdown>
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
                <p class="fw-normal mb-1">₱ {item.invst_interest_sum}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">₱ {item.invst_returned_amt}</p>
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
                <p class="fw-normal mb-1">
                  {new Date(item.invst_created_at).toDateString()}
                </p>
              </td>
              <td>
                {item.invst_status === "request" ? (
                  <>
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
                      className="ms-3"
                    >
                      Declined
                    </Button>
                  </>
                ) : item.invst_status === "approved" ||
                  item.invst_status === "started" ? (
                  <Button variant="primary">View</Button>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Investments;
