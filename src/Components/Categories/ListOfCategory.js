import React, { useEffect, useRef, useState } from "react";
import "../../Css/Category.css";
import AddingCategory from "./AddingCategory";
import axios from "axios";

import UpdateCategory from "./UpdateCategory";
function ListOfCategory(props) {
  const [showSub, setShowSub] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [showUpdateCategory, setShowUpdateCategory] = useState(false);
  const [ctg, setCtg] = useState("");
  const handleShowSub = (divId) => {
    showSub === divId ? setShowSub(null) : setShowSub(divId);
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/retreivecategories`)
      .then((res) => {
        if (res.data.status) {
          console.log(res.data.result);
          setCategoryList(res.data.result);
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  const handleShow = () => {
    setShowUpdateCategory(!showUpdateCategory);
  };

  const handleRemoveCategory = (id) => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/removeCategories`, {
        id,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <div className="container-fluid mt-3">
      {showUpdateCategory ? (
        <UpdateCategory handleShow={handleShow} ctg={ctg} />
      ) : (
        ""
      )}
      <div className="d-flex gap-4">
        <div
          className="w-50 shadow p-3 overflow-auto"
          style={{ height: "87vh" }}
        >
          <h4>Business Categories</h4>
          <table class="table align-middle mb-0 bg-white mt-3">
            <tbody>
              {categoryList.map((item) => (
                <tr key={item.ctg_id}>
                  {item.ctg_status !== "delete" ? (
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className=" bg-dark table-header text-light rounded border-bottom-0"
                          >
                            <div className="d-flex align-items-center justify-content-between ">
                              <label
                                onClick={() => handleShowSub(item.ctg_id)}
                                style={{ cursor: "pointer" }}
                                className="w-100"
                              >
                                {item.ctg_name}
                              </label>
                              <div className="d-flex gap-3">
                                <button
                                  type="button"
                                  class="btn btn-success"
                                  onClick={() => {
                                    handleShow();
                                    setCtg(item);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  class="btn btn-danger"
                                  onClick={() =>
                                    handleRemoveCategory(item.ctg_id)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {showSub === item.ctg_id ? (
                        <tbody className="shadow-sm">
                          {item.subcategory.map((subctg) => (
                            <tr key={subctg.sub_ctg_id}>
                              {subctg.sub_ctg_status === "save" ? (
                                <td className="ps-4 pe-2 border-bottom-0">
                                  <span className="d-flex justify-content-between  align-items-center">
                                    {subctg.sub_ctg_name}{" "}
                                  </span>
                                </td>
                              ) : (
                                ""
                              )}
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        ""
                      )}
                    </table>
                  ) : (
                    ""
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="w-50 shadow p-3 overflow-auto"
          style={{ height: "87vh" }}
        >
          <AddingCategory />
        </div>
      </div>
    </div>
  );
}

export default ListOfCategory;
