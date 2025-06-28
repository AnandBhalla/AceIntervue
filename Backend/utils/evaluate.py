from typing import Dict, List
from collections import Counter
import re
import requests
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sentence_transformers import SentenceTransformer, util

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

    return {
        "grammar": round(avg(grammar_scores), 2),
        "filler_words": round(avg(filler_scores), 2),
        "repetition": round(avg(repetition_scores), 2),
        "content_accuracy": round(avg(accuracy_scores), 2),
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
        return 5.0  # fallback score on API failure




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
