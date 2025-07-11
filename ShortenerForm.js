import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Grid, Paper, Snackbar, Alert
} from "@mui/material";
import generateShortCode from "../utils/generateShortCode";
import logger from "../middleware/logger";

const ShortenerForm = ({ addURL }) => {
  const [entries, setEntries] = useState(Array(5).fill({ url: "", shortcode: "", validity: "" }));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = () => {
    let hasError = false;
    const validEntries = entries
      .map((entry, idx) => {
        const { url, shortcode, validity } = entry;
        if (!url) return null;
        if (!isValidURL(url)) {
          setError(`Invalid URL at row ${idx + 1}`);
          hasError = true;
          return null;
        }
        if (validity && isNaN(validity)) {
          setError(`Validity must be a number at row ${idx + 1}`);
          hasError = true;
          return null;
        }
        return {
          originalURL: url,
          shortCode: shortcode || generateShortCode(),
          validity: validity ? parseInt(validity) : 30
        };
      })
      .filter(Boolean);

    if (hasError || validEntries.length === 0) return;

    validEntries.forEach((entry) => {
      const newURL = {
        id: entry.shortCode,
        originalURL: entry.originalURL,
        shortURL: `${window.location.origin}/${entry.shortCode}`,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + entry.validity * 60000),
        visits: 0,
      };
      addURL(newURL);
      logger("Shortened URL created", newURL);
    });

    setSuccess("URLs shortened successfully!");
    setEntries(Array(5).fill({ url: "", shortcode: "", validity: "" }));
    setError("");
  };

  return (
    <Box component={Paper} p={4} sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Shorten up to 5 URLs</Typography>
      <Grid container spacing={2}>
        {entries.map((entry, idx) => (
          <React.Fragment key={idx}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth label="Original URL"
                value={entry.url}
                onChange={(e) => handleChange(idx, "url", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                fullWidth label="Shortcode (optional)"
                value={entry.shortcode}
                onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField
                fullWidth label="Validity (min)"
                value={entry.validity}
                onChange={(e) => handleChange(idx, "validity", e.target.value)}
              />
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleShorten}>Shorten URLs</Button>
        </Grid>
      </Grid>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}>
        <Alert onClose={() => setSuccess("")} severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ShortenerForm;
