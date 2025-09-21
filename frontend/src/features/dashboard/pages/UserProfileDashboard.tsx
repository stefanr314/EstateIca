import Stack from "@mui/material/Stack";
import UserProfileContent from "../components/UserProfileContent";

import VerifyFab from "../components/VerifyFAB";

function UserProfileDashboard() {
  return (
    <Stack width={"100%"}>
      <UserProfileContent />
      <VerifyFab />
    </Stack>
  );
}

export default UserProfileDashboard;
