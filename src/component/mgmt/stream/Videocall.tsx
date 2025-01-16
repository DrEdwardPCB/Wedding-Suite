"use client";

import { useRef, useState, CSSProperties } from "react";
import ZoomVideo, { type VideoClient, type VideoPlayer, VideoQuality } from "@zoom/videosdk";
import { CameraButton, MicButton } from "./MicButtons";
import { PhoneOff } from "lucide-react";
import { Button } from "./Button";

const Videocall = (props: { slug: string; JWT: string }) => {
    const session = props.slug;
    const jwt = props.JWT;
    const [inSession, setinSession] = useState(false);
    const client = useRef<typeof VideoClient>(ZoomVideo.createClient());
    const [isVideoMuted, setIsVideoMuted] = useState(!client.current.getCurrentUserInfo()?.bVideoOn);
    const [isAudioMuted, setIsAudioMuted] = useState(client.current.getCurrentUserInfo()?.muted ?? true);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    const joinSession = async () => {
        await client.current.init("en-US", "Global", { patchJsMedia: true });
        client.current.on("peer-video-state-change", (payload) => void renderVideo(payload));
        const userName = `User-${new Date().getTime().toString().slice(8)}`;
        await client.current.join(session, jwt, userName)
        setinSession(true);
        const mediaStream = client.current.getMediaStream();
        await mediaStream.startAudio();
        await mediaStream.startVideo();
        setIsAudioMuted(client.current.getCurrentUserInfo().muted ?? true);
        setIsVideoMuted(!client.current.getCurrentUserInfo().bVideoOn);
        await renderVideo({ action: "Start", userId: client.current.getCurrentUserInfo().userId });
    };
    const renderVideo = async (event: {
        action: "Start" | "Stop";
        userId: number;
      }) => {
        const mediaStream = client.current.getMediaStream();
        if (event.action === "Stop") {
          const element = await mediaStream.detachVideo(event.userId);
          Array.isArray(element)
            ? element.forEach((el) => el.remove())
            : element.remove();
        } else {
          const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_360P);
          videoContainerRef.current!.appendChild(userVideo as VideoPlayer);
        }
      };
      const leaveSession = async () => {
        client.current.off(
          "peer-video-state-change",
          (payload: { action: "Start" | "Stop"; userId: number }) =>
            void renderVideo(payload)
        );
        await client.current.leave();
        window.location.href = "/mgmt";
      };
      return (
        <div>
          <h1>
            Session: {session}
          </h1>
          <div style={inSession ? {} : { display: "none" }}>
             {/* @ts-expect-error html component */}
            <video-player-container ref={videoContainerRef} style={videoPlayerStyle} />
          </div>
          {!inSession ? (
            <div>
              <Button onClick={joinSession}>
                Join
              </Button>
            </div>
          ) : (<div>
            <div>
              <CameraButton
                client={client}
                isVideoMuted={isVideoMuted}
                setIsVideoMuted={setIsVideoMuted}
                renderVideo={renderVideo}
              />
              <MicButton
                isAudioMuted={isAudioMuted}
                client={client}
                setIsAudioMuted={setIsAudioMuted}
              />
              <Button onClick={leaveSession}>
                <PhoneOff />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const videoPlayerStyle = {
    height: "75vh",
    marginTop: "1.5rem",
    marginLeft: "3rem",
    marginRight: "3rem",
    alignContent: "center",
    borderRadius: "10px",
    overflow: "hidden",
  } as CSSProperties;

  export default Videocall
