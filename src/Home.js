import React, { useState, useEffect } from "react";
import "./theme.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import plateImg from "./images/plateImg.png";
import white from "./images/white.png";
import useWindowDimensions from "./helpers/useWindowDimensions";
import ReactLoading from "react-loading";

const HomeContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
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
  font-size: 2rem;
  width: 90%;
  margin: 34px 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 38px;
  padding-bottom: 15px;
  .loader {
    display: ${(props) => !props.selector && "none"};
  }
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  height: 90vw;
  max-height: 450px;
  img {
    width: ${(props) => (!props.pressFeedback ? 90 : 88)}vw;
    height: auto;
    max-width: 450px;
  }
`;

const ImageContainer = styled.div`
  height: ${(props) =>
    !props.pressFeedback ? props.width * 0.6 : props.width * 0.58}px;
  width: ${(props) =>
    !props.pressFeedback ? props.width * 0.6 : props.width * 0.58}px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  cursor: ${(props) => (props.selector ? "wait" : "pointer")};
  img {
    height: ${(props) =>
      !props.pressFeedback ? props.width * 0.6 : props.width * 0.58}px;
    width: ${(props) =>
      !props.pressFeedback ? props.width * 0.6 : props.width * 0.58}px;
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
  const [image, setImage] = useState("");
  const [selector, setSelector] = useState(false);
  const [loopTime, setLoopTime] = useState(200);
  const [changingImage, setChangingImage] = useState(true);
  const [pressFeedback, setPressFeedback] = useState(false);
  const { height, width } = useWindowDimensions();

  const randomSelector = (e) => {
    e.preventDefault();
    if (!mealIds || mealIds.length < 1) {
      alert("Please add a meal to get started");
    } else if (selector === false) {
      setSelector(true);
      setLoopTime(100);
      let randomNum = Math.floor(Math.random() * mealIds.length);
      let oneMealId = mealIds[randomNum].id;
      let oneMeal = meals.filter((x) => x.id === oneMealId);
      setOneMealId(oneMealId);
      setMeal(oneMeal[0]);
      setPreviousMode("home");
      const firstTimer = setTimeout(() => {
        setChangingImage(false);
        setImage(oneMeal[0].mealData.imgUrl);
      }, 4000);
      const timer = setTimeout(() => {
        setImage(oneMeal[0].mealData.imgUrl);
        setMode("view");
      }, 5000);
      return () => {
        clearTimeout(firstTimer);
        clearTimeout(timer);
      };
    }
  };

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

  useEffect(() => {
    if (imagesArray.length > 0) {
      let index = 0;
      let interval;
      if (changingImage) {
        interval = setInterval(() => {
          index = (index + 1) % imagesArray.length;
          setImage(imagesArray[index]);
        }, 150);
      }
      return () => clearInterval(interval);
    }
  }, [imagesArray, selector, loopTime, changingImage]);

  return (
    <HomeContainer height={height}>
      <SelectionContainer selector={selector}>
        <ReactLoading type={"bubbles"} color={"gray"} className={"loader"} />
      </SelectionContainer>
      <PlateContainer
        selector={selector}
        pressFeedback={pressFeedback}
        onClick={(e) => randomSelector(e)}
        onMouseDown={(e) => handleFeedback(e)}
      >
        <img src={plateImg} alt="plate" />
        <ImageContainer
          width={width}
          selector={selector}
          pressFeedback={pressFeedback}
        >
          <img src={image ? image : white} alt="food" width={width} />
        </ImageContainer>
      </PlateContainer>
      <AddIconContainer pressFeedback={pressFeedback}>
        <FontAwesomeIcon onClick={() => setMode("add")} icon={faPlus} />
      </AddIconContainer>
      <AdminIconContainer>
        <FontAwesomeIcon onClick={() => setMode("admin")} icon={faChevronUp} />
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
