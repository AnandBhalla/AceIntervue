export async function fetchQuestionsAndAnswersFromAPI(payload, backendUrl) {
  const response = await fetch(`${backendUrl}/generate-qna`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch interview questions');
  }

  const data = await response.json();
  return data;
}
