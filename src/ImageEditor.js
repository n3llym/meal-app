import React, { useRef, useEffect, useState } from "react";
import ReactAvatarEditor from "react-avatar-editor";
import PropTypes from "prop-types";
import styled from "styled-components";
import plateImg from "./images/plateImg.png";

const ImageCropper = ({ firebaseUpload, setImageAsFile, imageAsFile }) => {
  const editor = useRef();
  const [scale, setScale] = useState(1);
  // const [imageAsFile, setImageAsFile] = useState(plateImg);

  const handleScale = e => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const handleImageAsFile = e => {
    // e.preventDefault();
    const imageAsFile = e.target.files[0];
    setImageAsFile(imageAsFile);
  };

  const onClickSave = () => {
    if (editor) {
      const canvas = editor.current.getImageScaledToCanvas();
      canvas.toBlob(blob => {
        // let url = URL.createObjectURL(blob);
        firebaseUpload(blob);
      });
    }
  };

  return (
    <>
      <ReactAvatarEditor
        ref={editor}
        image={imageAsFile ? imageAsFile : plateImg}
        width={250}
        height={250}
        scale={parseFloat(scale)}
      />
      <input name="newImage" type="file" onChange={handleImageAsFile} />
      <input
        name="Scale"
        type="range"
        onChange={handleScale}
        min="1"
        max="2"
        step="0.01"
        defaultValue="1"
      />
      <button onClick={() => onClickSave()}>Save</button>
    </>
  );
};

ImageCropper.propTypes = {
  imageSrc: PropTypes.string
};

export default ImageCropper;
