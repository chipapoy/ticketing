import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { CSVLink } from 'react-csv';
import DownloadCSV_Button from './DownloadCSV_Button';

import moment from 'moment';

const Dashboard_Modal = (props) => {
	// const [isOpen, setIsOpen] = useState(false);

	const [isOpen, setOpen] = useState(false);

	const [disableBtn, setDisableBtn] = useState(false);

	const [dateTime, setDayTime] = useState("");

	const cancelButtonRef = useRef(null)

	const closeModal = () => {
			// props.modalInfo.open = false;
			// props.modalInfo
			setOpen(!isOpen);



			props.toggleCallback({
				open: false,
				module: '',
				title: '',
				content: null
			})

	};

	useEffect(() => {
			setOpen(props.modalInfo.open);
	}, [props.modalInfo.open]);

	return (
			<>
				<Transition.Root show={isOpen} as={Fragment}>
					<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={closeModal}>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
						</Transition.Child>
						<div className="fixed inset-0 z-50 overflow-y-auto">
							<div className="flex min-h-full items-start md:justify-center md:p-4 text-center sm:items-start w-screen md:max-w-none">
								<Transition.Child
										as={Fragment}
										enter="ease-out duration-300"
										enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
										enterTo="opacity-100 translate-y-0 sm:scale-100"
										leave="ease-in duration-200"
										leaveFrom="opacity-100 translate-y-0 sm:scale-100"
										leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								>
										<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-screen sm:max-w-screen-2xl">
											<div className="bg-gray-50 pb-4 pt-5 p-1 md:p-6 sm:pb-4 justify-between w-full">
												<div className="mt-3 text-center sm:mt-0 sm:text-left flex justify-between">
													<div>
													<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
														{props.modalInfo.title}
													</Dialog.Title>
													</div>
													<div>
													<button
														type="button"
														className="mt-0 right-0 sm:w-auto sm:float-right justify-center p-1 hover:bg-gray-200 text-sm font-semibold text-gray-600 "
														onClick={() => closeModal()}
														ref={cancelButtonRef}>
														<CloseIcon />
													</button>
													</div>
												</div>
												<div className="bg-gray-50 px-4 flex flex-row sm:px-6">
												{
												props.modalInfo.hasExtraction === true ?  
													<DownloadCSV_Button 
														title={props.modalInfo.title}
														extractData={props.modalInfo.extractData}
													/> : null
												}
											</div>
												<div className="mt-1">
													{props.formContent}
												</div>
											</div>

										</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition.Root>
			</>

	)
}

export default Dashboard_Modal


