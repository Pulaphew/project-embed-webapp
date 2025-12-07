'use client';

import React, { useState, useRef } from 'react';
import { AudioOutlined } from '@ant-design/icons'; // Ant Design mic icon
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import { findSimilarWord } from '../api/findSimilarWord'; // Import the API function

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(''); // Recognized speech
  const [similarWord, setSimilarWord] = useState(''); // Similar word from backend
  const [recordingTime, setRecordingTime] = useState(0); // Tracks recording time in seconds
  const [message, setMessage] = useState(''); // Message to display when recording stops
  const recognitionRef = useRef<any>(null); // Reference to the recognition instance
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Reference to the timer

  const startRecording = () => {
    if (isRecording) {
      // Stop recording if already recording
      setIsRecording(false);
      setMessage('Recording stopped');
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // Stop the speech recognition
      }
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop the timer
      }
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = false; // Only final results
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition; // Store the recognition instance

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingTime(0); // Reset the timer
      setMessage(''); // Clear any previous message
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1); // Increment the timer every second
      }, 1000);
    };

    recognition.onresult = async (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult); // Update the transcript

      // Call the API to find a similar word
      try {
        const similarWord = await findSimilarWord(speechResult);
        setSimilarWord(similarWord); // Update the similar word
        setMessage('Received command successfully!');
      } catch (error) {
        setMessage('Error: Could not fetch similar word.');
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        console.warn('No speech detected. Please try again.');
        setMessage('No speech detected. Please try again.');
      } else if (event.error === 'audio-capture') {
        console.warn('Microphone not available.');
        setMessage('Microphone not available.');
      } else if (event.error === 'network') {
        console.warn('Network error occurred.');
        setMessage('Network error occurred.');
      } else {
        console.error('Speech recognition error:', event.error);
        setMessage('An error occurred during speech recognition.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop the timer when recording ends
      }
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Microphone Icon */}
      <button
        onClick={startRecording}
        className={`flex items-center justify-center w-20 h-20 rounded-full border-4 border-gray-400 ${
          isRecording ? 'bg-red-500 text-white' : 'bg-none text-gray-500'
        } hover:bg-blue-500 hover:text-white hover:scale-110 transition-all duration-300`}
      >
        <AudioOutlined className="text-4xl" />
      </button>

      {/* Display Recording Time */}
      {isRecording && (
        <p className="mt-2 text-lg text-red-500 font-bold">
          Recording: {recordingTime}s
        </p>
      )}

      {/* Display Message */}
      {message && (
        <p className="mt-2 text-lg text-green-500 font-bold text-center">{message}</p>
      )}

      {/* Display Transcript */}
      {/* {transcript && (
        <p className="mt-4 text-lg text-gray-800">
          You said: <span className="font-bold">{transcript}</span>
        </p>
      )} */}

      {/* Display Similar Word */}
      {similarWord && (
        <p className="mt-2 text-lg text-gray-800">
          Command: <span className="font-bold">{similarWord}</span>
        </p>
      )}
    </div>
  );
}