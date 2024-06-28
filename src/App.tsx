import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer, useEffect } from "react";
import { Button, Navbar, Table, Container } from "react-bootstrap";
import { sumBy, toSafeInteger } from "lodash";

import { Clear, Play, sortedPlays } from "./plays";
import playsReducer from "./playsReducer";
import PlayRow from "./PlayRow";

const STORAGE_KEY = "plays";

function App() {
  const [edit, setEdit] = useState(false);
  const [plays, dispatch] = useReducer(
    playsReducer,
    [new Play({ name: "Lachryma", level: 20, score: 989, clear: "EXC" })],
    (initial) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((p: Play) => new Play(p));
      } else {
        return initial;
      }
    },
  );

  console.log(plays);

  function toggleEdit() {
    setEdit(!edit);
    dispatch({ type: "sort" });
  }

  const orderedPlays = sortedPlays(plays);
  const totalForce = sumBy(orderedPlays.slice(0, 50), "force") / 1000;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plays));
  }, [plays]);

  return (
    <>
      <Navbar
        variant="light"
        expand="lg"
        className="justify-content-between"
        bg="light"
        onClick={toggleEdit}
      >
        <Container>
          <Navbar.Brand href="#">Volforce Calculator</Navbar.Brand>
          <Navbar.Brand href="#">{totalForce.toFixed(3)}</Navbar.Brand>
        </Container>
      </Navbar>
      <Table
        size="sm"
        variant="light"
        onDrop={(event) => {
          event.stopPropagation();
          event.preventDefault();

          if (event.dataTransfer.items) {
            for (let i = 0; i < event.dataTransfer.items.length; ++i) {
              const item = event.dataTransfer.items[i];
              if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    if (text) {
                      const rows = text.trim().split("\n");
                      const plays = rows.slice(1).map((row) => {
                        const cols = row.split(",");
                        return {
                          name: `${cols[0]} ${cols[1]}`,
                          level: toSafeInteger(cols[2]),
                          clear: {
                            PERFECT: "PUC",
                            "ULTIMATE CHAIN": "UC",
                            "EXCESSIVE COMPLETE": "EXC",
                            COMPLETE: "C",
                            PLAYED: "P",
                          }[cols[3]] as Clear,
                          score: toSafeInteger(cols[5]),
                        };
                      });
                      dispatch({ type: "replace", plays: plays });
                    }
                  };
                  reader.readAsText(file);
                }
              }
            }
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <thead className="thead-light">
          <tr>
            <th className="text-center">
              <input type="checkbox" onChange={toggleEdit} checked={edit} />
              {edit ? " " : ""}
              {edit ? <span onClick={toggleEdit}>Edit</span> : null}
            </th>
            <th>Name</th>
            <th className="text-center">Level</th>
            <th className="text-center">Score</th>
            <th className="text-center">Clear</th>
            <th className="text-center">Grade</th>
            <th className="text-center">VF</th>
            {edit ? (
              <th className="text-center">
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => dispatch({ type: "sort" })}
                >
                  Sort
                </Button>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {plays.map((play, index) => (
            <PlayRow
              key={index}
              play={play}
              index={index}
              position={orderedPlays.indexOf(play)}
              edit={edit}
              dispatch={dispatch}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;
