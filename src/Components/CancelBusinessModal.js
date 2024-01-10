import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function CancelBusinessModal({ handleCancelBusiness, type, msg, alertShow }) {
  const location = useLocation();
  const searchLocation = new URLSearchParams(location.search);
  const business = searchLocation.get("id");
  const user_id = searchLocation.get("user_id");
  const [cancelBusinessMessage, setCancelBusinessMessage] = useState("");
  const navigate = useNavigate();
  const handleClose = () => {
    handleCancelBusiness();
  };

  const hanldeCancel = () => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/cancelbusinessentrep`, {
        business,
        user_id,
        content: cancelBusinessMessage,
      })
      .then((res) => {
        if (res.data.status) {
          msg(res.data.message);
          type("success");
          alertShow(true);
          window.location.reload();
        } else {
          msg(res.data.message);
          type("danger");
          alertShow(true);
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
  return (
    <div>
      <Modal show={handleCancelBusiness} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Decline of Business Form </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="form-floating">
            <textarea
              class="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              style={{ height: "20rem" }}
              onChange={(e) => setCancelBusinessMessage(e.target.value)}
            ></textarea>
            <label for="floatingTextarea2">Provide decline message</label>
          </div>
          <div className="mt-3 d-flex justify-content-center w-100">
            <Button variant="primary" onClick={hanldeCancel} className="w-50">
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CancelBusinessModal;
