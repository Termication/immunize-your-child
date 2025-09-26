"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function LandingPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 5,
      }}
    >
      {/* Hero Section */}
      <Box sx={{ mb: 1 }}>
        <Image
          src="/branding/logo_letters.png"
          alt="Immunize Your Child Logo"
          width={400}
          height={10}
          priority
        />
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        A simple way for South African parents to track vaccinations, get
        reminders, and keep their children protected.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 3, borderRadius: 2 }}
      >
        Get Started
      </Button>

      {/* Features Section */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">📅 Vaccination Schedule</Typography>
            <Typography variant="body2" color="text.secondary">
              Keep track of all required vaccines by age.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">🔔 Smart Reminders</Typography>
            <Typography variant="body2" color="text.secondary">
              Get notified before your child’s next vaccination.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">🧾 Digital Records</Typography>
            <Typography variant="body2" color="text.secondary">
              Access and store all records securely in one place.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Footer */}
      <Typography variant="caption" sx={{ mt: 5 }} color="text.secondary">
        © 2025 Immunize Your Child — Built for South Africa
      </Typography>
    </Container>
  );
}
