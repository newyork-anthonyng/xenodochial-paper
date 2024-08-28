import { useRef } from "react";
import machine from "./machine";
import { useMachine } from "@xstate/react";

function copyTableData($table) {
  // Create a range object
  const range = document.createRange();
  range.selectNode($table);

  // Select the text content of the table
  window.getSelection().removeAllRanges(); // Clear any existing selections
  window.getSelection().addRange(range); // Add the range with the table

  // Copy the selected content
  try {
    document.execCommand("copy");
    //   alert("Table data copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }

  // Remove the selection to prevent any visual cues
  window.getSelection().removeAllRanges();
}

function Output() {
  const tableRef = useRef(null);
  const [state, send] = useMachine(
    machine.provide({
      actions: {
        copyTable: () => {
          console.log("copying table");
          if (tableRef.current) {
            copyTableData(tableRef.current);
          }
        },
      },
    })
  );

  if (state.matches("loading")) {
    return <div>Loading...</div>;
  }

  if (state.matches("error")) {
    return <div>Something wrong happened. Try again later.</div>;
  }

  if (state.context.data.length === 0) {
    return <p>No results</p>;
  }

  function handleCopyClick() {
    send({ type: "COPY" });
  }

  return (
    <div>
      <button onClick={handleCopyClick}>Copy</button>
      <table ref={tableRef}>
        <thead>
          <tr>
            <th>Account Id</th>
            <th>Business Name</th>
            <th>Certifications</th>
            <th>Description</th>
            <th>Email</th>
            <th>Largest Contract Value</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {state.context.data.map((datum) => {
            return (
              <tr key={datum.accountid}>
                <td>{datum.accountid}</td>
                <td>{datum.business_name}</td>
                <td>{datum.certifications.join()}</td>
                <td>{datum.description}</td>
                <td>{datum.email}</td>
                <td>{datum.largest_contract_value}</td>
                <td>{datum.phone}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Output;
