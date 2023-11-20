import React, { useEffect, useState } from "react";

import axios from "axios";

import {
  Button,
  Nav,
  Dropdown,
  DropdownButton,
  Navbar,
  Container,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
function User(props) {
  const [listuser, setListUser] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    axios.get("http://localhost:3006/admin/listofuser").then((res) => {
      if (res.data.status) {
        setListUser(res.data.result);
        console.log(res.data.result);
      } else {
        alert(res.data.message);
      }
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredUser = listuser.filter((item) => {
    if (filter === "entrepreneur") {
      return item.user_type === "entrepreneur";
    } else if (filter === "investor") {
      return item.user_type === "investor";
    } else if (filter === "verified") {
      return item.user_status === "Verified";
    } else if (filter === "not_verified") {
      return item.user_status === "No Verified";
    } else {
      return true;
    }
  });

  return (
    <div className="container-fluid mt-2">
      <Nav
        variant="pills"
        bg="dark"
        className="d-flex align-items-center justify-content-between mb-2"
      >
        <Nav.Item>
          <Nav.Link eventKey="1" href="#/home" className="text-dark">
            All
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link eventKey="2" title="Item" className="text-dark">
            Request
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link eventKey="3" title="Item" className="text-dark">
            Approved
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="4" title="Item" className="text-dark">
            Removed
          </Nav.Link>
        </Nav.Item>

        <Nav>
          <DropdownButton
            id="dropdown-button-dark-example1"
            title="User Type"
            variant="dark"
            size="sm"
            data-bs-theme="dark"
          >
            <Dropdown.Item href="#action/3.1">Entrpreneur</Dropdown.Item>
            <Dropdown.Item href="#action/3.2">Investor</Dropdown.Item>
          </DropdownButton>
        </Nav>
        <div class="d-flex ms-2 w-25 gap-2 align-items-center">
          <label class="">Start Date</label>
          <input type="date" class="form-control w-75" />
        </div>
        <div class="d-flex  w-25 gap-2 align-items-center ms-2">
          <label class="">End Date</label>
          <input type="date" class="form-control w-75" />
        </div>
      </Nav>
      <table class="table align-middle mb-0 bg-white">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Address</th>
            <th>User Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listuser.map((item) => (
            <tr key={item.user_id}>
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
                <p class="fw-normal mb-1">
                  {new Date(item.user_bdate).toDateString()}
                </p>
              </td>
              <td>
                <p class="fw-normal mb-1">{item.user_age}</p>
              </td>
              <td>
                <p class="fw-normal mb-1">{item.user_gender}</p>
              </td>

              <td>
                <p class="fw-normal mb-1">
                  {item.user_barangay}, {item.user_city}, {item.user_province}
                </p>
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
              <td>
                <span
                  class={`badge rounded-pill  ${
                    item.user_status === "basic"
                      ? "bg-danger "
                      : item.user_status === "semi"
                      ? "bg-warning"
                      : item.user_status === "fully"
                      ? "bg-info"
                      : ""
                  }`}
                >
                  {item.user_status}
                </span>
              </td>
              <td>
                <p class="fw-normal mb-1">
                  {new Date(item.user_created_at).toDateString()}
                </p>
              </td>
              <td>
                {item.user_status === "fully" ? (
                  <Button variant="primary">View</Button>
                ) : item.user_status === "semi" ? (
                  <Button
                    variant="success"
                    as={NavLink}
                    to={`approval?id=${item.user_id}`}
                    role="button"
                  >
                    Approve
                  </Button>
                ) : item.user_status === "basic" ? (
                  <Button
                    variant="success"
                    as={NavLink}
                    to={`approval?id=${item.user_id}`}
                    role="button"
                  >
                    Approve
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default User;
