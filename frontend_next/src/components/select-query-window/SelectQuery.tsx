import { useState } from "react";
import { MouseEvent } from "react";
import { LuTrash2 } from "react-icons/lu";

const items = [
  {
    employee: "Szymon",
    favorites: ["favourite1", "favourite2", "favourite3", "favourite4"],
  },
  { employee: "Geri", favorites: ["favourite1"] },
  { employee: "Caolán", favorites: ["favourite1"] },
];
function ListQueries() {
  const [closed, setClosed] = useState([] as string[]);
  // Event handler
  const handleClick = (event: MouseEvent) => console.log(event);
  const handleFolderClick = (name: string) => (event: MouseEvent) => {
    if (closed.includes(name)) {
      setClosed(closed.filter((v) => v != name));
    } else {
      setClosed([...closed, name]);
    }
  };

  // Button click handler
  const handleButtonClick = () => {
    console.log("Select Query button clicked");
  };

  // Trash bin click handler
  const handleTrashClick = (favorite: string) => {
    console.log(`Trash bin clicked for ${favorite}`);
  };
  let i = 0;
  return (
    <>
      <div className="bg-gray-400 text-center py-3 text-lg font-bold">
        Select a Favourite Query
      </div>
      {items.length === 0 && <p>No query found</p>}
      <ul>
        {items.map((item) => (
          <li
            key={item.employee}
            className={i++ % 2 ? "bg-sky-200" : "bg-white"}
          >
            <div
              onClick={handleFolderClick(item.employee)}
              style={{ cursor: "pointer" }}
            >
              {item.employee}
            </div>
            {item.favorites.length > 0 && !closed.includes(item.employee) && (
              <ul>
                {item.favorites.map((favorite) => (
                  <li
                    className={`flex items-center px-10 justify-between ${
                      i++ % 2 ? "bg-sky-200" : "bg-white"
                    }`}
                    key={favorite}
                    onClick={handleClick}
                  >
                    <span className="cursor-pointer">{favorite}</span>
                    <LuTrash2
                      className="mr-10"
                      onClick={() => handleTrashClick(favorite)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button
          className="bg-orange-400 border-solid border-orange-400 border-2 rounded-xl px-7 py-1 font-bold mr-3 mt-1 hover:bg-orange-200"
          onClick={handleButtonClick}
        >
          Select query
        </button>
      </div>
    </>
  );
}

export default ListQueries;
