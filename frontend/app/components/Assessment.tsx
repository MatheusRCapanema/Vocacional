'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Answer } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface AssessmentProps {
    questions: Question[];
    onComplete: (answers: Answer[]) => void;
}

export default function Assessment({ questions, onComplete }: AssessmentProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    const handleOptionSelect = (score: number) => {
        setSelectedOption(score);
        // Auto advance after a short delay for better flow, or require next button?
        // Let's require Next button for explicit confirmation, or auto-advance if it feels snappy.
        // User requested "Scientific", so maybe explicit is better to avoid misclicks.
        // But "avoid fatigue" suggests speed. Let's do auto-advance with a small delay.

        setTimeout(() => {
            handleNext(score);
        }, 300);
    };

    const handleNext = (score: number) => {
        const newAnswers = [...answers, { question_id: currentQuestion.id, score }];
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(newAnswers);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-right">
                    Questão {currentIndex + 1} de {questions.length}
                </p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 leading-relaxed">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-5 gap-4 mt-8">
                        {[1, 2, 3, 4, 5].map((score) => (
                            <button
                                key={score}
                                onClick={() => handleOptionSelect(score)}
                                className={`
                  flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
                  ${selectedOption === score
                                        ? 'bg-blue-600 text-white scale-105 shadow-lg ring-2 ring-blue-300'
                                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 hover:scale-105'}
                `}
                            >
                                <span className="text-xl font-bold mb-1">{score}</span>
                                <span className="text-xs text-center font-medium opacity-80">
                                    {score === 1 ? 'Odeio' :
                                        score === 2 ? 'Não Gosto' :
                                            score === 3 ? 'Indiferente' :
                                                score === 4 ? 'Gosto' : 'Amo'}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
