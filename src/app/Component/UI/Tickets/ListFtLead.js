import { Fragment, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { IconButton } from "@material-tailwind/react";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowPathIcon, FunnelIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify';
import { Menu, Transition } from '@headlessui/react'
import Create from '@/Component/Forms/Tickets/Create';
import Edit from '@/Component/Forms/Tickets/Edit';
import EditTech from '@/Component/Forms/Tickets/EditTech';
import EditLead from '@/Component/Forms/Tickets/EditLead';
import Details from '@/Component/Forms/Tickets/Details';
import moment from 'moment';
import SubHeaderBtn from '@/Component/UI/Tickets/SubHeaderBtn';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArticleIcon from '@mui/icons-material/Article';

const List = (props) => {

  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [techId, setTechId] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [defaultPage, setDefaultPage] = useState(1);
  const [isReset, setIsReset] = useState(false);

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
            icon: <EditNoteIcon />,
            access: true,
            record_id: row.id,
            is_tech: techId ? true : false
          },
          {
            title: 'Details',
            icon: <ArticleOutlinedIcon />,
            access: true,
            record_id: row.id,
            is_tech: techId ? true : false
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
      maxWidth: '5px'
    },
    {
      id: 'open_date',
      name: 'Open Date',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '10%',
      selector: row => moment(row.open_date).format('DD-MMM-YY HH:mm')
    },
    {
      id: 'closed_date',
      name: 'Close Date',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '10%',
      selector: row => moment(row.closed_date).format('DD-MMM-YY HH:mm') !== "Invalid date" ? moment(row.closed_date).format('DD-MMM-YY HH:mm') : '--'
    },
    {
      id: 'status',
      name: 'Status',
      sortable: true,
      selector: row => row.status,
      wrap: true,
      grow: 1,
      maxWidth: '5px',
      format: row => {
        // return row.status;
        const statusColor = {
          "Open": "text-red-500",
          "Closed": "text-green-500",
          "Resolved": "text-orange-500",
        };

        return (
          <span className={statusColor[row.status]}>{row.status}</span>
        );
      }
    },
    {
      id: 'active_org',
      name: 'Active Org',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '5%',
      selector: row => row.stage,
      format: row => {
        // return row.status;
        const statusColor = {
          "Helpdesk-L1": "text-yellow-800",
          "Helpdesk-L2": "text-yellow-800",
          "FieldTech-Lead": "text-blue-500",
          "FieldTech-L1": "text-blue-500",
          "FieldTech-L2": "text-blue-500"
        };

        return (
          <span className={statusColor[row.active_org]}>{row.active_org}</span>
        );
      }
    },
    {
      id: 'sla',
      name: 'SLA',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '5%',
      selector: row => row.sla,
      hide: 'lg'
    },
    {
      id: 'shop',
      name: 'Shop/Dept',
      sortable: true,
      selector: row => row.shop_name != null ? row.shop_name : row.department,
      hide: 'lg'
    },
    {
      id: 'ticket_type',
      name: 'Ticket Type',
      sortable: true,
      wrap: true,
      grow: 1,
      selector: row => row.ticket_type,
      hide: 'lg'
    },
    {
      id: 'category',
      name: 'Category',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '10%',
      selector: row => row.category,
      hide: 'lg'
    },
    {
      id: 'sub_category',
      name: 'Sub Category',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '15%',
      selector: row => row.sub_category,
      hide: 'lg'
    },
    {
      id: 'priority',
      name: 'Priority',
      sortable: true,
      selector: row => row.priority,
      hide: 'lg'
    },
    {
      id: 'update_by',
      name: 'Update By',
      sortable: true,
      selector: row => row.update_by,
      hide: 1580
    },
    {
      id: 'update_date',
      name: 'Update Date',
      sortable: true,
      selector: row => moment(row.update_date).format('DD-MMM-YY HH:mm') !== "Invalid date" ? moment(row.update_date).format('DD-MMM-YY HH:mm') : '--',
      hide: 1580
    }
  ];

  useEffect(() => {

    setUserId(localStorage.id)
    setRoleId(localStorage.role_id)
    setTechId(localStorage.tech_id)

    roleId ? fetchData(1) : null; // fetch page 1 of users

    refresh ? fetchData(1) : null;

    return () => {
      setRefresh(false);
      setIsReset(false);
      setUserId(null)
      setRoleId(null)
      setTechId(null)
    }

  }, [userId, roleId, techId, refresh]);

  const MenuButton = ({ menuArr }) => {

    const handleClickUpdate = (e) => {

      var record_id = e.target.dataset.id;

      props.toggleCallback({
        open: true,
        module: 'update_ticket',
        title: `Update Ticket ${record_id}`,
        content:
          roleId == 6
            ?
            <EditLead record_id={record_id} user_id={userId} role_id={roleId} />
            :
            roleId == 7
              ?
              <EditTech record_id={record_id} user_id={userId} role_id={roleId} />
              :
              <Edit record_id={record_id} user_id={userId} role_id={roleId} />

      })
    }

    const handleClickDetails = (e) => {

      var record_id = e.target.dataset.id;

      props.toggleCallback({
        open: true,
        module: 'details_ticket',
        title: `Details Ticket# ${record_id}`,
        content: <Details record_id={record_id} />
      })
    }

    return (
      <div className='w-50 inline-flex'>
        {menuArr.map((menu) => (
          <button key={menu.title} title={menu.title} data-id={menu.record_id} onClick={menu.title == "Edit" ? handleClickUpdate : handleClickDetails} aria-label={menu.title} 
          >
            {menu.icon}

          </button>
        ))}
      </div>
    )
  }

  const fetchData = async page => {

    console.log(techId == "null")

    try {

      setLoading(true)

      var api = techId == "null" ? 'getList' : 'getTechList';

      const response = await axios.get(`/api/TicketList/${api}?page=${page}&per_page=${perPage}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`)

      setData(response.data.result.data);
      setTotalRows(response.data.result.total);
      setLoading(false);

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

  };

  const searchData = async (page, search) => {

    try {

      var api = techId == "null" ? 'searchList' : 'searchTechList';

      setLoading(true);
      const response = await axios.get(`/api/TicketList/${api}?page=${page}&per_page=${perPage}&search=${search}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`);
      setData(response.data.result.data);
      setTotalRows(response.data.result.total);
      setLoading(false);

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
  };

  const handlePageChange = page => {
    fetchData(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {

    try {

      const api = techId == null ? 'getList' : 'getTechList';

      setLoading(true);

      const response = await axios.get(`/api/TicketList/${api}?page=${page}&per_page=${newPerPage}&user_id=${userId}&tech_id=${techId}&role_id=${roleId}`);

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

  };

  const conditionalRowStyles = [
    // {
    //   when: row => row.status === "Ongoing",
    //   style: {
    //     backgroundColor: 'green',
    //     color: 'white',
    //     '&:hover': {
    //       cursor: 'pointer',
    //     },
    //   },
    // },
    // You can also pass a callback to style for additional customization
    // {
    //   when: row => row.calories < 400,
    //   style: row => ({ backgroundColor: row.isSpecial ? 'pink' : 'inerit' }),
    // },
  ];

  const searchCallback = (data) => {

    console.log('this is search')
    console.log(data.search)
    searchData(1, data.search)
    // setData([]);
    // setRefresh(true);
    // setDefaultPage(1);
    // setIsReset(true);

  }

  const refreshCallback = (data) => {

    console.log('this is refresh')

    setData([]);
    setRefresh(data.refresh);
    setDefaultPage(1);
    setIsReset(true);

  }

  const createCallback = (data) => {
    // console.log(data);
    console.log('this is refresh upon creation')

    setData([]);
    setRefresh(true);
    setDefaultPage(1);
    setIsReset(true);
  }

  const updateCallback = (data) => {
    // console.log(data);
    console.log('this is refresh upon updating')

    setData([]);
    setRefresh(true);
    setDefaultPage(1);
    setIsReset(true);
  }

  const addTicketCallback = (data) => {
    props.toggleCallback({
      open: true,
      module: 'create_ticket',
      title: 'Create Tickets',
      content: <Create user_id={userId} createCallback={createCallback} />
    })
  }



  return (
    <DataTable
      columns={columns}
      data={data}
      persistTableHead={true}
      progressPending={loading}
      // dense
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      onChangeRowsPerPage={handlePerRowsChange}
      onChangePage={handlePageChange}
      fixedHeader={true}
      fixedHeaderScrollHeight={"50vh"}
      highlightOnHover={true}
      striped={true}
      pointerOnHover={true}
      paginationDefaultPage={defaultPage}
      paginationResetDefaultPage={isReset}
      responsive={true}
      subHeader={true}
      subHeaderAlign={"left"}
      customStyles={{
        headCells: {
          style: {
            background: '#9B9B9B',
            color: '#FBFBFB'
          }
        }
      }}

      subHeaderComponent={
        <SubHeaderBtn
          refreshCallback={refreshCallback}
          searchCallback={searchCallback}
          addTicketCallback={addTicketCallback}
        />
      }
    // onRowClicked={(row, event) => {


    //   console.log(row.id);

    //   props.ticketDetails({
    //     ticket_id: row.id
    //   })

    //   props.toggleCallback({
    //     open: true,
    //     module: 'update_ticket',
    //     title: 'Update Ticket'
    //   })


    // }}
    // actions={<Action />}
    // paginationRowsPerPageOptions={[5,10,15]}
    />
  );
}

export default List