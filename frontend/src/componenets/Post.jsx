import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToastHook from "../hooks/useToastHook";
import { formatDistanceToNow } from "date-fns";
import Actions from "./Actions";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import postAtom from "../atom/postAtom";

const Post = ({ post, postedBy }) => {
  // console.log(post);
  const [userData, setUserData] = useState(null);
  const showToast = useToastHook();
  const navigate = useNavigate();
  const [posts, setPosts] = useRecoilState(postAtom);
  const currentUser = useRecoilValue(userAtom);

  const copyUrl = (e) => {
    e.preventDefault();
    const currentUrl = window.location.href;
    console.log(currentUrl);
  };

  //////////////fetch user data

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/` + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
        // console.log(data);
        setUserData(data);
      } catch (error) {
        console.log(error);
        setUserData(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you really want to delete post ?")) return;
      const res = await fetch("/api/posts/" + post._id, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }
      setPosts(posts.filter((p) => p._id !== post._id));
      navigate(`/${userData.username}`);
      showToast("success", data, "success");
      console.log(data);
    } catch (error) {
      showToast("error", error.message, "error");
    }
  };

  // console.log(userData);
  // console.log(post);
  if (!userData) return;
  return (
    <Link to={`/${userData.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={userData?.name}
            src={userData?.profilePic}
            onClick={(e) => {
              e.preventDefault();

              navigate(`/${userData.username}`);
            }}
          />
          <Box h={"full"} w="1px" bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                position={"absolute"}
                top={"0px"}
                padding={"2px"}
                left={"15px"}
                name={post.replies[0].name}
                src={post.replies[0].userProfilePic}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                position={"absolute"}
                bottom={"0px"}
                padding={"2px"}
                right={"-5px"}
                name={post.replies[1].name}
                src={post.replies[1].userProfilePic}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size={"xs"}
                position={"absolute"}
                bottom={"0px"}
                padding={"2px"}
                left={"4px"}
                name={post.replies[1].name}
                src={post.replies[2].userProfilePic}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${userData.username}`);
                }}
              >
                {userData?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} w={40} align={"right"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === userData._id && (
                <DeleteIcon onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>
          <Text>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              border={"1px solid"}
              borderColor={"gray.light"}
              overflow={"hidden"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
