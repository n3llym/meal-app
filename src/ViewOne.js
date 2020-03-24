import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import plateImg from "./images/plateImg.png";

const ViewOneContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  contain: content;
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  position: fixed;
  top: 0;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  width: 90%;
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-top: 12.5vh;
  img {
    width: 90vw;
    height: auto;
    max-width: 600px;
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  width: 200px;
  background-color: gray;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
  }
`;

const DescriptionContainer = styled.div`
  width: 100%;
  height: auto;
  margin-top: 40px;
  text-align: center;
  p {
    margin: 0 15px;
  }
`;

const BackIconContainer = styled.div`
  font-size: 40px;
  color: gray;
  cursor: pointer;
  margin: 5px;
`;

const EditIconContainer = styled.div`
  font-size: 30px;
  color: gray;
  cursor: pointer;
  margin: 5px;
`;

const ViewNotesIconContainer = styled.div`
  display: ${props => props.viewNotes && "none"};
  position: fixed;
  bottom: 5px;
`;

const StyledNotes = styled.div`
  height: calc(100vh - 102px);
  position: absolute;
  bottom: 0;
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  display: ${props => !props.viewNotes && "none"};
  &::-webkit-scrollbar {
    display: none;
  }
  p {
    height: auto;
    margin: 15px;
  }
`;

const ViewOne = ({ setMode, oneMealId, meal }) => {
  console.log(meal);
  console.log(oneMealId);
  const [viewNotes, setViewNotes] = useState(false);

  return (
    <>
      <ViewOneContainer>
        <HeaderContainer>
          <BackIconContainer>
            <FontAwesomeIcon
              icon={faChevronLeft}
              onClick={() => {
                setMode("home");
              }}
            />
          </BackIconContainer>
          <Title>
            {/* <p>{meal && meal.mealData && meal.mealData.title}</p> */}
            <p>Risotto</p>
          </Title>
          <EditIconContainer>
            <FontAwesomeIcon icon={faEdit} onClick={() => setMode("edit")} />
          </EditIconContainer>
        </HeaderContainer>
        <PlateContainer>
          <img src={plateImg} />
          <ImageContainer>
            <img src={meal && meal.mealData.imgUrl} />
          </ImageContainer>
        </PlateContainer>
        <DescriptionContainer>
          {/* <p>{meal && meal.mealData && meal.mealData.description}</p> */}
          <p>Asparugus and Parmesan</p>
        </DescriptionContainer>
        <ViewNotesIconContainer
          onClick={() => setViewNotes(!viewNotes)}
          viewNotes={viewNotes}
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </ViewNotesIconContainer>
        <StyledNotes viewNotes={viewNotes}>
          {/* <p>{meal && meal.mealData && meal.mealData.notes}</p> */}
          <p>
            Notes and notes and notes and notesNotes and notes and notes and
            notes Notes and notes and notes and notes Notes and notes and notes
            and notes Notes and notes and notes and notes Notes and notes and
            notes and notes
          </p>
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
  oneMealId: PropTypes.string
};

export default ViewOne;
