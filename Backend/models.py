from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, EmailStr, Field, validator
from pydantic_settings import BaseSettings
from pydantic.json_schema import JsonSchemaValue
from pydantic import GetJsonSchemaHandler
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
    def __get_pydantic_json_schema__(cls, schema: JsonSchemaValue, handler: GetJsonSchemaHandler) -> JsonSchemaValue:
        return {"type": "string", "pattern": "^[a-fA-F0-9]{24}$"}

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
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserOut(UserBase):
    _id: str
    is_verified: bool
    created_at: datetime

    class Config:
        populate_by_name = True
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

class InterviewResponse(BaseModel):
    techStack: List[str]
    domain: str
    result: dict   

class QnARequest(BaseModel):
    domain: str
    techStack: List[str]
    questionCount: int
    interviewMode: str
    interviewType: str
    interviewerName: str
    user: str

    @property
    def question_count(self) -> int:
        return self.questionCount

class QnAResponse(BaseModel):
    questions: List[str]
    answers: List[str]

class Interview(BaseModel):
    userid: str
    questions: List[str]
    answers: List[str]
    candanswers: List[str]
    result: Optional[Dict] = {}

class EvaluateReq(BaseModel):
    questions: List[str]
    answers: List[str]
    candidateAnswers: List[str]
    techStack: List[str]
    domain: str
    user: str

class EvaluateRes(BaseModel):
    results: Dict[str, Any]

