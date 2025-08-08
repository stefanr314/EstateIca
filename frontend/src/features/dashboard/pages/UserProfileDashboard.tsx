import Stack from "@mui/material/Stack";
import UserProfileContent from "../components/UserProfileContent";
import { useTheme } from "@mui/material";

function UserProfileDashboard() {
  const theme = useTheme();
  return (
    <Stack width={"100%"}>
      <UserProfileContent />
    </Stack>
  );
}

export default UserProfileDashboard;
