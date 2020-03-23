import React, { useState } from "react";
import styled from "styled-components";
import Home from "./Home";
import AddNew from "./AddNew";
import ViewOne from "./ViewOne";
import theme from "./theme";

const OuterPageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  contain: content;
  background-color: ${theme.bgColor};
  color: ${theme.fontColor};
`;

function App() {
  const [mode, setMode] = useState("add");
  const [meal, setMeal] = useState();
  const [oneMealId, setOneMealId] = useState();

  return (
    <OuterPageContainer>
      {mode === "home" && (
        <Home setMode={setMode} setMeal={setMeal} setOneMealId={setOneMealId} />
      )}
      {mode === "add" && <AddNew setMode={setMode} />}
      {mode === "view" && (
        <ViewOne
          setMode={setMode}
          meal={meal}
          oneMealId={oneMealId}
          mode={mode}
        />
      )}
    </OuterPageContainer>
  );
}

export default App;
