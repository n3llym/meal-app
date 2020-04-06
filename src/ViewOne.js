import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import plateImg from "./images/plateImg.png";
import { checkValid } from "./helpers/functions.js";
import useWindowDimensions from "./helpers/useWindowDimensions";

const ViewOneContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: ${(props) => props.height - 1}px;
  contain: content;
  justify-content: flex-start;
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  width: 90%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 32px 0 5px 0;
  height: 38px;
  padding: 5px;
  p {
    contain: content;
    text-align: center;
    margin: 0;
  }
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  img {
    width: 90vw;
    height: auto;
    max-width: 450px;
  }
`;

const ImageContainer = styled.div`
  height: ${(props) => props.width * 0.6}px;
  width: ${(props) => props.width * 0.6}px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  img {
    height: ${(props) => props.width * 0.6}px;
    width: ${(props) => props.width * 0.6}px;
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

const EditContainer = styled.div`
  font-size: 1rem;
  color: gray;
  cursor: pointer;
  position: fixed;
  right: 5px;
  top: 5px;
  p {
    margin: 0;
  }
`;

const ViewNotesIconContainer = styled.div`
  display: ${(props) => props.viewNotes && "none"};
  position: fixed;
  font-size: 25px;
  bottom: 15px;
  color: gray;
`;

const StyledNotes = styled.div`
  height: ${(props) => `calc(${props.height}px - 75px)`};
  position: absolute;
  bottom: 0;
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  display: ${(props) => !props.viewNotes && "none"};
  &::-webkit-scrollbar {
    display: none;
  }
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
  const { height, width } = useWindowDimensions();

  return (
    <>
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
        <EditContainer>
          <p onClick={() => setMode("edit")}>Edit</p>
        </EditContainer>
        <PlateContainer>
          <img src={plateImg} alt="plate" />
          {checkValid(meal, "imgUrl") && (
            <ImageContainer width={width}>
              <img src={checkValid(meal, "imgUrl")} alt="food" width={width} />
            </ImageContainer>
          )}
        </PlateContainer>
        <DescriptionContainer>
          <p>{checkValid(meal, "description")}</p>
        </DescriptionContainer>
        {(checkValid(meal, "notes") || checkValid(meal, "link")) && (
          <ViewNotesIconContainer
            onClick={() => setViewNotes(!viewNotes)}
            viewNotes={viewNotes}
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </ViewNotesIconContainer>
        )}
        <StyledNotes viewNotes={viewNotes} height={height}>
          <p>{checkValid(meal, "notes")}</p>
          <a
            href={meal.mealData.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {meal.mealData.link === "" ? "" : meal.mealData.link}
          </a>
          <ViewNotesIconContainer>
            <FontAwesomeIcon
              icon={faChevronDown}
              onClick={() => setViewNotes(!viewNotes)}
            />
          </ViewNotesIconContainer>
        </StyledNotes>
      </ViewOneContainer>
    </>
  );
};

ViewOne.propTypes = {
  setMode: PropTypes.func,
  meal: PropTypes.object,
  oneMealId: PropTypes.string,
};

export default ViewOne;
