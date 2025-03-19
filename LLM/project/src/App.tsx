import React, { useState } from 'react';
import { Search, Database, Loader2, RefreshCcw, Trash2 } from 'lucide-react';
import { generateSQLQuery } from './lib/openai';
import { supabase } from './lib/supabase';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ question: string; response: any }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const sqlQuery = await generateSQLQuery(question);
      const { data, error: queryError } = await supabase.rpc('execute_query', { query_text: sqlQuery });

      if (queryError) throw queryError;
      setResult(data);
      setHistory((prev) => [{ question, response: data }, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Natural Language Database Query</h1>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-red-600 hover:text-red-800 flex items-center">
              <Trash2 className="w-5 h-5 mr-1" /> Clear History
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the data..."
              className="w-full px-4 py-3 pr-12 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Query Result</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Query History</h3>
            <ul className="space-y-2">
              {history.map((entry, index) => (
                <li key={index} className="p-3 bg-white shadow rounded-lg border">
                  <p className="text-gray-800 font-medium">{entry.question}</p>
                  <pre className="text-sm text-gray-600 bg-gray-100 p-2 rounded-lg overflow-x-auto mt-1">
                    {JSON.stringify(entry.response, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
