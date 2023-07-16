import * as React from 'react';
import {
    createBrowserRouter,
    Link,
  } from "react-router-dom";

import Spotify from './Spotify'
import Authentication from './Authentication'
  
export const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <h1>Hello World</h1>
          <Link to="about">About Us</Link>
        </div>
      ),
    },
    {
      path: "about",
      element: <div>About</div>,
    },
    {
        path: "spotify",
        element: <Spotify />
    },
    {
        path: "auth",
        element: <Authentication />
    },
  ]);