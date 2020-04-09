import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Home from "./Home";
import AddEdit from "./AddEdit";
import ViewOne from "./ViewOne";
import Admin from "./Admin";
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
  const [mode, setMode] = useState("admin");
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState({});
  const [oneMealId, setOneMealId] = useState();
  const [mealIds, setMealIds] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);
  const [previousMode, setPreviousMode] = useState("home");
  const [orderedList, setOrderedList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const data = await db.collection("meals").get();
      setMeals(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setMealIds(data.docs.map((doc) => ({ id: doc.id })));
    };
    fetchData();
  }, [meal]);

  useEffect(() => {
    const mealImages = (meals) => {
      let newImageArray = [];
      for (let mealObj of meals) {
        if (mealObj.mealData.imgUrl !== "") {
          newImageArray.push(mealObj.mealData.imgUrl);
        }
      }
      setImagesArray(newImageArray);
    };
    const ordered = meals.sort((a, b) =>
      a.mealData.title > b.mealData.title ? 1 : -1
    );
    setOrderedList(ordered);
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
          setPreviousMode={setPreviousMode}
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
          previousMode={previousMode}
        />
      )}
      {mode === "admin" && (
        <Admin
          setMode={setMode}
          setMeal={setMeal}
          setOneMealId={setOneMealId}
          meals={orderedList}
          mealIds={mealIds}
          imagesArray={imagesArray}
          setPreviousMode={setPreviousMode}
        />
      )}
    </OuterPageContainer>
  );
}

export default App;
