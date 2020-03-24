import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Home from "./Home";
import AddEdit from "./AddEdit";
import ViewOne from "./ViewOne";
import theme from "./theme";
import firebase from "./firebase";

const OuterPageContainer = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  contain: content;
  color: ${theme.fontColor};
  font-family: "Helvetica Neue";
`;

function App() {
  const [mode, setMode] = useState("home");
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState({});
  const [oneMealId, setOneMealId] = useState();
  const [mealIds, setMealIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const data = await db.collection("meals").get();
      setMeals(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setMealIds(data.docs.map(doc => ({ id: doc.id })));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const data = await db.collection("meals").get();
      setMeals(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setMealIds(data.docs.map(doc => ({ id: doc.id })));
    };
    fetchData();
  }, [meal]);

  return (
    <OuterPageContainer>
      {mode === "home" && (
        <Home
          setMode={setMode}
          setMeal={setMeal}
          setOneMealId={setOneMealId}
          meals={meals}
          mealIds={mealIds}
        />
      )}
      {(mode === "add" || mode === "edit") && (
        <AddEdit
          setMode={setMode}
          mode={mode}
          meal={meal}
          setMeal={setMeal}
          oneMealId={oneMealId}
          meals={meals}
        />
      )}
      {mode === "view" && (
        <ViewOne
          setMode={setMode}
          meal={meal}
          oneMealId={oneMealId}
          mode={mode}
          meals={meals}
          setMeal={setMeal}
        />
      )}
    </OuterPageContainer>
  );
}

export default App;
