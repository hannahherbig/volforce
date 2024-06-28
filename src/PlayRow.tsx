import { Button, ButtonGroup, Form } from "react-bootstrap";
import { Clear, Play, PlaysAction } from "./plays";
import { toSafeInteger } from "lodash";
import React, { useState } from "react";

function EditableName({
  play,
  index,
  dispatch,
}: {
  play: Play;
  index: number;
  dispatch: React.Dispatch<PlaysAction>;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <td onClick={() => setEditing(true)}>
      {editing ? (
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
          autoFocus
          onBlur={() => setEditing(false)}
        />
      ) : (
        play.name
      )}
    </td>
  );
}

function EditableLevel({
  play,
  index,
  dispatch,
}: {
  play: Play;
  index: number;
  dispatch: React.Dispatch<PlaysAction>;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <td className="text-center" onClick={() => setEditing(true)}>
      {editing ? (
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
          autoFocus
          onBlur={() => setEditing(false)}
        />
      ) : (
        play.level
      )}
    </td>
  );
}

function EditableScore({
  play,
  index,
  dispatch,
}: {
  play: Play;
  index: number;
  dispatch: React.Dispatch<PlaysAction>;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <td className="text-center" onClick={() => setEditing(true)}>
      {editing ? (
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
          autoFocus
          onBlur={() => setEditing(false)}
        />
      ) : (
        play.longScore.toLocaleString()
      )}
    </td>
  );
}

function EditableClear({
  play,
  index,
  dispatch,
}: {
  play: Play;
  index: number;
  dispatch: React.Dispatch<PlaysAction>;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <td className="text-center" onClick={() => setEditing(true)}>
      {editing ? (
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
          autoFocus
          onBlur={() => setEditing(false)}
        >
          <option>PUC</option>
          <option>UC</option>
          <option>EXC</option>
          <option>C</option>
          <option>P</option>
        </Form.Select>
      ) : (
        play.clear
      )}
    </td>
  );
}

export default function PlayRow({
  play,
  index,
  position,
  dispatch,
}: {
  play: Play;
  index: number;
  position: number;
  dispatch: React.Dispatch<PlaysAction>;
}) {
  return (
    <tr key={index} className={position >= 50 ? "table-secondary" : ""}>
      <th className="text-end">{position + 1}</th>
      <EditableName play={play} index={index} dispatch={dispatch} />
      <EditableLevel play={play} index={index} dispatch={dispatch} />
      <EditableScore play={play} index={index} dispatch={dispatch} />
      <EditableClear play={play} index={index} dispatch={dispatch} />

      <td className="text-center">{play.grade}</td>
      <td className="text-center">{play.force}</td>
      <td className="text-center">
        <ButtonGroup>
          <Button
            variant="outline-success"
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
            variant="outline-danger"
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
    </tr>
  );
}
