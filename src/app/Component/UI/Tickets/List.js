import { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { toast } from 'react-toastify'
import CreateHelpDesk from '@/Component/Forms/Tickets/CreateHelpDesk'
import Edit from '@/Component/Forms/Tickets/Edit'
import EditAdmin from '@/Component/Forms/Tickets/EditAdmin'
import EditHelpDesk from '@/Component/Forms/Tickets/EditHelpDesk'
import EditTech from '@/Component/Forms/Tickets/EditTech'
import EditLead from '@/Component/Forms/Tickets/EditLead'
import Details from '@/Component/Forms/Tickets/Details'
import moment from 'moment'
import SubHeaderBtn from '@/Component/UI/Tickets/SubHeaderBtn'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import Chip from '@mui/material/Chip'
import DrawerForm_filter from '@/Component/Forms/DrawerForm_filter_ticket'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

const List = (props) => {

  const [userId, setUserId] = useState(null)
  const [roleId, setRoleId] = useState(null)
  const [techId, setTechId] = useState(null)

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const [defaultPage, setDefaultPage] = useState(1)
  const [isReset, setIsReset] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)

  const [filterParam, setFilterParam] = useState('')
  const [isFilter, setIsFilter] = useState(false)

  const columns = [
    {
      id: 'action_btn',
      name: 'Action',
      sortable: false,
      selector: row => row.id,
      button: true,
      maxWidth: '30%',
      cell: (row, index, col, id) => {

        const menuArr = [
          {
            title: 'Edit',
            icon: <EditNoteIcon key={row.id} data-id={row.id} />,
            access: true,
            record_id: row.id,
            hide_in_tech: false,
          },
          {
            title: 'Details',
            icon: <ArticleOutlinedIcon data-id={row.id} />,
            access: true,
            record_id: row.id,
            hide_in_tech: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
          }
        ]

        return (
          <MenuButton menuArr={menuArr} />

        )
      }
    },
    {
      id: 'id',
      name: 'Ticket#',
      sortable: true,
      selector: row => row.id,
      wrap: true,
      grow: 1,
      width: '95px'
      // maxWidth: '5px'
    },
    {
      id: 'open_date',
      name: 'Open Date',
      sortable: true,
      wrap: true,
      grow: 1,
      // maxWidth: '10%',
      // selector: row => moment(row.open_date).format('DD-MMM-YY HH:mm'),
      selector: row => row.open_date,
      format: row => {

        var date = moment(row.open_date).format('DD-MMM-YY HH:mm').split(' ').join('\n')

        return <div style={{ whiteSpace: "pre-line" }}> {date} </div>
      }
    },
    {
      id: 'closed_date',
      name: 'Close Date',
      sortable: true,
      wrap: true,
      grow: 1,
      // maxWidth: '10%',
      omit: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
      selector: row => moment(row.closed_date).format('DD-MMM-YY HH:mm') !== "Invalid date" ? moment(row.closed_date).format('DD-MMM-YY HH:mm') : '--'
    },

    {
      id: 'status',
      name: 'Status',
      sortable: true,
      selector: row => row.status,
      wrap: true,
      grow: 1,
      // maxWidth: '5px',
      format: row => {
        // return row.status
        const statusColor = {
          "Open": "error",
          "Closed": "success",
          "Resolved": "warning",
        }

        return (
          // <span className={statusColor[row.status]}>{row.status}</span>
          <Chip label={row.status} color={statusColor[row.status]} size='small' />
        )
      }
    },
    {
      id: 'durationMin',
      name: 'Duration',
      sortable: true,
      selector: row => row.status,
      wrap: true,
      grow: 1,
      // maxWidth: '5px',
      omit: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
      format: row => {

        var duration = (row.durationMin / 60).toFixed(2)
        var sla = row.sla.split(' ')[0]
        var isDurationExceed = parseFloat(duration) > parseFloat(sla) ? true : false

        return (
          <span className={isDurationExceed ? 'text-red-500' : ''}>{duration} hrs</span>
        )
      }
    },
    {
      id: 'sla',
      name: 'SLA',
      sortable: true,
      wrap: true,
      grow: 1,
      // maxWidth: '5%',
      selector: row => row.sla,
      hide: 'lg'
    },
    {
      id: 'active_org',
      name: 'Active Org',
      sortable: true,
      wrap: true,
      grow: 1,
      width: '10rem',
      omit: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
      selector: row => row.stage,
      format: row => {
        // return row.status
        const statusColor = {
          "Helpdesk-L1": "warning",
          "Helpdesk-L2": "warning",
          "FieldTech-Lead": "primary",
          "FieldTech-L1": "secondary",
          "FieldTech-L2": "secondary",
          "Third Party": "default"
        }

        return (
          // <span className={statusColor[row.active_org]}>{row.active_org}</span>
          <Chip label={row.active_org} color={statusColor[row.active_org]} size='small' />
        )
      }
    },
    {
      id: 'technician_name',
      name: 'Assigned Tech',
      sortable: true,
      wrap: true,
      grow: 1,
      width: '10rem',
      omit: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
      selector: row => row.technician_name != null ? row.technician_name : 'n/a',
      hide: 'lg'
    },
    // {
    //   id: 'technician_name',
    //   name: 'Tech Assigned',
    //   sortable: true,
    //   wrap: true,
    //   grow: 1,
    //   // maxWidth: '10%',
    //   omit: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
    //   selector: row => row.technician_name,
    //   format: row => {
    //     return row.technician_name
    //   }
    // },
    // {
    //   id: 'tech_start',
    //   name: 'Activity Start',
    //   sortable: true,
    //   wrap: true,
    //   grow: 1,
    //   // maxWidth: '10%',
    //   selector: row => moment(row.tech_start).format('DD-MMM-YY HH:mm') !== "Invalid date" ? moment(row.tech_start).format('DD-MMM-YY HH:mm') : '--'
    // },
    // {
    //   id: 'tech_end',
    //   name: 'Activity End',
    //   sortable: true,
    //   wrap: true,
    //   grow: 1,
    //   // maxWidth: '10%',
    //   selector: row => moment(row.tech_end).format('DD-MMM-YY HH:mm') !== "Invalid date" ? moment(row.tech_end).format('DD-MMM-YY HH:mm') : '--'
    // },
    {
      id: 'shop',
      name: 'Shop/Dept',
      sortable: true,
      wrap: true,
      grow: 1,
      width: '12rem',
      selector: row => row.shop_name != null ? row.shop_name + ` - ` + row.area_location : row.department,
      hide: 'lg'
    },
    {
      id: 'ticket_type',
      name: 'Ticket Type',
      sortable: true,
      wrap: true,
      grow: 1,
      selector: row => row.ticket_type,
      format: row => {

        var ticket_type = row.ticket_type.split(' ').join('\n')

        return <div style={{ whiteSpace: "pre-line" }}> {ticket_type} </div>
      },
      hide: 'lg'
    },
    {
      id: 'category',
      name: 'Category',
      sortable: true,
      wrap: true,
      grow: 1,
      // maxWidth: '10%',
      selector: row => row.category,
      hide: 'lg'
    },
    // {
    //   id: 'sub_category',
    //   name: 'Sub Category',
    //   sortable: true,
    //   wrap: true,
    //   grow: 1,
    //   // maxWidth: '15%',
    //   selector: row => row.sub_category,
    //   hide: 'lg'
    // },
    {
      id: 'priority',
      name: 'Priority',
      sortable: true,
      selector: row => row.priority,
      hide: 'lg',
      format: row => {

        const statusColor = {
          "Priority 1": "text-indigo-600",
          "Priority 2": "text-green-600",
          "Priority 3": "text-orange-600",
          "Priority 4": "text-red-600"
        }

        return (
          <span className={statusColor[row.priority]}>{row.priority}</span>
          // <Chip label={row.priority} color={statusColor[row.priority]} size='small' />
        )
      }
    },
    {
      id: 'update_by',
      name: 'Update By',
      sortable: true,
      omit: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
      selector: row => row.update_by != null ? row.update_by : '--',
      hide: 1580
    },
    {
      id: 'update_date',
      name: 'Update Date',
      sortable: true,
      wrap: true,
      grow: 1,
      omit: (roleId == 1 || roleId == 2 || roleId == 6) ? false : true,
      // selector: row => moment(row.update_date).format('DD-MMM-YY HH:mm') !== "Invalid date" ? moment(row.update_date).format('DD-MMM-YY HH:mm') : '--',
      selector: row => row.update_date,
      format: row => {

        if (moment(row.update_date).format('DD-MMM-YY HH:mm') !== "Invalid date") {
          var date = moment(row.update_date).format('DD-MMM-YY HH:mm').split(' ').join('\n')

          return <div style={{ whiteSpace: "pre-line" }}> {date} </div>
        }

        return '--'

      },
      hide: 1580
    }
  ]

  useEffect(() => {

    setUserId(localStorage.id)
    setRoleId(localStorage.role_id)
    setTechId(localStorage.tech_id)

    roleId ? fetchData(1) : null // fetch page 1 of users

    refresh ? fetchData(1) : null

    return () => {
      setRefresh(false)
      setIsReset(false)
      setUserId(null)
      setRoleId(null)
      setTechId(null)
    }

  }, [userId, roleId, techId, refresh])

  const MenuButton = ({ menuArr }) => {

    const handleClickUpdate = (e) => {

      var record_id = menuArr[0].record_id

      // console.log(record_id)

      props.toggleCallback({
        open: true,
        module: 'update_ticket',
        title: `Update Ticket ${record_id}`,
        content:
          roleId == 6
            ?
            <EditLead record_id={record_id} user_id={userId} role_id={roleId} updateCallback={updateCallback} />
            :
            roleId == 7
              ?
              <EditTech record_id={record_id} user_id={userId} role_id={roleId} updateCallback={updateCallback} />
              :
              roleId == 2
                ?
                <EditHelpDesk record_id={record_id} user_id={userId} role_id={roleId} updateCallback={updateCallback} />
                :
                <EditAdmin record_id={record_id} user_id={userId} role_id={roleId} updateCallback={updateCallback} />

      })
    }

    const handleClickDetails = (e) => {

      var record_id = menuArr[1].record_id

      console.log(record_id)

      props.toggleCallback({
        open: true,
        module: 'details_ticket',
        title: `Details Ticket# ${record_id}`,
        content: <Details record_id={record_id} />
      })
    }

    return (
      <div className='inline-flex'>
        {menuArr.map((menu) => (

          !menu.hide_in_tech ?

            (<button key={menu.title} title={menu.title} data-id={menu.record_id} onClick={menu.title == "Edit" ? handleClickUpdate : handleClickDetails} aria-label={menu.title}
              className='mx-2 transition duration-100 ease-in-out hover:scale-110'
            >
              {menu.icon}
            </button>)

            :

            null

        ))}
        {/* <EditNoteIcon onClick={handleClickUpdate} /> */}
      </div>
    )
  }

  const fetchData = async page => {

    console.log(techId == "null")

    try {

      setLoading(true)

      var api = techId == "null" ? 'getList' : 'getTechList'

      const response = await axios.get(`/api/TicketList/${api}?page=${page}&per_page=${perPage}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`)

      setData(response.data.result.data)
      setTotalRows(response.data.result.total)
      setLoading(false)

    } catch (error) {

      setLoading(false)

      toast.error(error.message, {
        type: 'error',
        delay: undefined,
        isLoading: false,
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {

        }
      })
    }

  }

  const searchData = async (page, search) => {

    try {

      var api = techId == "null" ? 'searchList' : 'searchTechList'

      setLoading(true)
      const response = await axios.get(`/api/TicketList/${api}?page=${page}&per_page=${perPage}&search=${search}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`)
      setData(response.data.result.data)
      setTotalRows(response.data.result.total)
      setLoading(false)

    }
    catch (error) {
      console.log(error)
      setLoading(false)

      toast.error(error.message, {
        type: 'error',
        delay: undefined,
        isLoading: false,
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {

        }
      })
    }
  }

  const filterData = async (page, filter) => {

    try {

      // var api = techId == "null" ? 'searchList' : 'searchTechList'

      setLoading(true)
      const response = await axios.get(`/api/TicketList/filterList?page=${page}&per_page=${perPage}&${filter}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`)
      setData(response.data.result.data)
      setTotalRows(response.data.result.total)
      setLoading(false)

    }
    catch (error) {
      console.log(error)
      setLoading(false)

      toast.error(error.message, {
        type: 'error',
        delay: undefined,
        isLoading: false,
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {

        }
      })
    }
  }

  const handlePageChange = page => {
    fetchData(page)
  }

  const handlePerRowsChange = async (newPerPage, page) => {

    try {

      const api = techId == "null" ? 'getList' : 'getTechList'

      setLoading(true)

      const response = await axios.get(`/api/TicketList/${api}?page=${page}&per_page=${newPerPage}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`)

      setData(response.data.result.data)
      setPerPage(newPerPage)
      setLoading(false)

    }

    catch (error) {

      setLoading(false)

      toast.error(error.message, {
        type: 'error',
        delay: undefined,
        isLoading: false,
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {

        }
      })
    }

  }

  const handleFilterPageChange = page => {
    filterData(page, filterParam)
  }

  const handleFilterPerRowsChange = async (newPerPage, page) => {

    try {

      setLoading(true)
      const response = await axios.get(`/api/TicketList/filterList?page=${page}&per_page=${newPerPage}&${filterParam}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`)
      setData(response.data.result.data)
      setTotalRows(response.data.result.total)
      setLoading(false)

    }

    catch (error) {

      setLoading(false)

      toast.error(error.message, {
        type: 'error',
        delay: undefined,
        isLoading: false,
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {

        }
      })
    }

  }

  // const customStyles = {
  //   headRow: {
  //     style: {
  //       border: 'none',
  //     },
  //   },
  //   headCells: {
  //     style: {
  //       color: '#202124',
  //       fontSize: '14px',
  //     },
  //   },
  //   rows: {
  //     highlightOnHoverStyle: {
  //       backgroundColor: 'black',
  //       borderBottomColor: '#FFFFFF',
  //       borderRadius: '25px',
  //       outline: '1px solid #FFFFFF',
  //     },
  //   },
  //   pagination: {
  //     style: {
  //       border: 'none',
  //     },
  //   },
  // }

  const searchCallback = (data) => {

    if (data.search) {
      console.log('this is search')
      console.log(data.search)
      searchData(1, data.search)
      setIsFilter(false)
    }
  }

  const refreshCallback = (data) => {

    console.log('this is refresh')

    setData([])
    setRefresh(data.refresh)
    setDefaultPage(1)
    setIsReset(true)
    setIsFilter(false)

  }

  const createCallback = (data) => {
    // console.log(data)
    console.log('this is refresh upon creation')

    setData([])
    setRefresh(true)
    setDefaultPage(1)
    setIsReset(true)

    props.toggleCallback({
      open: data.open,
      module: null,
      title: null,
      content: null
    })
  }

  const updateCallback = (data) => {
    // console.log(data)
    console.log('this is refresh upon updating')

    setData([])
    setRefresh(true)
    setDefaultPage(1)
    setIsReset(true)

    props.toggleCallback({
      open: data.open,
      module: null,
      title: null,
      content: null
    })
  }

  const addTicketCallback = (data) => {
    props.toggleCallback({
      open: true,
      module: 'create_ticket',
      title: 'Create Tickets',
      content: <CreateHelpDesk user_id={userId} createCallback={createCallback} />
    })
  }

  const RecordDetails = ({ data }) => {

    return (
      // <pre></pre>
      <>
        <div className={`grid lg:grid-cols-5 gap-2 p-5 mx-5 text-sm bg-gray-100 border-x-2 border-gray-500 lg:divide-x sm:divide-y lg:divide-y-0 divide-black`}>

          <div className={`grid gap-2 p-3 mx-5`}>

            <strong>Customer</strong>
            <span>{data.customer_name}</span>
            <strong>Contact#</strong>
            <span>{data.contact_num}</span>
            <strong>Email</strong>
            <span>{data.email_add}</span>
          </div>

          <div className={`grid gap-2 p-3 mx-5`}>
            <strong>Shop/Dept</strong>
            <span>{data.shop_name != null ? data.shop_name : data.department}</span>
            <strong>Location/Section</strong>
            <span>{data.area_location != null ? data.area_location : data.section}</span>
            <strong>Tele Troubleshoot</strong>
            <span>{data.tele_ts}</span>
          </div>

          <div className={`grid gap-2 p-3 mx-5`}>

            <strong>Ticket Type</strong>
            <span>{data.ticket_type}</span>
            <strong>Category</strong>
            <span>{data.category}</span>
            <strong>Sub Category</strong>
            <span>{data.sub_category}</span>
          </div>

          <div className={`grid gap-2 p-3 mx-5`}>
            <strong>Assigned Tech</strong>
            <span>{data.technician_name != null ? data.technician_name : "n/a"}</span>
            <strong>Activity Start | End</strong>
            <span>
              {data.tech_start != null ? moment(data.tech_start).format('DD-MMM-YY HH:mm') : "--"}
              &nbsp;|&nbsp;
              {data.tech_end != null ? moment(data.tech_end).format('DD-MMM-YY HH:mm') : "--"}
            </span>
            <strong>Tagging</strong>
            <span>{data.tagging != null && data.tagging != 'N/A' ? data.tagging : "n/a"}</span>
            <strong>Resolution</strong>
            <span>{data.resolution != null ? data.resolution : "n/a"}</span>
          </div>

          <div className={`grid gap-2 p-3 mx-5`}>

            <strong>Creator</strong>
            <span>{data.added_by} | {moment(data.added_date).format('DD-MMM-YY HH:mm')}</span>
            <strong>Last Update by</strong>
            <span>{data.update_by != null ? data.update_by : 'n/a'} | {data.update_by != null ? moment(data.update_date).format('DD-MMM-YY HH:mm') : '--'}</span>
          </div>

        </div>
        <hr />
      </>
    )
  }

  // const filterCallback = (data) => {


  // }

  const drawerFilterCallback = (data) => {

    console.log(data)

    setOpenFilter(data.open)

    setIsFilter(data.isFilter)

    if (data.isFilter) {
      var param = data.isFilter ? Object.entries(data.filter).map(([key, val]) => `${key}=${val}`).join('&') : null

      setFilterParam(param)

      filterData(1, param)
    }
  }


  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        persistTableHead={true}
        progressPending={loading}
        // dense
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={30}
        paginationRowsPerPageOptions={[10, 15, 25, 30, 50]}
        onChangeRowsPerPage={isFilter ? handleFilterPerRowsChange : handlePerRowsChange}
        onChangePage={isFilter ? handleFilterPageChange : handlePageChange}
        fixedHeader={true}
        fixedHeaderScrollHeight={"70vh"}
        highlightOnHover={true}
        striped={true}
        pointerOnHover={true}
        paginationDefaultPage={defaultPage}
        paginationResetDefaultPage={isReset}
        progressComponent={
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        }
        subHeader={true}
        subHeaderAlign={"left"}
        expandableRows={true}
        expandableRowsHideExpander={true}
        // expandableRowExpanded={() => true}
        expandOnRowClicked={true}
        expandableRowsComponent={RecordDetails}
        customStyles={{
          headCells: {
            style: {
              background: '#9B9B9B',
              color: '#FBFBFB'
            }
          },
          rows: {
            highlightOnHoverStyle: {
              background: '#dce4f2',
              // color: '#FBFBFB',
              borderBottomColor: '#FFFFFF',
              outline: '1px solid #FFFFFF',

            },
            style: {
              padding: '2rem 0.2rem'
            }
          },
        }}
        subHeaderComponent={
          <SubHeaderBtn
            refreshCallback={refreshCallback}
            searchCallback={searchCallback}
            addTicketCallback={addTicketCallback}
            drawerFilterCallback={drawerFilterCallback}
          />
        }
      />
      <DrawerForm_filter openDrawer={openFilter} drawerFilterCallback={drawerFilterCallback} />
    </>
  )
}

export default List