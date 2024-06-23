import { useToast } from "@chakra-ui/toast";
import { useCallback } from "react";

const useToastHook = () => {
  const toast = useToast();
  const showToast = useCallback((title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  },[toast]);
  return showToast;
};

export default useToastHook;
