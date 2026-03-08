const axios = require('axios');
const logger = require('../utils/logger');

const generateAIResponse = async (message, emotion) => {
  try {
    // В продукционна среда тук се използва OpenAI API
    // За демо цели използваме предварително дефинирани отговори
    
    const responses = {
      happy: [
        "Чудесно е, че се чувстваш щастлив! Какво те прави щастлив днес?",
        "Радвам се, че си в добро настроение! Искаш ли да поговорим за това?",
        "Щастието е прекрасно чувство. Как мога да допринеса то да продължи?"
      ],
      sad: [
        "Съжалявам, че се чувстваш тъжен. Искаш ли да поговорим за това, което те тревожи?",
        "Тъгата е нормална човешка емоция. Понякога помага да споделиш с някого.",
        "Можеш да ми разкажеш какво те натъжава. Аз съм тук, за да те изслушам."
      ],
      angry: [
        "Виждам, че си ядосан. Понякога дишането дълбоко може да помогне. Искаш ли да опитаме заедно?",
        "Гневът е естествен. Нека опитаме да разберем какво го предизвиква.",
        "Когато сме ядосани, е добре да направим кратка почивка. Какво мислиш?"
      ],
      anxious: [
        "Тревожността може да е трудна. Нека опитаме някои техники за успокояване.",
        "Чувството на тревога е неприятно. Искаш ли да поговорим за това, което те тревожи?",
        "Помни, че си в безопасност сега. Аз съм тук да те подкрепя."
      ],
      stressed: [
        "Стресът може да бъде преодолян. Какво обикновено помага да се успокоиш?",
        "Нека опитаме заедно да направим няколко дълбоки вдишвания.",
        "Важно е да се грижиш за себе си, когато си под стрес. Искаш ли съвет?"
      ],
      neutral: [
        "Как минава денят ти? Има ли нещо, за което искаш да поговорим?",
        "Аз съм тук, за да те изслушам. Можеш да споделиш каквото те вълнува.",
        "Понякога просто да поговориш с някого помага. Разкажи ми повече."
      ]
    };

    const emotionResponses = responses[emotion.emotion] || responses.neutral;
    const randomResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
    
    return randomResponse;
  } catch (error) {
    logger.error('Error generating AI response:', error);
    return "Извинявай, имам технически проблем. Можеш ли да повториш?";
  }
};

const analyzeEmotion = async (message) => {
  try {
    // В продукционна среда тук се използва NLP модел
    // За демо цели използваме проста ключова дума проверка
    
    const emotionKeywords = {
      happy: ['щастлив', 'радост', 'усмихнат', 'доволен', 'прекрасно', 'чудесно'],
      sad: ['тъжен', 'натъжен', 'плача', 'самотен', 'мъчно', 'тежко'],
      angry: ['ядосан', 'гняв', 'бесен', 'разочарован', 'нервен'],
      anxious: ['тревожен', 'притеснен', 'страх', 'паника', 'неспокоен'],
      stressed: ['стрес', 'натоварен', 'изтощен', 'претоварен', 'умора']
    };

    const words = message.toLowerCase().split(' ');
    let detectedEmotion = 'neutral';
    let maxMatches = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = words.filter(word => keywords.includes(word)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    }

    // Sentiment analysis (-1 to 1)
    const sentimentScore = {
      happy: 0.8,
      sad: -0.6,
      angry: -0.7,
      anxious: -0.4,
      stressed: -0.5,
      neutral: 0
    }[detectedEmotion];

    return {
      emotion: detectedEmotion,
      sentiment: sentimentScore
    };
  } catch (error) {
    logger.error('Error analyzing emotion:', error);
    return { emotion: 'neutral', sentiment: 0 };
  }
};

module.exports = { generateAIResponse, analyzeEmotion };