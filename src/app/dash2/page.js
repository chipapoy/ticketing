import Create from '@/Component/Forms/Tickets/Edit2';
import WorkNote from '@/Component/UI/Tickets/WorkNote'

const Test = () => {

  return (
    <>
      <div className="bg-gray-50  pb-4 pt-5 p-1 md:p-6 sm:pb-4 justify-between w-full">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <div className="mt-2">
            <Create />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:px-6">
        <button
          type="button"
          className=" mt-1 sm:float-right justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 sm:ml-3 sm:w-auto"
          // onClick={closeModal}
          // ref={cancelButtonRef}
        >
          Cancel
        </button>
      </div>
    </>
  )
}


export default Test