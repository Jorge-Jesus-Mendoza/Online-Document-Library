"use client";

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import {
  IoPause,
  IoPlay,
  IoVolumeHigh,
  IoVolumeLow,
  IoVolumeMute,
  IoVolumeOff,
} from "react-icons/io5";

const formWaveSurferOptions = (ref: HTMLDivElement | string) => ({
  container: ref,
  waveColor: "#ccc",
  progressColor: "#0178ff",
  cursorColor: "transparent",
  responsive: true,
  height: 80,
  normalize: true,
  backend: "WebAudio" as "WebAudio",
  barWidth: 2,
  barGap: 3,
});

interface Props {
  audioFile: string;
}

const AudioPlayer = ({ audioFile }: Props) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState("");

  const formatTime = (seconds: number) => {
    let date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19); // hh:mm:ss
  };

  useEffect(() => {
    if (waveformRef.current) {
      const options = formWaveSurferOptions(waveformRef.current);
      wavesurfer.current = WaveSurfer.create(options);

      try {
        wavesurfer.current.load(audioFile);
      } catch (error) {
        console.error("Error loading audio file:", error);
      }

      const handleReady = () => {
        if (wavesurfer.current) {
          setVolume(wavesurfer.current.getVolume());
          setDuration(wavesurfer.current.getDuration());
          setAudioFileName(audioFile.split("/").pop()!);
        }
      };

      const handleAudioProcess = () => {
        if (wavesurfer.current) {
          setCurrentTime(wavesurfer.current.getCurrentTime());
        }
      };

      // Attach listeners
      wavesurfer.current.on("ready", handleReady);
      wavesurfer.current.on("audioprocess", handleAudioProcess);

      return () => {
        // Detach listeners
        if (wavesurfer.current) {
          wavesurfer.current.un("ready", handleReady);
          wavesurfer.current.un("audioprocess", handleAudioProcess);
          wavesurfer.current.destroy();
        }
      };
    }
  }, [audioFile]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      setPlaying(!playing);
      wavesurfer.current.playPause();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (wavesurfer.current) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume);
      setMuted(newVolume === 0);
    }
  };

  const handleMute = () => {
    if (wavesurfer.current) {
      setMuted(!muted);
      wavesurfer.current.setVolume(muted ? volume : 0);
    }
  };

  const handleVolumeUp = () => {
    handleVolumeChange(Math.min(volume + 0.1, 1));
  };

  const handleVolumeDown = () => {
    handleVolumeChange(Math.max(volume - 0.1, 0));
  };

  return (
    <div id="waveform" ref={waveformRef} style={{ width: "100%" }}>
      <div className="controls">
        <button onClick={handlePlayPause}>
          {playing ? <IoPause size={25} /> : <IoPlay size={25} />}
        </button>

        <button onClick={handleMute}>
          {muted ? <IoVolumeOff size={25} /> : <IoVolumeMute size={25} />}
        </button>

        <input
          type="range"
          id="volume"
          name="volume"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        />

        <button onClick={handleVolumeDown}>
          <IoVolumeLow size={25} />
        </button>

        <button onClick={handleVolumeUp}>
          <IoVolumeHigh size={25} />
        </button>
      </div>
      <div className="audio-info">
        <span>
          Playing: {audioFileName} <br />
        </span>
        <span>
          Duration: {formatTime(duration)} | Current Time:{" "}
          {formatTime(currentTime)} <br />
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
