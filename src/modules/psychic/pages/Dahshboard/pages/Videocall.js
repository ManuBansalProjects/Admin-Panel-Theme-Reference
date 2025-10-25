import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SOCKET_CLIENT } from '../../../../../utils/socket';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { markCallAsReceived, resetMeetingDetailsForOutgoingCall, setMeetingDetails, setMessageId} from '../../../../../redux/slices/meetingDetailsSlice';
import { sendChat, updateChat, GetMeetingDetails } from '../../../services/chat.services';
import Swal from 'sweetalert2';
import { SWAL_SETTINGS } from '../../../../../utils/Constants';

const Videocall = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem('psychic'));
    const meetingId = searchParams.get('meeting_id');

    const client = useRef(null);
    const localAudioTrack = useRef(null);
    const localVideoTrack = useRef(null);
    const [micMuted, setMicMuted] = useState(false);  
    const [videoOff, setVideoOff] = useState(false);
    const videoToggleInProgress = useRef(false);
    const [remoteMicMuted, setRemoteMicMuted] = useState(false);  
    const [remoteVideoOff, setRemoteVideoOff] = useState(null);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const remoteUserJoinedRef = useRef(null);
    const [joined, setJoined] = useState(false);
    const joinedRef = useRef(null);
    const [meetingLeaved, setMeetingLeaved] = useState(false);
    // const [callDuration, setCallDuration] = useState(0); 
    // const [callDurationCounter, setCallDurationCounter] = useState(0);
    // const callDurationCounterRef = useRef(null);
    const [timeLeftCounter, setTimeLeftCounter] = useState(0);
    const timeLeftCounterRef = useRef(null);
    const [ringingDots, setRingingDots] = useState('');
    const ringingDotsRef = useRef(null);
    const callerToneRef = useRef(null);
    const [isLocalUserSpeaking, setIsLocalUserSpeaking] = useState(false); 
    const [isRemoteUserSpeaking, setIsRemoteUserSpeaking] = useState(false);
    const localCameraDeviceIdRef = useRef(null);
    const localAudioDeviceIdRef = useRef(null);
    const [islocalTracksCreated, setisLocalTracksCreated] = useState(false);
    const isMountedRef = useRef(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const localAudioTrackPublished = useRef(null);
    const localVideoTrackPublished = useRef(null);
    const remoteUserRef = useRef(null);
    const [meetingError, setMeetingError] = useState(null);

    const meetingDetails = useSelector(state => state.meetingDetailsSlice.meetingDetails);
    // const meetingDetailsRef = useRef(meetingDetails);
    const meetingDetailsRef = useRef(null);

    //Loading callertone audio
    // useEffect(()=>{
    //   callerToneRef.current = new Audio('/meeting-ringtones/callertone.mp3');
    //   callerToneRef.current.loop = true;
    //   callerToneRef.current.load();

    //   return ()=>{
    //     callerToneRef.current?.pause();
    //     callerToneRef.current = null;  
    //   }
    // }, [])

    // ✅ Now meetingDetailsRef.current is up-to-date
    useEffect(() => {
        meetingDetailsRef.current = meetingDetails; 

        return ()=>{
          meetingDetailsRef.current = null;
        }
        // Execute any logic that depends on fresh meetingDetails here
    }, [meetingDetails]);

    //getting meeting details based on meeting-id
    useEffect(()=>{
      isMountedRef.current = true;
      meetingHandler();
      
      setMeetingLeaved(false);
      return () => {
          isMountedRef.current = null;
          leaveCurrentPage();
      };
    }, [meetingId]) 

    //SOCKET EVENTS Listening
    // useEffect(() => {
    //     //when client declines the call
    //     SOCKET_CLIENT.on('DECLINE-INCOMING-CALL', (data) => {
    //        if(data.sender_id == meetingDetailsRef.current?.call_info?.psychic_id){
    //              Swal.fire({
    //               icon: "error",
    //               text: 'Call has been declined',
    //               ...SWAL_SETTINGS,
    //             });
    //             leaveChannel(0);
    //         }
    //     });
    //     return () => {
    //         SOCKET_CLIENT.off('DECLINE-INCOMING-CALL');
    //     }
    // }, []);


    async function meetingHandler(){
      await getMeetingDetails();

      const meetingStartDateInSeconds = (new Date(meetingDetailsRef.current?.call_info.meeting_date)).getTime()/1000;
      const meetingEndDateInSeconds = meetingStartDateInSeconds + (30 * 60); //30 mins meeting time , in secs => 30 * 60
      const meetingRemainingSeconds = meetingEndDateInSeconds - (Date.now()/1000);
      startCountDownCounter(meetingRemainingSeconds);
        
      grantLocalDevicesPermissions();
    }

    //To get meetig details based on meeting id
    async function getMeetingDetails(){
      try {
        const response = await GetMeetingDetails({meeting_id : meetingId});
        const data = response.data;

        //checking current time with meeting start time, if meeting date and time are valid or not  
        const meetingStartDate = new Date(data.meeting_date);
        const currentDate = new Date();
        console.log('-----meeting start date', meetingStartDate)
        console.log('-----current date', currentDate)
        if(currentDate.getTime() < meetingStartDate.getTime()){
            const meetDate = meetingStartDate.toDateString();
            const hours = meetingStartDate.getHours().toString().padStart(2, '0');
            const minutes = meetingStartDate.getMinutes().toString().padStart(2, '0');
            const meetTime = `${hours}:${minutes}`;
            // alert(`Meeting time is too early, Plese try again later at ${meetDate}, ${meetTime}`)
            Swal.fire({
              icon: "error",
              text: `Meeting time is too early, Plese try again later at ${meetDate}, ${meetTime}`,
              ...SWAL_SETTINGS,
            });
            navigate(-1);
            return;
        }

        const meetingInfo = {
          call_info : {
            ...data,
            uid : Math.floor(Math.random() * 10000),
          }
        }
        console.log('-------setting meeting data', meetingInfo);
        dispatch(setMeetingDetails(meetingInfo));
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: error.message || 'Something went wrong',
          ...SWAL_SETTINGS,
        });
        navigate(-1);
      }

      // GetMeetingDetails({meeting_id : meetingId})
      // .then(response =>{
      //   const data = response.data;
      //   // if(data.meeting_expired){
      //   //   Swal.fire({
      //   //     icon: "error",
      //   //     text: 'Meeting has been expired',
      //   //     ...SWAL_SETTINGS,
      //   //   });
      //   //   navigate('/psychic/my-bookings');  
      //   // }else{
      //   //   const meetingInfo = {
      //   //     call_info : {
      //   //       ...data,
      //   //       uid : Math.floor(Math.random() * 10000),
      //   //     }
      //   //   }
      //   //   dispatch(setMeetingDetails(meetingInfo));
      //   // }
      //   const meetingInfo = {
      //     call_info : {
      //       ...data,
      //       uid : Math.floor(Math.random() * 10000),
      //     }
      //   }
      //   console.log('-------setting meeting data', meetingInfo);
      //   dispatch(setMeetingDetails(meetingInfo));
      // })
      // .catch(error =>{
      //   Swal.fire({
      //     icon: "error",
      //     text: error.message || 'Something went wrong',
      //     ...SWAL_SETTINGS,
      //   });
      //   navigate('/psychic/my-bookings');
      // })
      
    }

    // This is to grant permissions, whether they can be available for us or not
    async function grantLocalDevicesPermissions(){
      console.log(meetingDetailsRef.current, '------meeting details');
      const isVideoCall = meetingDetailsRef.current?.call_info?.meeting_type == 'video';

      let cameraStatus;
      if(isVideoCall){
        cameraStatus = await navigator.permissions.query({name : 'camera'});
      }
      const microphoneStatus = await navigator.permissions.query({name : 'microphone'});

      console.log(cameraStatus?.state, microphoneStatus.state, '----------device status')

      const cameraPermission = cameraStatus?.state == 'granted' || cameraStatus?.state == 'prompt';
      const audioPermission =  microphoneStatus?.state == 'granted' || microphoneStatus?.state == 'prompt';

      console.log('----------is video call', isVideoCall, cameraPermission, audioPermission);
      if ((isVideoCall ? cameraPermission : true) && audioPermission) {
        setPermissionDenied(false);
        initializeLocalSetup();
      }else{
        setPermissionDenied(true);
      }
    }

    // console.log('------permission denied', permissionDenied);
    async function initializeLocalSetup(){

      const status = await getLocalDevices();
      if (!isMountedRef.current) return;

      if(status){
        await createLocalTracks();
        if (!isMountedRef.current) return;
        setisLocalTracksCreated(true);
      }
    }

    let isRequestingDevices = false;

    async function getLocalDevices() {
      if (isRequestingDevices) return;
      isRequestingDevices = true;

      const isVideoCall = meetingDetailsRef.current?.call_info?.meeting_type === 'video';

      try {
        // 1. Trigger permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: isVideoCall,
        });

        // 2. Clean up immediately after permissions
        stream.getTracks().forEach(track => track.stop());

        // 3. Use Agora's APIs for reliable device listing
        const cameras = isVideoCall ? await AgoraRTC.getCameras() : [];
        const mics = await AgoraRTC.getMicrophones();

        if (!mics.length || (isVideoCall && !cameras.length)) {
          alert("No microphone or camera found.");
          return false;
        }

        // 4. Store default device IDs
        localAudioDeviceIdRef.current = mics[0]?.deviceId;
        if (isVideoCall) {
          localCameraDeviceIdRef.current = cameras[0]?.deviceId;
        }

        console.log("🎤 Mics:", mics);
        console.log("📷 Cameras:", cameras);

        return true;
      } catch (err) {
        console.error("❌ Device permission or access error:", err);

        switch (err.name) {
          case "NotAllowedError":
            alert("Please allow access to microphone and camera.");
            setMeetingError("Permission denied. Please allow access to microphone and camera.");
            break;
          case "NotFoundError":
            alert("No media devices found.");
            setMeetingError("No media devices found. Please connect a microphone or camera.");
            break;
          case "NotReadableError":
            alert("Device already in use by another application.");
            setMeetingError("Device already in use by another application.");
            break;
          case "AbortError":
            alert("Media access aborted. Close other apps using the mic/cam.");
            setMeetingError("Media access aborted. Close other apps using the mic/cam.");
            break;
          case "SecurityError":
            alert("HTTPS is required for media device access.");
            setMeetingError("HTTPS is required for media device access.");
            break;
          default:
            alert("Error: " + err.message);
            setMeetingError("Error: " + err.message);
        }
      } finally {
        isRequestingDevices = false;
      }
    }

    async function createLocalTracks() {
      const isVideoCall = meetingDetailsRef.current?.call_info?.meeting_type === 'video';

      // 🛑 Only run after permissions and device list is fetched
      if (!localAudioDeviceIdRef.current || (isVideoCall && !localCameraDeviceIdRef.current)) {
        console.warn("Local device IDs not available. Aborting track creation.");
        return;
      }

      try {
        // 🎤 Create microphone track
        if (!localAudioTrack.current) {
          localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
          console.log("🎤 Local audio track created");
        }

        // 🎥 Create camera track
        if (isVideoCall && !localVideoTrack.current) {
          try {
            localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
            console.log("📷 Local video track created");
          } catch (err) {
            console.warn("Camera creation failed, retrying...", err);
            const cameras = await AgoraRTC.getCameras();
            if (cameras.length) {
              localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
                cameraId: cameras[0].deviceId,
              });
            } else {
              alert("No available camera found.");
            }
          }
        }

        // 📺 Preview video
        if (isVideoCall && localVideoTrack.current) {
          const localContainer = document.getElementById("local-container");
          if (localContainer) {
            localContainer.innerHTML = "";
            await localVideoTrack.current.play(localContainer);
            localVideoTrack.current.getMediaStreamTrack().onended = async () => {
              console.warn("Video track ended. Recreating...");
              await recreateVideoTrack();
            };
          }
        }
      } catch (err) {
        console.error("Track creation error:", err);
      }
    }


    //asking permission and getting local device to use
    // let isRequestingDevices = false;
    // async function getLocalDevices(){
    //   try{
    //     if(isRequestingDevices)return;
    //     isRequestingDevices = true;

    //     // Request permissions to access audio and video
    //      // Trigger permissions first
    //     const isVideoCall = meetingDetailsRef.current?.call_info?.meeting_type == 'video'; 
    //     // const devicesRequested = {
    //     //   audio : true,
    //     //   video : isVideoCall
    //     // }
    //     // console.log('-----device reqused', devicesRequested);
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //       audio : true,
    //       video : true
    //     });

    //     const devices = await navigator.mediaDevices.enumerateDevices();
    //     console.log('------devices list', devices);
    //     let cameras;
    //     if(isVideoCall){
    //       cameras = devices.filter(d => d.kind === 'videoinput');
    //     }
    //     const mics = devices.filter(d => d.kind === 'audioinput');

    //     if ((isVideoCall && !cameras.length) || !mics.length) {
    //       alert('❌ No camera or mic found');
    //       return false;
    //     }
    //     // await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    //     // const cameras = await AgoraRTC.getCameras();
    //     // const mics = await AgoraRTC.getMicrophones();

    //     console.log("Available Cameras: ", cameras);
    //     console.log("Available Mics: ", mics);

    //     localAudioDeviceIdRef.current = mics[0].deviceId;
    //     if(isVideoCall){
    //       localCameraDeviceIdRef.current = cameras[0].deviceId;
    //     }

    //     // Clean up stream
    //     // stream.getTracks().forEach(track => track.stop());

    //     return  mics.length && (isVideoCall ? cameras.length : true)
    //   }catch (err) {
    //     console.error("❌ Failed to get device permissions or list devices:", err);

    //     switch (err.name) {
    //       case "NotAllowedError":
    //         alert("Permission denied. Please allow access to camera and microphone.");
    //         break;
    //       case "NotFoundError":
    //         alert("No media devices found. Check if a camera or microphone is connected.");
    //         break;
    //       case "NotReadableError":
    //         alert("Camera or microphone is already in use by another application.");
    //         break;
    //       case "AbortError":
    //         alert("Media access aborted. Close other apps using the camera/mic.");
    //         break;
    //       case "SecurityError":
    //         alert("HTTPS is required to access media devices.");
    //         break;
    //       default:
    //         alert("Unknown error: " + err.message);
    //     }
    //   }finally{
    //     isRequestingDevices = false;
    //   }
    // }

    //creating local tracks for camera and microphone to be preview then published
    // async function createLocalTracks(){

    //   console.log('---------creating local track', meetingDetailsRef.current);

    //   const isVideoCall = meetingDetailsRef.current?.call_info?.meeting_type == 'video';
    //   if(!(localAudioDeviceIdRef.current && (isVideoCall ? localCameraDeviceIdRef.current : true)))return;

    //   // Create audio track
    //   if(!localAudioTrack.current){
    //     try {
    //       localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
    //         microphoneId : localAudioDeviceIdRef.current,
    //         encoderConfig: {
    //           bitrate: 48 // Kbps (higher than default)
    //         }
    //       });
    //       console.log('----------------local audio track', localAudioTrack.current);
    //     } catch (err) {
    //       console.error("Microphone Track failed:", err);
    //       alert('Microphone Track creation failed');
    //       // throw err; // optional
    //     }
    //   }

    //   //Create video track
    //   console.log('--------isVideoCall', isVideoCall, localVideoTrack.current, localCameraDeviceIdRef.current);
    //   if(isVideoCall && !localVideoTrack.current){
    //     try {
    //       localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
    //         cameraId: localCameraDeviceIdRef.current,
    //         encoderConfig: {
    //           width: 640,
    //           height: 360,
    //           frameRate: 30,
    //           bitrateMax: 1500,
    //           bitrateMin: 600,
    //         },
    //       });
    //       console.log('----------------local video track', localVideoTrack.current);
    //     } catch (e) {
    //       console.warn('Error details:', {
    //         typeof: typeof e,
    //         toString: e?.toString?.(),
    //         message: e?.message,
    //         name: e?.name,
    //         code: e?.code,
    //         stack: e?.stack,
    //       });
    //       console.log('-------error in camera local track creation', e);  
    //       if (e.code === 'DEVICE_NOT_FOUND') {
    //         console.warn("Camera not found initially, retrying...");
    //         await new Promise(res => setTimeout(res, 500));
    //         localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
    //           cameraId: localCameraDeviceIdRef.current,
    //           encoderConfig: {
    //             width: 640,
    //             height: 360,
    //             frameRate: 30,
    //             bitrateMax: 1500,
    //             bitrateMin: 600,
    //           },
    //         });
    //       } else {
    //         alert('Camera Track creation failed');
    //         // throw e;
    //       }
    //     }

    //     //previewing local video track on screen
    //     const localContainer = document.getElementById('local-container');
    //     if (localContainer && localVideoTrack.current) {
    //       localContainer.innerHTML = '';
    //       localVideoTrack.current.play(localContainer);

    //       // 🔁 Monitor and recreate if it ends
    //       // localVideoTrack.current.getMediaStreamTrack().onended = async () => {
    //       //   console.warn("Video track ended. Attempting to reinitialize...");
    //       //   await recreateVideoTrack();
    //       // };
    //       localVideoTrack.current.getMediaStreamTrack().onended = async () => {
    //         console.warn("Track ended. Trying to recreate in 500ms...");
    //         setTimeout(async () => {
    //           await recreateVideoTrack();
    //         }, 500);
    //       };
    //     }
    //   }
    // }

    async function recreateVideoTrack(){
      try {
        if (localVideoTrack.current) {
          localVideoTrack.current.stop();
          localVideoTrack.current.close();
          localVideoTrack.current = null;
        }

        if (localAudioTrack.current) {
          localAudioTrack.current.stop();
          localAudioTrack.current.close();
          localAudioTrack.current = null;
        }

        // Retry creating the track after 1s
        setTimeout(() => {
          createLocalTracks();
        }, 1000);
      } catch (err) {
        console.error("Error while recreating video track:", err);
      }
    };

    // console.log('------rmeote users', remoteUsers);
    //join channel
    async function joinChannel(){
      console.log('------joining channel');
      //checking current time with meeting start time, if meeting date and time are valid or not  
      const meetingStartDate = new Date(meetingDetailsRef.current.call_info.meeting_date);
      const currentDate = new Date();
      console.log('-----meeting start date', meetingStartDate)
      console.log('-----current date', currentDate)
      if(currentDate.getTime() < meetingStartDate.getTime()){
          const meetDate = meetingStartDate.toDateString();
          const hours = meetingStartDate.getHours().toString().padStart(2, '0');
          const minutes = meetingStartDate.getMinutes().toString().padStart(2, '0');
          const meetTime = `${hours}:${minutes}`;
          alert(`Meeting time is too early, Plese try again later at ${meetDate}, ${meetTime}`)
          return;
      }

      //checking if at leat one device is enable or not
      console.log('----audio device', localAudioTrack.current);
      console.log('----video device', localVideoTrack.current);

      if (!localAudioTrack.current && !localVideoTrack.current) {
        alert("No Local tracks found");
        return;
      }

      let publishedTracks = [];
      if(localAudioTrack.current?.enabled){
        publishedTracks.push(localAudioTrack.current);
        localAudioTrackPublished.current = true;
      }
      if(localVideoTrack.current?.enabled){
        publishedTracks.push(localVideoTrack.current);
        localVideoTrackPublished.current = true;
      }
      if(!publishedTracks.length){
        alert('Please enable at least one device');
        return;
      }

      const uid = meetingDetailsRef.current?.call_info?.uid;
      const channel = meetingDetailsRef.current?.call_info?.channel;
      // Get token from server
      const res = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/generate-agora-token?channel=${channel}&uid=${uid}`);
      const token = res.data.token;

      //initialize agora client
      await initializeClient();
      if (!isMountedRef.current) return;
      // Join the Agora channel

      console.log('----------joining details', process.env.REACT_APP_AGORA_APP_ID, channel, token, uid);
      await client.current.join(process.env.REACT_APP_AGORA_APP_ID, channel, token, uid);
      // Enable volume indicator
      client.current.enableAudioVolumeIndicator();
      // AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 300); // Set to 300ms (custom)

      //publish local tracks
      await client.current.publish(publishedTracks);

      setJoined(true);
      joinedRef.current = true;
      setMeetingLeaved(false);

      //todo : a condition will come whether i need to start riongtone or the user is already joined
      // console.log('68428d8e442de4d5d8d78c25' != loggedInUser._id, '68428d8e442de4d5d8d78c25', loggedInUser._id);
      // if('68428d8e442de4d5d8d78c25' != loggedInUser._id)return;

      //delay 
      await new Promise((resolve, reject)=>{
        setTimeout(()=>{ resolve() }, 3000)
      })
      console.log('----rmeote joined', remoteUserJoinedRef.current);
      console.log('-------starting')

      if(remoteUserJoinedRef.current)return;
      startRingingDots();
      // const isVideoCall = meetingDetailsRef.current.call_info.meeting_type == 'video';
      // await storeCallInformation(isVideoCall);

      // const socketDetails = {
      //   meeting_id : searchParams.get('meeting_id'),
      //   sender_id : meetingDetailsRef.current.call_info.psychic_id,
      //   sender_name : meetingDetailsRef.current.call_info.psychic_name,
      //   receiver_id : meetingDetailsRef.current.call_info.customer_id,
      // };
      // sendSocketToCustomer(socketDetails);
    }

    //initializng client
    async function initializeClient() {
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setupEventListeners();
    }
    // Handle client events
    function setupEventListeners() {
        // Set up event listeners for remote tracks, 👇 Detect when a remote user joins
        client.current.on("user-published", async (user, mediaType) => {
            // Subscribe to the remote user when the SDK triggers the "user-published" event
            console.log('===========>Remote user joined', user);
            await client.current.subscribe(user, mediaType);

            if(!remoteUserJoinedRef.current && user){
              Swal.fire({
                icon: "success",
                // title : 'User Joined',
                text: 'Customer joined the meeting',
                ...SWAL_SETTINGS,
              });
              remoteUserJoinedRef.current = true;

              // if(user){
                // setRemoteUsers(prev => [...prev, user]);
              // }
              setRemoteUsers(prev => [...prev, user]);
              
              dispatch(markCallAsReceived());
              // startCallDurationCounter(); //starting the duration counter
              endRingingDots();

              // const meetingStartDateInSeconds = (new Date(meetingDetailsRef.current?.call_info.meeting_date)).getTime()/1000;
              // const meetingEndDateInSeconds = meetingStartDateInSeconds + (30 * 60); //30 mins meeting time , in secs => 30 * 60
              // const meetingRemainingSeconds = meetingEndDateInSeconds - (Date.now()/1000);
              // startCountDownCounter(meetingRemainingSeconds);
            }
            
             // If the remote user publishes an audio track
            if (mediaType === "audio") {
                const remoteAudioTrack = user.audioTrack; // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object
                remoteAudioTrack.play(); // Play the remote audio track
                setRemoteMicMuted(false); 
            }else{
                // const remoteVideoTrack = user.videoTrack;
                // const remoteContainer = document.getElementById('remote-container');
                // if(remoteContainer){
                //   remoteContainer.innerHTML = '';
                //   remoteVideoTrack.play(remoteContainer);
                // }

                remoteUserRef.current = user;
                setRemoteVideoOff(false);
            }

        });

        //Detect when a remote user left
        client.current.on('user-left', (user) => {
            console.log('Remote user left:', user.uid);
            Swal.fire({
              icon: "info",
              // title : 'User Left',
              text: 'Customer left the meeting',
              ...SWAL_SETTINGS,
            });

            // setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid)); // Update UI
            setRemoteUsers([]);
    
            if(remoteUserJoinedRef.current){
              remoteUserJoinedRef.current = null;

              //calling db to store call
              // if(meetingDetailsRef.current?.call_info?.call_start_time){

              //     const duration = meetingDetailsRef.current?.call_info?.call_start_time
              //       ? Math.floor((Date.now() - (meetingDetailsRef.current?.call_info?.call_start_time).getTime())/1000)
              //       : 0 //in seconds
              //     const callData = {
              //         message_id : meetingDetailsRef.current?.call_info?.message_id, 
              //         call_start_time : meetingDetailsRef.current?.call_info?.call_start_time, 
              //         call_duration : duration,
              //         call_status : meetingDetailsRef.current?.call_info?.call_status
              //     }
              //     updateCallInformation(callData);
              // }

            }
            if(remoteUserRef.current){
              remoteUserRef.current = null;
            }
            startRingingDots();
            // leaveChannel(0); //leaving the channel, 0 bcz. the remote user cut the call, i.e. isLeavedByMe = 0
        });

        //this detect the voice from the all connected users
        client.current.on("volume-indicator", (volumes) => {
          volumes.forEach((volume) => {
            // console.log('------valume', volume);
            if (volume.uid === meetingDetailsRef?.current?.call_info?.uid) {
              // This is you
              setIsLocalUserSpeaking(volume.level > 35);
            }else{
              setIsRemoteUserSpeaking(volume.level > 35);
            }
          });
        });

        // Handle the "user-unpublished" event to unsubscribe from the user's media tracks
        client.current.on("user-unpublished", async (user, mediaType) => {
            // Remote user unpublished
            console.log('===========>user unpublished', mediaType);
            if (mediaType === "video") {
              console.log("Remote video turned OFF");
              setRemoteVideoOff(true);
            } else if (mediaType === "audio") {
              console.log("Remote audio turned OFF");
              setRemoteMicMuted(true);
            }
        });

        //this detect when the remote user toggle the audio or video
        // client.current.on("user-info-updated", (user, info) => {
        //   if(info == 'mute-audio'){
        //     setRemoteMicMuted(true);
        //   }else if(info == 'unmute-audio'){
        //     setRemoteMicMuted(false);            
        //   }else if(info == 'mute-video'){
        //     console.log('------------user unpublished');
        //     setRemoteVideoOff(true);
        //   }else if(info == 'unmute-video'){
        //     console.log('============>user re-published user:', user);
        //     remoteUserRef.current = user;
        //     setRemoteVideoOff(false);
        //   }
        // });
    }

    useEffect(()=>{
      console.log('-------Inside useEffect', remoteUserRef.current);
      // if(!remoteVideoOff && remoteUserRef.current?.videoTrack){
      //   const remoteVideoTrack = remoteUserRef.current.videoTrack;
      //   console.log('-------Inside remote toggle video useEffect', remoteVideoTrack);
      //   const remoteContainer = document.getElementById('remote-container');
      //   console.log('-----------1. remote container', remoteContainer);
      //   if(remoteContainer && remoteContainer.offsetParent !== null){
      //     console.log('---------2. playing remote video');
      //     remoteContainer.innerHTML = '';
      //     remoteVideoTrack.play(remoteContainer);
      //   }
      // }

      if(!remoteVideoOff && remoteUserRef.current?.videoTrack && remoteUserJoinedRef.current){
        const remoteVideoTrack = remoteUserRef.current.videoTrack;
        console.log('-------Inside remote toggle video useEffect', remoteVideoTrack);
        const remoteContainer = document.getElementById('remote-container');
        console.log('-----------1. remote container', remoteContainer);
        if(remoteContainer && remoteContainer.offsetParent !== null){
          console.log('---------2. playing remote video');
          remoteContainer.innerHTML = '';
          remoteVideoTrack.play(remoteContainer);
        }
      }
      
    }, [remoteVideoOff])

    // Leave the channel (leave the call) and clean up
    async function leaveChannel(isLeavedByMe) {
        
        // ✅ Just leave the channel, do NOT destroy local tracks
        if (client.current) {
          try {
            await client.current.leave();
            client.current.removeAllListeners(); //Clean event listeners
            client.current = null; // ✅ Reset client
          } catch (err) {
            console.warn("Error leaving Agora channel:", err);
          }
        }

        setJoined(false);
        if(joinedRef.current){
          joinedRef.current = null;
        }
        setMeetingLeaved(true);

        // if(callDurationCounterRef.current){
        //   endCallDurationCounter();
        // }
        if(timeLeftCounterRef.current){
          endCountDownCounter();
        }
        if(ringingDotsRef.current){
          endRingingDots();
        }

        //storing call duration 
        // const duration = meetingDetailsRef.current?.call_info?.call_start_time
        //     ? Math.floor((Date.now() - (meetingDetailsRef.current?.call_info?.call_start_time).getTime())/1000)
        //     : 0 //in seconds
        // setCallDuration(duration);

        setRemoteUsers([]);
        if(remoteUserJoinedRef.current){
          remoteUserJoinedRef.current = null;

          //calling db to store call
          // if(meetingDetailsRef.current?.call_info?.call_start_time){
          //     const callData = {
          //         message_id : meetingDetailsRef.current?.call_info?.message_id, 
          //         call_start_time : meetingDetailsRef.current?.call_info?.call_start_time, 
          //         call_duration : duration,
          //         call_status : meetingDetailsRef.current?.call_info?.call_status
          //     }
          //     updateCallInformation(callData);
          // }

        }
        if(remoteUserRef.current){
          remoteUserRef.current = null;
        }
        
        console.log('-------leave call', meetingDetailsRef.current);
        //here hit a api to update call information to db, 2nd db hit
        // if(isLeavedByMe){
        //     //if call is already started ( received )
        //     console.log('---------call start time', meetingDetailsRef.current?.call_info?.call_start_time);
        //     if(meetingDetailsRef.current?.call_info?.call_start_time){
        //         const callData = {
        //             message_id : meetingDetailsRef.current?.call_info?.message_id, 
        //             call_start_time : meetingDetailsRef.current?.call_info?.call_start_time, 
        //             call_duration : duration,
        //             call_status : meetingDetailsRef.current?.call_info?.call_status
        //         }
        //         updateCallInformation(callData);
        //     }else{
        //         //if call has not been started ( not received )
        //         //send a socket to disable the toaster calling notification

        //         // const socketDetails = {
        //         //     sender_id : meetingDetailsRef.current?.call_info?.psychic_id,
        //         //     receiver_id : meetingDetailsRef.current?.call_info?.customer_id,
        //         // }
        //         // sendSocketToCustomerEndCall(socketDetails);
        //     }

        // }        
    }
    //leave the page
    async function leaveCurrentPage(){
      // Stop the local audio and video track and release devices
      if (localAudioTrack.current) {
          localAudioTrack.current.stop();
          localAudioTrack.current.close(); // Stop local audio
          localAudioTrack.current = null; // Clean up the track reference
          localAudioTrackPublished.current = null;
      }
      if (localVideoTrack.current) {
          localVideoTrack.current.stop();
          localVideoTrack.current.close(); // Stop local audio
          localVideoTrack.current = null; // Clean up the track reference
          localVideoTrackPublished.current = null;
      }

      // ✅ leave the channel
      if (client.current) {
        try {
          await client.current.leave();
          client.current.removeAllListeners(); // Clean event listeners
          client.current = null; // ✅ Reset client
        } catch (err) {
          console.warn("Error leaving Agora channel:", err);
        }
      }

      if(joinedRef.current){
        // const socketDetails = {
        //     sender_id : meetingDetailsRef.current?.call_info?.psychic_id,
        //     receiver_id : meetingDetailsRef.current?.call_info?.customer_id,
        // }
        // sendSocketToCustomerEndCall(socketDetails);

        joinedRef.current = null;
      }
      if(remoteUserJoinedRef.current){
        remoteUserJoinedRef.current = null;
      }
      if(remoteUserRef.current){
        remoteUserRef.current = null;
      }

      // if(callDurationCounterRef.current){
      //   endCallDurationCounter();
      // }
      if(timeLeftCounterRef.current){
        endCountDownCounter();
      }
      if(ringingDotsRef.current){
        endRingingDots();
      }

      if(localAudioDeviceIdRef.current){
        localAudioDeviceIdRef.current = null;
      }
      if(localCameraDeviceIdRef.current){
        localCameraDeviceIdRef.current = null;
      }
      if(videoToggleInProgress.current){
        videoToggleInProgress.current = null;
      }
     
      // if(meetingDetailsRef.current?.call_type == 'incoming'){
      //     dispatch(setMeetingDetails(null))
      // }else{
      //     dispatch(resetMeetingDetailsForOutgoingCall())
      // } 

       //here hit a api to update call information to db, 2nd db hit
        // if(isLeavedByMe){
        //     //if call is already started ( received )
        //     console.log('---------call start time', meetingDetailsRef.current?.call_info?.call_start_time);
        //     if(meetingDetailsRef.current?.call_info?.call_start_time){
        //         const callData = {
        //             message_id : meetingDetailsRef.current?.call_info?.message_id, 
        //             call_start_time : meetingDetailsRef.current?.call_info?.call_start_time, 
        //             call_duration : duration,
        //             call_status : meetingDetailsRef.current?.call_info?.call_status
        //         }
        //         updateCallInformation(callData);
        //     }else{
        //         //if call has not been started ( not received )
        //         //send a socket to disable the toaster calling notification
              
        //     }

        // }  

      //TODO : update call information in DB on Reload
      // if(meetingDetailsRef.current?.call_info?.call_start_time){
      //     const duration = Math.floor((Date.now() - (meetingDetailsRef.current?.call_info?.call_start_time).getTime())/1000)
      //     const callData = {
      //         message_id : meetingDetailsRef.current?.call_info?.message_id, 
      //         call_start_time : meetingDetailsRef.current?.call_info?.call_start_time, 
      //         call_duration : duration,
      //         call_status : meetingDetailsRef.current?.call_info?.call_status
      //     }
      //     updateCallInformation(callData);
      // }

      dispatch(setMeetingDetails(null));
    }
    
    //toggle Mic
    const toggleMic=async()=>{
        if(localAudioTrack.current){
            const isAudioEnabled = localAudioTrack.current.enabled;
            localAudioTrack.current.setEnabled(!isAudioEnabled);
            if(joinedRef.current && !localAudioTrackPublished.current){
              await client.current.publish([localAudioTrack.current]);
              localAudioTrackPublished.current = true;
            }
            setMicMuted(!isAudioEnabled ? false : true );
        }
    }

    // useEffect(() => {
    //   if (!videoOff && localVideoTrack.current) {
    //     const localContainer = document.getElementById('local-container');
    //     if (localContainer) {
    //       localVideoTrack.current.play(localContainer);
    //     }
    //   }
    // }, [videoOff]);

    // useEffect(() => {
    //   if (!videoOff && localVideoTrack.current) {
    //     const container = document.getElementById('local-container');
    //     container.innerHTML = '';
    //     localVideoTrack.current.play(container)
        
    //   }
    // }, [videoOff]);
    useEffect(() => {
      if (!videoOff && localVideoTrack.current) {
        const container = document.getElementById('local-container');
        if (container) {
          container.innerHTML = '';
          try {
            const result = localVideoTrack.current.play(container);
            if (result?.catch instanceof Function) {
              result.catch(err => {
                console.warn('Local video play error:', err);
              });
            }

            // Rebind onended for recovery
            const track = localVideoTrack.current.getMediaStreamTrack();
            if (track) {
              track.onended = async () => {
                console.warn("Track ended. Reinitializing...");
                await recreateVideoTrack(); // Define separately
              };
            }
          } catch (err) {
            console.error("Play failed:", err);
          }
        }
      }
    }, [videoOff]);


    //toggle video
    const toggleVideo = async () => {
      if (videoToggleInProgress.current || !localCameraDeviceIdRef.current) return;
      videoToggleInProgress.current = true;

      const isVideoEnabled = localVideoTrack.current?.enabled;

      try {
        if (isVideoEnabled) {
          // 🚫 Disable video
          setVideoOff(true);
          await localVideoTrack.current.setEnabled(false);

          if (joinedRef.current && localVideoTrackPublished.current) {
            await client.current.unpublish([localVideoTrack.current]);
            localVideoTrackPublished.current = false;
          }
        } else {
          // ✅ Enable or recreate track
          const shouldRecreate =
            !localVideoTrack.current ||
            localVideoTrack.current.getMediaStreamTrack().readyState !== 'live';

          if (shouldRecreate) {
            const cameras = await AgoraRTC.getCameras();
            if (!cameras.length) throw new Error("No camera devices available");

            localCameraDeviceIdRef.current = cameras[0].deviceId;

            localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
              cameraId: localCameraDeviceIdRef.current,
              encoderConfig: {
                width: 640,
                height: 360,
                frameRate: 30,
                bitrateMax: 1500,
                bitrateMin: 600,
              },
            });
          }

          await localVideoTrack.current.setEnabled(true);

          // Publish if not already
          if (joinedRef.current && !localVideoTrackPublished.current) {
            await client.current.publish([localVideoTrack.current]);
            localVideoTrackPublished.current = true;
          }

          setVideoOff(false);
        }
      } catch (err) {
        console.error("toggleVideo error:", err);
        alert("An error occurred while toggling video.");
      } finally {
        videoToggleInProgress.current = false;
      }
    };


    // const toggleVideo = async () => {
    //   if (videoToggleInProgress.current || !localCameraDeviceIdRef.current ) return;
    //   videoToggleInProgress.current = true;

    //   const isVideoEnabled = localVideoTrack.current?.enabled;

    //   try {
    //     if (isVideoEnabled) {
    //       // 🚫 Disable video
    //       setVideoOff(true);
    //       await localVideoTrack.current.setEnabled(false);

    //       //TODO : testing it 
    //       // await client.unpublish(localVideoTrack.current);
    //       if(joinedRef.current && localVideoTrackPublished.current){
    //         await client.current.unpublish([localVideoTrack.current]);
    //         localVideoTrackPublished.current = false;
    //       }

    //       // Don't stop/close the track, just disable it.
    //     } else {
    //       // ✅ Enable video
    //        if (
    //         !localVideoTrack.current ||
    //         localVideoTrack.current.getMediaStreamTrack().readyState !== 'live'
    //       ) {
    //         localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
    //           cameraId: localCameraDeviceIdRef.current,
    //           encoderConfig: {
    //             width: 640,
    //             height: 360,
    //             frameRate: 30,
    //             bitrateMax: 1500,
    //             bitrateMin: 600,
    //           },
    //         });
    //       }

    //       await localVideoTrack.current.setEnabled(true);

          
    //       if(joinedRef.current && !localVideoTrackPublished.current){
    //         await client.current.publish([localVideoTrack.current]);
    //         localVideoTrackPublished.current = true;
    //       }

    //       setVideoOff(false);
    //       // const localContainer = document.getElementById('local-container');

    //       // if (!localContainer) {
    //       //   console.warn('❌ Cannot find video container element.');
    //       //   return;
    //       // }

    //       // // Clear container content (safe approach)
    //       // while (localContainer.firstChild) {
    //       //   localContainer.removeChild(localContainer.firstChild);
    //       // }

    //       // try {
    //       //   // Await play — this avoids silent play errors
    //       //   await localVideoTrack.current.play(localContainer);

    //       //   // Re-bind end handler for recovery
    //       //   // localVideoTrack.current.getMediaStreamTrack().onended = async () => {
    //       //   //   console.warn("Video track ended unexpectedly. Recreating...");
    //       //   //   await recreateVideoTrack(); // <-- define this separately
    //       //   // };
    //       //   localVideoTrack.current.getMediaStreamTrack().onended = async () => {
    //       //     console.warn("Track ended. Trying to recreate in 500ms...");
    //       //     setTimeout(async () => {
    //       //       await recreateVideoTrack();
    //       //     }, 500);
    //       //   };
    //       // } catch (playErr) {
    //       //   console.error("Video play failed:", playErr);
    //       //   alert("Could not start camera. Check if another app is using it.");
    //       // }
    //     }
    //   } catch (err) {
    //     console.error("toggleVideo error:", err);
    //     alert("An error occurred while toggling video.");
    //   } finally {
    //     videoToggleInProgress.current = null;
    //   }
    // };

    // const toggleVideo = async () => {
    //   if (videoToggleInProgress.current || !localVideoTrack.current){
    //     return;
    //   }
    //   videoToggleInProgress.current = true;
      
    //   const isVideoEnabled = localVideoTrack.current.enabled;

    //   try {
    //     if (isVideoEnabled) {
    //       // 👇 Turn off video
    //       setVideoOff(true);
    //       await localVideoTrack.current.setEnabled(false);
    //       // localVideoTrack.current.stop();
    //     } else {
    //       setVideoOff(false);
    //       await localVideoTrack.current.setEnabled(true);
    //       const localContainer = document.getElementById('local-container');
    //       console.log('--------localContinaer', localContainer);
    //       if (localContainer) {
    //         // Clear DOM to ensure stream re-renders
    //         localContainer.innerHTML = '';
    //         localVideoTrack.current?.play(localContainer);

    //         // 🔁 Monitor and recreate if it ends
    //         localVideoTrack.current.getMediaStreamTrack().onended = async () => {
    //           console.warn("Video track ended. Attempting to reinitialize...");
    //           await recreateVideoTrack();
    //         };
    //       }

    //       // try {
            
            
    //       //   // // Short delay to allow hardware release
    //       //   // await new Promise(res => setTimeout(res, 300));
            
    //       //   // if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    //       //   //   alert("Your browser does not support audio/video permissions.");
    //       //   //   throw new Error("getUserMedia not available");
    //       //   // }

    
            
    //       // } catch (err) {
    //       //   console.error('❌ Failed to recreate video track:', err);
    //       //   alert("Could not access camera again. Please check camera permissions or reload.");
    //       // }
    //     }
    //   } catch (err) {
    //     console.error("Toggle video failed:", err);
    //   }finally{
    //     videoToggleInProgress.current = false;
    //   }
      
    // };
    
    // const toggleVideo = async () => {
    //   if (localVideoTrack.current) {
    //     const isVideoEnabled = localVideoTrack.current.enabled;

    //     if (isVideoEnabled) {
    //       // 👇 Turn off video
    //       await localVideoTrack.current.setEnabled(false);
    //       setVideoOff(true);
    //     } else {
    //       try {
    //          // Properly unpublish and stop old track
    //         await client.current.unpublish(localVideoTrack.current);
    //         localVideoTrack.current.stop();
    //         localVideoTrack.current.close();
    //         localVideoTrack.current = null;
            
    //         // Short delay to allow hardware release
    //         await new Promise(res => setTimeout(res, 300));
            
    //         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    //           alert("Your browser does not support audio/video permissions.");
    //           throw new Error("getUserMedia not available");
    //         }

    //         // 👇 Recreate video track instead of just setEnabled
    //         try {
    //           console.log('---------deivce id', cameraDeviceIdRef.current);
    //           localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
    //             cameraId: cameraDeviceIdRef.current,
    //             encoderConfig: {
    //               width: 640,
    //               height: 360,
    //               frameRate: 30,
    //               bitrateMax: 1500,
    //               bitrateMin: 600,
    //             },
    //           });
    //         } catch (e) {
    //           if (e.code === 'DEVICE_NOT_FOUND') {
    //             console.warn("Camera not found initially, retrying...");
    //             await new Promise(res => setTimeout(res, 500));
    //             localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
    //               cameraId: cameraDeviceIdRef.current,
    //               encoderConfig: {
    //                 width: 640,
    //                 height: 360,
    //                 frameRate: 30,
    //                 bitrateMax: 1500,
    //                 bitrateMin: 600,
    //               },
    //             });
    //           } else {
    //             throw e;
    //           }
    //         }

    //         const localContainer = document.getElementById('local-container');
    //         if (localContainer) {
    //           // Clear DOM to ensure stream re-renders
    //           localContainer.innerHTML = '';
    //           localVideoTrack.current.play(localContainer);
    //         }

    //         await client.current.publish(localVideoTrack.current);

    //         // Attach to DOM
    //         // setTimeout(() => {
              
    //         // }, 300);

    //         setVideoOff(false);
    //       } catch (err) {
    //         console.error('❌ Failed to recreate video track:', err);
    //         alert("Could not access camera again. Please check camera permissions or reload.");
    //       }
    //     }
    //   }
    // };

    //toggle Video
//     const toggleVideo = async () => {
//       if (!localVideoTrack.current) return;

//       const isVideoEnabled = localVideoTrack.current.enabled;

//       if (isVideoEnabled) {
//         // Just disable video, don't stop or close it
//         await localVideoTrack.current.setEnabled(false);
//         setVideoOff(true);
//       } else {
//         try {
//           // Re-enable the existing video track
//           await localVideoTrack.current.setEnabled(true);

//           // Re-attach to container (sometimes required)
//           const localContainer = document.getElementById('local-container');
//           if (localContainer) {
//             localContainer.innerHTML = '';
//             await localVideoTrack.current.play(localContainer);
//           }

//           // Republish if not already published
//           // const tracks = client.current.getLocalVideoTracks();
//           // if (tracks.length === 0) {
//           //   await client.current.publish(localVideoTrack.current);
//           // }

//           setVideoOff(false);
//         } catch (err) {
//           console.error("Failed to re-enable video track:", err);
//           alert("Could not re-enable camera. Try refreshing or checking permissions.");
//         }
//       }
// };



    // const toggleVideo=()=>{
    //     if(localVideoTrack.current){
    //         const isVideoEnabled = localVideoTrack.current.enabled;
    //         localVideoTrack.current.setEnabled(!isVideoEnabled);
    //         setVideoOff(!isVideoEnabled ? false : true);

    //         if(!isVideoEnabled){
              
    //         }
            
    //     }
    //     // const isVideoEnabled = localVideoTrack.current && localVideoTrack.current.isPlaying;

    //     // if (isVideoEnabled) {
    //     //   // Turn off video
    //     //   localVideoTrack.current.stop();
    //     //   localVideoTrack.current.close();
    //     //   const container = document.getElementById('local-container');
    //     //   if (container) container.innerHTML = ''; // Remove the canvas
    //     //   setVideoOff(true);
    //     // } else {
    //     //   // Turn on video again
    //     //   localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
    //     //   const container = document.getElementById('local-container');
    //     //   if (container) await localVideoTrack.current.play(container);
    //     //   setVideoOff(false);
    //     // }
    // }
    
    //functions related to call duration counter
    // function startCallDurationCounter(){
    //   endCallDurationCounter();

    //   setCallDurationCounter(0);
    //   callDurationCounterRef.current = setInterval(()=>{
    //     setCallDurationCounter(prev => prev+1);
    //   }, 1000)
    // }
    // function endCallDurationCounter(){
    //   if(callDurationCounterRef.current){
    //     clearInterval(callDurationCounterRef.current);
    //     callDurationCounterRef.current = null;
    //   }
    // }
    function formatCallDurationCounter(durationCounter){
      const mins = String(Math.floor(durationCounter/60)).padStart(2, '0');
      const secs = String(durationCounter%60).padStart(2, '0');
      return `${mins}:${secs}`;
    }
    function startCountDownCounter(remainingSeconds){
      console.log('--------count down timer started', remainingSeconds);
      // alert('--------count down timer started');

      remainingSeconds = 60; //for testing purpose : 60
      endCountDownCounter();

      setTimeLeftCounter(remainingSeconds);
      timeLeftCounterRef.current = setInterval(()=>{
        setTimeLeftCounter(prev => {
          if(prev > 1){
            return prev-1;
          }else{
            if(!prev){
              return 0;
            }
            
            Swal.fire({
              icon: "error",
              // title : 'User Left',
              text: 'Meeting time Ended',
              ...SWAL_SETTINGS,
            });

            // leaveChannel(1) //by default isLeavedByMe = true
            navigate(-1);
            return 0;
          }
        });
      }, 1000)
    }
    function endCountDownCounter(){
      if(timeLeftCounterRef.current){
        clearInterval(timeLeftCounterRef.current);
        timeLeftCounterRef.current = null;
      }
    }

    //ringingDots
    function startRingingDots(){
      //ringing dots
      ringingDotsRef.current = setInterval(()=>{
        setRingingDots(prevDots => prevDots.length>3 ? '' : prevDots + '.')
      }, 500)

      //start caller tone
      // callerToneRef.current?.play();
    }
    function endRingingDots(){
      setRingingDots('');
      clearInterval(ringingDotsRef.current);
      ringingDotsRef.current = null;

      //end caller tone
      // callerToneRef.current?.pause();
      // if(callerToneRef.current){
      //   callerToneRef.current.currentTime = 0;
      // }
    }

    //to display calling-toastar-notification to other user side ( to initiate call and to show notification to cleint side)
    // function sendSocketToCustomer(details){
    //     SOCKET_CLIENT.emit('CALL-CUSTOMER', details);
    // }

    //to end the calling-toastar-notification to other user side (to end the call before client joins)
    // function sendSocketToCustomerEndCall(details){
    //     SOCKET_CLIENT.emit('END-CALL-CUSTOMER', details);
    // }

    //storing call info to db
    // async function storeCallInformation(isVideoCall){
    //     const callInfoPayload = {
    //         type : isVideoCall ? 'video' : 'audio',
    //         call_initiate_time : new Date(),
    //         // senderId : meetingDetailsRef.current?.call_info?.sender_id,
    //         // receiverId : meetingDetailsRef.current?.call_info?.reciever_id
    //         psychic_id : meetingDetailsRef.current?.call_info?.psychic_id,
    //         customer_id : meetingDetailsRef.current?.call_info?.customer_id,
    //         meeting_id : searchParams.get('meeting_id')
    //     }
    //     const response = await sendChat(callInfoPayload);
    //     dispatch(setMessageId(response?.data?._id))
    // }

    //updating call info to db
    // async function updateCallInformation(callData){
    //     await updateChat(callData);
    // }

    const renderLocalAvatar = (isLocal) => {
      const name = isLocal
        ? loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.psychic_name
          : meetingDetailsRef.current?.call_info?.customer_name
        : loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.customer_name
          : meetingDetailsRef.current?.call_info?.psychic_name;

      const avatar = isLocal
        ? loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.psychic_profile_image
          : meetingDetailsRef.current?.call_info?.customer_profile_image
        : loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.customer_profile_image
          : meetingDetailsRef.current?.call_info?.psychic_profile_image;

          // console.log('------avatar name', avatar, name);
      return (
        // <div className="d-flex flex-column align-items-center">
        //   <div className='avatar avatar-lg'>
        //     <img alt='avatar' src={avatar} />
        //   </div>
        //   <h5 className='text-white'>{name}</h5>
        // </div>

        <h5 className='text-white'>{name}</h5>
      );
    };

    const renderRemoteAvatar = (isLocal) => {
      const name = isLocal
        ? loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.psychic_name
          : meetingDetailsRef.current?.call_info?.customer_name
        : loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.customer_name
          : meetingDetailsRef.current?.call_info?.psychic_name;

      const avatar = isLocal
        ? loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.psychic_profile_image
          : meetingDetailsRef.current?.call_info?.customer_profile_image
        : loggedInUser._id === meetingDetailsRef.current?.call_info?.psychic_id
          ? meetingDetailsRef.current?.call_info?.customer_profile_image
          : meetingDetailsRef.current?.call_info?.psychic_profile_image;

          // console.log('------avatar name', avatar, name);
      return (
        <div className="d-flex flex-column align-items-center">
          <div className='avatar avatar-lg'>
            <img alt='avatar' src={avatar} />
          </div>
          <h5 className='text-white'>{name}</h5>
        </div>
      );
    };

    return (
    <div className="container vh-70 d-flex flex-column video-call-bg p-0">
      <div className="flex-grow-1 m-0">
        {/* Local & Remote Containers */}
        <div className='video-box-parent d-flex w-100'>

          {/* Local Container */}
          <div className="video-box col-12 col-md-6 p-0 bg-black position-relative" style={{ height: '500px' }}>
            {meetingDetails?.call_info?.meeting_type === 'video' && !videoOff ? (
              <div id="local-container" className="w-100 h-100 d-flex align-items-center justify-content-center" />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                {renderLocalAvatar(true)}
              </div>
            )}

            {/*Local Controls */}
            {/* <div className='mute-btn position-absolute bottom-0 start-0 p-3 d-flex gap-3'>
              <button
                className={`btn btn-dark rounded-circle mic-indicator ${isLocalUserSpeaking && !micMuted ? 'glow' : ''}`}
                onClick={toggleMic}
              >
                {micMuted ? <i className="ti ti-microphone-off"></i> : <i className="ti ti-microphone"></i>}
              </button>

              {meetingDetails?.call_info?.meeting_type === 'video' && (
                <button
                  className="btn btn-dark rounded-circle"
                  onClick={toggleVideo}
                >
                  {videoOff ? <i className="ti ti-video-off"></i> : <i className="ti ti-video"></i>}
                </button>
              )}
            </div> */}
          </div>

          {/* Remote Container */}
          <div className="video-remote col-12 col-md-6 p-0 bg-dark position-relative" style={{ height: '500px' }}>
            {joined ? 
            (
              remoteUsers.length
              ?
                (
                  <>  
                    {
                      meetingDetails.call_info?.meeting_type === 'video' && !remoteVideoOff 
                      ? 
                        <div id="remote-container" className="w-100 h-100 d-flex align-items-center justify-content-center" />
                      : 
                        <div className="w-100 h-100">
                          {renderRemoteAvatar(false)}
                          <p style={{color : 'green'}}>Connected</p>
                        </div>
                    }
                    {/* Remote user controls */}
                    {/* <div className='position-absolute bottom-0 start-0 p-3 d-flex gap-3'>
                      <span className={`btn btn-dark rounded-circle mic-indicator ${isRemoteUserSpeaking && !remoteMicMuted ? 'glow' : ''}`}>
                        {remoteMicMuted ? <i className="ti ti-microphone-off"></i> : <i className="ti ti-microphone"></i>}
                      </span>

                      {meetingDetails?.call_info?.meeting_type === 'video' && (
                        <span className="btn btn-dark rounded-circle">
                          {remoteVideoOff ? <i className="ti ti-video-off"></i> : <i className="ti ti-video"></i>}
                        </span>
                      )}
                    </div> */}
                  </>
                )
              : 
                (
                  <>
                    {renderRemoteAvatar(false)}
                    <h3 className='mt-2'>Waiting for Customer to Join {ringingDots}</h3>
                  </>
                )  
        
            ) 
            : 
            (
              <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white">
                {islocalTracksCreated ? (
                  meetingLeaved ? (
                    <>
                      {renderRemoteAvatar(false)}
                      {/* <h3 className='mt-2'>Meeting Ended, Duration: {callDuration} seconds</h3> */}
                      <h3 className='mt-2'>Meeting Ended</h3>
                      <button className="btn btn-light mt-2" onClick={joinChannel}>Join Again</button>
                      <Link to='/psychic/my-bookings' className='btn btn-outline-light mt-2'>Go to Bookings</Link>
                    </>
                  ) : (
                    <>
                      {renderRemoteAvatar(false)}
                      <button className="btn btn-light mt-2" onClick={joinChannel}>Join Meeting</button>
                    </>
                  )
                ) : (
                  <div>{meetingError}</div>
                )}
              </div>
            )
            }
          </div>
        </div>

        
        {/* Controls for local User */}
        <div className='d-flex justify-content-center flex-wrap align-items-center position-relative w-100'>
          <div className='video-call-action-box py-3'>
            {/*Audio and video Controls */}
            <div className='mute-btn bottom-0 start-0 d-flex gap-2'>
              <button
                className={`btn mic-indicator ${isLocalUserSpeaking && !micMuted ? 'glow' : ''}`}
                onClick={toggleMic}
              >
                {micMuted ? <i className="ti ti-microphone-off" style={{ fontSize: '30px' }}></i> : <i className="ti ti-microphone" style={{ fontSize: '30px' }}></i>}
              </button>

              {meetingDetails?.call_info?.meeting_type === 'video' && (
                <button
                  className="btn"
                  onClick={toggleVideo}
                >
                  {videoOff ? <i className="ti ti-video-off" style={{ fontSize: '30px' }}></i> : <i className="ti ti-video" style={{ fontSize: '30px' }}></i>}
                </button>
              )}
            </div>
            {/*Call end button  */}
            <div className=''>
              <button
                onClick={() => {
                  // joined && leaveChannel(1)
                  navigate(-1);
                }}
                style={{
                  backgroundColor: 'red',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <i className="fa fa-phone" style={{ color: 'white', transform: 'rotate(225deg)' }} aria-hidden="true"></i>
              </button>
            </div>
            {/* Call Status, Time left counter */}
          </div>
          {timeLeftCounter && (
            <div className="position-absolute time-left-box end-0 me-3 p-0">
              <h5 className="mb-0" style={{color: '#5a045a'}}>
                Time Left {formatCallDurationCounter(timeLeftCounter)}
              </h5>
            </div>
          )}
        </div>

        {/* {
          permissionDenied && <button onClick={()=> {grantLocalDevicesPermissions()}}>Allow Device Permissions</button>
        } */}
      </div>
    </div>
  );
};

export default Videocall;

                
