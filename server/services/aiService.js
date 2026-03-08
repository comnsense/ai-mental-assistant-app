const logger = require('../utils/logger');

const generateAIResponse = async (message, emotion) => {
  try {
    const responses = {
      happy: [
        "Чудесно е, че се чувстваш щастлив! Разкажи ми повече.",
        "Радвам се, че си в добро настроение!"
      ],
      sad: [
        "Съжалявам, че се чувстваш тъжен. Искаш ли да поговорим?",
        "Тъгата е нормална. Аз съм тук за теб."
      ],
      angry: [
        "Виждам, че си ядосан. Дишай дълбоко.",
        "Гневът е естествен. Нека го обсъдим."
      ],
      anxious: [
        "Тревожността може да е трудна. Опитай да дишаш бавно.",
        "Всичко ще бъде наред. Аз съм до теб."
      ],
      neutral: [
        "Как мога да ти помогна днес?",
        "Разкажи ми как се чувстваш."
      ]
    };

    const emotionResponses = responses[emotion] || responses.neutral;
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  } catch (error) {
    logger.error('Error generating response:', error);
    return "Извинявай, имам технически проблем. Можеш ли да повториш?";
  }
};

const analyzeEmotion = async (message) => {
  const emotions = {
    happy: ['щастлив', 'радост', 'усмихнат'],
    sad: ['тъжен', 'натъжен', 'плача'],
    angry: ['ядосан', 'гняв', 'бесен'],
    anxious: ['тревожен', 'страх', 'притеснен']
  };

  const words = message.toLowerCase().split(' ');
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => words.includes(keyword))) {
      return emotion;
    }
  }
  
  return 'neutral';
};

module.exports = { generateAIResponse, analyzeEmotion };