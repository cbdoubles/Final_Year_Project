import React from "react";
import { Card, CardBody, Button, Spacer } from "@nextui-org/react";

interface InfoCardProps {
  title: string;
  item: any;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, item }) => {
  if (!item) {
    return null;
  }

  const renderPropertiesTable = () => {
    const properties = item.properties || {};
    return (
      <table className="table-auto w-full">
        <tbody>
          {Object.entries(properties).map(([key, value]) => (
            <tr key={key}>
              <td className="border px-4 py-2 font-medium">{key}</td>
              <td className="border px-4 py-2">
                {(value as string).toString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Card
      isBlurred
      className="bg-white bg-opacity-80 backdrop-blur-lg border-none rounded-lg shadow-lg mb-4 p-4 max-h-[400px] overflow-y-auto"
      shadow="sm"
    >
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h4>{title}</h4>
              <p>Type: {item.type === "node" ? "Node" : "Edge"}</p>
            </div>
            <Button
              isIconOnly
              className="text-default-900/60 data-[hover]:bg-foreground/10"
              radius="full"
              variant="light"
            ></Button>
          </div>

          <Spacer y={0.5} />

          <div className="flex flex-col">
            <p>Properties:</p>
            {renderPropertiesTable()}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default InfoCard;
