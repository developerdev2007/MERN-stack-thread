import {
  Avatar,
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Actions from "./Actions";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

const UserPost = ({ likes, postTitle, replies, postImg }) => {
  const copyUrl = (e) => {
    e.preventDefault();
    const currentUrl = window.location.href;
    console.log(currentUrl);
  };

  const [liked, setLiked] = useState();
  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size="md" name="Mark ZuckerBerg" src="/zuck-avatar.png" />
          <Box h={"full"} w="1px" bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size={"xs"}
              position={"absolute"}
              top={"0px"}
              padding={"2px"}
              left={"15px"}
              name="Dan Abrahmov"
              src="https://bit.ly/dan-abramov"
            />

            <Avatar
              size={"xs"}
              position={"absolute"}
              bottom={"0px"}
              padding={"2px"}
              right={"-5px"}
              name="Ryan Florence"
              src="https://bit.ly/ryan-florence"
            />

            <Avatar
              size={"xs"}
              position={"absolute"}
              bottom={"0px"}
              padding={"2px"}
              left={"4px"}
              name="Kola Tioluwani"
              src="https://bit.ly/tioluwani-kolawole"
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                markzuckerberg
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                1d
              </Text>
              <Menu>
                <MenuButton>
                  <BsThreeDots size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                      Copy Link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Flex>
          </Flex>
          <Text>{postTitle}</Text>
          {postImg && (
            <Box
              borderRadius={6}
              border={"1px solid"}
              borderColor={"gray.light"}
              overflow={"hidden"}
            >
              <Image src={postImg} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            {/* <Actions liked={liked} setLiked={setLiked} /> */}
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {" "}
              {replies} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.dark"}></Box>
            <Text fontSize={"sm"} color={"gray.light"}>
              {likes} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
