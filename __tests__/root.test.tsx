import React from "react"
import { render, screen } from '@testing-library/react'
import RootPage from "../src/app/page"
import * as navigation from "next/navigation"

// Mock router
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Root page redirected to login", () => {
  it("Should redirect to /login", () => {
    render(<RootPage />);

    expect(navigation.redirect).toHaveBeenCalledWith("/login");
  });
});