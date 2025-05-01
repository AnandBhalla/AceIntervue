import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

async def generate_qna(data):
    api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=api_key)
    
    model = genai.GenerativeModel('gemini-2.0-flash')

    prompt = (
        f"You are an interviewer. Return {data.questionCount} questions and answers in JSON format with "
        f"fields 'question' and 'answer'. Base the questions on {data.domain} and the following tech stack: "
        f"{', '.join(data.techStack)}. Ensure that the conversation flows naturally, like saying: "
        "'So your first question is...', 'Moving forward...', and 'At last, I want to ask...'. "
        "Merge these elements in the 'question' field. Avoid hard coding values.\n"
        "The JSON format should look like this: "
        "[{{'question': 'your question here', 'answer': 'your answer here'}}].\n"
        "Do not include any additional text, commentary, or formatting like bold, italics, etc."
    )

    response = model.generate_content(prompt)
    raw_text = response.candidates[0].content.parts[0].text
    cleaned = raw_text.strip().removeprefix("```json").removesuffix("```").strip()

    try:
        qa_list = json.loads(cleaned)
        questions = [item['question'] for item in qa_list]
        answers = [item['answer'] for item in qa_list]
        return questions, answers
    except json.JSONDecodeError:
        raise ValueError("Response was not valid JSON:\n" + cleaned)
