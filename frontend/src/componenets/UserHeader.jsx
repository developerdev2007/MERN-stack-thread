import {
  Avatar,
  Box,
  Flex,
  Text,
  VStack,
  Link,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useToast } from "@chakra-ui/react";
import userAtom from "../atom/userAtom";
import { useRecoilValue } from "recoil";
import useToastHook from "../hooks/useToastHook.js";

const UserHeader = ({ user }) => {
  if (!user) return null;
  const showToast = useToastHook();
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); /////the user that is logged in
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast(
        "error",
        "You must be logged in to perform this action",
        "error"
      );
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }
      if (following) {
        showToast("success", `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser?._id); //adding to users
      }
      setFollowing(!following);
      console.log(data);
      // setUser(data)
    } catch (error) {
      showToast("error", error, "error");
    } finally {
      setUpdating(false);
    }
  };
  // console.log(following);
  const copyUrl = () => {
    const currentUrl = window.location.href;
    // console.log(currentUrl);
    // console.log(window);
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        duration: 3000,
        isClosable: true,
        description: "Link has been successfully copied",
      });
    });
  };
  // console.log(user);
  // console.log(currentUser);
  return (
    <VStack alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              color={"gray.light"}
              bg={"gray.dark"}
              p={1}
              borderRadius={"full"}
            >
              threads
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "lg",
                lg: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "lg",
                lg: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update profile</Button>
        </Link>
      )}
      ;
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "UnFollow" : "Follow"}{" "}
        </Button>
      )}
      ;
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex alignItems={"center"} gap={2}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          color={"gray.light"}
          justifyContent={"center"}
          pb={3}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
