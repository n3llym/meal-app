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
    width: 90vw;
    height: auto;
    max-width: 450px;
  }
`;

const ImageContainer = styled.div`
  height: ${props => props.width * 0.6}px;
  width: ${props => props.width * 0.6}px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  cursor: pointer;
  img {
    height: ${props => props.width * 0.6}px;
    width: ${props => props.width * 0.6}px;
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

const Home = ({ setMode, setMeal, setOneMealId, meals, mealIds }) => {
  const [imagesArray, setImagesArray] = useState([]);
  const [image, setImage] = useState("");
  const { height, width } = useWindowDimensions();

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

  useEffect(() => {
    const mealImages = meals => {
      let newImageArray = [];
      for (let mealObj of meals) {
        newImageArray.push(mealObj.mealData.imgUrl);
      }
      setImagesArray(newImageArray);
    };
    mealImages(meals);
  }, [meals]);

  useEffect(() => {
    const interval = setInterval(() => {
      let randomNum = Math.floor(Math.random() * imagesArray.length);
      setImage(imagesArray[randomNum]);
    }, 2000);
    return () => clearInterval(interval);
  }, [meals]);

  return (
    <HomeContainer height={height}>
      <PlateContainer>
        <img src={plateImg} alt="plate" />
        <ImageContainer width={width}>
          <img
            src={image ? image : white}
            alt="food"
            width={width}
            onClick={() => randomSelector()}
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
  setMeal: PropTypes.func
};

export default Home;
