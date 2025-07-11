import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import ShortenerForm from "./components/ShortenerForm";

function App() {
  const [urls, setUrls] = useState([]);

  const addURL = (newURL) => {
    if (urls.find((u) => u.id === newURL.id)) {
      alert("Shortcode already exists!");
      return;
    }
    setUrls([...urls, newURL]);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center">URL Shortener</Typography>
      <ShortenerForm addURL={addURL} />
    </Container>
  );
}

export default App;
