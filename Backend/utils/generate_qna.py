import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()


async def generate_qna(data):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = (
        f"You are an interviewer. Return {data.questionCount} questions and answers in JSON format with "
        f"fields 'question' and 'answer'. Base the questions on {data.domain} and the following tech stack: "
        f"{', '.join(data.techStack)}. Ensure that the conversation flows naturally, like saying: "
        "'So your first question is...', 'Moving forward...', and 'At last, I want to ask...'. "
        "Merge these elements in the 'question' field. Avoid hard coding values.\n"
        "The JSON format should look like this:\n"
        "[{\"question\": \"your question here\", \"answer\": \"your answer here\"}]\n"
        "Do not include any extra text, markdown, or formatting."
    )

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )

    raw_text = response.text.strip()

    try:
        qa_list = json.loads(raw_text)
        questions = [item["question"] for item in qa_list]
        answers = [item["answer"] for item in qa_list]
        return questions, answers
    except json.JSONDecodeError:
        raise ValueError("Response was not valid JSON:\n" + raw_text)
