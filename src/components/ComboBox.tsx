import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

// --- Types ---------------------------------------------------------
interface Item {
  id: number,
  name: string,
}

interface Props {
  items: Item[],
  selectedItems: Item[],
  id: number,
  name: string,
  className: string,
  width?: number,
  onBlur: (e: any) => void,
  onChange: (items: Item[]) => void
}

export default function MultiSelectCombobox(props: Props) {
  const [query, setQuery] = useState('')
  const selectedItems = props.selectedItems;
  const items = props.items;

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase())
      })

  const removeSelectedItem = (item: Item) => {
    props.onChange(selectedItems.filter(s => s.id !== item.id));
  }

  return (
    <Combobox multiple
      value={selectedItems}
      onChange={props.onChange} 
      onClose={() => setQuery('')}
    >

      <div className={`flex flex-col ${props.className}`}
        style={{ width: props.width }}
      >
        <label className="input">
          <span className="label">Categories</span>

          <ComboboxInput
            aria-label="Assignees"
            id={props.id + ""}
            name={props.name}
            onBlur={props.onBlur}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ComboboxOptions anchor="bottom" className="list bg-base-200 rounded-sm shadow-sm empty:invisible">
            {filteredItems.map((item) => (
              <ComboboxOption key={item.id} value={item} className="list-row rounded-none data-focus:bg-primary items-center capitalize">
                {selectedItems.includes(item) && 
                  <span><FaCheck size={12} /></span>
                }
                {item.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>

        </label>

        {/* SHOW SELECTED ITEMS */}
        {selectedItems.length > 0 && (
          <div className="my-4 flex flex-wrap gap-x-2">
            {selectedItems.map((item) => (
              <span
                key={item.id}
                onClick={() => removeSelectedItem(item)}
                className="badge badge-soft badge-sm badge-success shadow-sm"
              >
                {item.name}
                <span><IoClose size={12}/></span>
              </span>
            ))}
          </div>
        )}

      </div>
    </Combobox>
  )
}
