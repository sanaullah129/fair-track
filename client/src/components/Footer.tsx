import { Paper, Typography } from "@mui/material"

const Footer = () => {
     return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: 1,
        borderColor: "divider",
      }}
      elevation={3}
    >
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', py: 0.5 }}>
          FairTrack — Sanaullah Ansari
        </Typography>
    </Paper>
  )
}

export default Footer