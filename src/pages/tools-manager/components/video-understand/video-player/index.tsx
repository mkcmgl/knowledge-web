
import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  width?: number | string;
  height?: number | string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // 示例视频链接
  width = '100%',
  height = 'auto',
  poster,
  autoPlay = false,
  controls = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div style={{ width, maxWidth: '800px', margin: '0 auto' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        width="100%"
        height={height}
        autoPlay={autoPlay}
        controls={controls}
        onClick={togglePlay}
      >
        您的浏览器不支持HTML5视频
      </video>
    </div>
  );
};

export default VideoPlayer;
