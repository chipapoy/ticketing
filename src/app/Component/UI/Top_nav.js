import { useEffect, useState } from 'react';
import Router from 'next/router';
import Link from 'next/link'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { Fragment } from 'react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import Badge from '@mui/material/Badge';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import NotificationsActiveSharpIcon from '@mui/icons-material/NotificationsActiveSharp';
import NotificationDrawer from '@/Component/UI/Notification'
import OpenTicketsDrawer from '@/Component/UI/OpenTickets'
import moment from 'moment';

const Top_nav = (props) => {

	const router = useRouter()

	const [userData, setUserData] = useState({
		id: null,
		name: null,
		email_add: null,
		username: null,
		role_id: null
	})

	const [openList, setOpenList] = useState([])
	const [countTicket, setCountOpen] = useState(0)
	const [notifList, setNotifList] = useState([])
	const [countNotif, setCountNotif] = useState(0)
	const [openTicketDrawer, setOpenTicketDrawer] = useState(false)
	const [openNotifDrawer, setOpenNotifDrawer] = useState(false)
	const [counter, setCounter] = useState(0)

	const navigation = [
		{ name: 'Dashboard', href: 'dashboard', current: false, restrict: (userData.role_id == 7 || userData.role_id == 8) ? true : false },
		{ name: 'Tickets', href: 'tickets', current: false, restrict: false },
		{ name: 'Reports', href: 'reports', current: false, restrict: (userData.role_id == 7 || userData.role_id == 8) ? true : false },
		{ name: 'Maintenance', href: 'maintenance', current: false, restrict: userData.role_id == 1 ? false : true },
	]

	const getOpenTickets = async () => {

		const response = await axios.get(`/api/Lists/open_ticket_notif`)
		setOpenList(response.data.result)
		setCountOpen(response.data.result.length)
	}

	useEffect(() => {
		getOpenTickets()

		return (() => {
			setCountOpen(0)
			setCounter(0)
			setOpenList([])
		})
	}, [])

	useEffect(() => {

		const interval = setInterval(() => {

			getOpenTickets()

			setCounter(prev => prev + 1)

			// console.log(counter)
			// console.log(moment().format('YYYY-MM-DD HH:mm:ss'))

		}, 10000)

		return () => clearInterval(interval)

	}, [counter])

	// useEffect(()=>{
	// 	console.log(openDrawer)
	// },[openDrawer])

	useEffect(() => {

		if (localStorage.getItem('id') === null) {
			router.push("/login");
		}
		else {
			setUserData({
				id: localStorage.getItem('id'),
				name: localStorage.getItem('name'),
				email_add: localStorage.getItem('email_add'),
				username: localStorage.getItem('username'),
				role_id: localStorage.getItem('role_id'),
				tech_id: localStorage.getItem('tech_id')
			})
		}

	}, [])




	function classNames(...classes) {
		return classes.filter(Boolean).join(' ')
	}

	function setCurrentPage(navName) {
		if (navName !== '') {
			const currentNav = navigation.find(nav => nav.name == navName)
			currentNav.current = true
		}
	}

	const handleTicketButton = () => {

		console.log('notifbutton')
		setOpenTicketDrawer(true)

	}

	const handleNotifButton = () => {

		console.log('notifbutton')
		setOpenNotifDrawer(true)

	}

	const callbackTicketDrawer = (data) => {

		console.log(data)
		setOpenTicketDrawer(data.state)
	}

	const callbackNotifDrawer = (data) => {

		console.log(data)
		setOpenNotifDrawer(data.state)
	}

	setCurrentPage(props.pageName);

	return (
		<>
			<div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<Image
								className="h-12 w-12"
								src="/tmg.png"
								width={100}
								height={100}
								alt="The Moment Group"
							/>
						</div>
						<div className="hidden md:block">
							<div className="ml-10 flex items-baseline space-x-4">
								{navigation.map((item) => (

									!item.restrict
										?
										<Link
											key={item.name}
											href={item.href}
											className={classNames(
												item.current
													? 'bg-gray-900 text-white'
													: 'text-gray-300 hover:bg-gray-700 hover:text-white',
												'rounded-md px-3 py-2 text-sm font-medium'
											)}
											aria-current={item.current ? 'page' : undefined}
										>
											{item.name}  {/* This shows the names of the buttons */}
										</Link>
										:
										null
								))}
							</div>
						</div>
					</div>
					<div className="hidden md:block">
						<div className="ml-4 flex items-center md:ml-6">
							<Menu as="div" className="relative ml-3">
								<div>
									<Menu.Button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >
										<span className="absolute -inset-1.5" />
										<span className="sr-only">View notifications</span>
										<Badge badgeContent={countTicket} color="error">
											<LocalActivityIcon onClick={handleTicketButton} />
											<OpenTicketsDrawer openDrawer={openTicketDrawer} callbackDrawer={callbackTicketDrawer} openList={openList} />
										</Badge>
									</Menu.Button>
								</div>
							</Menu>

							<Menu as="div" className="relative ml-3">
								<div>
									<Menu.Button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >
										<span className="absolute -inset-1.5" />
										<span className="sr-only">View notifications</span>
										<Badge badgeContent={countNotif} color="error">
											<NotificationsActiveSharpIcon onClick={handleNotifButton} />
											<NotificationDrawer openDrawer={openNotifDrawer} callbackDrawer={callbackNotifDrawer} openList={notifList} />
										</Badge>
									</Menu.Button>
								</div>
							</Menu>



							{/* Profile dropdown */}
							<div className="text-white text-center ml-3">{userData.name}</div>
							<Menu as="div" className="relative ml-3">
								<div>
									<Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
										<span className="absolute -inset-1.5" />
										<span className="sr-only">Open user menu</span>
										{/* <Image className="h-8 w-8 rounded-full" src={props.user.imageUrl} alt="" width={500}
											height={500} /> */}
										<Avatar
											alt={userData.name}
										/>
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
									<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										{props.userNavigation.map((item) => (
											<Menu.Item key={item.name}>
												{({ active }) => (
													<a
														href={item.href}
														className={classNames(
															active ? 'bg-gray-100' : '',
															'block px-4 py-2 text-sm text-gray-700'
														)}
													>
														{item.name}
													</a>
												)}
											</Menu.Item>
										))}
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>
					<div className="-mr-2 flex md:hidden">
						{/* Mobile menu button */}
						<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							{props.open ? (
								<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
							) : (
								<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
							)}
						</Disclosure.Button>
					</div>
				</div>
			</div>

			<Disclosure.Panel className="md:hidden">
				<div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
					{navigation.map((item) => (

						!item.restrict
							?
							< Link
								key={item.name}
								href={item.href}
								className={
									classNames(
										item.current
											? 'bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium'
									)}
								aria-current={item.current ? 'page' : undefined}
							>
								{item.name}  {/* This shows the names of the buttons */}
							</Link>
							:
							null
					))}
				</div>
				<div className="border-t border-gray-700 pb-3 pt-4">
					<div className="flex items-center px-5">
						<div className="flex-shrink-0">
							<Avatar
								alt={userData.name}
							/>
						</div>
						<div className="ml-3">
							<div className="text-base font-medium leading-none text-white">{userData.name}</div>
							<div className="text-sm font-medium leading-none text-gray-400">{userData.email_add}</div>
						</div>
						<button type="button" className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
							<span className="absolute -inset-1.5"></span>
							<span className="sr-only">View notifications</span>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
							</svg>
						</button>
					</div>
					<div className="mt-3 space-y-1 px-2">
						{props.userNavigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
							>
								{item.name}
							</a>
						))}
					</div>
				</div>
			</Disclosure.Panel >
		</>
	)

}


export default Top_nav

