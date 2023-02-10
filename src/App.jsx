import { useState, useEffect, useRef, createRef } from "react";

const MAX_ATTEMTPS = 5;
const WORD_LENGTH = 5;
const WORD = "hello";

function App() {
  const [words, setWords] = useState([]);
  const [word, setWord] = useState(new Array(WORD_LENGTH).fill(""));

  const refs = useRef(word.map(() => createRef()));

  useEffect(() => {
    console.log(word, words);
  }, [word, words]);

  const processWord = (e) => {
    e.preventDefault();

    const attemptWord = word.map((letter, index) => {
      if (letter === WORD.charAt(index)) {
        return { letter, status: "correct" };
      }

      if (WORD.split("").includes(letter)) {
        return { letter, status: "included" };
      }

      return { letter, status: "wrong" };
    });

    setWord(new Array(WORD_LENGTH).fill(""));
    setWords([...words, attemptWord]);

    refs.current[0].current.focus();

    if (attemptWord.every((letter) => letter.status === "correct")) {
      return alert("You Win");
    }

    if (words.length + 1 >= MAX_ATTEMTPS) {
      return alert("Game Over");
    }
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {words.map((word, index) => (
          <li key={index} className="flex gap-2">
            {word.map((letter, index) => (
              <span
                className={`bg-zinc-800 h-10 w-10 text-center text-white rounded`}
                style={{
                  backgroundColor:
                    letter.status === "correct"
                      ? "green"
                      : letter.status === "included" && "orange",
                }}
                key={index}
              >
                {letter.letter}
              </span>
            ))}
          </li>
        ))}
      </ul>

      <form onSubmit={processWord} className="flex gap-2 mt-10">
        {word.map((letter, index) => (
          <input
            className="bg-zinc-800 h-10 w-10 text-center text-white rounded"
            ref={refs.current[index]}
            key={index}
            type="text"
            value={letter}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                setWord((prev) => {
                  const newWord = [...prev];
                  newWord[index] = "";
                  return newWord;
                });

                if (index === 0) return;

                refs.current[index - 1].current.focus();
              }
            }}
            onChange={(e) => {
              if (index === WORD_LENGTH - 1) {
                return;
              }

              if (e.target.value.length >= 1 && index < WORD_LENGTH - 1) {
                refs.current[index + 1].current.focus();
              }
            }}
            onBeforeInput={(e) => {
              setWord((prev) => {
                const newWord = [...prev];
                newWord[index] = e.data;
                return newWord;
              });
            }}
          />
        ))}

        <input type="submit" value="Submit" style={{ display: "none" }} />
      </form>
    </>
  );
}

export default App;
