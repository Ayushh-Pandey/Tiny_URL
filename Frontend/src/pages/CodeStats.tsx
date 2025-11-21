import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';

export default function CodeStats() {
  const { code } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    client.get(`/links/${code}`).then(r => setData(r.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [code]);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Not found. <Link to="/">Back</Link></div>;

  const shortUrl = `${window.location.origin}/${code}`;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to Dashboard</Link>
      </div>

      <div className="bg-white p-6 rounded border shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Link Statistics</h2>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2">
            <span className="font-medium min-w-[120px]">Short Code:</span>
            <span className="text-gray-700">{code}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-medium min-w-[120px]">Short URL:</span>
            <div className="flex items-center gap-2">
              <a className="text-blue-600 hover:underline break-all" href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
              <button
                onClick={() => copyToClipboard(shortUrl)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                title="Copy short URL"
              >
                📋
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-medium min-w-[120px]">Target URL:</span>
            <a
              href={data.target_url}
              target="_blank"
              className="text-blue-600 hover:underline break-all"
              title={data.target_url}
            >
              {data.target_url}
            </a>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-medium min-w-[120px]">Total Clicks:</span>
            <span className="text-gray-700">{data.clicks}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-medium min-w-[120px]">Last Clicked:</span>
            <span className="text-gray-700">{data.last_clicked ? new Date(data.last_clicked).toLocaleString() : '—'}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-medium min-w-[120px]">Created:</span>
            <span className="text-gray-700">{new Date(data.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Recent Clicks (up to 50)</h3>

          {data.recent_clicks.length === 0 ? (
            <div className="text-gray-500 text-sm">No clicks yet</div>
          ) : (
            <div className="border rounded overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Timestamp</th>
                    <th className="text-left px-4 py-2 font-medium">IP Address</th>
                    <th className="text-left px-4 py-2 font-medium">User Agent</th>
                    <th className="text-left px-4 py-2 font-medium">Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_clicks.map((c: any, i: number) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {c.ip || '—'}
                      </td>
                      <td className="px-4 py-2 text-gray-600 truncate max-w-xs" title={c.user_agent}>
                        {c.user_agent || '—'}
                      </td>
                      <td className="px-4 py-2 text-gray-600 truncate max-w-xs" title={c.referrer}>
                        {c.referrer || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
