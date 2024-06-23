import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import useToastHook from "../hooks/useToastHook";
import Post from "../componenets/Post";
import userAtom from "../atom/userAtom";
import postAtom from "../atom/postAtom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useToastHook();
  const currentUser = useRecoilValue(userAtom);
  // console.log(currentUser);
  useEffect(() => {
    const getFeedpost = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
        }
        //  console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("error", error, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedpost();
  }, [showToast, setPosts]);

  return (
    <>
      {loading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {!loading && posts.length === 0 && (
        <h1>Follow some users to see posts!!!</h1>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
