# import os
# import ast
# import re
# import google.generativeai as genai
# from typing import Dict, List

# def evaluate(data: Dict) -> Dict[str, float]:
#     """
#     Uses the Gemini model to get per-question scores and advice, then
#     aggregates into the same return schema as the earlier evaluate function.
#     """
#     answers = data.get("answers", [])
#     candidate_answers = data.get("candidateAnswers", [])

#     # Configure Gemini
#     api_key = os.getenv("GOOGLE_API_KEY")
#     genai.configure(api_key=api_key)
#     model = genai.GenerativeModel('gemini-2.0-flash')

#     # Prompt asking for per-question score sets and advice
#     prompt = (
#         "You are an interview conversation analyser. "
#         "You will be provided with the expected answers and the candidate's answers. "
#         "Your task is to return a list of lists in the following format:\n"
#         "[[score_set_for_q1], [score_set_for_q2], ...]\n\n"
#         "Each inner list should contain scores for the corresponding question plus a short advice string. "
#         "All scores must be integers between 0 and 10, where 10 is best. "
#         "The sequence of judgement criteria for each question is strictly:\n"
#         "1. Accuracy (content matching)\n"
#         "2. Grammar\n"
#         "3. Repetition (penalize repeated words)\n"
#         "4. Filler Words (penalize use of words like 'um', 'uh', 'actually')\n"
#         "5. Morals (word sensitivity/respectfulness/honesty)\n"
#         "6. Soft Skills (leadership, teamwork, effort, etc.)\n\n"
#         "7th element of each inner list should be a brief AI advice string for that question.\n"
#         "Example: [[10,8,9,7,10,9,'Clarify your example'], [...], ...]\n\n"
#         f"Expected answers: {answers}\n"
#         f"Candidate answers: {candidate_answers}\n"
#         "Do not add any extra explanation; output exactly the list of lists."
#     )
#     try:
#         response = model.generate_content(prompt)
#         raw_text = response.candidates[0].content.parts[0].text.strip()
#     except Exception:
#         raw_text = ""

#     # Try to extract the list-of-lists from raw_text
#     per_q_scores: List[List] = []
#     ai_advice_list: List[str] = []
#     grammar_scores = []
#     filler_scores = []
#     repetition_scores = []
#     accuracy_scores = []

#     def safe_int(x):
#         try:
#             return int(x)
#         except:
#             return 0

#     parsed = False
#     try:
#         # Attempt to locate first bracketed list structure
#         match = re.search(r"(\[ *\[\s*.*\]\s*(,\s*\[.*\]\s*)*\])", raw_text, re.DOTALL)
#         if match:
#             list_str = match.group(1)
#         else:
#             list_str = raw_text  # fallback to whole text

#         per_q_scores = ast.literal_eval(list_str)
#         if isinstance(per_q_scores, list):
#             for item in per_q_scores:
#                 if not (isinstance(item, list) and len(item) >= 7):
#                     continue  # skip malformed
#                 acc = safe_int(item[0])
#                 gram = safe_int(item[1])
#                 rep = safe_int(item[2])
#                 fill = safe_int(item[3])
#                 advice = str(item[6])
#                 accuracy_scores.append(acc)
#                 grammar_scores.append(gram)
#                 repetition_scores.append(rep)
#                 filler_scores.append(fill)
#                 ai_advice_list.append(advice)
#             parsed = True
#     except Exception:
#         parsed = False

#     # Fallback: if parsing failed or no data, default to zeros
#     if not parsed or not accuracy_scores:
#         # fallback uniform zeros
#         grammar_score = 0.0
#         filler_words_score = 0.0
#         repetition_score = 0.0
#         content_accuracy_score = 0.0
#         overall_score = 0
#         ai_advice = "Could not parse model output; please retry." if raw_text else "Model failed to respond."
#         tips = []
#     else:
#         def avg(lst):
#             return sum(lst) / len(lst) if lst else 0

#         grammar_score = round(avg(grammar_scores), 2)
#         filler_words_score = round(avg(filler_scores), 2)
#         repetition_score = round(avg(repetition_scores), 2)
#         content_accuracy_score = round(avg(accuracy_scores), 2)
#         overall_score = (round((grammar_score + filler_words_score + repetition_score + content_accuracy_score) / 4)) * 10
#         ai_advice = " | ".join(ai_advice_list)  # combine per-question advice
#         tips = ai_advice_list  # expose list as tips
#         print(grammar_score,fi)
#     return {
#         "grammar_score": grammar_score * 10,
#         "filler_words_score": filler_words_score * 10,
#         "repetition_score": repetition_score * 10,
#         "content_accuracy_score": content_accuracy_score * 10,
#         "overall_score": overall_score,
#         "ai_advice": ai_advice,
#         "tips": tips,
#     }