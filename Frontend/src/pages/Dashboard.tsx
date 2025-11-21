import { useEffect, useState } from "react";
import client from "../api/client";
import { Link, useNavigate } from "react-router-dom";

type LinkItem = {
  slug: string;
  target_url: string;
  title?: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
};

type SortField = 'slug' | 'target_url' | 'clicks' | 'last_clicked' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function Dashboard() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [query, setQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdLink, setCreatedLink] = useState<LinkItem | null>(null);

  // Get the base URL for short links (use current domain in production)
  const BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'production' ? window.location.origin : 'http://localhost:4000');


  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await client.get("/links");
      setLinks(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const validate = () => {
    if (!url.trim()) return "Destination URL is required";

    if (!url.startsWith("http://") && !url.startsWith("https://"))
      return "URL must start with http:// or https://";

    if (customCode.trim() && !/^[A-Za-z0-9]{6,8}$/.test(customCode.trim()))
      return "Custom code must be 6-8 alphanumeric characters [A-Za-z0-9]{6,8}";

    return "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setCreating(true);

    try {
      let linkTitle = title.trim();
      if (!linkTitle) {
        try {
          linkTitle = new URL(url).hostname.replace("www.", "");
        } catch {
          linkTitle = "";
        }
      }

      const res = await client.post("/links", {
        target_url: url.trim(),
        customCode: customCode.trim() || undefined,
        title: linkTitle || undefined,
      });

      setLinks((prev) => [res.data, ...prev]);

      setUrl("");
      setCustomCode("");
      setTitle("");
      setShowForm(false);

      setCreatedLink(res.data);
      setShowSuccessModal(true);

    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const deleteLink = async (slug: string) => {
    if (!confirm("Delete this link?")) return;
    try {
      await client.delete(`/links/${slug}`);
      setLinks((prev) => prev.filter((l) => l.slug !== slug));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = links.filter((l) => {
    return (
      l.slug.toLowerCase().includes(query.toLowerCase()) ||
      l.target_url.toLowerCase().includes(query.toLowerCase())
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'last_clicked') {
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (sortField === 'created_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });


  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tiny URL</h1>

        <div className="flex gap-3">
          <a
            href={`${BASE_URL}/healthz`}
            target="_blank"
            className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
          >
            Health Check
          </a>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Create Link
          </button>

        </div>
      </div>

      <div className="flex items-center gap-2 border px-3 py-2 rounded w-full max-w-sm mb-6 bg-white">
        <span className="text-gray-500">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search links..."
          className="w-full text-sm outline-none"
        />
      </div>

{showForm && (
  <div className="bg-white border rounded p-5 mb-6">

    <h2 className="text-lg font-medium mb-4">Create a new link</h2>

    {error && (
      <div className="text-red-600 text-sm mb-2">{error}</div>
    )}

    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Destination URL *</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Custom Code (optional)</label>
        <input
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="yourcode"
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">6-8 alphanumeric characters</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Title (optional)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Blog Page"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={creating}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {creating ? "Creating..." : "Create"}
      </button>
      <button
        type="button"
        className="px-4 py-2 ml-3 bg-white text-black text-sm rounded border hover:bg-red-600 hover:text-white"
        onClick={() => setShowForm(false)}
      >
        Cancel
      </button>
    </form>
  </div>
)}

      {loading && (
        <div className="text-gray-600 text-sm">Loading links…</div>
      )}

      {!loading && sorted.length === 0 && (
        <div className="text-gray-600 text-sm">No links found.</div>
      )}

      {!loading && sorted.length > 0 && (
        <div className="bg-white border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('slug')}
                >
                  <div className="flex items-center gap-2">
                    Short Code
                    {sortField === 'slug' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('target_url')}
                >
                  <div className="flex items-center gap-2">
                    Target URL
                    {sortField === 'target_url' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('clicks')}
                >
                  <div className="flex items-center gap-2">
                    Total Clicks
                    {sortField === 'clicks' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('last_clicked')}
                >
                  <div className="flex items-center gap-2">
                    Last Clicked
                    {sortField === 'last_clicked' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((l) => {
                const shortUrl = `${BASE_URL}/${l.slug}`;

                return (
                  <tr key={l.slug} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={shortUrl}
                          rel="noreferrer"
                          target="_blank"
                          className="text-blue-600 font-medium hover:underline"
                          title={shortUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(shortUrl, '_blank');
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          }}
                        >
                          {l.slug}
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shortUrl);
                            alert("Copied!");
                          }}
                          title="Copy short URL"
                          className="p-1 rounded hover:bg-gray-200 text-gray-600 flex-shrink-0"
                        >
                          📋
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <a
                        href={l.target_url}
                        target="_blank"
                        className="text-blue-600 hover:underline truncate block max-w-xs"
                        title={l.target_url}
                      >
                        {l.target_url}
                      </a>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {l.clicks}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {l.last_clicked
                        ? new Date(l.last_clicked).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/code/${l.slug}`}
                          className="px-3 py-1 text-xs border rounded hover:bg-gray-100 text-gray-700"
                        >
                          Stats
                        </Link>
                        <button
                          onClick={() => deleteLink(l.slug)}
                          className="px-3 py-1 text-xs border rounded text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showSuccessModal && createdLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Link Created!</h2>
              <p className="text-gray-600 text-sm mb-4">Your short URL is ready</p>

              <div className="bg-gray-100 p-3 rounded mb-6 break-all">
                <a
                  href={`${BASE_URL}/${createdLink.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-mono"
                >
                  {`${BASE_URL}/${createdLink.slug}`}
                </a>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate(`/code/${createdLink.slug}`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Stats
                </button>

                <button
                  onClick={() => {
                    const shortUrl = `${BASE_URL}/${createdLink.slug}`;
                    navigator.clipboard.writeText(shortUrl);
                    alert("Link copied!");
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
