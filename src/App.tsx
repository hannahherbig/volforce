import React from "react";
import logo from "./logo.svg";
// import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Navbar } from "react-bootstrap";
import { Table } from "react-bootstrap";

function App() {
  return (
    <>
      <Navbar expand="lg" className="justify-content-between">
        <Navbar.Brand href="#">Volforce Calculator</Navbar.Brand>
        <Navbar.Brand href="#">{Math.random().toFixed(4)}</Navbar.Brand>
      </Navbar>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-right">
              <input type="checkbox" />
              &nbsp;
              <span>Edit</span>
            </th>
            <th>Name</th>
            <th className="text-center">Score</th>
            <th className="text-center">Clear</th>
            <th className="text-center">Grade</th>
            <th className="text-center">VF</th>
            <th className="text-center">
              <Button variant="info">Sort</Button>
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </>
  );
}

export default App;
