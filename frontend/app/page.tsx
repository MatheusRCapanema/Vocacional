'use client';

import { useEffect, useState } from 'react';
import { getQuestions, submitAssessment } from './lib/api';
import { Question, Answer, AssessmentResult } from './types';
import Assessment from './components/Assessment';
import Results from './components/Results';
import { Loader2, BrainCircuit } from 'lucide-react';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleComplete = async (answers: Answer[]) => {
    setSubmitting(true);
    try {
      const res = await submitAssessment(answers);
      setResult(res);
    } catch (e) {
      console.error(e);
      alert('Erro ao processar resultados. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (result) {
    return <Results result={result} onRetry={() => { setResult(null); setStarted(false); }} />;
  }

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-center max-w-2xl">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-8">
            <BrainCircuit className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Descubra sua Vocação <span className="text-blue-600">Cientificamente</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Utilizamos o modelo RIASEC e algoritmos avançados para conectar seu perfil comportamental
            às <strong>graduações</strong> ideais para o seu futuro.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Iniciar Avaliação
          </button>
          <p className="mt-6 text-sm text-gray-400">
            Tempo estimado: 10-15 minutos • Baseado em Ciência de Dados
          </p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Analisando seu perfil...</p>
        <p className="text-sm text-gray-500 mt-2">Encontrando as melhores graduações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Assessment questions={questions} onComplete={handleComplete} />
    </div>
  );
}
