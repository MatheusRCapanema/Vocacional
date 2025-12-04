
export interface Question {
    id: string;
    text: string;
    dimension: string;
}

export interface Answer {
    question_id: string;
    score: number;
}

export interface RiasecScore {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
}

export interface Course {
    id: string;
    title: string;
    riasec_scores: RiasecScore;
    description: string;
    area: string;
    match_score: number;
}

export interface AssessmentResult {
    id?: number;
    user_scores: RiasecScore;
    top_courses: Course[];
    dominant_profile: string;
}
