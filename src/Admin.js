import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import useWindowDimensions from "./helpers/useWindowDimensions";

const AdminContainer = styled.div`
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

const ListContainer = styled.div`
  height: ${(props) => props.height - 65}px;
  overflow: scroll;
  width: 100%;
  text-align: center;
  padding: 5px 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.p`
  margin: 5px;
  cursor: pointer;
`;

const BackIconContainer = styled.button`
  position: fixed;
  font-size: 25px;
  bottom: 15px;
  color: gray;
  margin-top: 10px;
  border: none;
  background-color: none;
`;

const Admin = ({ setMode, meals, setMeal, setOneMealId, setPreviousMode }) => {
  const { height } = useWindowDimensions();

  const handleMealSelection = (id) => {
    setPreviousMode("admin");
    let oneMeal = meals.filter((x) => x.id === id);
    setMeal(oneMeal[0]);
    setOneMealId(id);
    setMode("view");
  };

  return (
    <AdminContainer height={height}>
      {meals && (
        <ListContainer height={height}>
          {meals.map((meal) => (
            <ListItem
              key={meal.id}
              onClick={() => handleMealSelection(meal.id)}
            >
              {meal.mealData.title}
            </ListItem>
          ))}
        </ListContainer>
      )}
      <BackIconContainer aria-label="Back">
        <FontAwesomeIcon
          icon={faChevronDown}
          onClick={() => {
            setMeal("");
            setMode("home");
            setPreviousMode("home");
          }}
        />
      </BackIconContainer>
    </AdminContainer>
  );
};

Admin.propTypes = {
  setMode: PropTypes.func,
  setOneMealId: PropTypes.func,
  setMeal: PropTypes.func,
  imagesArray: PropTypes.array,
  meals: PropTypes.array,
  setPreviousMode: PropTypes.func,
};

export default Admin;
