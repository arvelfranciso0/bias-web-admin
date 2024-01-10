import React, { useEffect, useState, useRef } from "react";
import "../Css/userapproval.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FileDownload from "react-file-download";
import Loader from "./loader";
function UserApproveModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const getUserID = new URLSearchParams(location.search);
  const id = getUserID.get("id");
  const [show, setShow] = useState(false);
  const [user, setUser] = useState([]);
  const [userImages, setUserImages] = useState("");
  const refUserInformation = useRef();
  const refIDVerification = useRef();
  const [showLoader, setShowLoader] = useState(false);
  // console.log(id);
  // const handleHide = () => {
  //   navigate(-1);
  // };
  useEffect(() => {
    setShowLoader(true);
    if (id) {
      axios
        .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/approveUser`, {
          user_id: id,
        })
        .then((res) => {
          if (res.data.status) {
            setUser(res.data.result);
            console.log(res.data.result);
            setShowLoader(false);
          } else {
            return (
              <div>
                <h2>Error Occur </h2>
                <p>Error message {res.data.message}</p>
              </div>
            );
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
      return (
        <div>
          <h3>No User select</h3>
          <button onClick={() => navigate(-1)}>Okay</button>
        </div>
      );
    }
  }, []);

  const handleDownload = () => {
    const imageUrl = userImages;
    const desiredFileName = "downloaded_image.jpg";

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => FileDownload(blob, desiredFileName))
      .catch((error) => console.error("Error during image download:", error));
  };

  const handleApprove = () => {
    setShowLoader(true);
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/userapprove`, {
        user_id: id,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
          setShowLoader(false);
          window.location.reload();
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

  const scrollToDiv = (divRef) => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShowModal = (image) => {
    setUserImages(image);
    setShow(true);
  };
  const handleClose = () => {
    setUserImages("");
    setShow(false);
  };

  return (
    <div className="d-flex flex-column mt-3 p-3 gap-3">
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {" "}
          <img
            src={userImages}
            className="rounded mx-auto d-block "
            alt="..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            Donwload
          </Button>
        </Modal.Footer>
      </Modal>
      {showLoader ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <Loader />
        </div>
      ) : (
        <div className="container-fluid w-100">
          {user.length > 0 ? (
            <>
              {user[0].user_identity_status === "pending" ? (
                <div className="d-flex justify-content-end align-items-center gap-3 ">
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={handleApprove}
                  >
                    Approve
                  </button>
                  <button type="button" class="btn btn-secondary">
                    Decline
                  </button>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}

          {user.map((item) => (
            <>
              <img
                src={`${
                  item.user_profile
                    ? item.user_profile
                    : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                }`}
                className="rounded mx-auto d-block "
                alt="..."
                style={{ width: "15rem", height: "15rem" }}
              />
              <div className="d-flex gap-4">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  onClick={() => scrollToDiv(refUserInformation)}
                >
                  User Information
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  onClick={() => scrollToDiv(refIDVerification)}
                >
                  User ID
                </button>
              </div>

              <div
                className="border mt-2 p-3 bg-secondary text-light fs-5 w-100"
                ref={refUserInformation}
              >
                User Information
              </div>

              <span className="ps-3">
                <div class="mb-3">
                  <label className="form-label fw-bold">User Type</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={item.user_type.toUpperCase()}
                  />
                </div>
                <div class="mb-3">
                  <label className="form-label fw-bold">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={`${item.user_fname} ${item.user_mname} ${item.user_lname}`}
                  />
                </div>
                <div class="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={item.user_email}
                  />
                </div>
                <div class="mb-3">
                  <label className="form-label fw-bold">Address</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={`${item.user_province}, ${item.user_city}, ${item.user_barangay}`}
                  />
                </div>
                {/* <div class="mb-3">
            <label className="form-label fw-bold">
              Business Traffic Area{" "}
              {item.buss_station === "no" ? (
                <FontAwesomeIcon
                  icon={faSquareXmark}
                  style={{ color: "#ff0000" }}
                />
              ) : (
                item.buss_station ===
                "yes"(<FontAwesomeIcon icon={faSquareCheck} />)
              )}
            </label>
            <div className="d-flex gap-2 flex-wrap w-50">
              <span className="border p-2 ">{item.buss_station_name}</span>
            </div>
          </div> */}
                <div class="mb-3">
                  <label className="form-label fw-bold">Birthdate</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={new Date(item.user_bdate).toLocaleDateString()}
                  />
                </div>
                <div class="mb-3">
                  <label className="form-label fw-bold">Age</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={item.user_age}
                  />
                </div>
                <div class="mb-3">
                  <label className="form-label fw-bold">Contact Number</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={item.user_contact_num}
                  />
                </div>
                <div class="mb-3">
                  <label className="form-label fw-bold">Gender</label>
                  <input
                    type="text"
                    class="form-control"
                    readOnly
                    value={item.user_gender}
                  />
                </div>

                <div
                  className="border mt-3 p-3 bg-secondary text-light fs-5"
                  ref={refIDVerification}
                >
                  ID Verifiaction
                </div>

                <span className="ps-3">
                  <div class="mb-3">
                    <label className="form-label fw-bold">ID Type</label>
                    <input
                      type="text"
                      class="form-control"
                      readOnly
                      value={item.user_identity_id_type}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-evenly">
                    <div class="mb-3 d-flex align-items-center justify-content-center flex-column">
                      <label className="form-label fw-bold ">2x2</label>
                      {item.user_identity_photo ? (
                        <img
                          src={item.user_identity_photo}
                          className="rounded mx-auto d-block "
                          alt="..."
                          title="Click to view"
                          style={{
                            width: "20rem",
                            height: "15rem",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleShowModal(item.user_identity_photo)
                          }
                        />
                      ) : (
                        <label>No data</label>
                      )}
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-evenly">
                    {" "}
                    <div class="mb-3 d-flex align-items-center justify-content-center flex-column">
                      <label className="form-label fw-bold">Front ID</label>
                      {item.user_identity_front_id ? (
                        <img
                          src={item.user_identity_front_id}
                          title="Click to view"
                          style={{
                            width: "20rem",
                            height: "15rem",
                            cursor: "pointer",
                          }}
                          className="rounded mx-auto d-block "
                          alt="..."
                          onClick={() =>
                            handleShowModal(item.user_identity_front_id)
                          }
                        />
                      ) : (
                        <label>No data</label>
                      )}
                    </div>
                    <div class="mb-3 d-flex align-items-center justify-content-center flex-column">
                      <label className="form-label fw-bold">Back ID</label>
                      {item.user_identity_back_id ? (
                        <img
                          src={item.user_identity_back_id}
                          className="rounded mx-auto d-block "
                          alt="..."
                          title="Click to view"
                          style={{
                            width: "20rem",
                            height: "15rem",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleShowModal(item.user_identity_back_id)
                          }
                        />
                      ) : (
                        <label>No data</label>
                      )}
                    </div>
                  </div>
                </span>
              </span>
              {user.length > 0 ? (
                <>
                  {user[0].user_identity_status === "pending" ? (
                    <div className="contianer d-flex justify-content-center align-items-center gap-3 mt-4 mb-4">
                      <button
                        type="button"
                        class="btn btn-primary w-25"
                        onClick={handleApprove}
                      >
                        Approve
                      </button>
                      <button type="button" class="btn btn-secondary w-25">
                        Decline
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </>
          ))}
        </div>
      )}

      {/* <button onClick={handleHide} id="close-btn">
        Close
      </button> */}
    </div>
  );
}

export default UserApproveModal;
