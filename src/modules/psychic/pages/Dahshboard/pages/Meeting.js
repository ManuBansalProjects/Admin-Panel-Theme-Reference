import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { SOCKET_CLIENT } from '../../../../../utils/socket';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { markCallAsReceived, resetMeetingDetailsForOutgoingCall, setMeetingDetails, setMessageId } from '../../../../../redux/slices/meetingDetailsSlice';
import { sendChat, updateChat } from '../../../services/chat.services';

export const Meeting = ()=>{

    const params = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const client = useRef(null);
    const localAudioTrack = useRef(null);
    const localVideoTrack = useRef(null);
    const [micMuted, setMicMuted] = useState(false);  
    const [videoOff, setVideoOff] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [joined, setJoined] = useState(false);
    const [meetingLeaved, setMeetingLeaved] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
 
    const meetingDetails = useSelector(state => state.meetingDetailsSlice.meetingDetails);
    const meetingDetailsRef = useRef(meetingDetails);

    useEffect(() => {
        meetingDetailsRef.current = meetingDetails; // ✅ Now meetingDetailsRef.current is up-to-date
        // Execute any logic that depends on fresh meetingDetails here
    }, [meetingDetails]);

    //for incoming calls care
    useEffect(()=>{
        if(meetingDetails?.call_type == 'incoming'){
            const isVideoCall = meetingDetails?.call_info?.meeting_type == 'video' ? true : false;
            joinChannel(isVideoCall);
        }else if(meetingDetails?.call_type == 'outgoing'){
            const isVideoCall = meetingDetails?.call_info?.meeting_type == 'video' ? true : false;
            joinChannel(isVideoCall);
        }
    }, [meetingDetails?.call_type])


    useEffect(() => {
        SOCKET_CLIENT.on('DECLINE-INCOMING-CALL', (data) => {
            if(data.sender_id == meetingDetailsRef.current?.call_info?.sender_id){
                leaveChannel(0);
            }
        });
        return () => {
            SOCKET_CLIENT.off('DECLINE-INCOMING-CALL');
        }
    }, []);

    useEffect(()=>{
        initializeClient();

        return () => {
            leaveChannel();
        };
    }, [])
    function initializeClient() {
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setupEventListeners();
    }
    // Handle client events
    function setupEventListeners() {
        // Set up event listeners for remote tracks, 👇 Detect when a remote user joins
        client.current.on("user-published", async (user, mediaType) => {
            // Subscribe to the remote user when the SDK triggers the "user-published" event
            await client.current.subscribe(user, mediaType);

            // If the remote user publishes an audio track
            if (mediaType === "audio") {
                // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object
                const remoteAudioTrack = user.audioTrack;
                // Play the remote audio track
                remoteAudioTrack.play();
            }else{
                const remoteVideo = document.createElement('div');
                remoteVideo.id = user.uid;
                remoteVideo.style.width = '320px';
                remoteVideo.style.height = '240px';
                document.getElementById('remote-container').appendChild(remoteVideo);
                user.videoTrack.play(remoteVideo);
            }
            setRemoteUsers(prev => [...prev, user]);

            dispatch(markCallAsReceived())
        });

        client.current.on('user-left', (user) => {
            console.log('Remote user left:', user.uid);
            // Update UI
            setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
            //leaving the channel
            leaveChannel(0);
        });

        // Handle the "user-unpublished" event to unsubscribe from the user's media tracks
        client.current.on("user-unpublished", async (user) => {
            // Remote user unpublished
        });
    }

    // Join the channel and publish local audio
    async function joinChannel(isVideoCall){
        const uid = Math.floor(Math.random() * 10000); // random uid
        const channel = meetingDetailsRef.current?.call_info?.channel; //common channel (psyshicId + customerId)
        const res = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/generate-agora-token?channel=${channel}&uid=${uid}`);
        const token = res.data.token; //random token

        await client.current.join(process.env.REACT_APP_AGORA_APP_ID, channel, token, uid);

        localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();

        if(isVideoCall){
            localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
            const localContainer = document.getElementById('local-container');
            localVideoTrack.current.play(localContainer);

            await client.current.publish([localAudioTrack.current, localVideoTrack.current]);
        }else{    
            await client.current.publish([localAudioTrack.current]);
        }
        setJoined(true);
        setMeetingLeaved(false);
        

        if(meetingDetailsRef.current?.call_type == 'outgoing'){
            //here hit a api to store call information
            const messageId = await storeCallInformation(isVideoCall); //1st db call to store call initial info.

            const socketDetails = {
                channel,
                meeting_type : isVideoCall ? 'video' : 'audio',
                reciever_id : meetingDetailsRef.current?.call_info?.reciever_id,
                sender_id : meetingDetailsRef.current?.call_info?.sender_id,
                sender_name : meetingDetailsRef.current?.call_info?.sender_name,
                message_id : messageId
            }
            sendSocketToCustomer(socketDetails);
        }
    };
    // Leave the channel and clean up
    async function leaveChannel(isLeavedByMe) {
        // Stop the local audio track and release the microphone
        if (localAudioTrack.current) {
            localAudioTrack.current.close(); // Stop local audio
            localAudioTrack.current = null; // Clean up the track reference
        }
        if (localVideoTrack.current) {
            localVideoTrack.current.close(); // Stop local audio
            localVideoTrack.current = null; // Clean up the track reference
        }
        // Leave the channel
        await client.current.leave(); 

        //storing call duration 
        setJoined(false);
        setMeetingLeaved(true);
        const duration = meetingDetailsRef.current?.call_info?.call_start_time
            ? Math.floor((Date.now() - meetingDetailsRef.current?.call_info?.call_start_time)/1000)
            : 0 //in seconds
        setCallDuration(duration);
        
        console.log('-------leave call', meetingDetailsRef.current);
        //here hit a api to update call information to db, 2nd db hit
        if(isLeavedByMe){
            //if call is already started ( received )
            if(meetingDetailsRef.current?.call_info?.call_start_time){
                const callData = {
                    message_id : meetingDetailsRef.current?.call_info?.message_id, 
                    call_start_time : meetingDetailsRef.current?.call_info?.call_start_time, 
                    call_duration : duration,
                    call_status : meetingDetailsRef.current?.call_info?.call_status
                }
                updateCallInformation(callData);
            }else{
                //if call has not been started ( not received )
                //send a socket to disable the toaster calling notification
                const socketDetails = {
                    sender_id : meetingDetailsRef.current?.call_info?.sender_id,
                    reciever_id : meetingDetailsRef.current?.call_info?.reciever_id,
                }
                sendSocketToCustomerEndCall(socketDetails);
            }

        }
        
        if(meetingDetailsRef.current?.call_type == 'incoming'){
            dispatch(setMeetingDetails(null))
        }else{
            dispatch(resetMeetingDetailsForOutgoingCall())
        }
    }
    //toggle Mic
    const toggleMic=()=>{
        if(localAudioTrack.current){
            const isAudioEnabled = localAudioTrack.current.isEnabled;
            console.log('-------audio', isAudioEnabled);
            localAudioTrack.current.setEnabled(!isAudioEnabled);
            setMicMuted(!isAudioEnabled ? false : true );
        }
    }
    console.log('------micmuted', micMuted);
    //toggle Video
    const toggleVideo=()=>{
        if(localVideoTrack.current){
            const isVideoEnabled = localVideoTrack.current.isEnabled;
            localVideoTrack.current.setEnabled(!isVideoEnabled);
            setVideoOff(!isVideoEnabled ? false : true);
        }
    }

    //to display calling-toastar-notification to other user side
    function sendSocketToCustomer(details){
        SOCKET_CLIENT.emit('CALL-CUSTOMER', details);
    }
    //to end the calling-toastar-notification to other user side
    function sendSocketToCustomerEndCall(details){
        SOCKET_CLIENT.emit('END-CALL-CUSTOMER', details);
    }
    //storing to db
    async function storeCallInformation(isVideoCall){
        const callInfoPayload = {
            type : isVideoCall ? 'video' : 'audio',
            call_initiate_time : new Date(),
            senderId : meetingDetailsRef.current?.call_info?.sender_id,
            receiverId : meetingDetailsRef.current?.call_info?.reciever_id
        }
        const response = await sendChat(callInfoPayload);
        dispatch(setMessageId(response?.data?._id))
        return response?.data?._id;
    }
    async function updateCallInformation(callData){
        await updateChat(callData);
    }
     return (
        <div>
            <div>
                {!joined && meetingDetails?.call_type == 'outgoing' 
                    ? 
                        <>
                            <button className='btn bg-primary' onClick={ () => {joinChannel(false)}}>Join Audio</button>
                            <button className='btn bg-primary ms-3' onClick={ () => {joinChannel(true)}}>Join Video</button>
                        </>
                    : null
                }
                {
                    joined 
                    ?
                        <>
                            <button className='btn bg-danger' onClick={()=> leaveChannel(1)}>Leave</button>
                            <button className='btn bg-primary' onClick={()=> toggleMic()}>{ micMuted ? 'Unmute' : 'Mute' }</button>
                            <button className='btn bg-info' onClick={()=> toggleVideo()}>{ videoOff ? 'On Video' : 'Off Video' } </button>
                        </>
                    : null
                }
                {/* To Display whether call is ringing or connected */}
                {
                    joined 
                    ?
                        (
                        meetingDetails?.call_type == 'outgoing' 
                        ? 
                            <h3>{meetingDetails?.call_info?.call_status == 'received' ? 'Connected' : 'Ringing'}</h3>
                        : 
                            <h3>{meetingDetails?.call_type == 'incoming' ? 'Connected' : null }</h3> 
                        )
                    : null
                }
            </div>

            {
                meetingLeaved
                ? <h3>Meeting Ended, Call duration was {callDuration} seconds</h3>
                : null
            }

            <div id="local-container" style={{ width: '320px', height: '240px', backgroundColor: '#000' }} />
            <div id="remote-container" />
            
        </div>
    );
}