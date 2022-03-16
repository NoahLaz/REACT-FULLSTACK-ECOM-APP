import { useState } from "react";
import "./newProduct.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [img, setImg] = useState(null);
  const [cat, setCat] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const dispatch = useDispatch();

  const handleCat = (e) => {
    setCat(e.target.value.split(","));
  };

  const handleSize = (e) => {
    setSize(e.target.value.split(","));
  };

  const handleColor = (e) => {
    setColor(e.target.value.split(","));
  };

  const handleInput = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + img.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newProduct = {
            ...inputs,
            categories: cat,
            size,
            color,
            img: downloadURL,
          };
          addProduct(newProduct, dispatch);
        });
      }
    );
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => {
              setImg(e.target.files[0]);
            }}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            onChange={handleInput}
            type="text"
            name="title"
            placeholder="Apple Airpods"
          />
        </div>
        <div className="addProductItem">
          <label>Categories</label>
          <input
            type="text"
            placeholder="pants,dress..."
            name="cat"
            onChange={handleCat}
          />
        </div>
        <div className="addProductItem">
          <label>Sizes</label>
          <input
            type="text"
            placeholder="S,M..."
            name="size"
            onChange={handleSize}
          />
        </div>
        <div className="addProductItem">
          <label>Colors</label>
          <input
            type="text"
            placeholder="red,blue..."
            name="color"
            onChange={handleColor}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <textarea
            name="desc"
            id="desc"
            cols="30"
            rows="10"
            placeholder="Product description..."
            onChange={handleInput}
          ></textarea>
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input
            type="number"
            placeholder="$19"
            name="price"
            onChange={handleInput}
          />
        </div>
        <div className="addProductItem">
          <label>In Stock</label>
          <select
            name="inStock"
            id="inStock"
            defaultValue={"default"}
            onChange={handleInput}
          >
            <option value="default" disabled>
              Select an option
            </option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="addProductItem">
          <button className="addProductButton" onClick={handleClick}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
