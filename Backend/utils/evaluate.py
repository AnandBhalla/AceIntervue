import os
import ast
import re
import json
import google.generativeai as genai
from typing import Dict

def clean_and_parse(s: str):
    cleaned = re.sub(r"```(?:json)?\s*", "", s)
    cleaned = re.sub(r"```", "", cleaned)
    cleaned = cleaned.strip()
    m = re.search(r"(\[ *\[\s*.*?\]\s*(,\s*\[.*?\]\s*)*\])", cleaned, re.DOTALL)
    candidate = m.group(1) if m else cleaned
    try:
        return json.loads(candidate)
    except:
        return ast.literal_eval(candidate)

def evaluate(data: Dict) -> Dict[str, float]:
    answers = data.get("answers", [])
    candidate_answers = data.get("candidateAnswers", [])
    api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')

    prompt = (
        "You are an interview conversation analyser. "
        "You will be provided with the expected answers and the candidate's answers. "
        "Your task is to return a list of lists in the following format:\n"
        "[[score_set_for_q1], [score_set_for_q2], ...]\n\n"
        "Each inner list should contain scores for the corresponding question plus a short advice string. "
        "All scores must be integers between 0 and 10, where 10 is best. "
        "The sequence of judgement criteria for each question is strictly:\n"
        "1. Accuracy (content matching)\n"
        "2. Grammar\n"
        "3. Repetition\n"
        "4. Filler Words\n"
        "5. moral_scores\n"
        "6. Soft Skills\n\n"
        "7th element of each inner list should be a brief AI advice string for that question.\n"
        "Example: [[10,8,9,7,10,9,'Clarify your example'], [...], ...]\n\n"
        f"Expected answers: {answers}\n"
        f"Candidate answers: {candidate_answers}\n"
        "Do not add any extra explanation; output exactly the list of lists."
    )

    response = model.generate_content(prompt)
    raw_text = response.candidates[0].content.parts[0].text.strip()
    per_q_scores = clean_and_parse(raw_text)
    if not isinstance(per_q_scores, list):
        per_q_scores = []

    accuracy_scores = []
    grammar_scores = []
    repetition_scores = []
    filler_scores = []
    moral_scores = []
    softskils_scores = []
    question_advices = []
    question_scores = []

    def safe_int(x):
        try:
            return int(x)
        except:
            return 0

    for item in per_q_scores:
        if not (isinstance(item, list) and len(item) >= 7):
            continue
        accuracy = safe_int(item[0])
        grammar = safe_int(item[1])
        repetition = safe_int(item[2])
        filler = safe_int(item[3])
        moral = safe_int(item[4])
        soft = safe_int(item[5])
        advice = str(item[6])

        accuracy_scores.append(accuracy)
        grammar_scores.append(grammar)
        repetition_scores.append(repetition)
        filler_scores.append(filler)
        moral_scores.append(moral)
        softskils_scores.append(soft)
        question_advices.append(advice)

        question_scores.append({
            "accuracy": accuracy,
            "grammar": grammar,
            "repetition": repetition,
            "filler_words": filler,
            "moral_score": moral,
            "soft_skill_score": soft,
            "ai_suggestion": advice,
        })

    return {
        "accuracy_scores": accuracy_scores,
        "grammar_scores": grammar_scores,
        "repetition_scores": repetition_scores,
        "filler_scores": filler_scores,
        "moral_scores": moral_scores,
        "softskils_scores": softskils_scores,
        "question_advices": question_advices,
        "question_scores": question_scores,
    }
