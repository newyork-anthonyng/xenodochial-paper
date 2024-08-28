// import naics from "./naics";
import { useMachine } from "@xstate/react";
import machine from "./machine";

function Input() {
  const [state, send] = useMachine(machine);

  function handleTextChange(e) {
    send({ type: "CHANGE_TEXT", data: e.target.value });
  }

  function handleProcessClick() {
    send({ type: "PROCESS" });
  }
  return (
    <div>
      <h1>Input</h1>
      {state.matches("ready") && (
        <>
          <p>Enter list of search terms. Separate them by new lines</p>
          {/* <pre>{JSON.stringify(naics, null, 2)}</pre> */}
          <textarea value={state.context.text} onChange={handleTextChange} />
          <button onClick={handleProcessClick}>Process</button>
        </>
      )}
      {state.matches("processed") && (
        <>
          <ul>
            {state.context.data.map((datum) => {
              return <li key={datum}>{datum}</li>;
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default Input;
