import { useSetRecoilState } from "recoil";
import useToastHook from "./useToastHook";
import userAtom from "../atom/userAtom";
import { useState } from "react";

const useLogOut = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useToastHook();
    const [loading,setLoading] = useState(false)




    const logOut = async () => {
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
        }finally{
          setLoading(false)
        }
      };
    return logOut;
}

export default useLogOut