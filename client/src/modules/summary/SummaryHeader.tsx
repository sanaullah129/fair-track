import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import type { ProfileModel } from "../../types/api";

interface SummaryHeaderProps {
  profiles: ProfileModel[];
  activeProfileId: string;
  onProfileChange: (profileId: string) => void;
}

const SummaryHeader = ({
  profiles,
  activeProfileId,
  onProfileChange,
}: SummaryHeaderProps) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      sx={{ mb: { xs: 2, sm: 4 }, gap: { xs: 2, sm: 0 } }}
    >
      <Typography variant="h5" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
        Summary
      </Typography>
      <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
        <InputLabel>Select Profile</InputLabel>
        <Select
          value={activeProfileId}
          onChange={(event) => onProfileChange(event.target.value)}
          label="Select Profile"
        >
          {profiles.map((profile) => (
            <MenuItem key={profile._id} value={profile._id}>
              {profile.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default SummaryHeader;
