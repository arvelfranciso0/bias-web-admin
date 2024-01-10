import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Loader from "../loader";
function AddingCategory() {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [warningMsg, setWarningMsg] = useState("");
  const [showLoadingState, setShowLoadingState] = useState(false);
  const [submitBtnStatus, setSubmitBtnStatus] = useState(false);
  const addingSubCategory = () => {
    const hasSubCategory = subCategoryList.some((item) => item === subCategory);

    if (hasSubCategory) {
      setWarningMsg("Subcategory Already Exists");
      setInterval(() => {
        setWarningMsg("");
      }, 2000);
    } else {
      setSubCategoryList([...subCategoryList, subCategory]);
      setSubCategory("");
    }
  };

  useEffect(() => {
    if (subCategoryList.length > 0) {
      setSubmitBtnStatus(true);
    } else {
      setSubmitBtnStatus(false);
    }
  }, [subCategoryList]);

  const handleSubmitBusinessCategory = () => {
    setShowLoadingState(true);
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/addingCategories`, {
        category,
        subCategoryList,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
          setShowLoadingState(false);
          setSubCategoryList([]);
          setCategory("");
          window.location.reload();
        } else {
          alert(res.data.message);
          setShowLoadingState(false);
          setSubCategoryList([]);
          setCategory("");
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(error.message);
        setShowLoadingState(false);
        setSubCategoryList([]);
        setCategory("");
      });
  };
  return (
    <div className="contianer-fluid ">
      <h4>Adding Business Categories</h4>
      <form>
        <div class="mb-3">
          <label class="form-label">Category</label>
          <input
            type="text"
            class="form-control"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          />
        </div>
        <div class="mb-1">
          <label class="form-label">Sub-Category</label>
          <div className="d-flex gap-3">
            <input
              type="text"
              class="form-control"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
            />
            <button
              type="button"
              class="btn btn-secondary "
              onClick={addingSubCategory}
            >
              Add
            </button>
          </div>
          <label className="text-danger" style={{ fontSize: ".9rem" }}>
            {warningMsg}
          </label>
        </div>
        {subCategoryList.length > 0 ? (
          <label className="fw-bold bg-dark text-light p-1 w-100 rounded">
            List of subcategory
          </label>
        ) : (
          ""
        )}
        <div className="w-100 overflow-auto" style={{ height: "11rem" }}>
          {subCategoryList.length > 0 ? (
            <>
              {" "}
              <table class="table align-middle mb-0 bg-white mt-1 overflow-auto ">
                <tbody>
                  {subCategoryList.map((item, index) => (
                    <tr key={index}>
                      <td>{item}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          class="btn btn-link btn-rounded btn-sm fw-bold"
                          data-mdb-ripple-color="dark"
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            // onClick={() => handleRemoveFundsItems(index)}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="d-flex align-items-end justify-content-center mt-3 ">
          {submitBtnStatus ? (
            <button
              type="button"
              class="btn btn-primary w-50"
              onClick={handleSubmitBusinessCategory}
              disabled={showLoadingState}
            >
              {showLoadingState ? <Loader /> : "Submit"}
            </button>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
}

export default AddingCategory;
