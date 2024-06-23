import React, { useEffect, useState } from "react";
import UserHeader from "../componenets/UserHeader";
// import UserPost from "../componenets/UserPost";
import { useParams } from "react-router-dom";
import useToastHook from "../hooks/useToastHook";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../componenets/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atom/postAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postAtom);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const showToast = useToastHook();

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
        setPosts(data);
        // console.log(data);
      } catch (error) {
        showToast("error", error, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [showToast, username, user, setPosts]);
  // console.log("POst is here in recoil State", posts);
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner thickness="4px" speed="0.65s" size="xl" />
      </Flex>
    );
  }
  if (!user && !loading) {
    return <h1 size={"xl"}>User not found</h1>;
  }
  if (!user) return null;
  if (!posts) return null;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && (
        <Text my={10} textAlign={"center"}>
          User has no posts.
        </Text>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={40}>
          <Spinner thickness="4px" speed="0.65s" size="xl" />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
