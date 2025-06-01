import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div>
      <aside>Sidebar</aside>
      <main>
        <Outlet />
      </main>

      <footer>Footer</footer>
    </div>
  );
}

export default AuthLayout;
