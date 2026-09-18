import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/notes';

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load notes. Make sure the server and MongoDB are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Please enter both a title and content.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await axios.post(API_URL, {
        title: title.trim(),
        content: content.trim()
      });

      // Insert newest note immediately without page refresh.
      setNotes((currentNotes) => [response.data, ...currentNotes]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
      setError('Unable to create note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await axios.delete(`${API_URL}/${id}`);
      setNotes((currentNotes) => currentNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      setError('Unable to delete note. Please try again.');
    }
  };

  return (
    <main className="page-shell">
      <section className="app-card">
        <header className="hero">
          <p className="eyebrow">MERN STACK LAB ACTIVITY</p>
          <h1>Student Notes CRUD Micro-App</h1>
          <p className="subtitle">React state + REST API + MongoDB persistence</p>
        </header>

        <form className="note-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. AOS revision"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            rows="5"
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <section className="notes-section">
          <div className="section-heading">
            <h2>Your Notes</h2>
            <span>{notes.length} total</span>
          </div>

          {loading ? (
            <p className="state-message">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="state-message">No notes yet — add one above!</p>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <article className="note-card" key={note._id}>
                  <div>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                  </div>
                  <footer>
                    <time dateTime={note.createdAt}>
                      {new Date(note.createdAt).toLocaleString()}
                    </time>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDelete(note._id)}
                    >
                      Delete
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
