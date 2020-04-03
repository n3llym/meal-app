import React, { useState, useEffect } from "react";
import "./theme.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import plateImg from "./images/plateImg.png";
import white from "./images/white.png";
import useWindowDimensions from "./helpers/useWindowDimensions";

const HomeContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${props => props.height - 1}px;
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
  margin-top: 85px;
  img {
    width: ${props => (props.pressFeedback === false ? 90 : 88)}vw;
    height: auto;
    max-width: 450px;
  }
`;

const ImageContainer = styled.div`
  height: ${props =>
    props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
  width: ${props =>
    props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  cursor: ${props => (props.selector ? "wait" : "pointer")};
  img {
    height: ${props =>
      props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
    width: ${props =>
      props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
    max-width: 300px;
    max-height: 300px;
    border-radius: 50%;
  }
`;

const AddIconContainer = styled.div`
  font-size: 25px;
  color: gray;
  cursor: pointer;
  margin-bottom: 50px;
`;

const Home = ({
  setMode,
  setPreviousMode,
  setMeal,
  setOneMealId,
  meals,
  mealIds,
  imagesArray
}) => {
  const chooseTime = 5000;
  const initialLoopTime = 200;
  const [image, setImage] = useState("");
  const [selector, setSelector] = useState(false);
  const [linearLoopTime, setLinearLoopTime] = useState(initialLoopTime);
  const [index, setIndex] = useState(0);
  const [pressFeedback, setPressFeedback] = useState(false);
  const { height, width } = useWindowDimensions();

  const handleFeedback = () => {
    if (selector === false) {
      setPressFeedback(true);
      let feedbackTimer = setTimeout(() => {
        setPressFeedback(false);
      }, 500);
      return () => clearTimeout(feedbackTimer);
    }
  };

  const randomSelector = () => {
    if (!mealIds || mealIds.length < 1) {
      alert("Please add a meal to get started");
    } else {
      if (selector === false) {
        setSelector(true);
        const timer = setTimeout(() => {
          let randomNum = Math.floor(Math.random() * mealIds.length);
          let oneMealId = mealIds[randomNum].id;
          setOneMealId(oneMealId);
          let oneMeal = meals.filter(x => x.id === oneMealId);
          setMeal(oneMeal[0]);
          setPreviousMode("home");
          setMode("view");
        }, chooseTime);
        return () => clearTimeout(timer);
      }
    }
  };

  useEffect(() => {
    const calculateNewLoopTime = () => {
      let currentTime =
        chooseTime -
        (chooseTime / initialLoopTime) * linearLoopTime +
        linearLoopTime;
      setLinearLoopTime(
        initialLoopTime * ((chooseTime - currentTime) / chooseTime)
      );
    };
    if (selector === false) {
      if (imagesArray.length > 0) {
        let index = 0;
        const interval = setInterval(() => {
          index = (index + 1) % imagesArray.length;
          setImage(imagesArray[index]);
        }, initialLoopTime);
        return () => clearInterval(interval);
      }
    } else {
      const timer = setTimeout(() => {
        calculateNewLoopTime();
        setIndex((index + 1) % imagesArray.length);
        setImage(imagesArray[index]);
      }, linearLoopTime);
      return () => clearTimeout(timer);
    }
  }, [imagesArray, selector, linearLoopTime]);

  return (
    <HomeContainer height={height}>
      <div onClick={() => setMode("admin")}>Admin</div>
      <PlateContainer pressFeedback={pressFeedback}>
        <img src={plateImg} alt="plate" />
        <ImageContainer
          width={width}
          selector={selector}
          pressFeedback={pressFeedback}
        >
          <img
            src={image ? image : white}
            alt="food"
            width={width}
            onClick={() => randomSelector()}
            onMouseDown={() => handleFeedback()}
          />
        </ImageContainer>
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
  setMeal: PropTypes.func,
  imagesArray: PropTypes.array
};

export default Home;
