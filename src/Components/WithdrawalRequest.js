import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, Toast } from "react-bootstrap";
function WithdrawalRequest(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const withdrawId = searchParams.get("id");
  const [withdrawDetails, setWithdrawDetails] = useState([]);
  const [showToast, setshowToast] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/viewWithdrawalDetails`, {
        withdrawId,
      })
      .then((res) => {
        if (res.data.status) {
          console.log(res.data.result);
          setWithdrawDetails(res.data.result);
        } else {
          setAlertMsg(res.data.message);
          setAlertType("danger");
          setshowToast(true);
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
  return (
    <div
      className="countainer p-5 mt-5 d-flex align-items-center justify-content-center "
      style={{ height: "100vh" }}
    >
      {showToast ? (
        <ToastContainer position="top-center" className="p-3">
          <Toast
            className="d-inline-block m-1"
            bg={alertType}
            show={showToast}
            delay={3000}
            onClose={() => setshowToast(false)}
            autohide
          >
            <Toast.Body className="primary text-light">{alertMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
      ) : (
        ""
      )}
      {withdrawDetails.map((item, index) => (
        <div className="w-75 mt-5 pt-5" key={index}>
          <div className="border mt-2 p-3 bg-secondary text-light fs-5 w-100">
            Business Details
          </div>
          <div className="d-flex align-items-center justify-content-center w-100">
            <img
              src={item.buss_photo}
              alt="business log"
              style={{ height: "10rem", width: "10rem" }}
              className="rounded-circle shadow"
            />
          </div>
          <div class="mb-3">
            <label className="form-label fw-bold">Business Name</label>
            <input
              type="text"
              class="form-control"
              disabled
              value={item.buss_name}
            />
          </div>
          <div className="border mt-2 p-3 bg-primary text-light fs-5 w-100">
            Withdraw Details
          </div>

          <div class="mb-3">
            <label className="form-label fw-bold">Withdraw Amount</label>
            <input
              type="text"
              class="form-control"
              disabled
              value={item.withdraw_amt}
            />
          </div>
          <div class="mb-3">
            <label className="form-label fw-bold">Date Requested</label>
            <input
              type="text"
              class="form-control"
              disabled
              value={new Date(item.withdraw_created_at).toLocaleDateString()}
            />
          </div>
          <div className="border mt-2 p-3 bg-info text-light fs-5 w-100">
            Investment Details
          </div>
          <div class="mb-3">
            <label className="form-label fw-bold">Investment Return</label>
            <input
              type="text"
              class="form-control"
              disabled
              value={item.invst_returned_amt}
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <div class="mb-3">
              <label className="form-label fw-bold">
                Investment Number of Months
              </label>
              <input
                type="text"
                class="form-control"
                disabled
                value={item.invst_num_month}
              />
            </div>
            <div class="mb-3">
              <label className="form-label fw-bold">
                Investment Sum Interest
              </label>
              <input
                type="text"
                class="form-control"
                disabled
                value={item.invst_interest_sum}
              />
            </div>
            <div class="mb-3">
              <label className="form-label fw-bold">
                Investment Interest Rate
              </label>
              <input
                type="text"
                class="form-control"
                disabled
                value={item.invst_interest + "%"}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WithdrawalRequest;
