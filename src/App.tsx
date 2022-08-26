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
  const [state, setState] = useState<State>({
    generations: [],
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
    setLoading(true);

    try {
      ev.preventDefault();

      const prompt = inputRef?.current?.value;

      const resp = await fetch("/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Stable Diffusion Colab Server</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={inputRef} disabled={loading} />
      </form>

      <div id="results">
        {state.generations
          .slice()
          .reverse()
          .map((gen, i) => (
            <div className="item">
              <a href={gen.imageURL} download={`${gen.prompt}.png`} key={i}>
                <img src={gen.imageURL} title={gen.prompt} />
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
