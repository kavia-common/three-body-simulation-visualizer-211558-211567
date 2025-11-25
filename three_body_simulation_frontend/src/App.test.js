import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app title and controls", () => {
  render(<App />);
  expect(screen.getByText(/Three-Body Simulation/i)).toBeInTheDocument();
  expect(screen.getByText(/Simulation Controls/i)).toBeInTheDocument();
});
