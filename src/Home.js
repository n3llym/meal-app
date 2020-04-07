import React, { useState, useEffect } from "react";
import "./theme.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import plateImg from "./images/plateImg.png";
import white from "./images/white.png";
import useWindowDimensions from "./helpers/useWindowDimensions";

const HomeContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${(props) => props.height - 1}px;
  contain: content;
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const SelectionContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0 5px 0;
  padding-left: 10px;
  height: 38px;
  padding-bottom: 15px;
  .lds-ellipsis {
    display: ${(props) => (props.selector ? "flex" : "none")};
    align-self: center;
    position: relative;
    width: 80px;
    height: 80px;
    padding-left: 8px;
  }
  .lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1px solid gray;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  img {
    width: ${(props) => (props.pressFeedback === false ? 90 : 88)}vw;
    height: auto;
    max-width: 450px;
  }
`;

const ImageContainer = styled.div`
  height: ${(props) =>
    props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
  width: ${(props) =>
    props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  cursor: ${(props) => (props.selector ? "wait" : "pointer")};
  img {
    height: ${(props) =>
      props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
    width: ${(props) =>
      props.pressFeedback === false ? props.width * 0.6 : props.width * 0.58}px;
    max-width: 300px;
    max-height: 300px;
    border-radius: 50%;
    // stop IOS popup when user long holds on image
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
`;

const AddIconContainer = styled.div`
  font-size: 25px;
  color: gray;
  cursor: pointer;
  margin-top: 50px;
`;

const AdminIconContainer = styled.div`
  position: fixed;
  font-size: 25px;
  bottom: 15px;
  color: #dcdcdc;
`;

const Home = ({
  setMode,
  setPreviousMode,
  setMeal,
  setOneMealId,
  meals,
  mealIds,
  imagesArray,
}) => {
  const chooseTime = 5000;
  const initialLoopTime = 200;
  const [image, setImage] = useState("");
  const [selector, setSelector] = useState(false);
  const [linearLoopTime, setLinearLoopTime] = useState(initialLoopTime);
  const [index, setIndex] = useState(0);
  const [pressFeedback, setPressFeedback] = useState(false);
  const { height, width } = useWindowDimensions();

  const handleFeedback = (e) => {
    e.preventDefault();
    if (selector === false) {
      setPressFeedback(true);
      let feedbackTimer = setTimeout(() => {
        setPressFeedback(false);
      }, 500);
      return () => clearTimeout(feedbackTimer);
    }
  };

  const randomSelector = (e) => {
    e.preventDefault();
    if (!mealIds || mealIds.length < 1) {
      alert("Please add a meal to get started");
    } else {
      if (selector === false) {
        setSelector(true);
        const timer = setTimeout(() => {
          let randomNum = Math.floor(Math.random() * mealIds.length);
          let oneMealId = mealIds[randomNum].id;
          setOneMealId(oneMealId);
          let oneMeal = meals.filter((x) => x.id === oneMealId);
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
      <SelectionContainer selector={selector}>
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </SelectionContainer>
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
            onClick={(e) => randomSelector(e)}
            onMouseDown={(e) => handleFeedback(e)}
          />
        </ImageContainer>
      </PlateContainer>
      <AddIconContainer>
        <FontAwesomeIcon onClick={() => setMode("add")} icon={faPlus} />
      </AddIconContainer>
      <AdminIconContainer>
        <FontAwesomeIcon
          onClick={() => setMode("admin")}
          icon={faChevronDown}
        />
      </AdminIconContainer>
    </HomeContainer>
  );
};

Home.propTypes = {
  setMode: PropTypes.func,
  setOneMealId: PropTypes.func,
  setMeal: PropTypes.func,
  imagesArray: PropTypes.array,
};

export default Home;
