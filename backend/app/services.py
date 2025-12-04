import json
import math
from typing import List, Dict
from app.models import Answer, RiasecScore, Course

def load_courses():
    with open("app/data/courses.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return [Course(**p) for p in data]

def calculate_riasec_scores(answers: List[Answer]) -> RiasecScore:
    scores = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}
    counts = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}
    
    # Map question ID to dimension (assuming we have this mapping or can infer it)
    # For MVP, we'll assume the question ID starts with the dimension letter (e.g., R1, I2)
    
    for answer in answers:
        dimension = answer.question_id[0]
        # Handle cases like R10 (first char is R)
        if len(answer.question_id) > 1 and answer.question_id[0] in scores:
             dimension = answer.question_id[0]

        if dimension in scores:
            scores[dimension] += answer.score
            counts[dimension] += 1
            
    final_scores = {}
    for dim in scores:
        if counts[dim] > 0:
            final_scores[dim] = scores[dim] / counts[dim]
        else:
            final_scores[dim] = 0.0
            
    return RiasecScore(**final_scores)

def calculate_cosine_similarity(vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
    dot_product = sum(vec1[d] * vec2[d] for d in vec1)
    magnitude1 = math.sqrt(sum(v**2 for v in vec1.values()))
    magnitude2 = math.sqrt(sum(v**2 for v in vec2.values()))
    
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
        
    return dot_product / (magnitude1 * magnitude2)

def find_top_courses(user_scores: RiasecScore, limit: int = 5) -> List[Course]:
    courses = load_courses()
    user_vector = user_scores.dict()
    
    scored_courses = []
    for course in courses:
        similarity = calculate_cosine_similarity(user_vector, course.riasec_scores)
        course.match_score = similarity
        scored_courses.append(course)
        
    # Sort by match score descending
    scored_courses.sort(key=lambda x: x.match_score, reverse=True)
    
    return scored_courses[:limit]

def get_dominant_profile(scores: RiasecScore) -> str:
    # Return the top 3 letters, e.g., "SEC"
    sorted_scores = sorted(scores.dict().items(), key=lambda x: x[1], reverse=True)
    return "".join([item[0] for item in sorted_scores[:3]])
