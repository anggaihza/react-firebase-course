import {useEffect, useState} from "react";
import "./App.css";
import {Auth} from "./components/auth";
import {db, auth, storage} from "./config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {ref, uploadBytes} from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  // New movie state
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isMovieOscar, setIsMovieOscar] = useState(false);

  // state update title
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File Upload State
  const [fileUpload, setFileUpload] = useState(null);

  const movieCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    //read data from database
    //set the movie list
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {title: updatedTitle});
    getMovieList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Auth />

      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release date..."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isMovieOscar}
          onChange={(e) => setIsMovieOscar(e.target.checked)}
        />
        <label htmlFor="">Receive an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>

            <button onClick={(e) => deleteMovie(movie.id)}>Delete Movie</button>

            <input
              type="text"
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
