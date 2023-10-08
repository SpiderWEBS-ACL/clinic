import React, { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  items: string[];
  itemsObj: any[];
  heading: string;
  onSelectItem: (item: any, index:number) => void;
  path: string;
}

function ListGroup({ items, heading, onSelectItem, path }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  const handleItemSelect = (item: string, index: number) => {
    setSelectedIndex(index);
    onSelectItem(item,index);
    navigate(path);
  };

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            key={item}
            onClick={() => handleItemSelect(item, index)}
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
