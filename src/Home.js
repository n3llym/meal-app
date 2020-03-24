import React from "react";
import "./theme.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import plateImg from "./images/plateImg.png";
import useWindowDimensions from "./helpers/useWindowDimensions";

const HomeContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${props => props.height}px;
  contain: content;
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-top: 137px;
  img {
    width: 90vw;
    height: auto;
    max-width: 600px;
  }
`;

const SelectIconContainer = styled.div`
  font-size: 50px;
  color: black;
  cursor: pointer;
  position: absolute;
  margin: auto;
`;

const AddIconContainer = styled.div`
  font-size: 25px;
  color: gray;
  cursor: pointer;
  margin-bottom: 50px;
`;

const Home = ({ setMode, setMeal, setOneMealId, meals, mealIds }) => {
  const randomSelector = () => {
    if (!mealIds || mealIds.length < 1) {
      alert("Please add a meal to get started");
    }
    let randomNum = Math.floor(Math.random() * mealIds.length);
    let oneMealId = mealIds[randomNum].id;
    setOneMealId(oneMealId);
    let oneMeal = meals.filter(x => x.id === oneMealId);
    setMeal(oneMeal[0]);
    setMode("view");
  };

  const { height, width } = useWindowDimensions();
  console.log(height);

  return (
    <HomeContainer height={height}>
      <PlateContainer>
        <img src={plateImg} alt="plate" />
        <SelectIconContainer>
          <FontAwesomeIcon onClick={() => randomSelector()} icon={faPlus} />
        </SelectIconContainer>
      </PlateContainer>
      <AddIconContainer>
        <FontAwesomeIcon onClick={() => setMode("add")} icon={faPlus} />
      </AddIconContainer>
    </HomeContainer>
  );
};

Home.propTypes = {
  setMode: PropTypes.func,
  setOneMealId: PropTypes.func,
  setMeal: PropTypes.func
};

export default Home;
