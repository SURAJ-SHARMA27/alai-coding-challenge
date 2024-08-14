import { useState, useEffect } from "react";
import { Tldraw, createShapeId, Editor } from "tldraw";
import "tldraw/tldraw.css";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TldrawComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [items, setItems] = useState<{ text: string; id: string }[]>([]);

  const handleAddItem = () => {
    if (!editorInstance || inputText.trim() === "") return;

    const labelId = createShapeId();
    const newItem = { text: inputText, id: labelId };

    setItems((prevItems) => [...prevItems, newItem]);

    const point = [
      (items.length + 1) * 100,
      (items.length % 2 === 0 ? 200 : 280),
    ];

    editorInstance.createShape({
      id: labelId,
      type: "text",
      x: point[0],
      y: point[1],
      props: {
        text: inputText,
        textAlign: "middle",
        color: "black",
        font: "sans",
        size: "s",
      },
    });

    setInputText("");
    setIsOpen(false);
  };

  const handleAddTimeline = () => {
    if (!inputText.trim()) return;

    const lines = inputText.split("\n");
    let isValid = true;

    lines.forEach((line) => {
      if (!/^\d+: .+/.test(line.trim())) {
        isValid = false;
      }
    });

    if (!isValid) {
      setTimelineOpen(false)
      setInputText("")
      toast.error("Invalid format. Please follow the example format.");
      return;
    }

    toast.success("Timeline successfully created!");

    lines.forEach((line, index) => {
      const labelId = createShapeId();
      const newItem = { text: line, id: labelId };
      setItems((prevItems) => [...prevItems, newItem]);

      const point = [
        (index + 1) * 100,
        index % 2 === 0 ? 200 : 280,
      ];

      editorInstance?.createShape({
        id: labelId,
        type: "text",
        x: point[0],
        y: point[1],
        props: {
          text: line,
          textAlign: "middle",
          color: "black",
          font: "sans",
          size: "s",
        },
      });
    });

    setInputText("");
    setTimelineOpen(false);
  };

  const handleClearTimeline = () => {
    if (editorInstance) {
      items.forEach(( id:any ) => {
        editorInstance.deleteShape(id);
      });
    }
    setItems([]);
    toast.success("Timeline cleared!");
  };

  useEffect(() => {
    if (editorInstance) {
      const lineShapeId = createShapeId();

      editorInstance.createShape({
        id: lineShapeId,
        type: "line",
        props: {
          points: [
            { id: createShapeId(), index: "a1", x: 0, y: 250 },
            { id: createShapeId(), index: "a2", x: items.length * 100, y: 250 },
          ],
        },
      });

      return () => {
        editorInstance.deleteShape(lineShapeId);
      };
    }
  }, [editorInstance, items]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "250px", padding: "20px", borderRight: "1px solid #ccc" ,marginTop:"20px"}}>
        <Button
          variant="contained"
          onClick={() => setIsOpen(true)}
          style={{ marginBottom: "20px", width: "100%" }}
        >
          Add Item
        </Button>
        <Button
          variant="contained"
          onClick={() => setTimelineOpen(true)}
          style={{ marginBottom: "20px", width: "100%" }}
        >
          Add Timeline
        </Button>
        <Button
          variant="outlined"
          onClick={handleClearTimeline}
          style={{ marginBottom: "20px", width: "100%" }}
        >
          Clear Timeline
        </Button>
      </div>

      <div style={{ flex: 1 }}>
        <Tldraw
          hideUi={true}
          onMount={(editor) => {
            setEditorInstance(editor);
          }}
        />
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Timeline Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter item..."
            type="text"
            fullWidth
            variant="outlined"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            InputProps={{
              style: { minHeight: '100px' }
            }}
          />
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setIsOpen(false)} color="error" variant="outlined" style={{ borderColor: 'red' }}>
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={timelineOpen} onClose={() => setTimelineOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Timeline</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Enter your timeline in the following format:
          </Typography>
          <Typography variant="body2" gutterBottom>
            1: Activity 1...<br />
            2: Activity 2...<br />
            3: Activity 3...
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Enter timeline..."
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            InputProps={{
              style: { minHeight: '100px' }
            }}
          />
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setTimelineOpen(false)} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddTimeline} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-center" autoClose={3000} style={{ zIndex: 9999 }} />
    </div>
  );
}
