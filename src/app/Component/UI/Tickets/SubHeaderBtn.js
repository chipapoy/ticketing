import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, ButtonGroup, TextField, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const BasicButtons = (props) => {

  const [search, setSearch] = useState('')
  const [roleId, setRoleId] = useState()
  const [roleIdMaster, setRoleIdMaster] = useState([1, 2, 3])

  const theme = createTheme({
    palette: {
      gray: {
        main: '#e0e0e0',
        light: '#eeeeee',
        dark: '#bdbdbd'
      },
    },
  });

  const handleRefresh = () => {

    setSearch('')
    props.refreshCallback({
      refresh: true
    })

  }

  const handleSearch = () => {

    // console.log(search)
    props.searchCallback({
      search: search
    })
  }

  const handleFilter = () => {

    // setSearch('')
    props.drawerFilterCallback({
      open: true,
      isFilter: false,
      filter: null
    })

  }

  const handleAddTicket = () => {

    props.addTicketCallback({
      add: true
    })

  }

  

  useEffect(() => {

    setRoleId(localStorage.role_id)

    // roleIdMaster.includes(parseInt(roleId)) ? setIsDisabled(false) : setIsDisabled(true)

    // console.log(roleId)
    console.log(roleIdMaster.includes(parseInt(roleId)))
  }, [])

  return (
    <>

      <ThemeProvider theme={theme}>
        <ButtonGroup variant="contained" size='small' color='gray' disableElevation>
          <TextField
            id="search_ticket_num"
            value={search}
            label="Search Ticket#"
            variant="outlined"
            size='small'
            onChange={e => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch} sx={{boxShadow:'none', border:1, }} >
            <SearchIcon />
          </Button>
          <Button onClick={handleRefresh} sx={{boxShadow:'none', border:1, borderColor:'gray.dark'}}>
            <RefreshIcon />
          </Button>
          <Button onClick={handleFilter} sx={{boxShadow:'none', border:1, borderColor:'gray.dark'}}>
            <FilterAltIcon />
          </Button>
          {
            roleIdMaster.includes(parseInt(roleId)) ? (
              <Button onClick={handleAddTicket} sx={{boxShadow:'none', border:1, borderColor:'gray.dark'}}>
                <AddIcon />
                <Typography sx={{ fontSize: 12 }}>
                  Create
                </Typography>
              </Button>
            )
              :
              null
          }
        </ButtonGroup>
        
      </ThemeProvider>
    </>

  );
}


export default BasicButtons