import React from "react";
import AvatarEditor from "react-avatar-editor";
import PropTypes from "prop-types";

const MyEditor = ({ imageUrl, imageScale, handleScale }) => {
  return (
    <>
      <AvatarEditor
        image={imageUrl}
        width={250}
        height={250}
        border={25}
        scale={imageScale}
        rotate={0}
        borderRadius={120}
      />
      <input
        name="scale"
        type="range"
        min="0.1"
        max="2"
        step="0.01"
        defaultValue="1"
        onChange={handleScale}
      />
    </>
  );
};
MyEditor.defaultProps = {
  image:
    "https://firebasestorage.googleapis.com/v0/b/meal-app-647ba.appspot.com/o/images%2FIMG_0016.jpg?alt=media&token=7b76104a-97e7-47c5-ae80-32d627ae0abf"
};

MyEditor.propTypes = {
  imageUrl: PropTypes.string,
  imageScale: PropTypes.number,
  handleScale: PropTypes.func
};

export default MyEditor;
