from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from .database import Base

class AssessmentDB(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # RIASEC Scores
    score_r = Column(Float)
    score_i = Column(Float)
    score_a = Column(Float)
    score_s = Column(Float)
    score_e = Column(Float)
    score_c = Column(Float)
    
    dominant_profile = Column(String)
    
    # Store full answers as JSON for future recalibration
    answers_json = Column(JSON)
    
    # Store recommended courses IDs as JSON
    top_courses_json = Column(JSON)
    
    # User Feedback (1-5 stars) - Nullable initially
    user_rating = Column(Integer, nullable=True)
