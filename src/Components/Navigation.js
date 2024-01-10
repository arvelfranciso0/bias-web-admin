import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../Css/navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../Images/logo.jpg";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
export default function Navigation() {
  const [showRequest, setShowRequest] = useState(false);
  const [userCount, setUserCount] = useState(null);
  const [withdrawCount, setwithdrawCount] = useState(null);
  const [businessCount, setbusinessCount] = useState(null);
  const [investmentCount, setinvestmentCount] = useState(null);

  const handleShowSubMenu = () => {
    setShowRequest(!showRequest);
  };
  const navigate = useNavigate();
  const authAdmin = localStorage.getItem("authAdmin");
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/getCountList`)
      .then((res) => {
        if (res.data.status) {
          setUserCount(res.data.countUsers[0].countUser);
          setinvestmentCount(res.data.countInvesments[0].countInvesments);
          setwithdrawCount(res.data.countWithdraws[0].countWithdraws);
          setbusinessCount(res.data.countBusinessNum[0].countBusinessNum);
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
  }, [navigate]);

  useEffect(() => {
    if (authAdmin !== "authorized") {
      alert("You are not authorized");
      navigate("/");
    }
  }, [authAdmin, navigate]);

  return (
    <>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand
            href="#home"
            className="d-flex justify-content-center align-items-center gap-2"
          >
            <img
              src={logo}
              alt="..."
              className="rounded-circle"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />{" "}
            Bias Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={NavLink} to={"/admin/dashboard"}>
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/admin/reports"}>
                Reports
              </Nav.Link>

              <Nav.Link as={NavLink} to={"/admin/chat"}>
                Chats
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/admin/transactions"}>
                Transactions
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/admin/category"}>
                Category
              </Nav.Link>
              <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  For Approval{" "}
                  <Badge bg="danger">
                    {userCount +
                      businessCount +
                      investmentCount +
                      withdrawCount}
                  </Badge>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to={"/admin/user"}>
                    User <Badge bg="danger">{userCount}</Badge>
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to={"/admin/business"}>
                    Businesses <Badge bg="danger">{businessCount}</Badge>
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to={"/admin/investments?c=all"}>
                    Investments <Badge bg="danger">{investmentCount}</Badge>
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to={"/admin/withdraw"}>
                    Withdraw <Badge bg="danger">{withdrawCount}</Badge>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Link
                as={NavLink}
                to={"/"}
                onClick={() => localStorage.clear()}
              >
                Logout{" "}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}
