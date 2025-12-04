import { Question, Answer, AssessmentResult } from '../types';

const API_URL = 'http://localhost:8000';

export async function getQuestions(): Promise<Question[]> {
    const res = await fetch(`${API_URL}/questions`);
    if (!res.ok) throw new Error('Failed to fetch questions');
    return res.json();
}

export async function submitAssessment(answers: Answer[]): Promise<AssessmentResult> {
    const res = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
}

export async function submitFeedback(assessmentId: number, rating: number): Promise<void> {
    await fetch(`${API_URL}/feedback/${assessmentId}?rating=${rating}`, {
        method: 'POST',
    });
}
