import React, { useState, useEffect } from "react";
import { Button, Modal } from "rsuite";
import * as galleryServices from "../services/galary.services";
import UseImageLoad from "./imageloader";
import Loader from "./loader";

const SendMedia = ({ setOpen, chooseMedia, onClick, successButtonText = "Send", assignedMedia = [] , deletedMediaProps}) => {
  // console.log("user_id",user_id,openModal);
  // const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [mediaPage, setMediaPage] = useState(100);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [deletedMedia, setDeletedMedia] = useState([]);

  useEffect(() => {
    chooseMedia(selectedMedia);
  }, [selectedMedia]);

  useEffect(() => {
    setSelectedMedia(assignedMedia)
  },[]);

 
  /* Work of sent media*/
  useEffect(() => {
    // setOpen(openModal);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mediaPage]);
  // Function to handle scroll events
  const handleScroll = (e) => {
    if (e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight) {
      const scrollTop =
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop;
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;
      const scrolledToBottom =
        Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      if (scrolledToBottom && !isLoading) {
        fetchData();
      }
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      galleryServices.List({ limit: mediaPage }).then((data) => {
        const imgarr =
          data && data.data && data.data.list ? data.data.list : [];
        setData(imgarr);
        // setData((prevData) => [...prevData, ...imgarr])
        setMediaPage((prevPage) => prevPage + 10);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if(deletedMediaProps){
      deletedMediaProps(deletedMedia);
    }
  },[deletedMedia])
  
  const handleMediaSelection = (checked, url) => {
    // console.log("checked",checked,url);
    if (checked) {
      setSelectedMedia((previousState) => [...previousState, url?.filePath]);
      if(deletedMedia.indexOf(url.filePath) !== -1){
        setDeletedMedia(deletedMedia.filter(item=>{
          return item !== url.filePath;
        }))
      }
    } else {
      setSelectedMedia((previousState) =>
        previousState.filter((item) => item !== url?.filePath)
      );
      if(assignedMedia.indexOf(url.filePath) !== -1){
        setDeletedMedia((prev)=>[...prev, url.filePath])
      }
      // userAssignData.filter((item) => {
      //   console.log("item",item);
      //   if(selectedMedia.includes(item)){
      //     console.log("itemDeleted",item);
      //   }else{
      //     setDeletedData((prevState) => [...prevState, item])
      //   }
      // })
    }
  };

  const isSelectedMedia = (data) => {
    return selectedMedia.filter((item) => data?.filePath === item).length > 0;
  };

 /* Work of sent media */
 

  return (
    <>
      {/***********Social Media Work Modal <<<<<<*************/}
      <Modal
        size="full"
        open={true}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Media</Modal.Title>
        </Modal.Header>
        <Modal.Body onScroll={handleScroll}>
          <div className="">
            <div className="d-flex flex-wrap">
              {data &&
                data.length > 0 &&
                data.map((item, index) => {
                  return (
                    <div key={index} className="check_container">
                      <UseImageLoad item={item} index={index} />
                      <input
                        type="checkbox"
                        id={"input1" + index}
                        checked={isSelectedMedia(item)}
                        onChange={(e) =>
                          handleMediaSelection(e.target.checked, item)
                        }
                      />
                      <label htmlFor={"input1" + index}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="currentColor"
                          className="bi bi-check-circle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                      </label>
                    </div>
                  );
                })}
            </div>
            {isLoading ? <Loader /> : ""}
          </div>
        </Modal.Body>
        <Modal.Footer className="mt-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {selectedMedia.length ? (
                <>
                  <i
                    className="fa fa-check-circle"
                    aria-hidden="true"
                    style={{ fontSize: "23px", color: "#35b159" }}
                  ></i>
                  <h6 className="ms-2 mt-1 mb-0">
                    Selected {selectedMedia.length}{" "}
                    {selectedMedia.length > 1 ? "records" : "record"}
                  </h6>
                </>
              ) : (
                <></>
              )}
            </div>
            <div>
              <Button onClick={() => {
                setSelectedMedia([])
                onClick(true)
              }} appearance="subtle">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // setOpen(false);
                  onClick(false);
                }}
                appearance="primary"
              >
                {successButtonText}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      {/***********Social Media Work Modal <<<<<<*************/}
    </>
  );
};

export default SendMedia;
