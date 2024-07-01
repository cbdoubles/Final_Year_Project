import type { Network, IdType, DirectionType } from "vis-network";

type Callback = (e: any) => void;

interface VisNetworkEvents {
  onSelect(callback: (e: any, nodeIds: IdType[]) => void): void;
  onClick(callback: Callback): void;
  onDoubleClick(callback: Callback): void;
  onContextClick(callback: Callback): void;
}

export class VisNetwork implements VisNetworkEvents {
  constructor(private readonly network: Network) {}

  onSelect(callback: (e: any, nodeIds: IdType[]) => void): void {
    this.network.on("select", (e) => {
      const nodeIds = this.network.getSelectedNodes();
      callback(e, nodeIds);
    });
  }

  onClick(callback: Callback): void {
    this.network.on("click", (e) => {
      callback(e);
    });
  }

  onDoubleClick(callback: Callback): void {
    this.network.on("doubleClick", (e) => {
      callback(e);
    });
  }

  onContextClick(callback: Callback): void {
    this.network.on("oncontext", (e) => {
      callback(e);
    });
  }

  getSelectedNodes(): IdType[] {
    return this.network.getSelectedNodes();
  }

  getConnectedNodes(
    nodeOrEdgeId: IdType,
    direction?: DirectionType
  ): IdType[] | Array<{ fromId: IdType; toId: IdType }> {
    return this.network.getConnectedNodes(nodeOrEdgeId, direction);
  }
}
