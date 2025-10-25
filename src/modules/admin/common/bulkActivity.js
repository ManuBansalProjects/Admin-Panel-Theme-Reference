import React from 'react';

const BulkActivity = ({deleteButton = false, statusButton = false, onDeleteFunction, onStatusActive, onStatusInactive, selectedColumnsLength, allDataLength}) => {
  return (
    <div className="bulk_actions">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i
                className="fa fa-check-circle"
                aria-hidden="true"
                style={{ fontSize: "23px", color: "#35b159" }}
              ></i>
              <h6 className="ms-2 mt-1 mb-0">
                Selected 2 records of 10
                {/* Selected {selectedRecords.length}{" "}
                {selectedRecords.length > 1 ? "records" : "record"} of{" "}
                {allDataLength} */}
              </h6>
            </div>
            <div>
              <ul>
                {statusButton ? (
                    <>
                        <li>
                        <button
                            className="btn ripple btn-main-primary signbtn"
                            onClick={() => {
                                onStatusActive()
                            //   ChangeStatus(selectedRecords, 1);
                            }}
                        >
                            Active
                        </button>
                        </li>
                        <li>
                        <button
                            className="btn ripple btn-secondary"
                            onClick={() => {
                                onStatusInactive();
                            //   ChangeStatus(selectedRecords, 0);
                            }}
                        >
                            Inactive
                        </button>
                        </li>
                    </>
                ): (
                    <></>
                )}
                {deleteButton ? (
                    <li>
                    <button
                      className="btn ripple btn-secondary"
                      onClick={() => {
                        onDeleteFunction()
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ) : (
                    <></>
                )}
              </ul>
            </div>
          </div>
        </div>
  )
}

export default BulkActivity;