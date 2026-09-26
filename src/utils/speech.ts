export interface SpeechRecognitionHelper {
  start: (onResult: (text: string) => void, onError: (err: any) => void) => void;
  stop: () => void;
  isSupported: boolean;
}

export function createSpeechRecognizer(): SpeechRecognitionHelper {
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  let recognitionInstance: any = null;

  return {
    isSupported,
    start: (onResult, onError) => {
      if (!isSupported) {
        onError('Speech recognition not supported in this browser.');
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        onError(event.error);
      };

      try {
        recognitionInstance.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    },
    stop: () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          // safe ignore
        }
      }
    }
  };
}

export function speakText(text: string, onEnd?: () => void, voiceName?: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  utterance.onend = () => {
    onEnd?.();
  };
  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}
