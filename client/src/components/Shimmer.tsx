import { Box, Skeleton, Stack } from "@mui/material";

interface ShimmerProps {
  lines: number;
  shape: "text" | "circular" | "rectangular";
  width?: number;
  height?: number;
  spacing?: number;
}

const Shimmer = ({
  lines = 3,
  shape = "text",
  width = shape === "circular" ? 40 : shape === "rectangular" ? 210 : undefined,
  height = shape === "circular" ? 40 : shape === "rectangular" ? 24 : undefined,
  spacing = 1,
}: ShimmerProps) => {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
      <Stack spacing={spacing}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant={shape} width={width} height={height} animation="wave" />
        ))}
      </Stack>
    </Box>
  );
};

export default Shimmer;
