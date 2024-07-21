import React, {useState, useRef, useEffect} from 'react';
import {Switch} from 'antd';
import 'antd/dist/reset.css';

export function SoundToggle({soundUrl}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Initialize the audio object and store it in state
    const newAudio = new Audio(soundUrl);
    setAudio(newAudio);

    // Cleanup function to pause and unload the audio when the component unmounts
    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.src = ''; // This helps to unload the audio from memory
      }
    };
  }, [soundUrl]);

  const handleToggle = (checked) => {
    setIsPlaying(checked);
    if (checked && audio) {
      audio.play();
    } else if (audio) {
      audio.pause();
    }
  };

  return <Switch checked={isPlaying} onChange={handleToggle} />;
}
