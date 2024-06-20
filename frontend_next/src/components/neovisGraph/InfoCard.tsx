import React from "react";
import { Card, CardBody, Spacer } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface InfoCardProps {
  title: string;
  item: any;
  onCollapse: () => void;
  isCollapsed: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  item,
  onCollapse,
  isCollapsed,
}) => {
  const renderPropertiesTable = () => {
    const properties = item?.properties || {};
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md table-fixed text-sm">
          <tbody>
            {Object.entries(properties).map(([key, value]) => (
              <tr key={key} className="bg-gray-100 border-b">
                <td className="text-left px-4 py-2 font-medium break-words w-1/4 break-all">
                  {key}
                </td>
                <td className="text-left px-4 py-2 break-words w-3/4 break-all">
                  {String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card
      isBlurred
      className={`relative bg-white bg-opacity-80 backdrop-blur-lg border-none rounded-lg shadow-lg mb-4 max-h-[400px] overflow-y-auto transition-all duration-300 ${
        isCollapsed ? "bg-transparent shadow-none mb-0 p-2 w-20" : "p-4 w-96"
      }`}
      shadow="sm"
    >
      <CardBody className={`${isCollapsed ? "p-7" : "p-4"}`}>
        <div className="flex flex-col gap-3">
          {!isCollapsed && (
            <>
              <div className="flex flex-col">
                <h4>{title}</h4>
                <p>
                  Type:{" "}
                  {item ? (item.type === "node" ? "Node" : "Edge") : "None"}
                </p>
              </div>
              <Spacer y={0.5} />
              <div className="flex flex-col">
                <p>Properties:</p>
                {item ? (
                  renderPropertiesTable()
                ) : (
                  <p>No nodes or edges selected.</p>
                )}
              </div>
            </>
          )}
        </div>
      </CardBody>
      <button
        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg transform transition-transform duration-300 hover:scale-110"
        onClick={onCollapse}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        ) : (
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        )}
      </button>
    </Card>
  );
};

export default InfoCard;
