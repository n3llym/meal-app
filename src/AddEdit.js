import React, { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import firebase from "firebase";
import { storage } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons/faTrashAlt";
import { faImage } from "@fortawesome/free-regular-svg-icons/faImage";
import { faSearchMinus } from "@fortawesome/free-solid-svg-icons/faSearchMinus";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons/faUndoAlt";
import { checkValid } from "./helpers/functions.js";
import useWindowDimensions from "./helpers/useWindowDimensions";
import ReactAvatarEditor from "react-avatar-editor";

import plateImg from "./images/plateImg.png";
import white from "./images/white.png";
import EXIF from "exif-js";

const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";

const OuterContainer = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: ${(props) => props.windowHeight}px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none !important;
  }
  @media (min-width: 1025px) {
    width: 80%;
    max-width: 700px;
  }
`;

const AddNewContainer = styled.main`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${(props) => props.windowHeight}px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none !important;
  }
  @media (min-width: 1025px) {
    contain: content;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  min-height: fit-content;
  height: ${(props) => props.windowHeight}px;
  width: 100%;
  padding-bottom: 15px;
  @media (min-width: 1025px) {
    width: 100%;
    max-width: 700px;
  }
`;

const TitleInput = styled.div`
  width: 100%;
  height: auto;
  margin-top: 7px;
  input {
    font-size: 2rem;
    height: 38px;
    color: #545454;
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
    @media (min-width: 1025px) {
      margin: 0;
      input {
        margin 0;
      }
    }
  }
`;

const DescriptionNotesContainer = styled.div`
  contain: content;
  font-size: 1rem;
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 1025px) {
    width: 100%;
    form {
      width: 100%;
    }
  }
  form {
    width: 100%;
    display: contents;
  }
`;

const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  color: #545454;
  background-color: #faf8f8;
  border-radius: 4px;
  height: auto;
  margin: 0 15px 5px 15px;
  padding: 2px 5px;
  width: -webkit-fill-available;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: scroll;
  &.link {
    margin-top: 5px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 1025px) {
    margin: 0 0 15px 0;
    &.link {
      margin-top: 15px;
    }
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const StyledTextArea = styled.textarea`
  height: auto;
  font-size: 1rem;
  border: none;
  color: #545454;
  margin: 0 15px;
  width: -webkit-fill-available;
  background-color: #faf8f8;
  border-radius: 4px;
  padding: 5px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 1025px) {
    margin: 0;
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const Button = styled.button`
  cursor: pointer;
  font-size: 1rem;
  position: fixed;
  right: 5px;
  top: 5px;
  border: none;
  background-color: none;
  color: #545454;
  &.cancel {
    left: 5px;
    right: unset;
  }
`;

const DeleteIconButton = styled.button`
  color: red;
  border: none;
  background-color: none;
  cursor: pointer;
  font-size: 16px;
`;

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  height: ${(props) => props.maxWidth * 0.9}px;
  width: ${(props) => props.maxWidth * 0.9}px;
  max-width: 450px;
  max-height: 450px;
  .plate {
    width: ${(props) => props.maxWidth * 0.9}px;
    height: auto;
    max-width: 450px;
    position: relative;
  }
`;

const AvatarAndUploaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0);
  position: absolute;
  canvas {
    border-radius: 50%;
    height: ${(props) => props.maxWidth * 0.6}px;
    width: ${(props) => props.maxWidth * 0.6}px;
    max-width: 300px;
    max-height: 300px;
  }
`;

const AvatarEditorContainer = styled.div`
  height: ${(props) => props.maxWidth * 0.6}px;
  width: ${(props) => props.maxWidth * 0.6}px;
  max-width: 300px;
  max-height: 300px;
  contain: content;
  border-radius: 50%;
  position: relative;
  background: rgba(0, 0, 0, 0);
`;

const FileUploaderButton = styled.label`
  position: absolute;
  cursor: pointer;
  font-size: 40px;
  z-index: 2;
  visibility: ${(props) => props.imageAsFile && "hidden"};
  color: ${(props) => (props.imageUrl ? "white" : "#545454")};
`;

const HiddenFileInput = styled.input`
  position: absolute;
  border: none;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  &:focus {
    outline: none;
  }
`;

const PlateAndControlsContainer = styled.div`
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: auto;
  align-items: center;
`;

const LabelAndInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  input {
    width: 200px;
    margin: 5px;
  }
  svg {
    color: #dcdcdc;
  }
`;

const AddEdit = ({ setMode, meal, mode, setMeal, oneMealId, previousMode }) => {
  const [imageAsFile, setImageAsFile] = useState("");
  const [mealData, setMealData] = useState({
    title: checkValid(meal, "title") ? meal.mealData.title : "",
    description: checkValid(meal, "description")
      ? meal.mealData.description
      : "",
    notes: checkValid(meal, "notes") ? meal.mealData.notes : "",
    link: checkValid(meal, "link") ? meal.mealData.link : "",
    imgUrl: checkValid(meal, "imgUrl") ? meal.mealData.imgUrl : "",
    base64: checkValid(meal, "base64") ? meal.mealData.base64 : "",
  });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [initialRotation, setInitialRotation] = useState(0);

  const { height, maxWidth } = useWindowDimensions();
  const editor = useRef();

  function handleAddOrEditImage(urlValue, base64Value) {
    const db = firebase.firestore();
    if (mode === "edit") {
      db.collection("meals")
        .doc(oneMealId)
        .set({
          mealData: { ...mealData, imgUrl: urlValue, base64: base64Value },
        });
    } else {
      db.collection("meals").add({
        mealData: { ...mealData, imgUrl: urlValue, base64: base64Value },
      });
    }
  }

  async function onSave() {
    const canvas = editor.current.getImageScaledToCanvas();
    let promise = new Promise((resolve, reject) => {
      if (editor && imageAsFile !== "") {
        const canvas = editor.current.getImageScaledToCanvas();
        canvas.toBlob((e) => {
          const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(e);
          uploadTask.on(
            "state_changed",
            (snapShot) => {
              console.log(snapShot);
            },
            (err) => {
              reject(console.error(err));
            },
            () => {
              storage
                .ref("images")
                .child(imageAsFile.name)
                .getDownloadURL()
                .then((fireBaseUrl) => {
                  resolve(fireBaseUrl);
                });
            }
          );
        });
      } else if (checkValid(meal, "imgUrl")) {
        resolve(checkValid(meal, "imgUrl"));
      } else {
        resolve("");
      }
    });
    let urlValue = await promise;
    let base64Value;
    if (editor && imageAsFile !== "") {
      base64Value = canvas.toDataURL();
    } else if (checkValid(meal, "base64")) {
      base64Value = checkValid(meal, "base64");
    } else {
      base64Value = "";
    }
    await promise
      .then(
        setMeal({
          mealData: { ...mealData, imgUrl: urlValue, base64: base64Value },
        })
      )
      .then(handleAddOrEditImage(urlValue, base64Value))
      .then(setImageAsFile(""))
      .then(setMode("view"));
  }

  const handleFireBaseImageDelete = () => {
    if (checkValid(meal, "imgUrl")) {
      let httpsRef = storage.refFromURL(checkValid(meal, "imgUrl"));
      httpsRef
        .delete()
        .then(function () {
          console.log("file deleted");
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  const onDelete = () => {
    const db = firebase.firestore();
    db.collection("meals").doc(oneMealId).delete();
    handleFireBaseImageDelete();
    setMeal("");
    setMode(previousMode);
  };

  const handleTextChange = (field, value) => {
    setMealData((mealData) => ({
      ...mealData,
      [field]: value,
    }));
  };

  //handling image rotation on photo upload on mobile
  const handleImageAsFile = (e) => {
    const imageAsFile = e.target.files[0];
    EXIF.getData(imageAsFile, function () {
      let orientation = EXIF.getTag(this, "Orientation");
      switch (orientation) {
        case 8:
          setInitialRotation(270);
          setRotation(270);
          break;
        case 6:
          setInitialRotation(90);
          setRotation(90);
          break;
        case 3:
          setInitialRotation(180);
          setRotation(180);
          break;
        default:
          setInitialRotation(0);
          setRotation(0);
      }
    });
    if (imageAsFile === "") {
      console.error(`Not an image, the image file is a ${typeof imageAsFile}`);
    }
    setImageAsFile(imageAsFile);
  };

  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const handleRotation = (e) => {
    const value = e.target.value;
    setRotation(value);
  };

  const imagePreview = () => {
    if (imageAsFile) {
      return imageAsFile;
    } else if (
      mode === "edit" &&
      checkValid(meal, "imgUrl") &&
      checkValid(meal, "imgUrl") !== ""
    ) {
      return checkValid(meal, "imgUrl");
    } else {
      return white;
    }
  };

  return (
    <OuterContainer windowHeight={height}>
      <AddNewContainer windowHeight={height}>
        {mode === "add" && (
          <>
            <Button onClick={onSave}>Save</Button>
            <Button className="cancel" onClick={() => setMode("home")}>
              Cancel
            </Button>
          </>
        )}
        {mode === "edit" && (
          <>
            <Button onClick={onSave}>Update</Button>
            <Button className="cancel" onClick={() => setMode("view")}>
              Cancel
            </Button>
          </>
        )}
        <InnerContainer windowHeight={height}>
          <TitleInput>
            <label for="title" />
            <input
              type="text"
              id="title"
              name="title"
              rows="2"
              onChange={(event) =>
                handleTextChange("title", event.target.value)
              }
              defaultValue={mealData.title === "" ? "" : mealData.title}
              placeholder={"Meal"}
              autoComplete="off"
              aria-label="title"
            />
          </TitleInput>
          <PlateAndControlsContainer>
            <PlateContainer maxWidth={maxWidth}>
              <img src={plateImg} alt="plate" className="plate" />
              <AvatarAndUploaderContainer maxWidth={maxWidth}>
                <FileUploaderButton
                  htmlFor="image"
                  className="imageUploader"
                  imageAsFile={imageAsFile}
                  imageUrl={checkValid(meal, "imgUrl")}
                >
                  <FontAwesomeIcon icon={faImage} />{" "}
                </FileUploaderButton>
                <label for="image-uploader" />
                <HiddenFileInput
                  type="file"
                  id="image-uploader"
                  name="image"
                  className="fileinput"
                  onChange={handleImageAsFile}
                  accept={acceptedFileTypes}
                  multiple={false}
                  aria-label="image-uploader"
                />
                <AvatarEditorContainer maxWidth={maxWidth}>
                  <ReactAvatarEditor
                    ref={editor}
                    image={imagePreview()}
                    width={maxWidth * 0.6}
                    height={maxWidth * 0.6}
                    scale={parseFloat(scale)}
                    border={0}
                    borderRadius={150}
                    rotate={rotation}
                    color={[255, 255, 255, 0]}
                  />
                </AvatarEditorContainer>
              </AvatarAndUploaderContainer>
            </PlateContainer>
            <ControlsContainer>
              <LabelAndInputContainer>
                <FontAwesomeIcon icon={faSearchMinus} />
                <label for="scale" />
                <input
                  name="scale"
                  id="scale"
                  type="range"
                  onChange={handleScale}
                  min="1"
                  max="2"
                  step="0.01"
                  defaultValue="1"
                  disabled={imageAsFile ? false : true}
                  aria-label="image scale"
                />
                <FontAwesomeIcon icon={faSearchPlus} />
              </LabelAndInputContainer>
              <LabelAndInputContainer>
                <FontAwesomeIcon icon={faUndoAlt} />
                <label for="rotation" />
                <input
                  name="rotation"
                  id="rotation"
                  type="range"
                  onChange={handleRotation}
                  min={initialRotation}
                  max={initialRotation + 360}
                  step="10"
                  defaultValue={initialRotation}
                  disabled={imageAsFile ? false : true}
                  aria-label="image rotation"
                />
                <FontAwesomeIcon icon={faRedoAlt} />
              </LabelAndInputContainer>
            </ControlsContainer>
          </PlateAndControlsContainer>
          <DescriptionNotesContainer>
            <form>
              <label for="description" />
              <StyledInput
                type="text"
                id="description"
                name="description"
                onChange={(event) =>
                  handleTextChange("description", event.target.value)
                }
                defaultValue={
                  mealData.description === "" ? "" : mealData.description
                }
                placeholder="Description"
                autoComplete="off"
                aria-label="Description"
              />
              <label for="notes" />
              <StyledTextArea
                type="text"
                id="notes"
                name="notes"
                onChange={(event) =>
                  handleTextChange("notes", event.target.value)
                }
                defaultValue={mealData.notes === "" ? "" : mealData.notes}
                placeholder="Notes"
                aria-label="Notes"
              />
              <label for="link" />
              <StyledInput
                type="url"
                id="link"
                name="link"
                className="link"
                onChange={(event) =>
                  handleTextChange("link", event.target.value)
                }
                defaultValue={
                  mealData.link && mealData.link === "" ? "" : mealData.link
                }
                placeholder="Link"
                autoComplete="off"
                aria-label="Link"
              />
            </form>
          </DescriptionNotesContainer>
          {mode === "edit" && (
            <DeleteIconButton aria-label="delete">
              <FontAwesomeIcon icon={faTrashAlt} onClick={() => onDelete()} />
            </DeleteIconButton>
          )}
        </InnerContainer>
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
  mode: PropTypes.string,
  previousMode: PropTypes.string,
};

export default AddEdit;
