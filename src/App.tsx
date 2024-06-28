import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useReducer } from "react";
import { Button, Navbar, Form, Table, ButtonGroup } from "react-bootstrap";
import { orderBy, sumBy, assign, pick, toSafeInteger } from "lodash";

type Clear = "PUC" | "UC" | "EXC" | "CLEARED" | "PLAYED";

const STORAGE_KEY = "plays";

interface PlayData {
  name?: string;
  level?: number;
  score?: number;
  clear?: Clear;
}

class Play {
  name: string;
  level: number;
  score: number;
  clear: Clear;

  constructor({ name, level, score, clear }: PlayData) {
    this.name = name ?? "";
    this.level = level ?? 20;
    this.score = score ?? 0;
    this.clear = clear ?? "CLEARED";
  }

  toJSON() {
    return pick(this, ["name", "level", "score", "clear"]);
  }

  get fracScore() {
    let score = this.score;
    while (score > 1) {
      score /= 10;
    }
    return score;
  }

  get longScore() {
    let score = this.score;
    if (score > 0) {
      while (score * 10 <= 10_000_000) {
        score *= 10;
      }
    }
    return score;
  }

  get shortScore() {
    let score = this.score;
    if (score > 0) {
      while (score % 10 === 0) {
        score /= 10;
      }
    }
    return score;
  }

  get clearCoef() {
    return {
      PUC: 1.1,
      UC: 1.05,
      EXC: 1.02,
      CLEARED: 1.0,
      PLAYED: 0.5,
    }[this.clear];
  }

  get gradeCoef() {
    const score = this.fracScore;
    if (score >= 0.99) return 1.05;
    if (score >= 0.98) return 1.02;
    if (score >= 0.97) return 1.0;
    if (score >= 0.95) return 0.97;
    if (score >= 0.93) return 0.94;
    if (score >= 0.9) return 0.91;
    if (score >= 0.87) return 0.88;
    if (score >= 0.75) return 0.85;
    if (score >= 0.65) return 0.82;
    return 0.8;
  }

  get grade() {
    const score = this.fracScore;
    if (score >= 0.99) return "S";
    if (score >= 0.98) return "AAA+";
    if (score >= 0.97) return "AAA";
    if (score >= 0.95) return "AA+";
    if (score >= 0.93) return "AA";
    if (score >= 0.9) return "A+";
    if (score >= 0.87) return "A";
    if (score >= 0.75) return "B";
    if (score >= 0.65) return "C";
    return "D";
  }

  get force() {
    return Math.floor(
      this.level * this.fracScore * this.gradeCoef * this.clearCoef * 20,
    );
  }
}

interface PlaysAction {
  type: "add" | "change" | "delete" | "sort";
  index?: number;
  play?: PlayData;
}

function playsReducer(plays: Play[], action: PlaysAction) {
  switch (action.type) {
    case "add": {
      return [
        ...plays.slice(0, action.index! + 1),
        new Play(action.play!),
        ...plays.slice(action.index! + 1),
      ];
    }

    case "change": {
      return plays.map((play, index) => {
        if (index === action.index) {
          return new Play(assign({}, play, action.play));
        } else {
          return play;
        }
      });
    }

    case "delete": {
      return plays.filter((play, index) => index !== action.index);
    }

    case "sort": {
      return orderBy(
        plays,
        [
          "force",
          "level",
          "fracScore",
          (p: Play) => p.name?.toLowerCase() ?? "",
        ],
        ["desc", "desc", "desc", "asc"],
      );
    }
  }
}

function App() {
  const [edit, setEdit] = useState(true);
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

  const orderedPlays = orderBy(plays, ["force"], ["desc"]);
  const totalForce = sumBy(orderedPlays.slice(0, 50), "force") / 1000;

  return (
    <>
      <Navbar
        expand="lg"
        className="justify-content-between"
        onClick={toggleEdit}
      >
        <Navbar.Brand href="#">Volforce Calculator</Navbar.Brand>
        <Navbar.Brand href="#">{totalForce.toFixed(3)}</Navbar.Brand>
      </Navbar>
      <Table size="sm">
        <thead>
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
                  variant="info"
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
          {plays.map((play: Play, index: number) => (
            <tr>
              <th></th>
              <td>
                {edit ? (
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="Name"
                    value={play.name}
                    onChange={(e) => {
                      dispatch({
                        type: "change",
                        index,
                        play: {
                          name: e.target.value,
                        },
                      });
                    }}
                  />
                ) : (
                  play.name
                )}
              </td>
              <td className="text-center">
                {edit ? (
                  <Form.Control
                    type="number"
                    placeholder="0"
                    min="1"
                    max="20"
                    size="sm"
                    value={play.level}
                    onChange={(e) => {
                      dispatch({
                        type: "change",
                        index,
                        play: {
                          level: toSafeInteger(e.target.value),
                        },
                      });
                    }}
                  />
                ) : (
                  play.level
                )}
              </td>
              <td className="text-center">
                {edit ? (
                  <Form.Control
                    type="number"
                    placeholder="0"
                    min="1"
                    size="sm"
                    value={play.score}
                    onChange={(e) => {
                      dispatch({
                        type: "change",
                        index,
                        play: {
                          score: toSafeInteger(e.target.value),
                        },
                      });
                    }}
                  />
                ) : (
                  play.longScore.toLocaleString()
                )}
              </td>

              <td className="text-center">
                {edit ? (
                  <Form.Select
                    size="sm"
                    value={play.clear}
                    onChange={(e) => {
                      dispatch({
                        type: "change",
                        index,
                        play: {
                          clear: e.target.value as Clear,
                        },
                      });
                    }}
                  >
                    <option>PUC</option>
                    <option>UC</option>
                    <option>EXC</option>
                    <option>CLEARED</option>
                    <option>PLAYED</option>
                  </Form.Select>
                ) : (
                  play.clear
                )}
              </td>
              <td className="text-center">{play.grade}</td>
              <td className="text-center">{play.force}</td>
              {edit ? (
                <td className="text-center">
                  <ButtonGroup>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        dispatch({
                          type: "add",
                          index: index,
                          play: { level: play.level, clear: play.clear },
                        })
                      }
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        dispatch({
                          type: "delete",
                          index: index,
                        })
                      }
                    >
                      X
                    </Button>
                  </ButtonGroup>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;
