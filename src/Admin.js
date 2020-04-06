import React, { useEffect } from "react";
import "./theme.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import useWindowDimensions from "./helpers/useWindowDimensions";

const AdminContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: ${props => props.height - 1}px;
  contain: content;
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const ListContainer = styled.div`
  height: auto;
  margin: 32px 0 15px 0;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.p`
  margin: 5px;
  cursor: pointer;
`;

const BackIconContainer = styled.div`
  font-size: 40px;
  color: gray;
  cursor: pointer;
  position: fixed;
  left: 5px;
  top: 5px;
`;

const Admin = ({ setMode, meals, setMeal, setPreviousMode }) => {
  const { height } = useWindowDimensions();
  const handleClick = id => {
    setPreviousMode("admin");
    let oneMeal = meals.filter(x => x.id === id);
    setMeal(oneMeal[0]);
    setMode("view");
  };

  useEffect(() => {
    meals.sort((a, b) => (a.mealData.title > b.mealData.title ? 1 : -1));
  }, [meals]);

  return (
    <AdminContainer height={height}>
      <BackIconContainer>
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={() => {
            setMeal("");
            setMode("home");
          }}
        />
      </BackIconContainer>
      <ListContainer>
        {meals.map(meal => (
          <ListItem key={meal.id} onClick={() => handleClick(meal.id)}>
            {meal.mealData.title}
          </ListItem>
        ))}
      </ListContainer>
    </AdminContainer>
  );
};

Admin.propTypes = {
  setMode: PropTypes.func,
  setOneMealId: PropTypes.func,
  setMeal: PropTypes.func,
  imagesArray: PropTypes.array
};

export default Admin;
