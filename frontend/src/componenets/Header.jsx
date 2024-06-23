import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { CgLogOut, CgProfile } from "react-icons/cg";
import { AiFillHome } from "react-icons/ai";
import LogOutButton from "./LogOutButton";
import useLogOut from "../hooks/useLogOut";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atom/authAtom";

const Header = () => {
  const currentUser = useRecoilValue(userAtom);
  const logOut = useLogOut();
  const setAuthScreenState = useSetRecoilState(authScreenAtom);

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {currentUser && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={26} />
        </Link>
      )}
      {!currentUser && (
        <Link
          as={RouterLink}
          to="/auth"
          onClick={() => setAuthScreenState("login")}
        >
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
        w={6}
        alignItems={"center"}
      />
      {currentUser && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${currentUser.username}`}>
            <CgProfile size={26} />
          </Link>
          <Button
            size={"sm"}
            onClick={logOut}
            // isLoading={loading}
          >
            <CgLogOut />
          </Button>
        </Flex>
      )}
      {!currentUser && (
        <Link
          as={RouterLink}
          to="/auth"
          onClick={() => setAuthScreenState("signUp")}
        >
          signup
        </Link>
      )}
    </Flex>
  );
};

export default Header;
