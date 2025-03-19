import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateSQLQuery(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a SQL expert. Convert the following English question into a PostgreSQL query. The database has these tables:\n\ncategories(id, name, description)\nproducts(id, name, description, price, category_id)\n\nRespond ONLY with the SQL query, no explanation."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0,
    });

    return response.choices[0].message.content || '';
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later or check your API quota.');
    }
    throw error;
  }
}