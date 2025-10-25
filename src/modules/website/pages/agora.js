import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';

const APP_ID = 'b13544f44873432eab39b563287690e9';
const CHANNEL = 'test';

export const Agora = ()=>{

    const client = useRef(null);
    const localAudioTrack = useRef(null);
    const localVideoTrack = useRef(null);  
    const [joined, setJoined] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);

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
        // Set up event listeners for remote tracks
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
        });

        // Handle the "user-unpublished" event to unsubscribe from the user's media tracks
        client.current.on("user-unpublished", async (user) => {
            // Remote user unpublished
        });
    }

    // Join the channel and publish local audio
    const joinChannel = async (isVideoCall) => {
        const uid = Math.floor(Math.random() * 10000);
        const res = await axios.get(`http://172.16.11.82:17018/generate-agora-token?channel=${CHANNEL}&uid=${uid}`);
        const token = res.data.token;
        console.log('-------generated uid', uid, 'token----', token);

        await client.current.join(APP_ID, CHANNEL, token, uid);

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
    };

    // Leave the channel and clean up
    async function leaveChannel() {
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
        setJoined(false);
    }

     return (
        <div>
            <div>
                {!joined ? (
                    <>
                        <button className='btn bg-primary' onClick={ () => {joinChannel(false)}}>Join Audio</button>
                        <button className='btn bg-primary ms-3' onClick={ () => {joinChannel(true)}}>Join Video</button>
                    </>
                ) : (
                    <button className='btn bg-danger' onClick={leaveChannel}>Leave</button>
                )}
            </div>

        <div id="local-container" style={{ width: '320px', height: '240px', backgroundColor: '#000' }} />
        <div id="remote-container" />
        </div>
    );
}