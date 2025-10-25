import React, { useEffect, useState } from 'react';
// import userImg1 from "./../../../../../assets/website/images/user1.jpg"
import { SOCKET_CLIENT } from '../../../../../utils/socket';
import { useNavigate, useParams } from 'react-router-dom';
import { getChat, getChatUsers, getRoomId } from '../../../services/chat.services';
import { getUser } from '../../../../../utils/commonfunction';
import { ROLE } from '../../../../../utils/Constants';
import Messages from './Messages';
import { useTranslation } from 'react-i18next';

export default function Chat() {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  // const roomId = params?.id || "67c6810c4c47fb4f6d361cbd";
  const [roomId, setRoomId] = useState("")
  // const [userId, setUserId] = useState("");
  const SENDER = getUser(ROLE.PSYCHIC);
  
  const [newMessage, setNewMessage] = useState('');
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
    getChatUsers()
      .then((response) => {
        console.log("=-==users List-=-=-", response)
        setChatUsers(response?.data?.list);
        // setUserId(response?.data?.list[0]._id);
      })
      .catch((error) => {
        console.log("error", error)
      })
  }, []);

  function onUserClick(receiver){
    // setUserId(receiver?._id);
    if(receiver.chatDetails && receiver.chatDetails._id){
      navigate(`/psychic/chat/${receiver.chatDetails._id}?receiverID=${receiver._id}`, {state: {receiver: receiver}});
    }else{
      getRoomId({receiverId: receiver._id, senderId: SENDER._id,})
      .then((response) => {
        console.log("=-=chatId=->", response);
        // This is the chat id {response.data._id}
        navigate(`/psychic/chat/${response.data._id}?receiverID=${receiver._id}`, {state: {receiver: receiver}});
      })
    }
    // if(!receiver.roomId && !receiver.chatDetails){
    //   getRoomId({receiverId: userId, senderId: MyId,})
    //   .then((response) => {
    //     console.log("=-=chatId=->", response);
    //     setRoomId(response?.data?.chatId);
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   })
    // }else if(receiver.roomId){
    //   setRoomId(receiver.roomId)
    // }else if(receiver.chatDetails){
    //   setRoomId(receiver?.chatDetails?._id)
    // }
  }

  console.log("-=-=-=-roomId--=-=-=-=", roomId);

  return (
    <div className='dashboard-right-container'>
      <div className='dashboard-header'>
        <h2 className='heading-22-bold'>{t("label_chat_history")}</h2>
      </div>
      <div className='dashboard-body'>
        <div className='chat-wrapper'>
          <div className='chat-left-container'>
            <div className='chat-search-box'>
              <input type='text' placeholder='Search' />
              <button aria-label="Search"><i className='ti ti-search' aria-hidden="true"></i></button>
            </div>
            <div className='chat-list-box' tabindex={0}>
              {/* Recent chats */}
              {chatUsers?.map((receiver) => (
                <div onClick={() => onUserClick(receiver)} className='chat-list-item d-flex gap-3' key={receiver._id}>
                  <figure className='avatar avatar-md m-0'>
                    <img alt='avatar' src={receiver.profile_image} />
                  </figure>
                  <figcaption>
                    <h4 className='heading-18-semibold'>{receiver.name}</h4>
                    <p className='m-0'>{receiver.designation}</p>
                    <span>{t("chat_welcome_what_would_you_like_to_discuss_today")}</span>
                    {/* <time>10 mins ago</time> */}
                  </figcaption>
                </div>
              ))}
            </div>
          </div>
          {
            params.roomID ?
              <Messages/>
            :
            <>
              <div className='py-5 text-center w-100 mt-5'>
                <h4>{t("chat_welcome")}</h4>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}
