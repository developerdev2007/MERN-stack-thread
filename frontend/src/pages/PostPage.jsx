import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
// import { BsThreeDots } from "react-icons/bs";
import Actions from "../componenets/Actions";
import Comment from "../componenets/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Link, useNavigate, useParams } from "react-router-dom";
import useToastHook from "../hooks/useToastHook";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postAtom from "../atom/postAtom";

const PostPage = () => {
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postAtom);
  const { user, loading } = useGetUserProfile();
  const showToast = useToastHook();
  const { pid } = useParams();
  const navigate = useNavigate();
  const currentPost = posts[0];

  useEffect(() => {
    const getPosts = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
        // console.log(data);
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPosts();
  }, [pid, showToast, setPosts]);
  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you really want to delete post ?")) return;
      const res = await fetch("/api/posts/" + currentPost._id, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }
      setPosts(posts.filter((p) => p._id !== posts._id));
      navigate(`/${user.username}`);
      showToast("success", data, "success");
      console.log(data);
    } catch (error) {
      showToast("error", error.message, "error");
    }
  };
  if (!user && loading) {
    return (
      <Flex
        w={"full"}
        h={"full"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner />
      </Flex>
    );
  }
  if (!currentPost) return null;
  // if (!user) return null;
  // console.log(user);
  // console.log("posts");
  // console.log(currentPost);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"xs"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src={"/verified.png"} w={4} h={4} ml={2} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} w={40} align={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box
          borderRadius={6}
          border={"1px solid"}
          borderColor={"gray.light"}
          overflow={"hidden"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>
      <Flex gap={3} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {currentPost.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} bg={"gray.light"} borderRadius={"full"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {currentPost.likes.length} likes
        </Text>
      </Flex>
      <Divider my={4} />

      <Flex gap={3} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like and reply</Text>
        </Flex>
        <Button> Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
