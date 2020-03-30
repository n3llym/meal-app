import React, { useRef, useEffect, useState } from "react";
import ReactAvatarEditor from "react-avatar-editor";
import PropTypes from "prop-types";
import styled from "styled-components";
import white from "./images/white.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import useWindowDimensions from "./helpers/useWindowDimensions";

const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarAndUploaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: absolute;
  top: 55px;
  background: rgba(0, 0, 0, 0);
  canvas {
    border-radius: 50%;
  }
`;

const AvatarEditorContainer = styled.div`
  height: ${props => props.width * 0.6}px;
  width: ${props => props.width * 0.6}px;
  max-width: 400px;
  max-height: 400px;
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
  visibility: ${props => props.imageAsFile && "hidden"};
  color: ${props => (props.imageUrl ? "white" : "gray")};
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

const SaveButton = styled.button`
  border-radius: 4px;
  padding: 5px;
  width: 150px;
  align-self: center;
  margin-top: 15px;
  color: gray;
`;

const ImageCropper = ({
  firebaseUpload,
  imageAsFile,
  setImageAsFile,
  imageUrl,
  mode,
  ...props
}) => {
  const editor = useRef();
  const { height, width } = useWindowDimensions();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleImageAsFile = e => {
    const imageAsFile = e.target.files[0];
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    setImageAsFile(imageAsFile);
  };

  const handleScale = e => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const handleRotation = e => {
    const rotation = e.target.value;
    console.log(rotation);
    setRotation(rotation);
  };

  const onClickSave = () => {
    if (editor) {
      const canvas = editor.current.getImageScaledToCanvas();
      canvas.toBlob(blob => {
        firebaseUpload(blob);
      });
    }
  };

  const imagePreview = () => {
    if (imageAsFile) {
      return imageAsFile;
    } else if (mode === "edit") {
      return imageUrl;
    } else {
      return white;
    }
  };

  return (
    <EditorContainer>
      <AvatarAndUploaderContainer>
        <FileUploaderButton
          htmlFor="image"
          className="imageUploader"
          imageAsFile={imageAsFile}
          imageUrl={imageUrl}
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
            min="1"
            max="360"
            step="10"
            defaultValue="0"
            disabled={imageAsFile ? false : true}
          />
        </LabelAndInputContainer>
      </ControlsContainer>
      <SaveButton
        onClick={() => onClickSave()}
        disabled={imageAsFile ? false : true}
      >
        Save Image
      </SaveButton>
    </EditorContainer>
  );
};

ImageCropper.propTypes = {
  imageAsFile: PropTypes.string,
  firebaseUpload: PropTypes.func,
  setImageAsFile: PropTypes.func,
  mode: PropTypes.string,
  imageUrl: PropTypes.string
};

export default ImageCropper;
