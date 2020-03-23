import React, { useState } from "react";
import firebase from "./firebase";
import PropTypes from "prop-types";
import styled from "styled-components";
import CloseButton from "./Components/CloseButton";

const AddNewContainer = styled.div`
  margin: 50px;
  background: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 4px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.12);
  border: solid 1px grey;
  contain: content;
  form {
    width: 100%;
  }
`;

const InputContainer = styled.div`
  margin: 10px;
  width: 90%;
  input {
    width: 100%;
  }
  textarea {
    width: 100%;
    height: 5rem;
  }
`;

const SaveButton = styled.div`
  margin: 10px;
  border-radius: 40%;
  padding: 5px;
  width: 50px;
`;

const Edit = ({ meal, oneMealId, setEditMode, setMode }) => {
  const [name, setName] = useState(meal.title);
  const [description, setDescription] = useState(meal.description);
  const [notes, setNotes] = useState(meal.notes);

  const onUpdate = () => {
    const mealData = {
      title: name,
      description: description,
      notes: notes
    };
    const db = firebase.firestore();
    db.collection("meals")
      .doc(oneMealId)
      .set({ mealData });
    setEditMode(false);
  };

  const onDelete = () => {
    const db = firebase.firestore();
    db.collection("meals")
      .doc(oneMealId)
      .delete();
    setMode("home");
  };

  console.log(meal);

  return (
    <AddNewContainer>
      <CloseButton setMode={setEditMode} page={false} />
      <InputContainer>
        <label>Title</label>
        <br />
        <input
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
        />
      </InputContainer>
      <InputContainer>
        <label>Description</label>
        <br />
        <input
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
        />
      </InputContainer>
      <InputContainer>
        <label>Notes</label>
        <br />
        <textarea
          type="text"
          id="notes"
          value={notes}
          onChange={e => {
            setNotes(e.target.value);
          }}
        />
      </InputContainer>
      <SaveButton onClick={onUpdate}>Update</SaveButton>
      <SaveButton onClick={onDelete}>Delete</SaveButton>
    </AddNewContainer>
  );
};

Edit.propTypes = {
  setEditMode: PropTypes.func,
  setMode: PropTypes.func,
  meal: PropTypes.object,
  oneMealId: PropTypes.string
};

export default Edit;
