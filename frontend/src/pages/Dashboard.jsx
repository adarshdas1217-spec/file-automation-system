import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/files">View Files</Link>
    </div>
  );
}