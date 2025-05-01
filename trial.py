import google.generativeai as genai

data = {
    "domain": "web development",
    "techStack": ["React", "Node.js", "MongoDB"],
    "questionCount": 3
}

def generate_qna(data):
    api_key = "AIzaSyDmU1KbqQ2Twy9DXkBHsyN0apKAvcA2BHQ"
    genai.configure(api_key=api_key)
    
    model = genai.GenerativeModel('gemini-2.0-flash')

    prompt = (
        f"You are an interviewer. Return {data['questionCount']} questions and answers in JSON format with "
        f"fields 'question' and 'answer'. Base the questions on {data['domain']} and the following tech stack: "
        f"{', '.join(data['techStack'])}. Use phrases like: 'So your first question is...', "
        "'Moving forward...', and 'At last, I want to ask...'. Merge these into the question.\n"
        "Respond only in JSON format like: "
        "{{'question': '...', 'answer': '...'}} with no extra text or formatting."
    )

    response = model.generate_content(prompt)
    print(response.text)

generate_qna(data)
