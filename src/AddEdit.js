import React, { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import firebase from "firebase";
import { storage } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { checkValid } from "./helpers/functions.js";
import useWindowDimensions from "./helpers/useWindowDimensions";
import ReactAvatarEditor from "react-avatar-editor";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import plateImg from "./images/plateImg.png";
import white from "./images/white.png";
import EXIF from "exif-js";

const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";

const OuterContainer = styled.div`
  height: ${(props) => props.windowHeight - 1}px;
  width: 100vw;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::--scrollbar {
    display: none !important;
  }
`;

const AddNewContainer = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
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
  height: auto;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  input {
    font-size: 1rem;
    border: none;
    color: gray;
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
      width: 79%;
      max-width: 690px;
      margin: 0 15px 15px 15px;
      &.link {
        margin-top: 15px;
      }
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
    @media (min-width: 1025px) {
      width: 79%;
      max-width: 690px;
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

const PlateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  .plate {
    width: 90vw;
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
    height: ${(props) => props.width * 0.6}px;
    width: ${(props) => props.width * 0.6}px;
    max-width: 300px;
    max-height: 300px;
  }
`;

const AvatarEditorContainer = styled.div`
  height: ${(props) => props.width * 0.6}px;
  width: ${(props) => props.width * 0.6}px;
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
  color: ${(props) => (props.imageUrl ? "white" : "gray")};
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

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  label {
    font-size: 0.5rem;
  }
  input {
    color: red;
    margin: 5px;
  }
`;

const LabelAndInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  input {
    width: 200px;
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
  });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [initialRotation, setInitialRotation] = useState(0);

  const { height, width } = useWindowDimensions();
  const editor = useRef();

  function addOrEditConditional(value) {
    const db = firebase.firestore();
    if (mode === "edit") {
      db.collection("meals")
        .doc(oneMealId)
        .set({ mealData: { ...mealData, imgUrl: value } });
    } else {
      db.collection("meals").add({ mealData: { ...mealData, imgUrl: value } });
    }
  }

  async function onSave() {
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
              reject(console.log(err));
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
    let value = await promise;
    await promise
      .then(setMeal({ mealData: { ...mealData, imgUrl: value } }))
      .then(addOrEditConditional(value))
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
          console.log("error deleting file");
        });
    }
  };

  const onDelete = () => {
    const db = firebase.firestore();
    db.collection("meals").doc(oneMealId).delete();
    handleFireBaseImageDelete();
    setMode("home");
  };

  const handleChange = (field, value) => {
    setMealData((mealData) => ({
      ...mealData,
      [field]: value,
    }));
  };

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
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
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
        <InnerContainer mode={mode}>
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
              <SaveButton onClick={onSave}>Update</SaveButton>
              <CancelButton onClick={() => setMode(previousMode)}>
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
              onChange={(event) => handleChange("title", event.target.value)}
              defaultValue={mealData.title === "" ? "" : mealData.title}
              placeholder={"Meal"}
              autoComplete="off"
            />
          </TitleInput>
          <>
            <PlateContainer>
              <img src={plateImg} alt="plate" className="plate" />
              <AvatarAndUploaderContainer width={width}>
                <FileUploaderButton
                  htmlFor="image"
                  className="imageUploader"
                  imageAsFile={imageAsFile}
                  imageUrl={checkValid(meal, "imgUrl")}
                >
                  <FontAwesomeIcon icon={faImage} />{" "}
                </FileUploaderButton>
                <HiddenFileInput
                  type="file"
                  id="image"
                  name="image"
                  className="fileinput"
                  onChange={handleImageAsFile}
                  accept={acceptedFileTypes}
                  multiple={false}
                />
                <AvatarEditorContainer width={width}>
                  <ReactAvatarEditor
                    ref={editor}
                    image={imagePreview()}
                    width={width * 0.6}
                    height={width * 0.6}
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
                <label htmlFor="scale">Zoom</label>
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
                />
              </LabelAndInputContainer>
              <LabelAndInputContainer>
                <label htmlFor="rotation">Rotate</label>
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
                />
              </LabelAndInputContainer>
            </ControlsContainer>
          </>
          <form>
            <DescriptionNotesInput>
              <input
                type="text"
                id="description"
                name="description"
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                defaultValue={
                  mealData.description === "" ? "" : mealData.description
                }
                placeholder="Description"
                autoComplete="off"
              />
              <textarea
                type="text"
                id="notes"
                name="notes"
                onChange={(event) => handleChange("notes", event.target.value)}
                defaultValue={mealData.notes === "" ? "" : mealData.notes}
                placeholder="Notes"
              />
              <input
                type="url"
                id="link"
                name="link"
                className="link"
                onChange={(event) => handleChange("link", event.target.value)}
                defaultValue={
                  mealData.link && mealData.link === "" ? "" : mealData.link
                }
                placeholder="Link"
                autoComplete="off"
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
  mode: PropTypes.string,
};

export default AddEdit;
