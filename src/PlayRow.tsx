import React, { useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { toSafeInteger } from "lodash";
import classNames from "classnames";
import { Clear, Play, PlaysAction } from "./plays";

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
  isDesktop,
  dispatch,
}: {
  play: Play;
  index: number;
  isDesktop: boolean;
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
      ) : isDesktop ? (
        play.longScore
      ) : (
        Math.floor(play.longScore / 1000)
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
  showButtons,
  isDesktop,
  dispatch,
}: {
  play: Play;
  index: number;
  position: number;
  showButtons: boolean;
  isDesktop: boolean;
  dispatch: React.Dispatch<PlaysAction>;
}) {
  const rowClass = classNames({
    "table-secondary": position > 50,
    "font-monospace": true,
  });
  return (
    <tr key={index} className={rowClass}>
      <th className="text-center">
        {showButtons ? (
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
        ) : (
          position + 1
        )}
      </th>
      <EditableName play={play} index={index} dispatch={dispatch} />
      <EditableLevel play={play} index={index} dispatch={dispatch} />
      <EditableScore
        play={play}
        index={index}
        isDesktop={isDesktop}
        dispatch={dispatch}
      />
      <EditableClear play={play} index={index} dispatch={dispatch} />

      {isDesktop && <th className="text-center">{play.grade}</th>}
      <th className="text-center">{play.force}</th>
    </tr>
  );
}
