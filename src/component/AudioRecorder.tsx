'use client'

import { useState, useRef } from "react";
import {isNil} from "lodash"
const mimeType = "audio/webm";
const AudioRecorder = ()=>{
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<MediaRecorder|null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<MediaStream|null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audio, setAudio] = useState<string|null>(null);

    const getMicrophonePermission = async()=>{
        setAudio(null)
        if ("MediaRecorder" in window) {
            try {
                const audioConstraints = { audio: true };
                // create audio and video streams separately
                const audioStream = await navigator.mediaDevices.getUserMedia(
                    audioConstraints
                );
                setPermission(true);
                //combine both audio and video streams
                setStream(audioStream);
                
            } catch (err) {
                alert((err as Error).message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    }

    const startRecording = async () => {
        if(isNil(stream)){
            alert("You have not enable the permission to record audio");
        }else{

            setRecordingStatus("recording");
            //create new Media recorder instance using the stream
            const media = new MediaRecorder(stream, { mimeType });
            //set the MediaRecorder instance to the mediaRecorder ref
            mediaRecorder.current = media;
            //invokes the start method to start the recording process
            mediaRecorder.current.start();
            const localAudioChunks:Blob[] = [];
            mediaRecorder.current.ondataavailable = (event) => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localAudioChunks.push(event.data);
            };
            setAudioChunks(localAudioChunks);
        }
      };
      const stopRecording = () => {
        if(isNil(mediaRecorder.current)){
            alert("You have not start recording")
        }else{

            setRecordingStatus("inactive");
            //stops the recording instance
            mediaRecorder.current.stop();
            mediaRecorder.current.onstop = () => {
                //creates a blob file from the audiochunks data
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                //creates a playable URL from the blob file.
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudio(audioUrl);
                setAudioChunks([]);
            };
        }
      };
    return (<>
        <div className="audio-controls">
        {!permission ? (
        <button onClick={getMicrophonePermission} type="button">
            Get Microphone
        </button>
        ) : null}
        {permission && recordingStatus === "inactive" ? (
        <button onClick={startRecording} type="button">
            Start Recording
        </button>
        ) : null}
        {recordingStatus === "recording" ? (
        <button onClick={stopRecording} type="button">
            Stop Recording
        </button>
        ) : null}
    </div>
    {audio ? (
    <div className="audio-container">
        <audio src={audio} controls></audio>
        <a download href={audio}>
            Download Recording
        </a>
    </div>
    ) : null}
    </>)
}
export default AudioRecorder