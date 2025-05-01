export const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
    
    return new Promise((resolve) => {
      utterance.onend = resolve;
    });
  };
  
  export const cancelSpeech = () => {
    window.speechSynthesis.cancel();
  };