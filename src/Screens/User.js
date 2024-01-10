import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Nav,
  NavDropdown,
  Navbar,
  Button,
  Dropdown,
} from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function User(props) {
  const [listuser, setListUser] = useState([]);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_NETWORK_ADD}/admin/listofuser`)
      .then((res) => {
        if (res.data.status) {
          const data = res.data.result;

          // data.sort((current, prev) => {
          //   if (
          //     current.user_status === "verified" &&
          //     prev.user_status !== "verified"
          //   ) {
          //     return 1;
          //   } else if (
          //     current.user_status !== "verified" &&
          //     prev.user_status === "verified"
          //   ) {
          //     return -1;
          //   } else {
          //     return 0;
          //   }
          // });

          setListUser(data);
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

  // const handleFilterChange = (event) => {
  //   setFilter(event.target.value);
  // };

  // const filteredUser = listuser.filter((item) => {
  //   if (filter === "entrepreneur") {
  //     return item.user_type === "entrepreneur";
  //   } else if (filter === "investor") {
  //     return item.user_type === "investor";
  //   } else if (filter === "verified") {
  //     return item.user_status === "Verified";
  //   } else if (filter === "not_verified") {
  //     return item.user_status === "No Verified";
  //   } else {
  //     return true;
  //   }
  // });
  useEffect(() => {
    const sortedData = listuser.sort((a, b) => {
      const dateA = new Date(a.user_created_at);
      const dateB = new Date(b.user_created_at);

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

    setListUser(sortedData);
  }, [startDate, endDate]);

  // useEffect(() => {
  //   if (status === "basic") {
  //     listuser.sort((a, b) => {
  //       if (a.user_status === "basic" && b.user_status !== "basic") {
  //         return 1;
  //       } else if (a.user_status !== "basic" && b.user_status === "basic") {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   } else if (status === "verified") {
  //     listuser.sort((a, b) => {
  //       if (a.user_status === "verified" && b.user_status !== "verified") {
  //         return 1;
  //       } else if (
  //         a.user_status !== "verified" &&
  //         b.user_status === "verified"
  //       ) {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   }
  // }, [status]);

  // const hadleFilterUser = (typeUser) => {
  //   if (typeUser === "entrepreneur") {
  //     const data = listuser.sort((a, b) => {
  //       if (a.user_type === "entrepreneur" && b.user_type !== "entrepreneur") {
  //         return 1;
  //       } else if (
  //         a.user_type !== "entrepreneur" &&
  //         b.user_type === "entrepreneur"
  //       ) {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //     setFilterData(data);
  //   } else if (typeUser === "investor") {
  //     const data = listuser.sort((a, b) => {
  //       if (a.user_type === "investor" && b.user_type !== "investor") {
  //         return 1;
  //       } else if (a.user_type !== "investor" && b.user_type === "investor") {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //     setFilterData(data);
  //   } else {
  //   }
  // };
  return (
    <div className="container-fluid mt-2">
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" variant="pills">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  User Status
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setStatus("all")}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatus("basic")}>
                    Basic
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatus("verified")}>
                    Verified
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className="ms-3"
                >
                  User Type
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setType("all")}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setType("entrepreneur")}>
                    Entrepreneur
                  </Dropdown.Item>{" "}
                  <Dropdown.Item onClick={() => setType("investor")}>
                    Investor
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

      <div className="w-100 overflow-auto" style={{ height: "80vh" }}>
        {" "}
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
                {status === "all" && type === "all" ? (
                  <>
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
                        {new Date(item.user_bdate).toLocaleDateString()}
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
                        {item.user_barangay}, {item.user_city},{" "}
                        {item.user_province}
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
                            : item.user_status === "verified"
                            ? "bg-info"
                            : ""
                        }`}
                      >
                        {item.user_status}
                      </span>
                    </td>
                    <td>
                      <p class="fw-normal mb-1">
                        {new Date(item.user_created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td>
                      {item.user_status === "basic" &&
                      !item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "basic" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex gap-3 align-items-center justify-content-center">
                          <Button
                            variant="primary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                            role="button"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "verified" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  </>
                ) : status === item.user_status && type === "all" ? (
                  <>
                    {" "}
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
                        {new Date(item.user_bdate).toLocaleDateString()}
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
                        {item.user_barangay}, {item.user_city},{" "}
                        {item.user_province}
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
                            : item.user_status === "verified"
                            ? "bg-info"
                            : ""
                        }`}
                      >
                        {item.user_status}
                      </span>
                    </td>
                    <td>
                      <p class="fw-normal mb-1">
                        {new Date(item.user_created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td>
                      {item.user_status === "basic" &&
                      !item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "basic" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex gap-3 align-items-center justify-content-center">
                          <Button
                            variant="primary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                            role="button"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "verified" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  </>
                ) : status === "all" && type === item.user_type ? (
                  <>
                    {" "}
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
                        {new Date(item.user_bdate).toLocaleDateString()}
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
                        {item.user_barangay}, {item.user_city},{" "}
                        {item.user_province}
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
                            : item.user_status === "verified"
                            ? "bg-info"
                            : ""
                        }`}
                      >
                        {item.user_status}
                      </span>
                    </td>
                    <td>
                      <p class="fw-normal mb-1">
                        {new Date(item.user_created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td>
                      {item.user_status === "basic" &&
                      !item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "basic" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex gap-3 align-items-center justify-content-center">
                          <Button
                            variant="primary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                            role="button"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "verified" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  </>
                ) : status === item.user_status && type === item.user_type ? (
                  <>
                    {" "}
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
                        {new Date(item.user_bdate).toLocaleDateString()}
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
                        {item.user_barangay}, {item.user_city},{" "}
                        {item.user_province}
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
                            : item.user_status === "verified"
                            ? "bg-info"
                            : ""
                        }`}
                      >
                        {item.user_status}
                      </span>
                    </td>
                    <td>
                      <p class="fw-normal mb-1">
                        {new Date(item.user_created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td>
                      {item.user_status === "basic" &&
                      !item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "basic" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex gap-3 align-items-center justify-content-center">
                          <Button
                            variant="primary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                            role="button"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : item.user_status === "verified" &&
                        item.user_identity_user_id ? (
                        <div className="d-flex  align-items-center justify-content-end">
                          {" "}
                          <Button
                            variant="secondary"
                            as={NavLink}
                            to={`approval?id=${item.user_id}`}
                          >
                            View
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
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
    </div>
  );
}

export default User;
