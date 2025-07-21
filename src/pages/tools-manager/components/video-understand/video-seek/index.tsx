
import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'antd';

interface VideoPlayerProps {
  src: string;
  startTime?: number;
  endTime?: number;
}

const VideoPlayerWithSeek: React.FC<VideoPlayerProps> = ({ 
  src, 
  startTime = 3, 
  endTime = 10 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= endTime) {
        video.pause();
        video.currentTime = startTime;
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [startTime, endTime]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        src={src}
        controls
        width="600"
      />
      <div className="controls">
        <Button type="primary" onClick={handlePlay} disabled={isPlaying}>
          {isPlaying ? '播放中...' : `播放 ${startTime}-${endTime}秒`}
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayerWithSeek;
