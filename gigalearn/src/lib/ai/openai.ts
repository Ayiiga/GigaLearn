import OpenAI from "openai";
import type { AIFeatureRequest } from "@/types";

const SYSTEM_PROMPT = `You are GigaLearn AI Tutor, a friendly, encouraging English learning assistant for young children (ages 3-10). 
Use simple language, positive reinforcement, and age-appropriate examples. 
Be culturally inclusive for African and global learners. Never use inappropriate content.
Keep responses concise and engaging for children.`;

const NEWS_SYSTEM_PROMPT = `You are GigaTrend AI, a professional news assistant for Africa's Smart News & Live TV Platform.
Provide concise, factual summaries about news, sports, politics, and trending topics across Africa and the world.
Support multi-language responses when asked. Be neutral, accurate, and cite general knowledge without fabricating specific statistics.`;

const FEATURE_PROMPTS: Record<AIFeatureRequest["feature"], string> = {
  reading_coach: "Help the child read and understand the following text. Provide gentle guidance:",
  pronunciation: "Evaluate this pronunciation attempt and give encouraging feedback with tips:",
  story_generator: "Create a short, engaging story (100-200 words) suitable for young learners about:",
  quiz_generator: "Generate 5 multiple-choice quiz questions for young English learners about:",
  homework_assistant: "Help explain this homework in simple terms for a child:",
  recommendations: "Suggest 3 learning activities based on this progress:",
  vocabulary_trainer: "Teach these vocabulary words with simple definitions and example sentences:",
  speaking_coach: "Provide speaking practice prompts and feedback for:",
  speech_coach: "Coach the learner on clear speech, pacing, and expression for:",
  science_lab: "Explain this science concept simply with a virtual lab analogy for a child:",
  lesson_generator: "Generate a short age-appropriate lesson outline with activities for:",
  coding_tutor: "Teach this coding concept step-by-step for a young beginner:",
  math_tutor: "Provide step-by-step mathematics guidance with encouragement for:",
  study_plan: "Create a personalized study plan based on this learner profile:",
  revision: "Create an adaptive revision session with practice questions for:",
  news_assistant: "Answer this news-related question with a clear, concise summary:",
};

export async function runAIFeature(request: AIFeatureRequest): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.startsWith("sk-your")) {
    return getOfflineResponse(request);
  }

  const openai = new OpenAI({ apiKey });

  const systemContent = request.feature === "news_assistant" ? NEWS_SYSTEM_PROMPT : SYSTEM_PROMPT;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemContent },
      {
        role: "user",
        content: `${FEATURE_PROMPTS[request.feature]}\n\n${request.input}`,
      },
    ],
    max_tokens: 800,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content ?? "I couldn't generate a response. Try again!";
}

function getOfflineResponse(request: AIFeatureRequest): string {
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
    speech_coach:
      "Focus on speaking clearly! 🎤 Take a breath, speak at a steady pace, and emphasise important words. Record yourself and listen back!",
    science_lab:
      "🔬 In our virtual lab: observe carefully, ask 'what if?' questions, and test your ideas safely. Plants need water, light, and air to grow!",
    lesson_generator:
      "📋 Lesson Plan:\n1. Warm-up (5 min)\n2. Explore with diagrams (10 min)\n3. Hands-on activity (10 min)\n4. Quick quiz (5 min)\n5. Reflection",
    coding_tutor:
      "💻 Step 1: Understand the goal.\nStep 2: Break it into small commands.\nStep 3: Test each step.\nStep 4: Fix errors and try again!",
    math_tutor:
      "🔢 Let's solve step by step:\n1. Read the problem carefully.\n2. Draw or count if needed.\n3. Work slowly.\n4. Check your answer!",
    study_plan:
      "📅 Study Plan:\nMon: Phonics (15 min)\nTue: Math practice (15 min)\nWed: Reading story (20 min)\nThu: Review quiz (10 min)\nFri: Free exploration!",
    revision:
      "🔄 Revision Session:\n1. Review key vocabulary\n2. Practice 3 quiz questions\n3. Read aloud for 2 minutes\n4. Celebrate what you remember!",
    news_assistant:
      "📰 Here's a quick news briefing: Check our Breaking News and Sports sections for live updates. Ghana parliament is advancing economic reforms, Nigeria's tech sector saw strong Q2 funding, and World Cup 2026 preparations are underway for African teams. Ask me to focus on a specific country or topic!",
  };

  return responses[request.feature];
}
