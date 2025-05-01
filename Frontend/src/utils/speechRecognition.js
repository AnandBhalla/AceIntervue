export const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    return recognition;
  };
  
  export const startListening = (recognition) => {
    return new Promise((resolve) => {
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        resolve('');
      };
  
      recognition.start();
    });
  };