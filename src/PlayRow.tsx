import { Button, ButtonGroup, Form } from "react-bootstrap";
import { Clear, Play, PlaysAction } from "./plays";
import { toSafeInteger } from "lodash";
import React from "react";

export default function PlayRow({
  play,
  index,
  position,
  edit,
  dispatch,
}: {
  play: Play;
  index: number;
  position: number;
  edit: boolean;
  dispatch: React.Dispatch<PlaysAction>;
}) {
  return (
    <tr key={index} className={position >= 50 ? "table-secondary" : ""}>
      <th className="text-end">{position + 1}</th>
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
            <option>C</option>
            <option>P</option>
          </Form.Select>
        ) : (
          play.clear
        )}
      </td>
      <td className="text-center">{play.grade}</td>
      <td className="text-center">{play.force}</td>
      {edit && (
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
      )}
    </tr>
  );
}
