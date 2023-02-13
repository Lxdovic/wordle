import { useState, useEffect, useRef, createRef } from "react";

const MAX_ATTEMTPS = 5;
const WORD_LENGTH = 5;
const WORD = "hello";

function App() {
  const [words, setWords] = useState([]);
  const [word, setWord] = useState(new Array(WORD_LENGTH).fill(""));

  const refs = useRef(word.map(() => createRef())); // try to avoid using useRef to much especially if a solution can be find with state. I tipically use it to find information about the height or other property

  useEffect(() => {
    console.log(word, words);
    // useless with the way you implemented it exept for debugging
    // with the version that I propose it is useful
  }, [word, words]);

  const processWord = (e) => {
    // missing condition to prevent the user from adding new words when he add already added 5
    e.preventDefault();

    /* for code clarity the functions could be divided in three different function: the goal is to have one action per function
    
    - processWord
    - addWord
    - checkWinning
      

    here it might be overkill because it is fairly simple and with react it could be annoying to have the state change in a specific function but keep in mind that is it best that each function has one goal only


    */

    // processWord
    const attemptWord = word.map((letter, index) => {
      if (letter === WORD.charAt(index)) {
        return { letter, status: "correct" };
      }

      if (WORD.split("").includes(letter)) {
        return { letter, status: "included" };
      }

      return { letter, status: "wrong" };
    });

    // addWord
    setWord(new Array(WORD_LENGTH).fill(""));
    setWords([...words, attemptWord]);

    refs.current[0].current.focus();

    // checkWining
    if (attemptWord.every((letter) => letter.status === "correct")) {
      return alert("You Win");
    }

    if (words.length + 1 >= MAX_ATTEMTPS) {
      return alert("Game Over");
    }
  };

  return (
    <>
      {/* all the lines should be visible when the user open the page  use the variable MAX_ATTEMTPS */}
      {/* for code clarity it would better to have a component Line and another tile especially if you used tailwind because the css cannot help us to  determine to what correspond each element*/}
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

      {/* not sur a form is the most adapted it is a form here a div with an on key down could have work + I don't think having a line specifically for the current guess is a good idea you can look at my version of the wordle one to see a version with the 5 option visible from the beginning*/}
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
              }); // not a fan of thus sintaw prefer const newWord = [...word]; newWord[index] = e.data;setWord(newWord) // more consise
            }}
            // I do not think it is the optimal solution you are using 3 different fonctions to just detect an onChange event
          />
        ))}

        {/* adding a form add some unnecessary code */}
        <input type="submit" value="Submit" style={{ display: "none" }} />
      </form>
    </>
  );
}

export default App;
