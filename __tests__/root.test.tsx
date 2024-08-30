import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Root from "@/app/page"
import { describe } from 'node:test'

describe("Root", () => {
  render(<Root />)
  
})