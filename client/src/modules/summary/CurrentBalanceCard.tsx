import { Card, CardContent, Typography } from "@mui/material";
import type { ProfileModel } from "../../types/api";

interface CurrentBalanceCardProps {
  balance: number;
  profile?: ProfileModel;
}

const CurrentBalanceCard = ({ balance, profile }: CurrentBalanceCardProps) => {
  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        mb: { xs: 2, sm: 4 },
        borderRadius: { xs: 1, sm: 2 },
        p: { xs: 1.5, sm: 0 }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Current Balance - {profile?.name}
        </Typography>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: "bold", fontSize: { xs: '2rem', sm: '3rem' } }}>
          {balance.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          })}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CurrentBalanceCard;
