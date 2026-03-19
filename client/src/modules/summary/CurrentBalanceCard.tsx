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
        mb: 4,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
          Current Balance - {profile?.name}
        </Typography>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: "bold" }}>
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
