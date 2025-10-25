<div className="container vh-70 d-flex flex-column video-call-bg p-0">
      <div className="row flex-grow-1 m-0">
        {/* Local & Remote Containers */}
        <div className='d-flex w-100'>
 
          {/* Local Container */}
          <div className="video-box col-12 col-md-6 p-0 bg-black position-relative" style={{ height: '500px' }}>
            {meetingDetails?.call_info?.meeting_type === 'video' && !videoOff ? (
              <div id="local-container" className="w-100 h-100 d-flex align-items-center justify-content-center" />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                {renderAvatar(true)}
              </div>
            )}
 
            {/* Controls */}
            <div className='mute-btn position-absolute bottom-0 start-0 p-3 d-flex gap-3'>
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
            </div>
          </div>
 
          {/* Remote Container */}
          <div className="video-remote col-12 col-md-6 p-0 bg-dark position-relative" style={{ height: '500px' }}>
            {joined ? (
              <>
                {meetingDetails?.call_info?.meeting_type === 'video' && !remoteVideoOff ? (
                  <div id="remote-container" className="w-100 h-100 d-flex align-items-center justify-content-center" />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    {renderAvatar(false)}
                  </div>
                )}
                <div className='position-absolute bottom-0 start-0 p-3 d-flex gap-3'>
                  <span className={`btn btn-dark rounded-circle mic-indicator ${isRemoteUserSpeaking && !remoteMicMuted ? 'glow' : ''}`}>
                    {remoteMicMuted ? <i className="ti ti-microphone-off"></i> : <i className="ti ti-microphone"></i>}
                  </span>
 
                  {meetingDetails?.call_info?.meeting_type === 'video' && (
                    <span className="btn btn-dark rounded-circle">
                      {remoteVideoOff ? <i className="ti ti-video-off"></i> : <i className="ti ti-video"></i>}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white">
                {islocalTracksCreated ? (
                  meetingLeaved ? (
                    <>
                      {renderAvatar(false)}
                      <h3>Meeting Ended, Duration: {callDuration} seconds</h3>
                      <button className="btn btn-light mt-2" onClick={joinChannel}>Join Again</button>
                      <Link to='/psychic/my-bookings' className='btn btn-outline-light mt-2'>Go to Bookings</Link>
                    </>
                  ) : (
                    <>
                      {renderAvatar(false)}
                      <button className="btn btn-light" onClick={joinChannel}>Join Meeting</button>
                    </>
                  )
                ) : (
                  <div>Something went wrong</div>
                )}
              </div>
            )}
          </div>
        </div>
 
        {/* Call Status & End Call Button */}
        {
          joined
          &&
          <div className='d-flex justify-content-between align-items-center p-3 mt-2'>
            <div>
              {
                !remoteUsers.length
                ? <h3>Ringing {ringingDots}</h3>
                : <h3>Connected {formatCallDurationCounter(callDurationCounter)}</h3>
              }
            </div>
 
            <div className='gap-3'>
              { remoteUsers.length && <h3 className='text-danger'>Time Left {formatCallDurationCounter(timeLeftCounter)}</h3> }
              <button className="btn btn-danger px-4 fw-bold" onClick={() => leaveChannel(1)}>
                End Call
              </button>
            </div>
          </div>
        }
 
        {
          permissionDenied && <button onClick={()=> {grantLocalDevicesPermissions()}}>Allow Device Permissions</button>
        }
      </div>
    </div>