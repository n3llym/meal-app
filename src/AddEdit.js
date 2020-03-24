import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import firebase from "firebase";
import { storage } from "./firebase";
import plateImg from "./images/plateImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const AddNewContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  contain: content;
  overflow-x: scroll;
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const InnerContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

const TitleInput = styled.div`
  margin: 32px 0;
  & input {
    font-size: 2rem;
    color: gray;
    background-color: #faf8f8;
    border: none;
    border-radius: 4px;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding: 5px;
    width: calc(100vw - 140px);
    &:focus::placeholder {
      color: transparent;
    }
  }
`;

const DescriptionNotesInput = styled.div`
  contain: content;
  margin: 10px 0px;
  font-size: 1rem;
  width: 100vw;
  input {
    font-size: 1rem;
    border: none;
    color: gray;
    background-color: #faf8f8;
    border-radius: 4px;
    height: auto;
    margin: 0 15px;
    width: -webkit-fill-available;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    &:focus::placeholder {
      color: transparent;
    }
  }
  textarea {
    height: 5rem;
    font-size: 1rem;
    border: none;
    color: gray;
    margin: 0 15px;
    width: -webkit-fill-available;
    background-color: #faf8f8;
    border-radius: 4px;
    overflow-y: scroll;
    padding: 5px;
    &::-webkit-scrollbar {
      display: none;
    }
    &:focus::placeholder {
      color: transparent;
    }
  }
`;

const SaveButton = styled.div`
  cursor: pointer;
  font-size: 1rem;
  position: fixed;
  right: 5px;
  top: 5px;
`;

const CancelButton = styled.div`
  cursor: pointer;
  font-size: 1rem;
  position: fixed;
  left: 5px;
  top: 5px;
`;

const DeleteIconContainer = styled.div`
  color: red;
  margin-bottom: 15px;
`;

const ImageContainer = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  contain: content;
  position: absolute;
  img {
    height: 200px;
    width: 200px;
    object-fit: cover;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ImageInput = styled.div`
  label {
    position: absolute;
    top: 45%;
    left: 35%;
    cursor: pointer;
  }
  .inputfile {
    position: absolute;
    top: 45%;
    left: 35%;
    border: none;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    &:focus {
      outline: none;
    }
  }
`;

const AddImageButton = styled.div`
  cursor: pointer;
  position: absolute;
`;

const AddEdit = ({ setMode, meal, mode, setMeal, oneMealId }) => {
  const [imageAsFile, setImageAsFile] = useState("");
  const [newMealData, setNewMealData] = useState({
    title: meal ? meal.mealData.title : "",
    description: meal ? meal.mealData.description : "",
    notes: meal ? meal.mealData.notes : "",
    imgUrl: meal ? meal.mealData.imgUrl : ""
  });

  console.log(newMealData.imgUrl);

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
      <InnerContainer>
        {mode === "add" && (
          <>
            <SaveButton onClick={onSave}>Save</SaveButton>
            <CancelButton onClick={() => setMode("home")}>Cancel</CancelButton>
          </>
        )}
        {mode === "edit" && (
          <>
            <SaveButton onClick={onUpdate}>Update</SaveButton>
            <CancelButton onClick={() => setMode("view")}>Cancel</CancelButton>
          </>
        )}
        <form>
          <TitleInput>
            <input
              type="text"
              id="title"
              name="title"
              onChange={event => handleChange("title", event.target.value)}
              defaultValue={newMealData.title === "" ? "" : newMealData.title}
              placeholder={"Meal"}
            ></input>
          </TitleInput>
        </form>
        <PlateContainer>
          <img src={plateImg} />
          {!imageAsFile && (
            <ImageInput>
              <label for="image">Choose an Image</label>
              <input
                type="file"
                id="image"
                name="image"
                className="inputfile"
                onChange={handleImageAsFile}
              ></input>
            </ImageInput>
          )}
          {imageAsFile && (
            <AddImageButton onClick={e => handleFireBaseImageUpload(e)}>
              Save
            </AddImageButton>
          )}
          {/* {imageAsFile && newMealData.imgUrl && ( */}
          <ImageContainer>
            {/* <img src={newMealData.imgUrl} /> */}
            <img src="https://firebasestorage.googleapis.com/v0/b/meal-app-647ba.appspot.com/o/images%2FIMG_0001.jpeg?alt=media&token=082a5fb9-2794-45f2-8cf9-a55454a3d2bf" />
          </ImageContainer>
          {/* )} */}
        </PlateContainer>
        <form>
          <DescriptionNotesInput>
            <input
              type="text"
              id="description"
              name="description"
              onChange={event =>
                handleChange("description", event.target.value)
              }
              defaultValue={
                newMealData.description === "" ? "" : newMealData.description
              }
              placeholder={"Description"}
            ></input>
          </DescriptionNotesInput>
          <DescriptionNotesInput>
            <textarea
              type="text"
              id="notes"
              name="notes"
              onChange={event => handleChange("notes", event.target.value)}
              defaultValue={
                newMealData.notes === "" ? "" : setNewMealData.description
              }
              placeholder={"Notes"}
            ></textarea>
          </DescriptionNotesInput>
        </form>
      </InnerContainer>
      {mode === "edit" && (
        <DeleteIconContainer>
          <FontAwesomeIcon icon={faTrashAlt} onClick={() => onDelete()} />
        </DeleteIconContainer>
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
