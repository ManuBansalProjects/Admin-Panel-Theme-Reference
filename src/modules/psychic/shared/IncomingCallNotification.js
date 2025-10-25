import React, { useEffect, useRef, useState } from 'react';
import { SOCKET_CLIENT } from "../../../utils/socket";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setIncomingCallRequestDetails, setMeetingDetails } from '../../../redux/slices/meetingDetailsSlice';

const IncomingCallNotification = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioUnlockedRef = useRef(false);
  const ringToneRef = useRef(null);
  const incomingCallDetails = useSelector(state => state.meetingDetailsSlice.incomingCallRequestDetails);
  const incomingCallDetailsRef = useRef(incomingCallDetails);

  useEffect(()=>{
    ringToneRef.current = new Audio('/meeting-ringtones/ringtone.mp3');
    ringToneRef.current.loop = true;
    ringToneRef.current.load();

    return ()=>{
      ringToneRef.current?.pause();
      ringToneRef.current = null;
      audioUnlockedRef.current = null;
      incomingCallDetailsRef.current = null;
    }
  }, [])
  
  useEffect(()=>{
    if(audioUnlocked){
      startRingtone();
    }
  }, [audioUnlocked])
 
  // Keep ref updated by incmong-call-details on every render
  useEffect(() => {
    incomingCallDetailsRef.current = incomingCallDetails;
  }, [incomingCallDetails]);

  //Socket events
  useEffect(() => {
    SOCKET_CLIENT.on('INCOMING-CALL', (data) => {
      dispatch(setIncomingCallRequestDetails(data))
      if(audioUnlockedRef.current){
        startRingtone();
      }
    });

    SOCKET_CLIENT.on('END-INCOMING-CALL', (data) => {
      if( incomingCallDetailsRef.current?.sender_id == data.sender_id){
        dispatch(setIncomingCallRequestDetails(null))
        endRingtone();
      }
    });

    return () => {
      SOCKET_CLIENT.off('INCOMING-CALL');
      SOCKET_CLIENT.off('END-INCOMING-CALL');
    }
  }, []);

  const handleAccept = () => {
    // const data = {
    //     call_type : 'incoming',
    //     call_info : { 
    //       ...incomingCallDetailsRef.current, 
    //       uid : Math.floor(Math.random() * 10000) // random uid
    //     }
    // }
    // dispatch(setMeetingDetails(data))
    
    navigate(`/psychic/meeting?meeting_id=${incomingCallDetailsRef.current.meeting_id}`) 
    dispatch(setIncomingCallRequestDetails(null))
    endRingtone();
  };
  const handleDecline = () => {
    //todo: make the socket
    const socketDetails = {
      sender_id : incomingCallDetailsRef.current?.sender_id,
      receiver_id : incomingCallDetailsRef.current?.receiver_id
    }
    SOCKET_CLIENT.emit('DECLINE-CALL', socketDetails);
    dispatch(setIncomingCallRequestDetails(null))
    endRingtone();
  };
  
  function unlockAudio(){
    if (!ringToneRef.current) return;

    ringToneRef.current.volume = 0;
    ringToneRef.current.play().then(() => {
      ringToneRef.current.pause();
      ringToneRef.current.currentTime = 0;
      ringToneRef.current.volume = 1;
      setAudioUnlocked(true);
      audioUnlockedRef.current = true;
    }).catch(console.warn);
  };
  function startRingtone(){
    ringToneRef.current?.play();
  }
  function endRingtone(){
    ringToneRef.current?.pause();
    ringToneRef.current.currentTime = 0;
  }

  if (!incomingCallDetails) return null;

  return (
    <div className="incoming-call-container">
      <div className="incoming-call-box shadow">
        <strong>{incomingCallDetails?.sender_name}</strong> is calling...
        <div className="incoming-call-actions mt-2">
          <div className='mb-2'>
            <button className="btn btn-success me-2" onClick={handleAccept}>Accept</button>
            <button className="btn btn-danger" onClick={handleDecline}>Decline</button>
          </div>
          {!audioUnlocked && (
            <button className="btn btn-primary" onClick={()=> {unlockAudio()}}>🔓 Enable Sound</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
