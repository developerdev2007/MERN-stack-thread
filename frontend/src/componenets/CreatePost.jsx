import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import useToastHook from "../hooks/useToastHook";
import postAtom from "../atom/postAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;
const CreatePost = () => {
  const currentUser = useRecoilValue(userAtom);
  const { username } = useParams();
  const showToast = useToastHook();
  const [posts, setPosts] = useRecoilState(postAtom);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updating, setUpdating] = useState(false);
  const [postText, setPostText] = useState("");
  const [remChar, setRemChar] = useState(MAX_CHAR);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemChar(0);
    } else {
      setPostText(inputText);
      setRemChar(MAX_CHAR - inputText.length);
    }
    // console.log("handleTextChange");
  };
  const handlePostSubmit = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: currentUser._id,
          text: postText,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }
      if (username === currentUser.username) {
        setPosts([data, ...posts]);
      }
      showToast("success", data.message, "success");
      setPostText("");
      setImgUrl("");
      onClose();
      console.log(data);
    } catch (error) {
      showToast("error", error, "error");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={"20px"}
        right={"20px"}
        size={{ base: "sm", sm: "md", md: "lg" }}
        onClick={onOpen}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Textarea
                placeholder="post text"
                value={postText}
                onChange={handleTextChange}
              />
              <Text
                fontSize={"sm"}
                color={"gray.800"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={1}
              >
                {remChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={18}
                onClick={() => {
                  imageRef.current.click();
                }}
              />
            </FormControl>

            {imgUrl && (
              <>
                <Flex mt={5} w={"full"} position={"relative"}>
                  <Image src={imgUrl} alt={"selected image"} />

                  <CloseButton
                    onClick={() => setImgUrl(null)}
                    bg={"gray.800"}
                    position="absolute"
                    top={2}
                    right={2}
                  />
                </Flex>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handlePostSubmit}
              isLoading={updating}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
