'use client';

import { useState } from 'react';

const defaultProfile = `# .gitconfig
[user]
  name = Your Name
  email = you@example.com

[core]
  editor = nano

[alias]
  co = checkout
  br = branch
  st = status
`;

export default function HomePage() {
  const [owner, setOwner] = useState('codeandbrain');
  const [repo, setRepo] = useState('dotfile');
  const [filePath, setFilePath] = useState('.dotfile-demo/.gitconfig');
  const [title, setTitle] = useState('Add dotfile composer demo');
  const [branchName, setBranchName] = useState('dotfile-composer-demo');
  const [content, setContent] = useState(defaultProfile);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setStatus(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

      const response = await fetch(`${backendUrl}/api/create-pr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          branchName,
          filePath,
          title,
          body: 'Created by the dotfile composer demo UI',
          fileContents: content,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Request failed');
      }

      setStatus(`PR created: ${payload.pullRequest.html_url}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="panel">
        <div className="header-row">
          <div>
            <p className="eyebrow">Dotfile Composer</p>
            <h1>Visual dotfile profile</h1>
          </div>
          <button className="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating PR...' : 'Apply to GitHub'}
          </button>
        </div>

        <div className="form-grid">
          <label>
            Owner
            <input value={owner} onChange={(event) => setOwner(event.target.value)} />
          </label>
          <label>
            Repository
            <input value={repo} onChange={(event) => setRepo(event.target.value)} />
          </label>
          <label>
            Branch name
            <input value={branchName} onChange={(event) => setBranchName(event.target.value)} />
          </label>
          <label>
            File path
            <input value={filePath} onChange={(event) => setFilePath(event.target.value)} />
          </label>
          <label className="full-width">
            PR title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
        </div>

        <div className="editor-grid">
          <div className="editor-wrap">
            <h2>Dotfile content</h2>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} />
          </div>

          <div className="preview-wrap">
            <h2>Preview</h2>
            <pre>{content}</pre>
          </div>
        </div>

        {status ? <div className="status-box">{status}</div> : null}
      </section>
    </main>
  );
}
