import type { AIFeatureRequest } from "@/types";

export function getOfflineAIResponse(request: AIFeatureRequest): string {
  const responses: Record<AIFeatureRequest["feature"], string> = {
    reading_coach:
      "Great job reading! 🌟 Let's break it down: read each word slowly, sound it out, and look at the pictures for clues. You're doing amazing!",
    pronunciation:
      "Nice try! 🎤 Remember to open your mouth wide for vowel sounds. Listen to the audio and repeat slowly. Practice makes perfect!",
    story_generator:
      "Once upon a time, a little lion named Leo lived in the African savanna. Leo loved to learn new words every day. One sunny morning, Leo found a magical book that taught him to read. He shared his new skills with all his friends. The end! 📚",
    quiz_generator:
      "1. What letter does 'Apple' start with? (A/B/C)\n2. Which word rhymes with 'cat'? (hat/bat/sun)\n3. How many syllables in 'elephant'? (2/3/4)\n4. What is the opposite of 'big'? (small/tall/fast)\n5. Complete: The cat ___ on the mat. (sat/run/jump)",
    homework_assistant:
      "Let's work through this together! 💡 Break the task into small steps. Read the instructions aloud, try one example, and ask for help if you get stuck.",
    recommendations:
      "Based on your progress, try:\n1. 🅰️ Alphabet Adventure — Letter tracing\n2. 🔤 GigaPhonics — CVC word blending\n3. 📖 Story time — Read a short story aloud",
    vocabulary_trainer:
      "Word: Happy 😊\nMeaning: Feeling good and smiling\nExample: I am happy when I play with friends.\n\nWord: Brave 🦁\nMeaning: Not afraid to try new things\nExample: The brave girl read aloud in class.",
    speaking_coach:
      "Let's practice speaking! 🗣️ Try saying: 'Hello, my name is ___. I like to ___.' Speak slowly and clearly. Great job practicing!",
  };

  return responses[request.feature];
}
