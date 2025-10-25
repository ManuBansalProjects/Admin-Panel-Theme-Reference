// store/callSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
//   incomingCall: null, // Details of an incoming call
//   activeCall: null,   // Current call in progress
    meetingDetails : null,
    incomingCallRequestDetails : null //to contain details of a incoming call request
};

const meetingDetailsSlice = createSlice({
  name: 'meetingDetailsSlice',
  initialState,
  reducers: {
    
    //initiating
    setMeetingDetails: (state, action) => {
      state.meetingDetails = action.payload;
    },
    //updating message id ( db primary key)
    setMessageId: (state, action) => {
      state.meetingDetails.call_info.message_id = action.payload; 
    },
    markCallAsReceived : (state, action)=>{
      state.meetingDetails.call_info.call_status = 'received'; 
      state.meetingDetails.call_info.call_start_time = new Date();
    },
    resetMeetingDetailsForOutgoingCall : (state, action)=>{
        delete state?.meetingDetails?.call_info?.call_status
        delete state?.meetingDetails?.call_info?.call_start_time
    },
    
    
    setIncomingCallRequestDetails: (state, action) => {
      state.incomingCallRequestDetails = action.payload;
    },
  },
});

export const { 
    setMeetingDetails, 
    setMessageId, 
    markCallAsReceived, 
    resetMeetingDetailsForOutgoingCall, 
    setIncomingCallRequestDetails 
} = meetingDetailsSlice.actions;

export default meetingDetailsSlice.reducer;
