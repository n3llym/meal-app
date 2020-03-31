import React, { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import firebase from "firebase";
import { storage } from "./firebase";
import plateImg from "./images/plateImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { checkValid } from "./helpers/functions.js";
import ImageCropper from "./ImageEditor";
import useWindowDimensions from "./helpers/useWindowDimensions";

const OuterContainer = styled.div`
  height: ${props => props.height - 1}px;
  height: 100%;
  width: 100vw;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::-webkit-scrollbar {
    display: none !important;
  }
  // border: 2px solid red;
`;

const AddNewContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  // border: 2px solid green;
  // contain: content;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none !important;
  }
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  // border: 2px solid yellow;
  height: ${props => props.height - 1}px;
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  margin: 0 5px;
  .plate {
    width: 90vw;
    height: auto;
    max-width: 450px;
  }
`;

const TitleInput = styled.div`
  margin: 32px 0 5px 0;
  width: 100%;
  height: auto;
  & input {
    font-size: 2rem;
    height: 38px;
    color: gray;
    font-family: "Helvetica Neue";
    background-color: #faf8f8;
    border: none;
    border-radius: 4px;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding: 5px;
    margin: 0 15px;
    width: -webkit-fill-available;
    resize: none;
    &:focus::placeholder {
      color: transparent;
    }
  }
`;

const DescriptionNotesInput = styled.div`
  contain: content;
  margin: 15px 0;
  font-size: 1rem;
  width: 100vw;
  input {
    font-size: 1rem;
    border: none;
    color: gray;
    background-color: #faf8f8;
    border-radius: 4px;
    height: auto;
    margin: 0 15px 15px 15px;
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
    height: auto;
    font-size: 1rem;
    border: none;
    color: gray;
    margin: 0 15px;
    width: -webkit-fill-available;
    background-color: #faf8f8;
    border-radius: 4px;
    padding: 5px;
    overflow-y: scroll;
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
  cursor: pointer;
`;

const ImageContainer = styled.div`
  height: 250px;
  width: 250px;
  border-radius: 50%;
  contain: content;
  position: absolute;
  img {
    height: 250px;
    width: 250px;
    object-fit: cover;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
  }
`;

const AddEdit = ({ setMode, meal, mode, setMeal, oneMealId }) => {
  const [imageAsFile, setImageAsFile] = useState("");
  const [mealData, setMealData] = useState({
    title: checkValid(meal, "title") ? meal.mealData.title : "",
    description: checkValid(meal, "description")
      ? meal.mealData.description
      : "",
    notes: checkValid(meal, "notes") ? meal.mealData.notes : "",
    imgUrl: checkValid(meal, "imgUrl") ? meal.mealData.imgUrl : ""
  });
  const { height, width } = useWindowDimensions();

  const onSave = () => {
    const db = firebase.firestore();
    db.collection("meals").add({ mealData });
    setMeal({ mealData: mealData });
    setImageAsFile("");
    setMode("view");
  };

  console.log("meal", meal);
  const onUpdate = () => {
    //to-do: add ability to update photo
    const db = firebase.firestore();
    db.collection("meals")
      .doc(oneMealId)
      .set({ mealData });
    setMeal({ mealData: mealData });
    setMode("view");
  };

  const handleFireBaseImageDelete = () => {
    if (checkValid(meal, "imgUrl")) {
      let httpsRef = storage.refFromURL(checkValid(meal, "imgUrl"));
      httpsRef
        .delete()
        .then(function() {
          console.log("file deleted");
        })
        .catch(function(error) {
          console.log("error deleting file");
        });
    }
  };

  const onDelete = () => {
    const db = firebase.firestore();
    db.collection("meals")
      .doc(oneMealId)
      .delete();
    handleFireBaseImageDelete();
    setMode("home");
  };

  const handleFireBaseImageUpload = e => {
    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(e);

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
            setMealData(prevObject => ({
              ...prevObject,
              imgUrl: fireBaseUrl
            }));
          });
      }
    );
  };

  const handleChange = (field, value) => {
    setMealData(mealData => ({
      ...mealData,
      [field]: value
    }));
  };

  return (
    <OuterContainer height={height}>
      <AddNewContainer height={height}>
        <InnerContainer height={height}>
          {mode === "add" && (
            <>
              <SaveButton onClick={onSave}>Save</SaveButton>
              <CancelButton onClick={() => setMode("home")}>
                Cancel
              </CancelButton>
            </>
          )}
          {mode === "edit" && (
            <>
              <SaveButton onClick={onUpdate}>Update</SaveButton>
              <CancelButton onClick={() => setMode("view")}>
                Cancel
              </CancelButton>
            </>
          )}
          <TitleInput>
            <input
              type="text"
              id="title"
              name="title"
              rows="2"
              onChange={event => handleChange("title", event.target.value)}
              defaultValue={mealData.title === "" ? "" : mealData.title}
              placeholder={"Meal"}
            />
          </TitleInput>
          {(!mealData.imgUrl || mode === "edit") && (
            <ImageCropper
              firebaseUpload={handleFireBaseImageUpload}
              imageAsFile={imageAsFile}
              setImageAsFile={setImageAsFile}
              imageUrl={mealData.imgUrl}
              mode={mode}
            />
          )}
          {mealData.imgUrl && mode !== "edit" && (
            <PlateContainer>
              <img src={plateImg} alt="plate" className="plate" />
              <ImageContainer>
                <img src={mealData.imgUrl} alt="food" />
              </ImageContainer>
            </PlateContainer>
          )}

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
                  mealData.description === "" ? "" : mealData.description
                }
                placeholder={"Description"}
              />
              <textarea
                type="text"
                id="notes"
                name="notes"
                onChange={event => handleChange("notes", event.target.value)}
                defaultValue={mealData.notes === "" ? "" : mealData.notes}
                placeholder={"Notes"}
              />
            </DescriptionNotesInput>
          </form>
        </InnerContainer>
        {mode === "edit" && (
          <DeleteIconContainer>
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => onDelete()} />
          </DeleteIconContainer>
        )}
      </AddNewContainer>
    </OuterContainer>
  );
};

AddEdit.propTypes = {
  setMode: PropTypes.func,
  setEditMode: PropTypes.func,
  meal: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setMeal: PropTypes.func,
  oneMealId: PropTypes.string,
  mode: PropTypes.string
};

export default AddEdit;
