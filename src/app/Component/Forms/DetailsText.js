'use client';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';


const DetailsText = (props) => {

  return (
    <div className="w-auto mb-4">
      <ListItemText
        primary={props.label}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline', fontSize: '18px' }}
              color="text.primary"
            >
              {props.value}
            </Typography>
          </React.Fragment>
        }
      />
    </div>
  )
}


export default DetailsText