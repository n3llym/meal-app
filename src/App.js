import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Home from "./Home";
import AddEdit from "./AddEdit";
import ViewOne from "./ViewOne";
import theme from "./theme";
import firebase from "./firebase";

const OuterPageContainer = styled.div`
  display: flex;
  justify-content: center;
  contain: content;
  color: ${theme.fontColor};
  font-family: "Helvetica Neue";
  height: auto;
`;

function App() {
  const [mode, setMode] = useState("home");
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState({});
  const [oneMealId, setOneMealId] = useState();
  const [mealIds, setMealIds] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const data = await db.collection("meals").get();
      setMeals(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setMealIds(data.docs.map(doc => ({ id: doc.id })));
    };
    fetchData();
  }, [meal]);

  useEffect(() => {
    const mealImages = meals => {
      let newImageArray = [];
      for (let mealObj of meals) {
        if (mealObj.mealData.imgUrl !== "") {
          newImageArray.push(mealObj.mealData.imgUrl);
        }
      }
      setImagesArray(newImageArray);
    };
    mealImages(meals);
  }, [meals]);

  return (
    <OuterPageContainer>
      {mode === "home" && (
        <Home
          setMode={setMode}
          setMeal={setMeal}
          setOneMealId={setOneMealId}
          meals={meals}
          mealIds={mealIds}
          imagesArray={imagesArray}
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
