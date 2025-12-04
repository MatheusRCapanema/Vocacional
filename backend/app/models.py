from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class Question(BaseModel):
    id: str
    text: str
    dimension: str

class Answer(BaseModel):
    question_id: str
    score: int = Field(..., ge=1, le=5)  # 1-5

class UserResponse(BaseModel):
    answers: List[Answer]

class RiasecScore(BaseModel):
    R: float
    I: float
    A: float
    S: float
    E: float
    C: float

class Course(BaseModel):
    id: str
    title: str
    riasec_scores: Dict[str, float]
    description: str
    area: str
    match_score: Optional[float] = 0.0

class AssessmentResult(BaseModel):
    id: Optional[int] = None
    user_scores: RiasecScore
    top_courses: List[Course]
    dominant_profile: str
