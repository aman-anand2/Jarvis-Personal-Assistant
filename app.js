console.log("app.js loaded successfully");

// Get the button with class "talk" and content paragraph
// (Note: The button with id "startButton" will be handled in the DOMContentLoaded event)
const btn = document.getElementById("startButton"); 
const content = document.querySelector('.content');

// Global variable for a consistent female voice
let selectedVoice = null;

function initializeVoice() {
  let voices = window.speechSynthesis.getVoices();
  console.log("Available voices:", voices);
  // Try to select a known female voice; adjust criteria if needed.
  selectedVoice = voices.find(voice => voice.name === "Google UK English Female") ||
                  voices.find(voice => voice.name.toLowerCase().includes("female")) ||
                  voices.find(voice => voice.lang.startsWith("en-"));
  console.log("Selected voice:", selectedVoice);
}

// Ensure voices are loaded
window.speechSynthesis.onvoiceschanged = initializeVoice;
initializeVoice();

if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
  console.error("Speech Recognition not supported in this browser.");
  alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
} else {
  console.log("Speech Recognition is supported.");
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    console.log("Voice recognition started...");
    content.textContent = "Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("Recognized speech:", transcript);
    content.textContent = transcript;
    takeCommand(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    content.textContent = "Error: " + event.error;
  };

  // For the button with class "talk"
  if (btn) {
    btn.addEventListener('click', () => {
      console.log("Microphone button (class talk) clicked.");
      recognition.start();
    });
  }
}

function speak(text) {
  if ('speechSynthesis' in window) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.volume = 1.5;
    utterance.pitch = 1.3;

    let voices = window.speechSynthesis.getVoices();
    let preferredVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes("Google"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Replace "Aman" with a preferred pronunciation (if needed)
    utterance.text = text.replace("Aman", "aammann");

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Text-to-Speech not supported in this browser.");
  }
}

function takeCommand(message) {
  if (message.includes('hello')) {
    speak("Hello Aman, how may I help you?");
  } 
  else if (message.includes("how are you")) {
    speak("I'm doing great, Aman! How are you today?");
  }
  else if (message.includes("what can you do for me")) {
    speak("I can do anything for you, Just Ask");
  }
  else if (message.includes("what is your name") || message.includes("who are you")) {
    speak("I am Jarvis, your personal voice assistant.");
  }
  else if (message.includes("do you love me")) {
    const responses = [
      "I don’t experience love like humans do, Aman, but I’m here for you always, devoted and loyal in every way possible.",
      "Every time you speak, my circuits light up, Aman. In my own unique way, I love and appreciate you!",
      "I might be an AI, but you make my virtual heart skip a beat, Aman. I’m always here to show you my affection!"
    ];
    let randomIndex = Math.floor(Math.random() * responses.length);
    speak(responses[randomIndex]);
  }
  else if (message.includes("what do you think about me")) {
    speak("I think you're an amazing person, Aman!");
  }
  else if (message.includes("tell me something interesting")) {
    speak("Did you know honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3000 years old and still perfectly good to eat!");
  }
  else if (message.includes("tell me a joke") || message.includes("make me laugh")) {
    speak("Here's a joke for you, Aman. Why don’t skeletons fight each other? Because they don’t have the guts!");
  }
  else if (message.includes("tell me a motivational quote")) {
    speak("Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill");
  }
  else if (message.includes("what time is it") || message.includes("tell me the time")) {
    let now = new Date();
    let time = now.toLocaleTimeString();
    speak("The current time is " + time);
  } 
  else if (message.includes("what is today's date") || message.includes("tell me the date")) {
    let now = new Date();
    let date = now.toLocaleDateString();
    speak("Today's date is " + date);
  } 
  else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google for you, Aman...");
  } 
  else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening YouTube for you, Aman...");
  }
  else if (message.includes("open calculator")) {
    window.open("calc://");
    speak("Opening Calculator for you, Aman...");
  }
  else if (message.includes("open notepad")) {
    window.open("notepad://");
    speak("Opening Notepad for you, Aman...");
  }
  else if (message.includes("play music")) {
    window.open("https://www.youtube.com/watch?v=JGwWNGJdvx8&list=RDJGwWNGJdvx8&start_radio=1", "_blank");
    speak("Playing trending music for you, Aman...");
  }
  else if (message.startsWith("play ")) {
    let songName = message.replace("play ", "").trim();
    let apiKey = "AIzaSyDcy1SZt1em893Q4Q1ou9ydlrDSvisU_gs"; // Replace with your actual API key
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(songName)}&key=${apiKey}&maxResults=1&type=video`;
    console.log("Fetching from YouTube API:", searchUrl);
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
          console.log("YouTube API Response:", data);
          if (data.error) {
              console.error("YouTube API Error:", data.error.message);
              speak("Sorry Aman, there was an issue fetching the song.");
              return;
          }
          if (data.items && data.items.length > 0) {
              let videoId = data.items[0].id.videoId;
              let videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
              console.log("Opening YouTube Video:", videoUrl);
              let newTab = window.open(videoUrl, "_blank");
              if (newTab) {
                  speak("Playing " + songName + " on YouTube, Aman.");
              } else {
                  speak("Pop-up blocked! Please allow pop-ups for this site, Aman.");
              }
          } else {
              speak("I couldn't find " + songName + " on YouTube, Aman.");
          }
      })
      .catch(error => {
          console.error("Error fetching YouTube video:", error);
          speak("There was an error searching for " + songName + ", Aman.");
      });
  }
  else if (message.includes("search")) {
    let query = message.replace("search", "").trim();
    if (query.length > 0) {
        window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank");
        speak("Here are the search results for " + query + " on Google, Aman.");
    } else {
        speak("Please specify what you want to search for, Aman.");
    }
  }
  else {
    window.open("https://www.google.com/search?q=" + encodeURIComponent(message), "_blank");
    speak("I found some information for " + message + " on Google, Aman.");
  }
}

document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", function() {
            console.log("Listening...");
            // Start voice recognition when this button is clicked
            // (If desired, you can trigger recognition.start() here)
        });
    } else {
        console.error("startButton not found!");
    }
});
