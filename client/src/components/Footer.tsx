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
        zIndex: 100,
      }}
      elevation={3}
    >
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            py: { xs: 1, sm: 0.5 },
            px: 1,
            fontSize: { xs: '0.7rem', sm: '0.75rem' }
          }}
        >
          FairTrack — Sanaullah Ansari
        </Typography>
    </Paper>
  )
}

export default Footer