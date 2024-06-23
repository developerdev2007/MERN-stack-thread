import SignIn from "../componenets/SignIn";
import SignUp from "../componenets/SignUp";
import { useRecoilValue } from "recoil";
import authScreenAtom from "../atom/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  //   useSetRecoilState(authScreenState);
  return <>{authScreenState === "login" ? <SignIn /> : <SignUp />}</>;
};

export default AuthPage;
