import React, { useEffect, useState } from "react";
import "../Css/userapproval.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { calculateAge, calculateBirthdate } from "../Functions/utils";
function UserApproveModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const getUserID = new URLSearchParams(location.search);
  const id = getUserID.get("id");
  const [user, setUser] = useState([]);
  console.log(id);
  const handleHide = () => {
    navigate(-1);
  };
  useEffect(() => {
    if (id) {
      axios
        .post("http://localhost:3006/admin/approveUser", {
          user_id: id,
        })
        .then((res) => {
          if (res.data.status) {
            setUser(res.data.result);
            console.log(res.data.result);
          } else {
            return (
              <div>
                <h2>Error Occur </h2>
                <p>Error message {res.data.message}</p>
              </div>
            );
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

  const handleApprove = (id) => {
    axios
      .post("http://localhost:3006/admin/userapprove", {
        user_id: id,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <div className="container">
      {user.map((item) => {
        if (item.idt_id) {
          return (
            <>
              <div className="user-approve-modal-content" key={item.user_id}>
                <div>
                  <img src={item.user_profile_photo} />
                </div>
                <div>
                  <h2>User Information</h2>
                  <p>First name: {item.user_fname}</p>
                  <p>Middle name: {item.user_mname}</p>
                  <p>Last Name: {item.user_lname}</p>
                  <p>Age: {calculateAge(item.user_bdate)}</p>
                  <p>Gender: {item.user_gender}</p>
                  <p>Birthdate: {calculateBirthdate(item.user_bdate)}</p>
                  <p>Contact number: {item.user_contact_num}</p>
                </div>

                <div>
                  <h2>Location Information</h2>
                  <p>Province: {item.user_province}</p>
                  <p>City: {item.user_city}</p>
                  <p>Barangay: {item.user_barangay}</p>
                </div>

                <div>
                  <h2>Credentials/Identification Cards/ID's</h2>
                  <h4>User Picture</h4>
                  <div>
                    <img src={item.idt_user_picture} />
                  </div>
                  <p>ID Type: {item.idt_id_type}</p>
                  <h4>Front ID</h4>
                  <div>
                    <img src={item.idt_id_photo_url_front} />
                  </div>
                  <h4>Back ID</h4>
                  <div>
                    <img src={item.idt_id_photo_url_back} />
                  </div>
                </div>

                <button onClick={() => handleApprove(item.user_id)}>
                  Approve
                </button>
                <button>Decline</button>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="user-approve-modal-content" key={item.user_id}>
                <h2>User Information</h2>
                <p>details here...</p>
                <h2>Location Information</h2>
                <p>details ... here</p>

                <div>
                  <h3>Please notify the user to Verify his/her account.</h3>
                  <button>Notify</button>
                </div>
              </div>
            </>
          );
        }
      })}
      {/* <button onClick={handleHide} id="close-btn">
        Close
      </button> */}
    </div>
  );
}

export default UserApproveModal;
