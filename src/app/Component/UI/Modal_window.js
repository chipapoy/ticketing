import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import CircularProgress from '@mui/material/CircularProgress';



const Modal_window = (props) => {
  // const [isOpen, setIsOpen] = useState(false);

  const [isOpen, setOpen] = useState(false);

  const [disableBtn, setDisableBtn] = useState(false);

  const [dateTime, setDayTime] = useState("");

  const cancelButtonRef = useRef(null)
  
  const closeModal = () => {
    // props.modalInfo.open = false;
    // props.modalInfo
    // setOpen(!isOpen);

    props.toggleCallback({
      open: false,
      module: '',
      title: '',
      content: null
    })
    
  };

  useEffect(() => {
    // setOpen(props.modalInfo.open);
    console.log(props.modalInfo.open);

  },[]);

  return (
    <>
    {console.log(props.modalInfo.module)}
      <Transition.Root show={props.modalInfo.open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={ () => { null } }>
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
            <div className="flex min-h-full items-start md:justify-center md:p-4 text-center sm:items-start w-full md:max-w-none">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-[${props.modalWidth}] max-w-5xl`}>
                  <div className="bg-gray-50  pb-4 pt-5 p-1 md:p-6 sm:pb-4 justify-between w-full">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {props.modalInfo.title}
                      </Dialog.Title>
                      <div className="mt-2">
                        {props.formContent}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:px-6">
                    
                    <button
                      type="button"
                      className=" sm:ml-3 sm:w-auto mt-1 px-3 py-2 sm:float-right rounded-md bg-red-500  text-sm font-semibold text-white shadow-sm hover:bg-red-600 "
                      onClick={closeModal}
                      ref={cancelButtonRef}
                    >
                      {props.cancelName == undefined? "Cancel" : props.cancelName}
                    </button>
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

export default Modal_window