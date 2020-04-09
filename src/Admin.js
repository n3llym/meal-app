import React from "react";
import "./theme.js";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
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

const BackIconContainer = styled.div`
  position: fixed;
  font-size: 25px;
  bottom: 15px;
  color: gray;
  margin-top: 10px;
`;

const Admin = ({ setMode, meals, setMeal, setOneMealId, setPreviousMode }) => {
  const { height } = useWindowDimensions();
  const handleClick = (id) => {
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
            <ListItem key={meal.id} onClick={() => handleClick(meal.id)}>
              {meal.mealData.title}
            </ListItem>
          ))}
        </ListContainer>
      )}
      <BackIconContainer>
        <FontAwesomeIcon
          icon={faChevronDown}
          onClick={() => {
            setMeal("");
            setMode("home");
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
};

export default Admin;
