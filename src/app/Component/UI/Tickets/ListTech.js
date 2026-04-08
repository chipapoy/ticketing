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
import Details from '@/Component/Forms/Tickets/Details';
import moment from 'moment';
import SubHeaderBtn from '@/Component/UI/Tickets/SubHeaderBtn';


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
      cell: (row, index, col, id) => {

        const menuArr = [
          {
            title: 'Edit',
            icon: '',
            access: true,
            record_id: row.id
          },
          {
            title: 'Details',
            icon: '',
            access: true,
            record_id: row.id
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
          "Closed": "text-green-500"
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
    },
    {
      id: 'shop',
      name: 'Shop/Dept',
      sortable: true,
      selector: row => row.shop_name != null ? row.shop_name : row.department,
    },
    {
      id: 'ticket_type',
      name: 'Ticket Type',
      sortable: true,
      selector: row => row.ticket_type,
    },
    {
      id: 'category',
      name: 'Category',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '10%',
      selector: row => row.category,
    },
    {
      id: 'sub_category',
      name: 'Sub Category',
      sortable: true,
      wrap: true,
      grow: 1,
      maxWidth: '15%',
      selector: row => row.sub_category,
    },
    {
      id: 'priority',
      name: 'Priority',
      sortable: true,
      selector: row => row.priority,
    },
    {
      id: 'update_by',
      name: 'Update By',
      sortable: true,
      selector: row => row.update_by,
    },
    {
      id: 'update_date',
      name: 'Update Date',
      sortable: true,
      selector: row => moment(row.update_date).format('DD-MMM-YY HH:mm') !== "Invalid date" ? moment(row.update_date).format('DD-MMM-YY HH:mm') : '--'
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

  }, [userId,roleId,techId,refresh]);

  const MenuButton = ({ menuArr }) => {

    const handleClickUpdate = (e) => {

      var record_id = e.target.dataset.id;

      props.toggleCallback({
        open: true,
        module: 'update_ticket',
        title: `Update Ticket ${record_id}`,
        content: roleId > 6 ? 
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
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-40 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            ...
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-[4em] z-50 mt-[-2.7em] w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {menuArr.map((menu) => (
                <Menu.Item key={menu.title}>
                  {({ active }) => (
                    <button data-id={menu.record_id} onClick={menu.title == "Edit" ? handleClickUpdate : handleClickDetails} className={
                      `${active ? 'bg-blue-100' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`
                    } >
                      {menu.title}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

    )
  }

  const fetchData = async page => {

    try {

      setLoading(true)

      const api = techId==null ? 'getList' : 'getTechList';

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

  const searchData = async (page,search) => {

    try {

      const api = techId==null ? 'searchList' : 'searchTechList';

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

      const api = techId==null ? 'getList' : 'getTechList';

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
    searchData(1,data.search)
    // setData([]);
    // setRefresh(true);
    // setDefaultPage(1);
    // setIsReset(true);

  }

  const refreshCallback = (data) => {

    console.log('this is refresh')

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
      content: <Create user_id = {userId}/>
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