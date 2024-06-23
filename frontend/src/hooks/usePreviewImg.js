import { useState } from "react";
import useToastHook from "./useToastHook.js";

export default function usePreviewImg() {
  const showToast = useToastHook();
  const [imgUrl, setImgUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", " Please select an image file", "error");
      setImgUrl(null);
    }
  };
  // console.log(imgUrl);
  return { handleImageChange, imgUrl ,setImgUrl};
}
