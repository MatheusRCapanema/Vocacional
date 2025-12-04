import { useState } from 'react';
import { submitFeedback } from '../lib/api';
import { Star } from 'lucide-react';
import { AssessmentResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface ResultsProps {
    result: AssessmentResult;
    onRetry: () => void;
}

export default function Results({ result, onRetry }: ResultsProps) {
    const [rating, setRating] = useState(0);
    const [feedbackSent, setFeedbackSent] = useState(false);

    const handleRate = async (value: number) => {
        setRating(value);
        if (result.id) {
            await submitFeedback(result.id, value);
            setFeedbackSent(true);
        }
    };

    const data = [
        { subject: 'Realista', A: result.user_scores.R, fullMark: 5 },
        { subject: 'Investigativo', A: result.user_scores.I, fullMark: 5 },
        { subject: 'Artístico', A: result.user_scores.A, fullMark: 5 },
        { subject: 'Social', A: result.user_scores.S, fullMark: 5 },
        { subject: 'Empreendedor', A: result.user_scores.E, fullMark: 5 },
        { subject: 'Convencional', A: result.user_scores.C, fullMark: 5 },
    ];

    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Left Panel: Profile & Chart */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full md:w-1/2 h-full p-6 flex flex-col justify-center items-center bg-white dark:bg-gray-800 shadow-xl z-10 relative"
            >
                <div className="text-center mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Seu Perfil Vocacional</h1>
                    <p className="text-xl text-blue-600 font-semibold">Código: {result.dominant_profile}</p>
                </div>

                <div className="h-[300px] md:h-[400px] w-full max-w-lg mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                            <Radar
                                name="Você"
                                dataKey="A"
                                stroke="#2563eb"
                                strokeWidth={3}
                                fill="#3b82f6"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Feedback Section */}
                <div className="mb-6 text-center">
                    {!feedbackSent ? (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Esse resultado faz sentido?</p>
                            <div className="flex gap-1 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        className={`transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                                    >
                                        <Star fill="currentColor" size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-green-600 text-sm font-medium animate-pulse">Obrigado pelo feedback!</p>
                    )}
                </div>

                <button
                    onClick={onRetry}
                    className="text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                    Refazer Teste
                </button>
            </motion.div>

            {/* Right Panel: Recommended Courses */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 md:p-12 bg-gray-50 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl mx-auto space-y-8 pb-12"
                >
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Cursos Recomendados</h2>
                        <p className="text-gray-600 dark:text-gray-400">Com base no seu perfil, estas graduações são as mais compatíveis:</p>
                    </div>

                    <div className="space-y-4">
                        {result.top_courses.map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h3>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                                            {course.area}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm font-bold">
                                        {Math.round(course.match_score * 100)}%
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{course.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
