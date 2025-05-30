from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, EmailStr, Field, validator
from bson import ObjectId
from enum import Enum

class UserModel(str, Enum):
    free = "free"
    premium = "premium"
    enterprise = "enterprise"

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel):
    email: EmailStr
    name: str
    model: UserModel = UserModel.free

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    password: str
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserOut(UserBase):
    _id: str  # MongoDB _id as string
    is_verified: bool
    created_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str

class TokenData(BaseModel):
    id: Optional[str] = None

class Domain(BaseModel):
    domain: str
    techStacks: List[str]

class QnARequest(BaseModel):
    domain: str  # Interview domain (e.g., frontend, backend, etc.)
    techStack: List[str]  # List of technologies used (e.g., ["React", "Node.js"])
    questionCount: int  # Number of questions to generate
    interviewMode: str  # Mode of interview 
    interviewType: str  
    interviewerName: str  # Interviewer's gender or identifier
    user: str  # User's identifier or name

class QnAResponse(BaseModel):
    questions: List[str]
    answers: List[str]

class Interview(BaseModel):
    userid: str
    questions: List[str]
    answers: List[str]
    candanswers: List[str]
    result: Optional[Dict] = {}

@property
def question_count(self) -> int:
    return self.questionCount

class EvaluateReq(BaseModel):
    questions: List[str]
    answers: List[str]
    candidateAnswers: List[str]
    techStack: List[str]
    domain: str
    user: str

class EvaluateRes(BaseModel):
    results: Dict[str, Any]