import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import plateImg from "./images/plateImg.png";
import { checkValid } from "./helpers/functions.js";
import useWindowDimensions from "./helpers/useWindowDimensions";

const ViewOneContainer = styled.main`
  min-height: ${(props) => props.height}px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  contain: content;
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 2rem;
  width: 80%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 38px;
  font-weight: normal;
  p {
    contain: content;
    text-align: center;
    margin: 0;
  }
  @media (min-width: 1025px) {
    margin: 32px 0 5px 0;
    width: 100%;
  }
`;

const PlateAndTextContainer = styled.div`
  height: auto;
  display: flex;
  height: ${(props) => props.windowHeight * 0.75}px;
  max-height: 550px;
  width: auto;
  flex-direction: column;
  align-items: center;
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  width: ${(props) => props.maxWidth * 0.9}px;
  height: ${(props) => props.maxWidth * 0.9}px;
  max-width: 450px;
  max-height: 450px;
  img {
    width: ${(props) => props.maxWidth * 0.9}px;
    height: auto;
    max-width: 450px;
  }
`;

const ImageContainer = styled.div`
  height: ${(props) => props.maxWidth * 0.6}px;
  width: ${(props) => props.maxWidth * 0.6}px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  img {
    height: ${(props) => props.maxWidth * 0.6}px;
    width: ${(props) => props.maxWidth * 0.6}px;
    max-width: 300px;
    max-height: 300px;
    border-radius: 50%;
  }
`;

const DescriptionContainer = styled.div`
  width: 100%;
  height: auto;
  margin-top: 15px;
  text-align: center;
  p {
    margin: 0 15px;
  }
`;

const BackIconContainer = styled.div`
  font-size: 40px;
  color: gray;
  cursor: pointer;
  position: fixed;
  left: 5px;
  top: 5px;
`;

const EditButton = styled.button`
  font-size: 1rem;
  color: gray;
  cursor: pointer;
  position: fixed;
  right: 5px;
  top: 5px;
  border: none;
  background-color: none;
  p {
    margin: 0;
  }
`;

const ViewNotesIconContainer = styled.div`
  font-size: 25px;
  height: 30px;
  bottom: 15px;
  color: gray;
`;

const StyledNotesContainer = styled.div`
  height: ${(props) => `calc(${props.windowHeight}px - 75px)`};
  position: absolute;
  bottom: 0;
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  overflow-y: scroll;
  display: ${(props) => !props.viewNotes && "none"};
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledNotes = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
  p {
    height: auto;
    margin: 15px;
    align-self: flex-start;
  }
  a {
    height: auto;
    margin: 15px;
    align-self: flex-start;
  }
`;

const ViewOne = ({ setMode, meal, setMeal, previousMode }) => {
  const [viewNotes, setViewNotes] = useState(false);
  const { height, maxWidth } = useWindowDimensions();

  return (
    <ViewOneContainer height={height}>
      <BackIconContainer>
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={() => {
            setMeal("");
            setMode(previousMode ? previousMode : "home");
          }}
        />
      </BackIconContainer>
      <Title>
        <p>{checkValid(meal, "title")}</p>
      </Title>
      <EditButton>
        <p onClick={() => setMode("edit")}>Edit</p>
      </EditButton>
      <PlateAndTextContainer windowHeight={height}>
        <PlateContainer maxWidth={maxWidth}>
          <img src={plateImg} alt="plate" />
          {checkValid(meal, "imgUrl") && (
            <ImageContainer maxWidth={maxWidth}>
              <img src={checkValid(meal, "imgUrl")} alt="food" />
            </ImageContainer>
          )}
        </PlateContainer>
        <DescriptionContainer>
          <p>{checkValid(meal, "description")}</p>
        </DescriptionContainer>
      </PlateAndTextContainer>
      <ViewNotesIconContainer
        onClick={() => setViewNotes(!viewNotes)}
        viewNotes={viewNotes}
      >
        {checkValid(meal, "notes") && <FontAwesomeIcon icon={faChevronUp} />}
      </ViewNotesIconContainer>
      <StyledNotesContainer viewNotes={viewNotes} windowHeight={height}>
        <StyledNotes>
          <p>{checkValid(meal, "notes")}</p>
          <a
            href={meal.mealData.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {meal.mealData.link === "" ? "" : meal.mealData.link}
          </a>
        </StyledNotes>
        <ViewNotesIconContainer>
          <FontAwesomeIcon
            icon={faChevronDown}
            onClick={() => setViewNotes(!viewNotes)}
          />
        </ViewNotesIconContainer>
      </StyledNotesContainer>
    </ViewOneContainer>
  );
};

ViewOne.propTypes = {
  setMode: PropTypes.func,
  meal: PropTypes.object,
  oneMealId: PropTypes.string,
};

export default ViewOne;
