import React, { useState, useEffect } from "react";
import "../Css/userapproval.css";
import UserApproveModal from "./User_Approve_Modal";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
function UserApproval(props) {
  const [showApprove, setShowApprove] = useState(false);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleShow = (id) => {
    navigate(`u/${id}`);
  };
  useEffect(() => {
    axios.get("http://localhost:3006/admin/userApproval").then((res) => {
      if (res.data.status) {
        setUser(res.data.result);
        console.log(res.data.result);
      } else {
        alert(res.data.message);
      }
    });
  }, []);

  return (
    <div className="user-approval-contianer ">
      <div className="user-approval-header">
        <h3>User Approval</h3>
      </div>
      <div className="user-approval-filter">
        <h4>Filter Section : </h4>
      </div>
      <div className="user-approval-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Usert Type</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {user.map((item) => (
              <tr key={item.user_id}>
                <td>{item.user_email}</td>

                <td>
                  {item.user_fname} {item.user_mname} {item.user_lname}
                </td>
                <td>{item.user_gender}</td>

                <td>
                  {item.user_barangay}, {item.user_city}, {item.user_province}
                </td>
                <td>{item.user_type}</td>
                <td>{item.user_status}</td>
                <td>
                  <button onClick={() => handleShow(item.user_id)}>
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
}

export default UserApproval;
