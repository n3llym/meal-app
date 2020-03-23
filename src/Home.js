import React, { useEffect, useState } from "react";
import "./theme.js";
import firebase from "./firebase";
import styled from "styled-components";
import PropTypes from "prop-types";

const HomeContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  border-radius: 4px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.12);
  border: solid 1px grey;
  contain: content;
  @media (min-width: 1025px) {
    margin: 50px;
    width: 80%;
    max-width: 700px;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectButton = styled.button`
  padding: 10px;
  width: 100px;
  border-radius: 4px;
  cursor: pointer;
`;

const AddButton = styled.button`
  padding: 10px;
  width: 100px;
  border-radius: 4px;
  cursor: pointer;
`;

const Home = ({ setMode, setMeal, setOneMealId }) => {
  const [meals, setMeals] = useState([]);
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

  const randomSelector = () => {
    let randomNum = Math.floor(Math.random() * mealIds.length);
    let oneMealId = mealIds[randomNum].id;
    setOneMealId(oneMealId);
    const fetchData = async () => {
      const db = firebase.firestore();
      var docRef = db.collection("meals").doc(oneMealId);

      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            setMeal(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    };
    fetchData();
    setMode("view");
  };

  return (
    <HomeContainer>
      <ListContainer>
        {meals &&
          meals.map(
            (meal, id) =>
              meal.mealData &&
              meal.mealData.title !== "" && (
                <p key={id}>{meal.mealData.title}</p>
              )
          )}
      </ListContainer>
      <SelectButton onClick={() => randomSelector()}>Select</SelectButton>
      <AddButton onClick={() => setMode("add")}>Add New</AddButton>
    </HomeContainer>
  );
};

Home.propTypes = {
  setMode: PropTypes.func,
  setOneMealId: PropTypes.func,
  setMeal: PropTypes.func
};

export default Home;
