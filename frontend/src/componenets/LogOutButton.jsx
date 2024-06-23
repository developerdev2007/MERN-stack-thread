import { Button } from "@chakra-ui/react";
import { CgLogOut } from "react-icons/cg";
import { useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import useToastHook from "../hooks/useToastHook.js";
import { useState } from "react";

const LogOutButton = () => {
  const [loading, setLoading] = useState(false);
  const showToast = useToastHook();
  const setUser = useSetRecoilState(userAtom);
  const handleLogOut = async () => {
    setLoading(true);
    try {
      //fetch request
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-Threads");
      showToast("Success", data.message, "success");
      setUser(null);
      // console.log("logout has  been successfully done");
    } catch (error) {
      showToast("Error", error, "error");
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      position={"fixed"}
      top={"20px"}
      right={"20px"}
      size={"md"}
      onClick={handleLogOut}
      isLoading={loading}
    >
      <CgLogOut />
    </Button>
  );
};

export default LogOutButton;
