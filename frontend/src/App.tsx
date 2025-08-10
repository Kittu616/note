import  { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import 'katex/dist/katex.min.css';


//shadcn
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { SymbolCombobox } from "./components/search/Search";

// Updated Note type to match what backend returns
type Note = {
  _id: string; // MongoDB id
  id: string;  // Your custom id field (maps to time_id from frontend)
  notes: string;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function App(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [latex, setLatex] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(false)

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/note/get');

      const notesData = Array.isArray(res.data) ? res.data : [];
      setNotes(notesData);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or update note
  const saveNote = async () => {
    if (!latex.trim()) return;

    const payload = {
      time_id: editingId || Date.now().toString(),
      notes: latex,
      checked: false,
    };

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        // If editing, we might need an update endpoint
        // For now, we'll just create a new note
        await axios.post('/note/post', payload);
      } else {
        await axios.post('/note/post', payload);
      }

      setLatex('');
      setEditingId(null);
      await fetchNotes();
    } catch (err: any) {
      setError(err?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const removeNote = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/note/delete/${id}`);
      await fetchNotes();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (n: Note) => {
    setEditingId(n.id); // Use the id field, not time_id
    setLatex(n.notes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white min-h-screen w-[100vw]  py-6 md:py-12 px-2 sm:px-4  font-sans">
      <div className="absolute top-[1vh] left-[20vw] md:left-[40vw]"><SymbolCombobox></SymbolCombobox></div>
      <div className=" mx-auto  rounded-2xl shadow-lg mt-4">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">Notes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor column */}
          <div className="flex flex-col">
            <Textarea
              className="resize-none h-40 md:h-56 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Type LaTeX here (e.g. \\frac{a}{b} or x^2 + y^2 = z^2)"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
            />

            <div className="flex items-center gap-2 mt-3">
              <Button
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                onClick={saveNote}
                disabled={!latex.trim() || loading}
              >
                {editingId ? 'Update' : 'Add'} note
              </Button>

              <Button
                className="px-3 py-2 rounded-md border hover:bg-gray-100"
                onClick={() => { setLatex(''); setEditingId(null); }}
              >
                Clear
              </Button>

              {loading && <span className="text-sm text-gray-500">Processing...</span>}
            </div>

            {error && (
              <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="mt-4">
              <div className="p-4  rounded-md  break-words">
                {latex.trim() ? (
                  <BlockMath math={latex} />
                ) : (
                  <div className="text-sm text-gray-400">Rendered LaTeX</div>
                )}
              </div>
            </div>
          </div>

          {/* Notes list column */}
          <div>
            <div className="flex  justify-between mb-3">
              <h2 className="text-lg font-medium">Notes ({notes.length})</h2>
              <Button
                className="text-sm"
                onClick={() => fetchNotes()}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>

            <div className="space-y-4 w-[100%]  overflow-auto pr-2">
              {notes.length === 0 && !loading && (
                <div className="text-sm text-gray-500">No notes yet — add one on the left.</div>
              )}

              {notes.map((n) => (
                <div key={n._id} className="p-3 rounded-lg ">
                  <div className="flex sm:flex-row flex-col justify-between items-start">
                    <div className="border rounded-lg px-1 w-[100%] py-1 my-1">{selected ? (<>
                      <div className="text-xs text-gray-500 mb-1">Raw</div>
                      <Textarea disabled className="!cursor-default">{n.notes}</Textarea></>
                    ) : (
                      <div className="mt-3 p-1">
                        <div className="text-xs text-gray-500 mb-1">Rendered</div>
                        <div className="p-3 rounded flex ">
                          {n.notes.trim() ? (
                            <BlockMath math={n.notes} className="" />
                          ) : (
                            <span className="text-sm text-gray-400">Empty</span>
                          )}
                        </div>
                      </div>)}
                    </div>

                    <div className="flex flex-row sm:flex-col items-end gap-1">
                      <Button
                        className="px-2 py-1 rounded bg-yellow-100 text-xs sm:text-sm hover:bg-yellow-200"
                        onClick={() => startEdit(n)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="px-2 py-1 rounded bg-red-100 text-xs sm:text-sm hover:bg-red-200"
                        onClick={() => removeNote(n.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        className="px-2 py-1 rounded bg-red-100 text-xs sm:text-sm hover:bg-red-200"
                        onClick={() => setSelected(!selected)}
                      >
                        {selected ? "Render" : "Latex"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Note: This frontend expects your Express API at <code>/note/*</code> (proxy in dev or serve built files in production).
        </div>
      </div>
    </div>
  );
}