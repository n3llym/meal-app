import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import firebase from "firebase";
import { storage } from "./firebase";
import CloseButton from "./Components/CloseButton";

const AddNewContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: scroll;
  border-radius: 4px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.12);
  border: solid 1px grey;
  contain: content;
  padding: 0 25px;
  form {
    border: 2px solid blue;
    padding: 75px 0;
  }
  @media (min-width: 1025px) {
    margin: 50px;
    width: 80%;
    max-width: 700px;
  }
`;

const InputContainer = styled.div`
  margin: 20px;
  border: 2px solid red;
  contain: content;
  label {
  }
  input {
    width: 98%;
    font-size: 1rem;
  }
  textarea {
    width: 98%;
    height: 5rem;
    font-size: 1rem;
  }
`;

const SaveButton = styled.button`
  margin: 25px;
  padding: 10px;
  width: 100px;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
  font-size: 1rem;
`;

const ImageContainer = styled.div`
  height: 500px;
  width: 500px;
  contain: content;
  img {
    height: 500px;
    width: 500px;
  }
`;

const AddEdit = ({ setMode, meal, mode, setMeal, oneMealId }) => {
  const [imageAsFile, setImageAsFile] = useState("");
  const [newMealData, setNewMealData] = useState({
    title: meal ? meal.mealData.title : "",
    description: meal ? meal.mealData.description : "",
    notes: meal ? meal.mealData.notes : "",
    imgUrl: meal ? meal.mealData.imgUrl : ""
  });

  const onSave = () => {
    const db = firebase.firestore();
    db.collection("meals").add({ newMealData });
    setMeal({ mealData: newMealData });
    setMode("view");
  };

  const onUpdate = () => {
    const db = firebase.firestore();
    db.collection("meals")
      .doc(oneMealId)
      .set({ newMealData });
    setMeal({ mealData: newMealData });
    setMode("view");
  };

  const onDelete = () => {
    const db = firebase.firestore();
    db.collection("meals")
      .doc(oneMealId)
      .delete();
    setMode("home");
  };

  const handleImageAsFile = e => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image);
  };

  const handleFireBaseImageUpload = e => {
    e.preventDefault();
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);

    uploadTask.on(
      "state_changed",
      snapShot => {
        console.log(snapShot);
      },
      err => {
        console.log(err);
      },
      () => {
        storage
          .ref("images")
          .child(imageAsFile.name)
          .getDownloadURL()
          .then(fireBaseUrl => {
            setNewMealData(prevObject => ({
              ...prevObject,
              imgUrl: fireBaseUrl
            }));
          });
      }
    );
  };

  const handleChange = (field, value) => {
    setNewMealData(newMealData => ({
      ...newMealData,
      [field]: value
    }));
  };

  return (
    <AddNewContainer>
      <CloseButton setMode={setMode} page={"home"} />
      <form onSubmit={handleFireBaseImageUpload}>
        <InputContainer>
          <label>Image</label>
          <br />
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageAsFile}
          ></input>
        </InputContainer>
        <button>Add Image</button>
      </form>
      {imageAsFile && newMealData.imgUrl && (
        <ImageContainer>
          <img src={newMealData.imgUrl} />
        </ImageContainer>
      )}
      <form>
        <InputContainer>
          <label>Title</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            onChange={event => handleChange("title", event.target.value)}
            defaultValue={newMealData.title}
          ></input>
        </InputContainer>
        <InputContainer>
          <label>Description</label>
          <br />
          <input
            type="text"
            id="description"
            name="description"
            onChange={event => handleChange("description", event.target.value)}
            defaultValue={newMealData.description}
          ></input>
        </InputContainer>
        <InputContainer>
          <label>Notes</label>
          <br />
          <textarea
            type="text"
            id="notes"
            name="notes"
            onChange={event => handleChange("notes", event.target.value)}
            defaultValue={newMealData.notes}
          ></textarea>
        </InputContainer>
      </form>
      {mode === "add" && (
        <SaveButton type="submit" value="Save" onClick={onSave}>
          Save
        </SaveButton>
      )}
      {mode === "edit" && (
        <>
          <SaveButton onClick={onUpdate} type="submit" value="Update">
            Update
          </SaveButton>
          <SaveButton onClick={onDelete} type="submit" value="Delete">
            Delete
          </SaveButton>
        </>
      )}
    </AddNewContainer>
  );
};

AddEdit.propTypes = {
  setMode: PropTypes.func,
  setEditMode: PropTypes.func,
  meal: PropTypes.object,
  setMeal: PropTypes.func,
  oneMealId: PropTypes.string,
  mode: PropTypes.string
};

export default AddEdit;
