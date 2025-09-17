import { Stack } from "@mui/material";
import HomePageContent from "../components/HomePageContent";
import LogoutButton from "@/shared/components/LogoutButton";

function HomePage() {
  return (
    <Stack gap={2}>
      <h1>Welcome to the Dashboard. How can I help you?</h1>;
      <LogoutButton />
      <HomePageContent />
    </Stack>
  );
}

export default HomePage;
