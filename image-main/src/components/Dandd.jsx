// import { useState, useRef } from "react";

// const Dandd = () => {
//   const [image, setImage] = useState(null);
//   const inputRef = useRef();

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setImage(event.dataTransfer.files);
//   };

//   // send files to the server
//   async function uploadImage() {
//     console.log("uploaded");
//     console.log(image);
//     const formData = new FormData();
//     formData.append("image", image[0]);

//     const response = await fetch("http://127.0.0.1:8000/api/products/", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .catch((error) => console.log(error));
//   }

//   if (image) {
//     return (
//       <div className="flex flex-col justify-center items-center rounded-2xl absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]  w-80 shadow-2xl h-60">
//         <ul>
//           {Array.from(image).map((image, idx) => (
//             <li key={idx}>{image.name}</li>
//           ))}
//         </ul>
//         <div className="mt-4">
//           <button
//             onClick={() => setImage(null)}
//             className="bg-blue-500 mr-5 py-2 px-4 rounded-xl"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={uploadImage}
//             className="bg-blue-500 px-4 py-2 rounded-xl "
//           >
//             Upload
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="flex flex-col justify-center items-center rounded-2xl absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]  w-80 shadow-2xl h-60"
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//     >
//       <p>Drag and Drop Files to Upload</p>
//       <p>Or</p>
//       <input
//         type="file"
//         multiple
//         onChange={(event) => setImage(event.target.files)}
//         hidden
//         accept="image/png, image/jpeg"
//         ref={inputRef}
//       />
//       <button
//         onClick={() => inputRef.current.click()}
//         className="bg-blue-800 text-white font-bold rounded-full px-4 py-2"
//       >
//         Select Files
//       </button>
//     </div>
//   );
// };

// export default Dandd;

// ***change by ishan***
import { useState, useRef } from "react";
import { redirect } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

const Dandd = () => {
  const [image, setImage] = useState(null);
  const [colorizedImageUrl, setColorizedImageUrl] = useState(null);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setImage(event.dataTransfer.files);
  };

  async function uploadImage() {
    const formData = new FormData();
    formData.append("image", image[0]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.colorized_image_url) {
        console.log(data.colorized_image_url);
        setColorizedImageUrl(data.colorized_image_url);
      } else {
        console.error("Server response is missing colorized_image_url:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
  const handleDownload = (imageUrl) => {
    // Fetch the image from the provided URL
    fetch(imageUrl)
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
  const colorize = () => {
    setColorizedImageUrl((prev) => {
      prev = null;
    });
    setImage((prev) => {
      prev = null;
    });
    redirect("/");
  };

  if (colorizedImageUrl) {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <img
          src={colorizedImageUrl}
          alt="Colorized Image"
          className="h-52 w-52"
          onError={() => console.error("Error loading image")}
        />
        <div className="mt-8">
          <button
            onClick={() => {
              handleDownload(colorizedImageUrl);
            }}
            className="mr-2"
          >
            Download
          </button>
          <button onClick={colorize} className="ml-2">
            Colorize
          </button>
        </div>
      </div>
    );
  }

  if (image) {
    return (
      <div className="flex flex-col justify-center items-center rounded-2xl absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]  w-80 shadow-2xl h-60">
        <ul>
          {Array.from(image).map((image, idx) => (
            <li key={idx}>{image.name}</li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            onClick={() => setImage(null)}
            className="bg-blue-500 mr-5 py-2 px-4 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={uploadImage}
            className="bg-blue-500 px-4 py-2 rounded-xl "
          >
            Colorize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center items-center rounded-2xl absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]  w-80 shadow-2xl h-60"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p>Drag and Drop Files to Upload</p>
      <p>Or</p>
      <input
        type="file"
        multiple
        onChange={(event) => setImage(event.target.files)}
        hidden
        accept="image/png, image/jpeg"
        ref={inputRef}
      />
      <button
        onClick={() => inputRef.current.click()}
        className="bg-blue-800 text-white font-bold rounded-full px-4 py-2"
      >
        Select Files
      </button>
    </div>
  );
};

export default Dandd;
