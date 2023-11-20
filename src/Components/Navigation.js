import { NavLink, Outlet } from "react-router-dom";
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
export default function Navigation() {
  const [showRequest, setShowRequest] = useState(false);
  const handleShowSubMenu = () => {
    setShowRequest(!showRequest);
  };
  return (
    // <div>
    //   <div className="nav">
    //     <div>
    //       <h2>Bias</h2>
    //     </div>
    //     <ul>
    //       <NavLink
    //         to={"dashboard"}
    //         className={({ isActive, isPending }) =>
    //           isPending ? "navlink" : isActive ? "activeNavlink" : "navlink"
    //         }
    //       >
    //         Dashboard
    //       </NavLink>
    //       <NavLink
    //         to={"user"}
    //         className={({ isActive, isPending }) =>
    //           isPending ? "navlink" : isActive ? "activeNavlink" : "navlink"
    //         }
    //       >
    //         User
    //       </NavLink>
    //       <NavLink
    //         to={"business"}
    //         className={({ isActive, isPending }) =>
    //           isPending ? "navlink" : isActive ? "activeNavlink" : "navlink"
    //         }
    //       >
    //         Businesses
    //       </NavLink>
    //       <NavLink
    //         to={"investment"}
    //         className={({ isActive, isPending }) =>
    //           isPending ? "navlink" : isActive ? "activeNavlink" : "navlink"
    //         }
    //       >
    //         Investments
    //       </NavLink>
    //       <NavLink
    //         to={"transactions"}
    //         className={({ isActive, isPending }) =>
    //           isPending ? "navlink" : isActive ? "activeNavlink" : "navlink"
    //         }
    //       >
    //         Transactions
    //       </NavLink>

    //       <ul className={showRequest ? "subMenuParent-color" : "subMenuParent"}>
    //         <div className="submenu-up-down" onClick={handleShowSubMenu}>
    //           <div id="title-submenu">Request</div>

    //           <FontAwesomeIcon
    //             icon={faChevronDown}
    //             className={showRequest ? "icon-close" : "icon-up"}
    //           />
    //         </div>

    //         <div className={showRequest ? "subOpen" : "subClose"}>
    //           <li className="subli">
    //             <NavLink
    //               to={"request/business-approval"}
    //               className={({ isActive, isPending }) =>
    //                 isPending ? "sub" : isActive ? "activesub" : "sub"
    //               }
    //             >
    //               Business Approval
    //             </NavLink>
    //           </li>

    //           <li className="subli">
    //             <NavLink
    //               to={"request/user-withdrawal"}
    //               className={({ isActive, isPending }) =>
    //                 isPending ? "sub" : isActive ? "activesub" : "sub"
    //               }
    //             >
    //               Withdrawal
    //             </NavLink>
    //           </li>
    //           <li className="subli">
    //             <NavLink
    //               to={"request/user-approval"}
    //               className={({ isActive, isPending }) =>
    //                 isPending ? "sub" : isActive ? "activesub" : "sub"
    //               }
    //             >
    //               User Approval
    //             </NavLink>
    //           </li>
    //           <li className="subli">
    //             <NavLink
    //               to={"request/user-transactions"}
    //               className={({ isActive, isPending }) =>
    //                 isPending ? "sub" : isActive ? "activesub" : "sub"
    //               }
    //             >
    //               Transaction
    //             </NavLink>
    //           </li>
    //         </div>
    //       </ul>

    //       <NavLink
    //         to={"summary"}
    //         className={({ isActive, isPending }) =>
    //           isPending ? "navlink" : isActive ? "activeNavlink" : "navlink"
    //         }
    //       >
    //         Summary
    //       </NavLink>
    //       <NavLink
    //         to={"funds"}
    //         className={({ isActive, isPending }) =>
    //           isPending ? "navlink" : isActive ? "activeNavlink" : "navlink"
    //         }
    //       >
    //         Funds
    //       </NavLink>
    //     </ul>
    //   </div>
    //   <Outlet />
    // </div>

    <>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#home">Bias Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={NavLink} to={"/dashboard"}>
                Dashboard
              </Nav.Link>

              <Nav.Link as={NavLink} to={"/summary"}>
                Summary
              </Nav.Link>
              <Nav.Link as={NavLink} to={"/funds"}>
                Funds
              </Nav.Link>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Inventory"
                menuVariant="dark"
              >
                <NavDropdown.Item as={NavLink} to={"/user"}>
                  User
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={"/business"}>
                  Businesses
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={"/investments"}>
                  Investments
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={"/transactions"}>
                  Transactions
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={""}>
                  Logs
                </NavDropdown.Item>
              </NavDropdown>
              {/* <NavDropdown
                id="nav-dropdown-dark-example"
                title="Requests"
                menuVariant="dark"
              >
                <NavDropdown.Item href="#action/3.1">
                  Business Approval
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  User Approval
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Withdrawal
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}
