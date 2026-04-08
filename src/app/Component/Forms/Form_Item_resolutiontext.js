import React from 'react'
import { Combobox } from '@headlessui/react';

const Form_Item_resolutiontext = ({listOfItems}) => {
    const [selectedItem, setSelectedItem] = useState(itemChoices[0])
    const [query, setQuery] = useState('')
  
    const filteredItems =
      query === ''
        ? listOfItems
        : listOfItems.filter((thing) => {
            return thing.toLowerCase().includes(query.toLowerCase())
        })  
  
    return (
      <Combobox value={selectedItem} onChange={setSelectedItem}>
        <Combobox.Input onChange={(event) => setQuery(event.target.value)} required={isInputRequired}/>
        <Combobox.Options>
          {filteredItems.map((item) => (
            <Combobox.Option key={item} value={item}>
              {item}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
)}

export default Form_Item_resolutiontext