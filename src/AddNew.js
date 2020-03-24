// import React, { useState } from "react";
// import styled from "styled-components";
// import PropTypes from "prop-types";
// import firebase from "firebase";
// import { storage } from "./firebase";
// import CloseButton from "./Components/CloseButton";

// const AddNewContainer = styled.div`
//   background: white;
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   border-radius: 4px;
//   box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.12);
//   border: solid 1px grey;
//   contain: content;
//   padding: 0 25px;
//   form {
//     border: 2px solid blue;
//     padding: 75px 0;
//   }
//   @media (min-width: 1025px) {
//     margin: 50px;
//     width: 80%;
//     max-width: 700px;
//   }
// `;

// const InputContainer = styled.div`
//   margin: 20px;
//   border: 2px solid red;
//   contain: content;
//   label {
//   }
//   input {
//     width: 98%;
//     font-size: 1rem;
//   }
//   textarea {
//     width: 98%;
//     height: 5rem;
//     font-size: 1rem;
//   }
// `;

// const SaveButton = styled.button`
//   margin: 25px;
//   padding: 10px;
//   width: 100px;
//   border-radius: 4px;
//   cursor: pointer;
//   align-self: center;
//   font-size: 1rem;
// `;

// const ImageContainer = styled.div`
//   height: 500px;
//   width: 500px;
//   contain: content;
//   img {
//     height: 500px;
//     width: 500px;
//   }
// `;

// const AddNew = ({ setMode }) => {
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newNotes, setNewNotes] = useState("");
//   // const allInputs = { imgUrl: "" };
//   const [imageAsFile, setImageAsFile] = useState("");
//   const [imageAsUrl, setImageAsUrl] = useState();

//   const saveData = () => {
//     const mealData = {
//       title: newTitle,
//       description: newDescription,
//       notes: newNotes,
//       imgUrl: imageAsUrl
//     };
//     const db = firebase.firestore();
//     db.collection("meals").add({ mealData });

//     setMode("view");
//   };

//   const handleImageAsFile = e => {
//     const image = e.target.files[0];
//     setImageAsFile(() => image);
//   };

//   const handleFireBaseUpload = e => {
//     e.preventDefault();
//     console.log("start of upload");
//     if (imageAsFile === "") {
//       console.error(`not an image, the image file is a ${typeof imageAsFile}`);
//     }
//     const uploadTask = storage
//       .ref(`/images/${imageAsFile.name}`)
//       .put(imageAsFile);

//     uploadTask.on(
//       "state_changed",
//       snapShot => {
//         console.log("snapshot", snapShot);
//       },
//       err => {
//         console.log(err);
//       },
//       () => {
//         storage
//           .ref("images")
//           .child(imageAsFile.name)
//           .getDownloadURL()
//           .then(fireBaseUrl => {
//             setImageAsUrl(fireBaseUrl);
//           });
//       }
//     );
//   };

//   return (
//     <AddNewContainer>
//       <CloseButton setMode={setMode} page={"home"} />
//       <form onSubmit={handleFireBaseUpload}>
//         <InputContainer>
//           <label>Image</label>
//           <br />
//           <input
//             type="file"
//             id="image"
//             name="image"
//             onChange={handleImageAsFile}
//           ></input>
//         </InputContainer>
//         <button>Add Image</button>
//       </form>
//       {imageAsFile && (
//         <ImageContainer>
//           <img src={imageAsUrl} alt="image tag" />
//         </ImageContainer>
//       )}
//       <form>
//         <InputContainer>
//           <label>Title</label>
//           <br />
//           <input
//             type="text"
//             id="title"
//             name="title"
//             onChange={event => setNewTitle(event.target.value)}
//           ></input>
//         </InputContainer>
//         <InputContainer>
//           <label>Description</label>
//           <br />
//           <input
//             type="text"
//             id="description"
//             name="description"
//             onChange={event => setNewDescription(event.target.value)}
//           ></input>
//         </InputContainer>
//         <InputContainer>
//           <label>Notes</label>
//           <br />
//           <textarea
//             type="text"
//             id="notes"
//             name="notes"
//             onChange={event => setNewNotes(event.target.value)}
//           ></textarea>
//         </InputContainer>
//       </form>
//       <SaveButton type="submit" value="Save" onClick={saveData}>
//         Save
//       </SaveButton>
//     </AddNewContainer>
//   );
// };

// AddNew.propTypes = {
//   setMode: PropTypes.func
// };

// export default AddNew;
