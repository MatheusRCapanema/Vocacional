from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from typing import List
from app.models import Question, UserResponse, AssessmentResult
from app.services import calculate_riasec_scores, find_top_courses, get_dominant_profile
from app.database import engine, get_db, Base
from app.sql_models import AssessmentDB

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vocational Assessment API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Vocational Assessment API is running"}

@app.get("/questions", response_model=List[Question])
def get_questions():
    try:
        with open("app/data/questions.json", "r", encoding="utf-8") as f:
            questions = json.load(f)
        return questions
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Questions file not found")

@app.post("/submit", response_model=AssessmentResult)
def submit_assessment(response: UserResponse, db: Session = Depends(get_db)):
    # Calculate RIASEC scores
    scores = calculate_riasec_scores(response.answers)
    
    # Find top courses
    top_courses = find_top_courses(scores)
    
    # Determine dominant profile
    dominant_profile = get_dominant_profile(scores)
    
    # Save to Database
    db_assessment = AssessmentDB(
        score_r=scores.R,
        score_i=scores.I,
        score_a=scores.A,
        score_s=scores.S,
        score_e=scores.E,
        score_c=scores.C,
        dominant_profile=dominant_profile,
        answers_json=[a.dict() for a in response.answers],
        top_courses_json=[c.dict() for c in top_courses]
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    
    return AssessmentResult(
        id=db_assessment.id,
        user_scores=scores,
        top_courses=top_courses,
        dominant_profile=dominant_profile
    )

@app.post("/feedback/{assessment_id}")
def submit_feedback(assessment_id: int, rating: int, db: Session = Depends(get_db)):
    if not (1 <= rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
    assessment = db.query(AssessmentDB).filter(AssessmentDB.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    assessment.user_rating = rating
    db.commit()
    
    return {"message": "Feedback received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
