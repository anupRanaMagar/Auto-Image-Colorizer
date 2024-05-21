import { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEye, FaFileDownload } from "react-icons/fa";
const Historylog = () => {
  const [colorizedImages, setColorizedImages] = useState([]);
  const [show, setShow] = useState({});

  useEffect(() => {
    fetchData();
  }, []);
  // Empty dependency array ensures useEffect only runs once on component mount
  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/all-images/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setColorizedImages(data.colorized_images);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const deleteHistory = async (id) => {
    console.log(id);
    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:8000/api/delete-image/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchData();
  };

  const toggleShow = (id) => {
    setShow({ ...show, [id]: !show[id] });
  };

  const downloadImage = (imageUrl) => {
    // Fetch the image from the provided URL
    fetch("http://127.0.0.1:8000" + imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = url;

        // Extract the file name from the URL
        const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

        // Set the download attribute with the file name
        link.setAttribute("download", fileName);

        // Append the link to the body and trigger a click event
        document.body.appendChild(link);
        link.click();

        // Clean up: remove the link and revoke the object URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
      });
  };

  return (
    <div>
      <h2 className="flex justify-center items-center text-3xl my-10 ">
        Colorized Images History
      </h2>
      <ul>
        {colorizedImages.map((image, index) => (
          <li key={index} className="m-2 p-4 bg-[#f1efef] rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center px-4 my-2">
                <span className="pr-4">{index + 1}</span>
                <p className="mr-5">
                  {"color_" + image.colorized_image.split("/").pop()}
                </p>
                <FaEye
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => toggleShow(index)}
                />
              </div>
              <div className="flex">
                <FaFileDownload
                  className="w-5 h-5 mr-6 cursor-pointer"
                  onClick={() => {
                    downloadImage(image.colorized_image);
                  }}
                />

                <MdDeleteForever
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    deleteHistory(image.id);
                  }}
                />
              </div>
            </div>
            {show[index] && (
              <img
                src={"http://127.0.0.1:8000" + image.colorized_image}
                className="h-32 w-32"
              ></img>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Historylog;

/* <p>ID: {image.id}</p>
            <p>User: {image.user}</p>
            <img
              src={"http://127.0.0.1:8000" + image.image}
              alt="Original Image"
            />
            <img
              src={"http://127.0.0.1:8000" + image.colorized_image}
              alt="Colorized Image"
            /> */
