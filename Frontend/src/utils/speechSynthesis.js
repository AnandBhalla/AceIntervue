const typeToVoiceName = {
  INM: "Microsoft Ravi - English (India)",
  INW: "Microsoft Heera - English (India)",
  USM: "Microsoft Mark - English (United States)",
  USW: "Microsoft Susan - English (United Kingdom)"
};

export const speak = (text, type = "INM") => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const targetVoiceName = typeToVoiceName[type];

    const selectedVoice = voices.find(voice => voice.name === targetVoiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn(`Voice for type "${type}" not found. Using default voice.`);
    }

    utterance.onend = resolve;
    window.speechSynthesis.speak(utterance);
  });
};

export const cancelSpeech = () => {
  window.speechSynthesis.cancel();
};
