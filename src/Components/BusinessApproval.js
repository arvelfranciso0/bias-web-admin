import React, { useState, useEffect } from "react";
import "../Css/business_approval.css";
import LazyLoad from "react-lazy-load";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faArrowUpWideShort,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { useNavigate, Outlet } from "react-router-dom";
function BusinessApproval(props) {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [listofBusinessApproval, setlistofBusinessApproval] = useState([]);
  const handleShowNew = () => {
    setShowNew(!showNew);
  };

  const handleShowModal = (id) => {
    navigate(`t/${id}`);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3006/admin/listofBusinessApproval")
      .then((res) => {
        if (res.data.status) {
          setlistofBusinessApproval(res.data.result);
          console.log(res.data.result);
        } else {
          alert(res.data.message);
        }
      });
  }, []);

  return (
    <>
      <div className="business-approval-contianer">
        <div className="business-approval-header">
          <h3>Business Approval</h3>
        </div>
        <div className="business-approval-filter">
          <h4>Filter Section : </h4>
          <div className="range-container">
            <div className="start-date">
              <label id="approve-title">Start Date : </label>
              <input type="date" />
            </div>
            <div className="end-date">
              <label id="approve-title">End Date :</label>
              <input type="date" />
            </div>
            <FontAwesomeIcon
              icon={faSort}
              title="Click here to sort the date"
              className="sort-range-date"
            />
          </div>
          <div className="sorting-container">
            <label id="approve-title">Sort : </label>
            {showNew ? (
              <FontAwesomeIcon
                icon={faArrowUpWideShort}
                className="sort-icon"
                title="Click here to set to new to old"
                onClick={handleShowNew}
              />
            ) : (
              <FontAwesomeIcon
                icon={faArrowDownWideShort}
                title="Click here to set to old to new"
                className="sort-icon"
                onClick={handleShowNew}
              />
            )}
          </div>
        </div>

        <div className="business-approval-content">
          {listofBusinessApproval.map((item) => (
            <LazyLoad height={362} offset={300} threshold={0.95}>
              <div className="business-approval-details" key={item.buss_id}>
                <div className="business-image">
                  <img src={item.buss_photo} alt="Logo" />
                </div>
                <p>
                  Entrepreneur Name: {item.user_fname} {item.user_lname}
                </p>
                <p>Business Name: {item.buss_name}</p>

                <p>Business Capital : {item.buss_capital}</p>
                <button onClick={() => handleShowModal(item.buss_id)}>
                  More
                </button>
              </div>
            </LazyLoad>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default BusinessApproval;
