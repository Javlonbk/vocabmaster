import type { CefrLevel } from '../types/shared';

export type PlacementQuestion = {
  id: string;
  word: string;
  question: string;
  options: string[];
  correctAnswer: number;
  level: CefrLevel;
};

export const placementQuestions: PlacementQuestion[] = [
  {
    id: 'a1-1',
    word: 'apple',
    question: 'What is an apple?',
    options: ['A fruit', 'A vehicle', 'A tool', 'A building'],
    correctAnswer: 0,
    level: 'A1'
  },
  {
    id: 'a1-2',
    word: 'chair',
    question: 'What is a chair used for?',
    options: ['Sitting', 'Cooking', 'Driving', 'Painting'],
    correctAnswer: 0,
    level: 'A1'
  },
  {
    id: 'a1-3',
    word: 'sleep',
    question: 'What does "sleep" mean?',
    options: ['To rest', 'To run', 'To shout', 'To build'],
    correctAnswer: 0,
    level: 'A1'
  },
  {
    id: 'a1-4',
    word: 'cold',
    question: 'What does "cold" describe?',
    options: ['Low temperature', 'A color', 'A shape', 'A job'],
    correctAnswer: 0,
    level: 'A1'
  },
  {
    id: 'a1-5',
    word: 'buy',
    question: 'What does "buy" mean?',
    options: ['To purchase', 'To sell', 'To search', 'To teach'],
    correctAnswer: 0,
    level: 'A1'
  },
  {
    id: 'a2-1',
    word: 'travel',
    question: 'What does "travel" mean?',
    options: ['To go to places', 'To read books', 'To draw pictures', 'To sleep'],
    correctAnswer: 0,
    level: 'A2'
  },
  {
    id: 'a2-2',
    word: 'message',
    question: 'What is a message?',
    options: ['Information sent to someone', 'A type of food', 'A weather event', 'A sport'],
    correctAnswer: 0,
    level: 'A2'
  },
  {
    id: 'a2-3',
    word: 'healthy',
    question: 'What does "healthy" mean?',
    options: ['In good health', 'Very tired', 'Angry', 'Expensive'],
    correctAnswer: 0,
    level: 'A2'
  },
  {
    id: 'a2-4',
    word: 'invite',
    question: 'What does "invite" mean?',
    options: ['To ask someone to come', 'To refuse help', 'To repair', 'To forget'],
    correctAnswer: 0,
    level: 'A2'
  },
  {
    id: 'a2-5',
    word: 'careful',
    question: 'What does "careful" mean?',
    options: ['Giving attention to avoid mistakes', 'Very loud', 'Fast', 'Empty'],
    correctAnswer: 0,
    level: 'A2'
  },
  {
    id: 'b1-1',
    word: 'decision',
    question: 'What is a decision?',
    options: ['A choice made after thinking', 'A type of job', 'A mistake', 'A tool'],
    correctAnswer: 0,
    level: 'B1'
  },
  {
    id: 'b1-2',
    word: 'improve',
    question: 'What does "improve" mean?',
    options: ['To make better', 'To delay', 'To hide', 'To fail'],
    correctAnswer: 0,
    level: 'B1'
  },
  {
    id: 'b1-3',
    word: 'suggest',
    question: 'What does "suggest" mean?',
    options: ['To recommend', 'To shout', 'To borrow', 'To cancel'],
    correctAnswer: 0,
    level: 'B1'
  },
  {
    id: 'b1-4',
    word: 'schedule',
    question: 'What is a schedule?',
    options: ['A plan of activities and times', 'A type of food', 'A tool', 'A story'],
    correctAnswer: 0,
    level: 'B1'
  },
  {
    id: 'b1-5',
    word: 'environment',
    question: 'What does "environment" refer to?',
    options: ['The natural world around us', 'A book', 'A job', 'A machine'],
    correctAnswer: 0,
    level: 'B1'
  },
  {
    id: 'b2-1',
    word: 'analyze',
    question: 'What does "analyze" mean?',
    options: ['To examine in detail', 'To ignore', 'To decorate', 'To invent'],
    correctAnswer: 0,
    level: 'B2'
  },
  {
    id: 'b2-2',
    word: 'negotiate',
    question: 'What does "negotiate" mean?',
    options: ['To discuss to reach agreement', 'To celebrate', 'To ignore', 'To announce'],
    correctAnswer: 0,
    level: 'B2'
  },
  {
    id: 'b2-3',
    word: 'efficient',
    question: 'What does "efficient" mean?',
    options: ['Working well without waste', 'Very expensive', 'Slow', 'Weak'],
    correctAnswer: 0,
    level: 'B2'
  },
  {
    id: 'b2-4',
    word: 'reliable',
    question: 'What does "reliable" mean?',
    options: ['Able to be trusted', 'Always late', 'Very noisy', 'Tiny'],
    correctAnswer: 0,
    level: 'B2'
  },
  {
    id: 'b2-5',
    word: 'significant',
    question: 'What does "significant" mean?',
    options: ['Important or meaningful', 'Very small', 'Unrelated', 'Temporary'],
    correctAnswer: 0,
    level: 'B2'
  },
  {
    id: 'c1-1',
    word: 'coherent',
    question: 'What does "coherent" mean?',
    options: ['Clear and logical', 'Confusing', 'Rough', 'Hidden'],
    correctAnswer: 0,
    level: 'C1'
  },
  {
    id: 'c1-2',
    word: 'advocate',
    question: 'What does "advocate" mean?',
    options: ['To publicly support', 'To avoid', 'To repair', 'To soften'],
    correctAnswer: 0,
    level: 'C1'
  },
  {
    id: 'c1-3',
    word: 'meticulous',
    question: 'What does "meticulous" mean?',
    options: ['Very careful and precise', 'Lazy', 'Very fast', 'Very loud'],
    correctAnswer: 0,
    level: 'C1'
  },
  {
    id: 'c1-4',
    word: 'hypothesis',
    question: 'What is a hypothesis?',
    options: ['An idea to be tested', 'A final answer', 'A mistake', 'A purchase'],
    correctAnswer: 0,
    level: 'C1'
  },
  {
    id: 'c1-5',
    word: 'sustainable',
    question: 'What does "sustainable" mean?',
    options: ['Able to continue without harm', 'Temporary', 'Expensive', 'Uncertain'],
    correctAnswer: 0,
    level: 'C1'
  },
  {
    id: 'c2-1',
    word: 'ubiquitous',
    question: 'What does "ubiquitous" mean?',
    options: ['Present everywhere', 'Extremely rare', 'Uncertain', 'Dangerous'],
    correctAnswer: 0,
    level: 'C2'
  },
  {
    id: 'c2-2',
    word: 'quintessential',
    question: 'What does "quintessential" mean?',
    options: ['The most perfect example', 'Unclear', 'Unimportant', 'Temporary'],
    correctAnswer: 0,
    level: 'C2'
  },
  {
    id: 'c2-3',
    word: 'paradox',
    question: 'What is a paradox?',
    options: ['A statement that seems contradictory', 'A type of map', 'A device', 'A number'],
    correctAnswer: 0,
    level: 'C2'
  },
  {
    id: 'c2-4',
    word: 'elucidate',
    question: 'What does "elucidate" mean?',
    options: ['To make clear', 'To hide', 'To shorten', 'To confuse'],
    correctAnswer: 0,
    level: 'C2'
  },
  {
    id: 'c2-5',
    word: 'ambivalent',
    question: 'What does "ambivalent" mean?',
    options: ['Having mixed feelings', 'Very confident', 'Very calm', 'Very angry'],
    correctAnswer: 0,
    level: 'C2'
  }
];
