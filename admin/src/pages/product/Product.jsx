import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { userRequest } from "../../requestMethods";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../firebase";
import { updateProduct } from "../../redux/apiCalls";

export default function Product() {
  // update the product
  const dispatch = useDispatch();
  const [img, setImg] = useState(null);
  const title = useRef(null);
  const categories = useRef();
  const price = useRef();
  const desc = useRef();
  const color = useRef();
  const inStock = useRef();
  const size = useRef();

  const handleClick = (e, oldImg, id) => {
    e.preventDefault();
    if (img) {
      const storage = getStorage(app);
      // Create a reference to the file to delete
      const desertRef = ref(storage, oldImg);
      // Delete the file
      deleteObject(desertRef)
        .then(() => {
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
                const updatedProduct = {
                  title: title.current.value,
                  price: price.current.value,
                  categories: categories.current.value.split(","),
                  color: color.current.value.split(","),
                  size: size.current.value.split(","),
                  inStock: inStock.current.value,
                  desc: desc.current.value,
                  img: downloadURL,
                };
                updateProduct(dispatch, updatedProduct, id);
              });
            }
          );
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });
    } else {
      const updatedProduct = {
        title: title.current.value,
        price: price.current.value,
        categories: categories.current.value.split(","),
        color: color.current.value.split(","),
        size: size.current.value.split(","),
        inStock: inStock.current.value,
        desc: desc.current.value,
      };
      updateProduct(dispatch, updatedProduct, id);
    }
  };

  // display the product
  const [productStats, setProductStats] = useState([]);
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Fab",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );
  useEffect(() => {
    const getProductStats = async () => {
      try {
        const res = await userRequest.get(`/orders/stats?pid=${product._id}`);
        const statList = res.data.sort((a, b) => a._id - b._id);
        statList.map((item) =>
          setProductStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (error) {}
    };
    getProductStats();
  }, [product, MONTHS]);

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart
            data={productStats}
            dataKey="Sales"
            title="Sales Performance"
          />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">
              {product.title.substring(0, 70)}...
            </span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id: </span>
              <span className="productInfoValue">{" " + product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">In stock:</span>
              <span className="productInfoValue">{`${product.inStock}`}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              type="text"
              name="title"
              defaultValue={product.title}
              ref={title}
            />
            <label>In Stock</label>
            <select
              name="inStock"
              id="idStock"
              ref={inStock}
              defaultValue={product.inStock}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <label>Description</label>
            <textarea
              defaultValue={product.desc}
              name="desc"
              id="desc"
              cols="30"
              rows="10"
              ref={desc}
            ></textarea>

            <label>Categories</label>
            <input
              type="text"
              placeholder="pants,dress..."
              name="cat"
              defaultValue={product.categories}
              ref={categories}
            />

            <label>Price</label>
            <input
              type="number"
              placeholder="$45"
              name="price"
              defaultValue={product.price}
              ref={price}
            />

            <label>Sizes</label>
            <input
              type="text"
              placeholder="S,M..."
              name="size"
              defaultValue={product.size}
              ref={size}
            />

            <label>Colors</label>
            <input
              ref={color}
              type="text"
              placeholder="red,blue..."
              name="color"
              defaultValue={product.color}
            />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img
                src={img ? URL.createObjectURL(img) : product.img}
                alt=""
                className="productUploadImg"
              />
              <input
                type="file"
                id="file"
                onChange={(e) => {
                  setImg(e.target.files[0]);
                }}
              />
            </div>
            <button
              className="productButton"
              onClick={(e) => {
                handleClick(e, product.img, product._id);
              }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
