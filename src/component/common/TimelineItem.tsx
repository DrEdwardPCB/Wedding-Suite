"use client"
import{ TimelineItem as MuiTimelineItem } from '@mui/lab'
import { withStyles } from "@mui/styles";
export const TimelineItem = withStyles({
    missingOppositeContent: {
      "&:before": {
        display: "none"
      }
    }
  })(MuiTimelineItem);