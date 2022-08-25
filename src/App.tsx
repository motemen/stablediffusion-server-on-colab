import { useRef, useState } from "react";
import "./App.css";

interface Generaion {
  prompt: string;
  imageURL: string;
}

interface State {
  generations: Generaion[];
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<State>({ generations: [] });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();

    const prompt = inputRef?.current?.value;

    setLoading(true);

    const resp = await fetch(
      "https://g631b9i5u5c-496ff2e9c6d22116-5000-colab.googleusercontent.com/generate",
      {
        method: "POST",
        body: JSON.stringify({
          prompt,
        }),
      }
    );
    const blob = await resp.blob();
    setState((state) => {
      return {
        generations: [
          ...state.generations,
          {
            prompt: prompt!,
            imageURL: URL.createObjectURL(blob),
          },
        ],
      };
    });
  };

  return (
    <div className="App">
      <h1>Stable Diffusers</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={inputRef} disabled={loading} />
      </form>

      {state.generations.map((gen, i) => (
        <img key={i} src={gen.imageURL} title={gen.prompt} />
      ))}
    </div>
  );
}

export default App;
