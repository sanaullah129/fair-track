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
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 4 }}
    >
      <Typography variant="h5" component="h1">
        Summary
      </Typography>
      <FormControl sx={{ minWidth: 200 }}>
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
