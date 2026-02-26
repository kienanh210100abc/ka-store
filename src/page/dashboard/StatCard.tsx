import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard = ({ title, value, icon, color, subtitle }: StatCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px ${color}25`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: "12px",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            fontWeight={500}
            sx={{
              flex: 1,
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h3"
          fontWeight="bold"
          color={color}
          sx={{
            mb: 0.5,
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
