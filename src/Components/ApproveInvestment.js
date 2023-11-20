import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ApproveInvestment(props) {
  const [userInvestment, setUserInvestment] = useState([]);
  const location = useLocation();
  const searchId = new URLSearchParams(location.search);
  const invst_id = searchId.get("id");
  const user_id = searchId.get("user_id");

  useEffect(() => {
    axios
      .post("http://localhost:3006/admin/displayuserInvestment", {
        invst_id: invst_id,
        user_id: user_id,
      })
      .then((res) => {
        if (res.data.status) {
          setUserInvestment(res.data.result);
          console.log(res.data.result);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, [invst_id, user_id]);

  const handleApproveInvestment = (businessName) => {
    axios
      .post("http://localhost:3006/admin/approvedInvestment", {
        invst_id: invst_id,
        invst_status: "approved",
        invst_update_type: "approval",
        user_id: user_id,
        notif_type: "investment",
        notif_status: "unread",
        notif_content: `Your investment on business ${businessName} has been approved`,
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
  return (
    <div class="container rounded bg-white mb-5">
      {userInvestment.map((item, index) => (
        <div class="row" key={index}>
          <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                class="rounded-circle mt-5"
                width="150px"
                height="150px"
                src={item.user_profile}
              />
              <span class="font-weight-bold">
                {item.user_fname} {item.user_mname} {item.user_lname}
              </span>
              <span class="text-black-50">{item.user_email}</span>
              <span> </span>
            </div>
          </div>
          <div class="col-md-5 border-right">
            <div class="p-3 py-5">
              {" "}
              <label class="labels">
                {new Date(item.invst_created_at).toDateString()}
              </label>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-right">Investment Details</h4>
              </div>
              <div class="row mt-3">
                <div class="col-md-12">
                  <label class="labels">Invest Amount</label>
                  <input
                    readOnly
                    type="text"
                    class="form-control"
                    value={`₱ ${item.invst_amt}`}
                  />
                </div>
                <div class="row mt-2">
                  <div class="col-md-6">
                    <label class="labels">Months</label>
                    <input
                      readOnly
                      type="text"
                      class="form-control"
                      value={item.invst_num_month}
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="labels">Interet Rate</label>
                    <input
                      readOnly
                      type="text"
                      class="form-control"
                      value={`${item.invst_interest} %`}
                    />
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="labels">Return Amount</label>
                  <input
                    readOnly
                    type="text"
                    class="form-control"
                    value={`₱ ${item.invst_returned_amt}`}
                  />
                </div>
                {/* <div class="col-md-12">
                <label class="labels">Address Line 2</label>
                <input
                readOnly
                  type="text"
                  class="form-control"
                  placeholder="enter address line 2"
                  value=""
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Postcode</label>
                <input
                readOnly
                  type="text"
                  class="form-control"
                  placeholder="enter address line 2"
                  value=""
                />
              </div>
              <div class="col-md-12">
                <label class="labels">State</label>
                <input
                readOnly
                  type="text"
                  class="form-control"
                  placeholder="enter address line 2"
                  value=""
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Area</label>
                <input
                readOnly
                  type="text"
                  class="form-control"
                  placeholder="enter address line 2"
                  value=""
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Email ID</label>
                <input
                readOnly
                  type="text"
                  class="form-control"
                  placeholder="enter email id"
                  value=""
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Education</label>
                <input
                readOnly
                  type="text"
                  class="form-control"
                  placeholder="education"
                  value=""
                />
              </div> */}
              </div>
              <div class="mt-5 text-center">
                <button
                  class="btn btn-primary profile-button"
                  type="button"
                  onClick={() => handleApproveInvestment(item.buss_name)}
                >
                  Approved Investment
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3 py-5">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="text-right">Business Details</h4>
              </div>
              <div class="d-flex flex-column align-items-center text-center p-3 ">
                <img
                  class="rounded-circle"
                  width="150px"
                  height="150px"
                  src={item.buss_photo}
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Business Name</label>
                <input
                  readOnly
                  type="text"
                  class="form-control"
                  placeholder="experience"
                  value={item.buss_name}
                />
              </div>{" "}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApproveInvestment;
