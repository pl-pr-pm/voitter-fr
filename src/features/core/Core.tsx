import React, { useEffect } from "react";
import Header from "../../components/Header/Header";

import { Box } from "@material-ui/core";

import { Timeline } from "../timeline/Timeline";
import ProfileModal from "../../components/ProfileModal/ProfileModal";

const Core: React.FC = () => {
  useEffect(() => {
    const fetchBootLoader = async () => {};
    fetchBootLoader();
  }, []);

  return (
    <Box height="100%">
      <Header />
      <ProfileModal />
      <Timeline />
    </Box>
  );
};

export default Core;
