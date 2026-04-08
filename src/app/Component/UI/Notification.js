import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid'
import moment from 'moment';

export default function TemporaryDrawer(props) {
  const [state, setState] = React.useState(false);

  const prioColor = {
    "Priority 1": "#3949ab",
    "Priority 2": "#43a047",
    "Priority 3": "#fb8c00",
    "Priority 4": "#e53935"
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
    props.callbackDrawer({
      state: open
    })

    console.log(open)

  };

  React.useEffect(() => {
    setState(props.openDrawer)
  }, [props.openDrawer])


  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 350 }}
      role="presentation"
    // onClick={toggleDrawer(anchor, false)}
    // onKeyDown={toggleDrawer(anchor, false)}
    >
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', fontSize: '25px' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <>
            <Grid container spacing={2}>
              <Grid item sm={10}>
                <ListSubheader component="div" id="nested-list-subheader">
                  <strong>Notifications</strong>
                </ListSubheader>

              </Grid>
              <Grid item sm={2}>
                <IconButton aria-label="close" onClick={toggleDrawer(anchor, false)}>
                  <CloseIcon fontSize='small' />
                </IconButton>
              </Grid>
            </Grid>
            <Divider />
          </>

        }
      >

        {
          props.openList.length > 0 ?
            props.openList.map((item, index) => (
              <ListItem key={index} >x
                <ListItemText
                  primary={item.id + ' | ' + item.priority}
                  sx={{
                    color: prioColor[item.priority]
                  }}
                  // primaryTypographyProps={{
                  // }}
                  secondary={moment(item.open_date).format("DD-MMM-YYYY HH:mm")}
                />
              </ListItem>
            ))
            :
            <ListItem >
              <ListItemText
                primary="No notifications yet"
                sx={{
                  textAlign: 'center'
                }}
              />
            </ListItem>

        }
      </List>
      <Divider />
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      {/* {['left', 'right', 'top', 'bottom'].map((anchor) => ( */}
      <React.Fragment >
        {/* <Button onClick={toggleDrawer('right', true)}>test</Button> */}
        <Drawer
          // variant='persistent'
          anchor={'right'}
          open={state}
          onClose={toggleDrawer('right', false)}
        >
          {list('right')}
        </Drawer>
      </React.Fragment>
      {/* ))} */}
    </div>
  );
}