import React, { useEffect, useRef, useState, useContext, Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { VisContext } from '../context/visContext';
import ContextMenu, { ContextMenuState, ContextMenuType } from './contextMenu';
import MobileContextButton from './buttons/mobileContext';
import { AlertState, AlertType } from './alert';
import { IdType } from 'vis-network';
import { WikiSummary } from './sidebar/wikipediaSummaries';

const StyledCanvas = styled.div`
    height: inherit;
    width: inherit;
    top: inherit;
    left: inherit;
    position: fixed;
`;

interface Props {
    containerId: string;
    summaries: WikiSummary[];
    setSummaries: Dispatch<SetStateAction<WikiSummary[]>>;
    setCurrentSummary: Dispatch<SetStateAction<WikiSummary | null>>;
    setAlertState: Dispatch<SetStateAction<AlertState>>;
    darkMode: boolean;
}

const NeovisComponent: React.FC<Props> = ({
    containerId,
    summaries,
    setSummaries,
    setCurrentSummary,
    setAlertState,
    darkMode,
}) => {
    const visRef = useRef<HTMLDivElement>(null);
    const { vis, visNetwork } = useContext(VisContext);

    // State to track selected nodes and labels
    const [selection, setSelection] = useState<IdType[]>([]);
    const [selectionLabels, setSelectionLabels] = useState<string[]>([]);

    // State to manage context menu visibility
    const [contextMenuState, _setContextMenuState] = useState<ContextMenuState>({
        open: false,
        type: ContextMenuType.Canvas,
        mobile: typeof window !== 'undefined' && window.innerWidth < 1100,
        x: 0,
        y: 0,
    });

    // References to keep state in event listeners
    const contextMenuStateRef = useRef(contextMenuState);
    const selectionRef = useRef(selection);

    const setContextMenuState = (data: ContextMenuState) => {
        contextMenuStateRef.current = data;
        _setContextMenuState(data);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1100 && !contextMenuStateRef.current.mobile) {
                setContextMenuState({ ...contextMenuStateRef.current, mobile: true });
            } else if (window.innerWidth >= 1100 && contextMenuStateRef.current.mobile) {
                setContextMenuState({ ...contextMenuStateRef.current, mobile: false });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const updateSelectionState = (nodeIds: IdType[]) => {
            setSelection(nodeIds);
            selectionRef.current = nodeIds;

            const labels = vis
                .nodes()
                .get()
                .filter((node: any) => nodeIds.includes(node.id))
                .map((node: any) => node.label || '');

            setSelectionLabels(labels);
        };

        if (!vis || !visNetwork) return;

        visNetwork.on('select', (params: any) => {
            if (params.nodes) {
                updateSelectionState(params.nodes);
            }
        });

        visNetwork.on('click', () => {
            if (contextMenuStateRef.current.open) {
                setContextMenuState({ ...contextMenuStateRef.current, open: false });
            }
            setAlertState({ show: false, type: AlertType.None });
        });

        visNetwork.on('doubleClick', (params: any) => {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const cypher = `MATCH (p1: Page)-[l: LINKS_TO]-(p2: Page) WHERE ID(p1) = ${nodeId} RETURN p1, l, p2`;
                vis.updateWithCypher(cypher);
            }
        });

        visNetwork.on('oncontext', (params: any) => {
            params.event.preventDefault();

            const rect = params.event.target.getBoundingClientRect();
            const x = params.event.clientX - rect.left;
            const y = params.event.clientY - rect.top;

            const nodeId = visNetwork.getNodeAt({ x, y });
            const type = nodeId ? (selectionRef.current.length > 1 ? ContextMenuType.Nodes : ContextMenuType.Node) : ContextMenuType.Canvas;

            setContextMenuState({ open: true, type, mobile: window.innerWidth < 1100, x, y });
        });

        return () => {
            visNetwork.off('select');
            visNetwork.off('click');
            visNetwork.off('doubleClick');
            visNetwork.off('oncontext');
        };
    }, [vis, visNetwork, setAlertState]);

    useEffect(() => {
        const initializeNeovis = async () => {
            const { default: NeoVis } = await import('neovis.js/dist/neovis.js');
            const config = {
                containerId: containerId,
                neo4j: {
                    serverUrl: 'bolt://localhost:7687',
                    serverUser: 'neo4j', // Replace with your Neo4j username
                    serverPassword: 'letmein', // Replace with your Neo4j password
                },
                visConfig: {
                    nodes: {
                        shape: 'dot',
                        size: 16,
                        font: {
                            size: 14,
                            color: '#000000',
                            face: 'arial',
                            background: 'rgba(255,255,255,0.8)',
                        },
                        borderWidth: 2,
                        shadow: true,
                    },
                    edges: {
                        arrows: {
                            to: { enabled: true },
                        },
                        font: {
                            size: 12,
                            color: '#343434',
                            strokeWidth: 0,
                            align: 'horizontal',
                        },
                        color: {
                            color: '#848484',
                            highlight: '#848484',
                            hover: '#848484',
                        },
                        width: 2,
                        shadow: true,
                    },
                    interaction: {
                        hover: true,
                        tooltipDelay: 200,
                    },
                },
                labels: {
                    Character: {
                        caption: 'name',
                        size: 'degree',
                        community: 'community',
                    },
                },
                relationships: {
                    INTERACTS: {
                        thickness: 'weight',
                        caption: true,
                    },
                },
                initialCypher:
                    "MATCH (bacon:Person {name:'Kevin Bacon'})-[r*1..4]-(hollywood) RETURN DISTINCT hollywood, r",
                nonFlat: true,
            };

            const viz = new NeoVis(config as any);
            viz.render();
            console.log(viz);
        };

        initializeNeovis();
    }, [containerId]);

    return (
        <StyledCanvas id="canvas">
            <div id={containerId} ref={visRef} />
            {!vis && <h2 style={{ position: 'absolute', right: '25px', bottom: '5px' }}>Loading...</h2>}
            {contextMenuState.mobile && (
                <MobileContextButton
                    contextMenuState={contextMenuState}
                    setContextMenuState={setContextMenuState}
                    selection={selection}
                    darkMode={darkMode}
                />
            )}
            {vis && visNetwork && (
                <ContextMenu
                    vis={vis}
                    visNetwork={visNetwork}
                    darkMode={darkMode}
                    state={contextMenuState}
                    setState={setContextMenuState}
                    selection={selection}
                    setSelection={setSelection}
                    selectionLabels={selectionLabels}
                    setSelectionLabels={setSelectionLabels}
                    summaries={summaries}
                    setSummaries={setSummaries}
                    setCurrentSummary={setCurrentSummary}
                />
            )}
        </StyledCanvas>
    );
};

export default NeovisComponent;
