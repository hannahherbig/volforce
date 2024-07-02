import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import React, { useReducer, useEffect, useState } from "react";
import { Button, Navbar, Table, Container } from "react-bootstrap";
import { sumBy, toSafeInteger } from "lodash";

import { Clear, Play, sortedPlays } from "./plays";
import playsReducer from "./playsReducer";
import PlayRow from "./PlayRow";

const isDesktopQuery = window.matchMedia("(min-width: 768px)");
const STORAGE_KEY = "plays";

export default function App() {
  const [showButtons, setShowButtons] = useState(true);
  const [plays, dispatch] = useReducer(
    playsReducer,
    [new Play({ name: "Lachryma", level: 20, score: 989, clear: "EXC" })],
    (initial) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length) {
          return parsed.map((p: Play) => new Play(p));
        } else {
          return initial;
        }
      } else {
        return initial;
      }
    }
  );

  const [isDesktop, setIsDesktop] = useState(isDesktopQuery.matches);

  useEffect(() => {
    function updateIsDesktop(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
    }
    isDesktopQuery.addEventListener("change", updateIsDesktop);

    return () => {
      isDesktopQuery.removeEventListener("change", updateIsDesktop);
    };
  });

  const orderedPlays = sortedPlays(plays);
  const totalForce = sumBy(orderedPlays.slice(0, 50), "force") / 1000;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plays));
  }, [plays]);

  function handleDrop(event: React.DragEvent<HTMLTableElement>) {
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
  }

  return (
    <>
      <Navbar
        variant="light"
        expand="lg"
        className="justify-content-between"
        bg="light"
        onClick={() => setShowButtons(!showButtons)}
      >
        <Container>
          <Navbar.Brand href="#" className="h1">
            Volforce Calculator
          </Navbar.Brand>
          <Navbar.Brand href="#" className="h1">
            {totalForce.toFixed(3)}
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Table
        size="sm"
        variant="light"
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <thead className="thead-light">
          <tr>
            <th className="text-center">
              {showButtons && (
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => dispatch({ type: "sort" })}
                >
                  Sort
                </Button>
              )}
            </th>
            <th>Name</th>
            <th className="text-center">Level</th>
            <th className="text-center">Score</th>
            <th className="text-center">Clear</th>
            {isDesktop && <th className="text-center">Grade</th>}
            <th className="text-center">VF</th>
          </tr>
        </thead>
        <tbody>
          {plays.map((play, index) => (
            <PlayRow
              key={play.id}
              play={play}
              index={index}
              position={orderedPlays.indexOf(play)}
              showButtons={showButtons}
              isDesktop={isDesktop}
              dispatch={dispatch}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
}
