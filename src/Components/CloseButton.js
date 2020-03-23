import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Close = styled.div`
  height: 15px;
  width: 15px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  position: absolute;
  right: 0;
`;

const CloseButton = ({ setMode, page }) => {
  return <Close onClick={() => setMode(page)}></Close>;
};

CloseButton.propTypes = {
  setMode: PropTypes.func,
  page: PropTypes.string
};

export default CloseButton;
