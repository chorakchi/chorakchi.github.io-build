import React from "react";
import { hotjar } from "react-hotjar";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./../navigator/routes";
hotjar.initialize(1988903, 6);

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
