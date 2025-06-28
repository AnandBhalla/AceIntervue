from typing import Dict, List
from collections import Counter
import re
import requests
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import ast

# Setup
# nltk.download('punkt')
# nltk.download('stopwords')

model = SentenceTransformer('all-MiniLM-L6-v2')
FILLERS = {"um", "uh", "like", "you know", "so", "actually", "basically", "i mean", "well"}

def evaluate(data: Dict) -> Dict[str, float]:
    questions = data["questions"]
    answers = data["answers"]
    candidate_answers = data["candidateAnswers"]

    grammar_scores = []
    filler_scores = []
    repetition_scores = []
    accuracy_scores = []

    for ca, ref in zip(candidate_answers, answers):
        grammar_scores.append(score_grammar(ca))
        filler_scores.append(score_filler_words(ca))
        repetition_scores.append(score_repetition(ca))
        accuracy_scores.append(score_content_accuracy(ca, ref))

    grammar_score=round(avg(grammar_scores), 2)
    filler_words_score=round(avg(filler_scores), 2)
    repetition_score=round(avg(repetition_scores), 2)
    content_accuracy_score=round(avg(accuracy_scores), 2)
    overall_score=(round((grammar_score+filler_words_score+repetition_score+content_accuracy_score)/4))*10
    ai_advice,tips=generate_summary(grammar_score,filler_words_score,repetition_score,content_accuracy_score,overall_score)
    print(tips)
    print(type(tips))
    return {
        "grammar_score": grammar_score*10,
        "filler_words_score": filler_words_score*10,
        "repetition_score": repetition_score*10,
        "content_accuracy_score": content_accuracy_score*10,
        "overall_score":overall_score,
        "ai_advice":ai_advice,
        "tips":tips,
    }

def avg(lst):
    return sum(lst) / len(lst) if lst else 0

# Grammar scoring using LanguageTool public API
def score_grammar(text: str) -> float:
    try:
        res = requests.post(
            "https://api.languagetool.org/v2/check",
            data={"text": text, "language": "en-US"}
        )
        matches = res.json().get("matches", [])
        error_count = len(matches)
        word_count = len(text.split())

        # print(error_count)
        if word_count == 0:
            return 10.0
        errors_per_100 = (error_count / word_count) * 100
        if errors_per_100 <= 2:
            return 10
        elif errors_per_100 <= 5:
            return 8
        elif errors_per_100 <= 10:
            return 6
        elif errors_per_100 <= 15:
            return 4
        else:
            return 2
    except Exception:
        return 0  # fallback score on API failure




# Filler word scoring
def score_filler_words(text: str) -> float:
    words = word_tokenize(text.lower())
    filler_count = sum(1 for word in words if word in FILLERS)
    ratio = filler_count / max(1, len(words))

    if ratio <= 0.01:
        return 10
    elif ratio <= 0.03:
        return 8
    elif ratio <= 0.05:
        return 6
    elif ratio <= 0.08:
        return 4
    else:
        return 2

# Word repetition scoring
def score_repetition(text: str) -> float:
    words = word_tokenize(text.lower())
    words = [w for w in words if w not in stopwords.words("english") and w.isalpha()]
    word_freq = Counter(words)
    repeated = sum(1 for count in word_freq.values() if count > 1)
    ratio = repeated / max(1, len(words))

    if ratio <= 0.03:
        return 10
    elif ratio <= 0.05:
        return 8
    elif ratio <= 0.08:
        return 6
    elif ratio <= 0.1:
        return 4
    else:
        return 2

# Semantic content similarity
def score_content_accuracy(candidate: str, reference: str) -> float:
    # if(candidate==""):   
    #     return 0
    embedding1 = model.encode(candidate, convert_to_tensor=True)
    embedding2 = model.encode(reference, convert_to_tensor=True)
    similarity = util.cos_sim(embedding1, embedding2).item()

    if similarity > 0.9:
        return 10
    elif similarity > 0.75:
        return 8
    elif similarity > 0.6:
        return 6
    elif similarity > 0.4:
        return 4
    else:
        return 2

def generate_summary(grammar_score,filler_words_score,repetition_score,content_accuracy_score,overall_score):
    api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = (
        "You are given scores of an interview generate an advice based on that how to improve and what to work upon. If everything seems perfect praise the candidate."
        f"grammar accuracy: {grammar_score}, filler words: {filler_words_score}, repetition of words: {repetition_score}, content accuracy: {content_accuracy_score}, overall score: {overall_score}"
        "give 3 lines as a paragraph and 5 points of improvement starting with exact heading as :`tips`. followed by a json like list in format {'','',''...}"
        "Do not include any additional text, commentary, or formatting like bold, italics, etc."
    )
    response = model.generate_content(prompt)
    raw_text = response.candidates[0].content.parts[0].text
    # cleaned = raw_text.strip().removeprefix("```json").removesuffix("```").strip()
    tips = extract_tips(raw_text)
    # print(tips)
    return raw_text,tips

def extract_tips(raw_text):
    # Find the line starting with 'tips'
    match = re.search(r"tips\s*:\s*(\{.*?\})", raw_text, re.DOTALL)
    if match:
        tips_str = match.group(1)
        try:
            tips_list = ast.literal_eval(tips_str)
            return list(tips_list)
        except Exception as e:
            print("Error parsing tips:", e)
    return []