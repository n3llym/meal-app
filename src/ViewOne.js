import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Edit from "./Edit";
import CloseButton from "./Components/CloseButton";

const ViewOneContainer = styled.div`
  background: white;
  width: 100vw;
  height: 100vh;
  border-radius: 4px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.12);
  border: solid 1px grey;
  position: relative;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 1025px) {
    margin: 50px;
    width: 80%;
    max-width: 700px;
  }
`;

const TextContainer = styled.div`
  height: 100vh;
  width: 100%;
  background-color: blue;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  background-color: green;
  height: 75px;
  width: 100%;
  margin: 75px 20px;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  height: 250px;
  width: 250px;
  background-color: yellow;
`;

const StyledNotes = styled.div`
  height: 60vh;
  background-color: pink;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  p {
    border: 2px solid white;
  }
`;

const ViewOne = ({ setMode, meal, oneMealId }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      {!editMode ? (
        <ViewOneContainer>
          <CloseButton setMode={setMode} page={"home"} />
          <TextContainer>
            <Title
              className="title"
              onClick={() => {
                setEditMode(true);
              }}
            >
              <p>{meal && meal.mealData && meal.mealData.title}</p>
            </Title>
            <ImageContainer></ImageContainer>
          </TextContainer>
          <StyledNotes>
            <p>{meal && meal.mealData && meal.mealData.notes}</p>
          </StyledNotes>
        </ViewOneContainer>
      ) : (
        <Edit
          meal={meal.mealData}
          oneMealId={oneMealId}
          setEditMode={setEditMode}
          setMode={setMode}
          setEditMode={setEditMode}
        />
      )}
    </>
  );
};

ViewOne.propTypes = {
  setMode: PropTypes.func,
  meal: PropTypes.object,
  oneMealId: PropTypes.string
};

export default ViewOne;
