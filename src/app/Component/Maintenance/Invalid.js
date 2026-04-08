const Invalid = ({typeOfModal = "Add/Edit"}) => {
   return (
      <span>
         You dont have the access to {typeOfModal} Data
      </span>
   )
}

export default Invalid