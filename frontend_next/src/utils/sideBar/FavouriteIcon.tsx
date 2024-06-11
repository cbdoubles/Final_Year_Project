import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import QueryIcon from "./QueryIcon";
import {
  QueryFolderType,
  QueryType,
  QueryFolderListType,
} from "@/src/libs/types";
import { combineFoldersAndQueries } from "./FolderQueryListConverter";

const folders: QueryFolderType[] = [
  { folderId: 1, folderName: "Folder 1" },
  { folderId: 2, folderName: "Folder 2" },
];

const queries: QueryType[] = [
  {
    queryId: 1,
    folderId: 1,
    queryName: "Query 1",
    cypherQuery: "MATCH (n) RETURN n",
    natLang: "Find all nodes",
  },
  {
    queryId: 2,
    folderId: 1,
    queryName: "Query 2",
    cypherQuery: "MATCH (n)-[r]->(m) RETURN r",
    natLang: "Find all relationships",
  },
  {
    queryId: 3,
    folderId: 2,
    queryName: "Query 3",
    cypherQuery: "MATCH (n:Person) RETURN n",
    natLang: "Find all persons",
  },
];

export default function FavoriteIcon({ collapsed }: { collapsed: boolean }) {
  const queryFolderList: QueryFolderListType[] = combineFoldersAndQueries(
    folders,
    queries
  );

  const loadItems = async () => {
    await new Promise((r) => setTimeout(r, 2000));
    return queryFolderList;
  };

  return (
    <QueryIcon
      loadItems={loadItems}
      type="Favorite"
      icon={StarIcon}
      collapsed={collapsed}
    />
  );
}
