"use client";

import { convertToWav } from "@/utils/convertToWavUtil";
import { Mic, CirclePause } from "lucide-react";
import { useState, useRef } from "react";
import { MessagePayload } from "../types";

export default function Recorder({
  setMessage,
  roomId,
  setSound
}: {
  setMessage: (message: MessagePayload) => void;
  roomId: number;
  setSound: (sound: File) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const wavBlob = await convertToWav(blob);
        setSound(new File([wavBlob], `recording-${Date.now()}.wav`, { type: "audio/wav" }));

        const file = new File([wavBlob], `recording-${Date.now()}.wav`, {
          type: "audio/wav",
        });

        setMessage({
          type: "files",
          files: [file],
          room_id: roomId,
        });

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      setTimerInterval(
        setInterval(() => {
          setRecordingTime((t) => t + 1);
        }, 1000)
      );
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  const formatRecordingTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <span
      className="p-1 cursor-pointer flex items-center gap-1"
      onClick={isRecording ? handleStopRecording : handleStartRecording}
    >
      {isRecording ? (
        <>
          <CirclePause  className="text-red-500 w-5 h-5" />
          <span>{formatRecordingTime(recordingTime)}</span>
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </span>
  );
}
