import * as React from 'react'
import { useState, useEffect } from 'react'
import { DateRangePicker } from "@tremor/react"
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Button, TextField, Typography } from '@mui/material'
import { blue, green, red } from '@mui/material/colors';
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete'
import Skeleton from '@mui/material/Skeleton'
import moment from 'moment'
import {
  getClassification,
  getShop,
  getActiveOrg,
  getStatus

} from '@/Collections/DropdownList'

export default function TemporaryDrawer(props) {

  const theme = createTheme({
    palette: {
      primary1: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1e88e5'
      },
      success: {
        main: green[500],
        light: green[300],
        dark: green[700]
      },
      danger: {
        main: red[500],
        light: red[300],
        dark: red[700]
      },
      gray: {
        main: '#e0e0e0',
        light: '#eeeeee',
        dark: '#bdbdbd'
      },
    },
  });

  const [state, setState] = useState(false)

  const [statusArr, setStatusArr] = useState([])
  const [activeOrgArr, setActiveOrgArr] = useState([])
  const [shopArr, setShopArr] = useState([])
  const [classArr, setClassArr] = useState([])
  const [form, setForm] = useState({
    status_id: null,
    active_org_id: null,
    shop_id: null,
    class_id: null,
    from: null,
    to: null
  })

  // const handleChange = (e, value) => {

  //   const id = e.target.id.split('-')[0]

  //   if (value != null) {
  //     setForm(prev => (
  //       {
  //         ...prev,
  //         [id]: value.id
  //       }
  //     ))
  //   }
  // }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setState(open)
    props.drawerFilterCallback({
      open: open
    })

    console.log(open)

  }

  useEffect(() => {

    setState(props.openDrawer)

    setForm({
      status_id: null,
      active_org_id: null,
      shop_id: null,
      class_id: null,
      from: null,
      to: null
    })

    if (props.openDrawer) {
      getStatus().then((response) => {
        setStatusArr(response.data.result)
      })

      getActiveOrg().then((response) => {
        setActiveOrgArr(response.data.result)
      })

      getShop().then((response) => {
        setShopArr(response.data.result)
      })

      getClassification().then((response) => {
        setClassArr(response.data.result)
      })
    }

    return () => {
      setStatusArr([])
      setActiveOrgArr([])
      setShopArr([])
      setClassArr([])
    }

  }, [props.openDrawer])

  const getForm = () => {
    console.log(form)

    props.drawerFilterCallback({
      open: false,
      isFilter: true,
      filter: form
    })
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 350 }}
      role="presentation"
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
                  <strong>Filter</strong>
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
        <Grid container spacing={2} columnSpacing={2} padding={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              {
                statusArr.length > 0 ?
                  <DateRangePicker 
                    id="date" 
                    className="max-w-sm mx-auto " 
                    enableSelect={true} 
                    placeholder='Select Open Date'
                    onValueChange={ (v) => {
                      console.log( moment(v.from).format('YYYY-MM-DD') ) 
                      console.log( moment(v.to).format('YYYY-MM-DD') ) 

                      setForm( prev => (
                        {
                          ...prev,
                          from: moment(v.from).format('YYYY-MM-DD'),
                          to: moment(v.to).format('YYYY-MM-DD')
                        }
                      ))

                    }}



                  />
                  :
                  <Skeleton animation="wave" />
              }

            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              {
                statusArr.length > 0 ?
                  <Autocomplete
                    disablePortal
                    id="class_id"
                    options={classArr}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Classification" size='small' />}
                    onChange={(e, v) => {
                      const id = e.target.id.split('-')[0]

                      if (v != null) {
                        setForm(prev => (
                          {
                            ...prev,
                            [id]: v.id
                          }
                        ))
                      }
                      else {
                        setForm(prev => (
                          {
                            ...prev,
                            class_id: null
                          }
                        ))
                      }
                    }}
                  />
                  :
                  <Skeleton animation="wave" />
              }

            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              {
                statusArr.length > 0 ?
                  <Autocomplete
                    disablePortal
                    multiple
                    id="shop_id"
                    options={shopArr}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Shop Name" size='small' />}
                    onChange={(e, v) => {
                      const id = e.target.id.split('-')[0]

                      var data = Object.entries(v).map(([key, val]) => val.id).join(',')
                      console.log(data)

                      if (data != null) {
                        setForm(prev => (
                          {
                            ...prev,
                            [id]: data
                          }
                        ))
                      }
                      else {
                        setForm(prev => (
                          {
                            ...prev,
                            shop_id: null
                          }
                        ))
                      }
                    }}
                  />
                  :
                  <Skeleton animation="wave" />
              }

            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              {
                statusArr.length > 0 ?
                  <Autocomplete
                    disablePortal
                    id="status_id"
                    options={statusArr}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Status" size='small' />}
                    onChange={(e, v) => {
                      const id = e.target.id.split('-')[0]

                      if (v != null) {
                        setForm(prev => (
                          {
                            ...prev,
                            [id]: v.id
                          }
                        ))
                      }
                      else {
                        setForm(prev => (
                          {
                            ...prev,
                            status_id: null
                          }
                        ))
                      }
                    }}

                  />
                  :
                  <Skeleton animation="wave" />
              }
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              {
                statusArr.length > 0 ?
                  <Autocomplete
                    disablePortal
                    id="active_org_id"
                    options={activeOrgArr}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Active Org" size='small' />}
                    onChange={(e, v) => {
                      const id = e.target.id.split('-')[0]

                      if (v != null) {
                        setForm(prev => (
                          {
                            ...prev,
                            [id]: v.id
                          }
                        ))
                      }
                      else {
                        setForm(prev => (
                          {
                            ...prev,
                            active_org_id: null
                          }
                        ))
                      }
                    }}
                  />
                  :
                  <Skeleton animation="wave" />
              }

            </FormControl>
          </Grid>


          <Grid item xs={12}>
            <ThemeProvider theme={theme}>
              {/* <ButtonGroup variant="contained" size='small' color='primary' disableElevation> */}
              <Button
                variant="contained"
                onClick={getForm}
                color='primary1'
                sx={{ border: 1, borderColor: 'primary1.dark', }}
                disableElevation
              >
                <Typography variant="button" sx={{ fontSize: 14 }}>
                  Apply
                </Typography>
              </Button>
              {/* </ButtonGroup> */}
            </ThemeProvider>
          </Grid>
        </Grid>
      </List>
    </Box>
  )

  return (
    <div>
      {/* {['left', 'left', 'top', 'bottom'].map((anchor) => ( */}
      <React.Fragment >
        {/* <Button onClick={toggleDrawer('left', true)}>test</Button> */}
        <Drawer
          variant='persistent'
          anchor={'left'}
          open={state}
          onClose={toggleDrawer('left', false)}
        >
          {list('left')}
        </Drawer>
      </React.Fragment>
      {/* ))} */}
    </div>
  )
}