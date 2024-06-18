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

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[400px] mb-4"
      shadow="sm"
    >
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h4>{title}</h4>
              <p>Type: {item.labels ? "Node" : "Edge"}</p>
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
            <pre>{JSON.stringify(item.properties || item, null, 2)}</pre>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default InfoCard;
