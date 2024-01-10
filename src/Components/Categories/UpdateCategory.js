import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
function UpdateCategory({ handleShow, ctg }) {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const categoryData = [ctg];
    const AddingEditStatusCategory = categoryData.map((item) => {
      return {
        ...item,
        editStatus: false,
        subcategory: item.subcategory.map((sub) => ({
          ...sub,
          editStatus: false,
          deleteStatus: false,
        })),
      };
    });

    setCategory(AddingEditStatusCategory);
  }, [ctg]);
  const handleClose = () => {
    handleShow();
  };

  const handleAllowEditSubCategory = (sub_catgeory_id) => {
    const UpdateStatusSubcategory = category.map((item) => {
      return {
        ...item,
        subcategory: item.subcategory.map((sub) => {
          if (sub.sub_ctg_id === sub_catgeory_id) {
            return {
              ...sub,
              editStatus: true,
            };
          } else {
            return sub;
          }
        }),
      };
    });
    setCategory(UpdateStatusSubcategory);
  };

  const handleInputChange = (sub_catgeory_id, newText) => {
    const UpdateSubcategoryName = category.map((item) => {
      return {
        ...item,

        subcategory: item.subcategory.map((sub) => {
          if (sub_catgeory_id === sub.sub_ctg_id) {
            return {
              ...sub,
              sub_ctg_name: newText,
            };
          } else {
            return sub;
          }
        }),
      };
    });
    setCategory(UpdateSubcategoryName);
  };

  const handleDeleteSubCategory = (sub_catgeory_id) => {
    const deleteSubcategory = category.map((item) => {
      return {
        ...item,
        subcategory: item.subcategory.map((sub) => {
          if (sub_catgeory_id === sub.sub_ctg_id) {
            return {
              ...sub,
              deleteStatus: true,
              sub_ctg_status: "delete",
            };
          } else {
            return sub;
          }
        }),
      };
    });

    console.log(deleteSubcategory);
    setCategory(deleteSubcategory);
  };

  const handleEditCategory = (ctg_id) => {
    const AllowEditCategory = category.map((item) => {
      if (item.ctg_id === ctg_id) {
        return {
          ...item,
          editStatus: true,
        };
      } else {
        return item;
      }
    });
    setCategory(AllowEditCategory);
  };

  const handleInputChangeCategory = (ctg_id, newText) => {
    const UpdateCategoryName = category.map((item) => {
      if (item.ctg_id === ctg_id) {
        return {
          ...item,
          ctg_name: newText,
        };
      } else {
        return item;
      }
    });
    setCategory(UpdateCategoryName);
  };

  const handleUpdateCategories = () => {
    const editedCategory = category.filter((item) => {
      if (item.editStatus === true) {
        return item;
      }
    });
    const subcategory = category[0].subcategory;
    const editedSubCategory = subcategory.filter(
      (item) => item.editStatus === true || item.deleteStatus === true
    );

    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/updatesCategorandSubs`, {
        editedCategory,
        editedSubCategory,
      })
      .then((res) => {
        if (res.data.status) {
          alert(res.data.message);
          window.location.reload();
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div>
      <Modal show={handleShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {category.map((item) => (
            <div key={item.ctg_id}>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    value={item.ctg_name}
                    disabled={item.editStatus ? false : true}
                    onChange={(e) =>
                      handleInputChangeCategory(item.ctg_id, e.target.value)
                    }
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleEditCategory(item.ctg_id)}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Sub-Category</label>
                {item.subcategory.map((data, index) => (
                  <div key={data.sub_ctg_id}>
                    {data.deleteStatus ? (
                      ""
                    ) : (
                      <div class="input-group mb-1">
                        <input
                          type="text"
                          class="form-control"
                          value={data.sub_ctg_name}
                          disabled={data.editStatus ? false : true}
                          onChange={(e) =>
                            handleInputChange(data.sub_ctg_id, e.target.value)
                          }
                        />
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          onClick={() =>
                            handleAllowEditSubCategory(data.sub_ctg_id)
                          }
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          onClick={() =>
                            handleDeleteSubCategory(data.sub_ctg_id)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-danger"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateCategories}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateCategory;
