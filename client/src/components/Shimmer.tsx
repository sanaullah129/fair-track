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
}: ShimmerProps) => {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 4 }, px: { xs: 1, sm: 0 } }}>
      <Stack spacing={{ xs: 0.75, sm: 1 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant={shape} width={width} height={height} animation="wave" />
        ))}
      </Stack>
    </Box>
  );
};

export default Shimmer;
