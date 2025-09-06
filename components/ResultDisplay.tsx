import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { StoryResult } from '../types';
import { SpeakerOnIcon, SpeakerOffIcon, DownloadIcon } from './Icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  result: StoryResult | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow"></div>
        <p className="text-gray-500">The storyteller is thinking...</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, result }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const speechSupported = 'speechSynthesis' in window;

  const handleSpeechEnd = useCallback(() => {
    setIsSpeaking(false);
  }, []);

  const handleSpeechError = useCallback((event: SpeechSynthesisErrorEvent) => {
    console.error('SpeechSynthesisUtterance.onerror:', event.error, event);
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!speechSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = handleSpeechEnd;
    utterance.onerror = handleSpeechError;
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [speechSupported, handleSpeechEnd, handleSpeechError]);

  useEffect(() => {
    if (result) {
      const fullText = `${result.title}. ${result.text} Moral of the story: ${result.moral}`;
      speak(fullText);
    }

    return () => {
      if (speechSupported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [result, speak, speechSupported]);

  const handleToggleSpeech = () => {
    if (!speechSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (result) {
      const fullText = `${result.title}. ${result.text} Moral of the story: ${result.moral}`;
      speak(fullText);
    }
  };

  const handleDownload = async () => {
    if (!resultRef.current || !result || isDownloading) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = `${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(filename);

    } catch (err) {
      console.error("Failed to generate PDF:", err);
      // You could show an error toast to the user here
    } finally {
      setIsDownloading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-300 p-6 rounded-2xl">
        <h3 className="font-bold mb-2">An Error Occurred</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) {
    return null; // Don't render anything if there's no result yet
  }

  return (
    <div ref={resultRef} className="bg-white p-8 rounded-2xl space-y-8">
      <div className="flex justify-center items-center gap-4">
        <h2 className="text-3xl font-bold text-brand-yellow text-center">{result.title}</h2>
        {speechSupported && (
          <button
              onClick={handleToggleSpeech}
              className="text-brand-yellow hover:text-brand-yellow-dark transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              aria-label={isSpeaking ? 'Stop reading aloud' : 'Read story aloud'}
          >
              {isSpeaking ? <SpeakerOffIcon className="w-7 h-7" /> : <SpeakerOnIcon className="w-7 h-7" />}
          </button>
        )}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="text-brand-yellow hover:text-brand-yellow-dark disabled:text-gray-400 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 disabled:cursor-wait"
          aria-label="Download story as PDF"
        >
          {isDownloading ? (
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-gray-400"></div>
          ) : (
            <DownloadIcon className="w-7 h-7" />
          )}
        </button>
      </div>
      
      <div className="flex justify-center">
        <img 
            src={result.imageUrl} 
            alt={`Illustration for the story: ${result.title}`}
            className="rounded-lg max-w-full md:max-w-2xl shadow-lg border-4 border-gray-200"
        />
      </div>
      
      <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
          {result.text}
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <blockquote className="text-center italic text-gray-500">
            <p className="font-bold text-brand-yellow mb-2">Moral of the story:</p>
            <p>"{result.moral}"</p>
        </blockquote>
      </div>
    </div>
  );
};

export default ResultDisplay;